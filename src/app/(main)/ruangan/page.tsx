// src/app/(main)/ruangan/page.tsx
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { RuanganClient } from "@/components/ruangan/RuanganClient";

export const dynamic = "force-dynamic"; // Selalu fresh, tidak di-cache

export default async function RuanganPage() {
  // Cek apakah user sudah login
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil semua ruangan dari DB
  const rooms = await prisma.room.findMany({
    orderBy: [{ namaGedung: "asc" }, { nomorRuangan: "asc" }],
  });

  // Ambil semua booking approved hari ini untuk cek ketersediaan real-time
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = await prisma.booking.findMany({
    where: {
      status:  "approved",
      tanggal: today,
    },
    select: { roomId: true, jamMulai: true, jamSelesai: true },
  });

  // Hitung status setiap ruangan berdasarkan waktu sekarang
  const now = new Date();
  const nowStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const roomsWithStatus = rooms.map((room) => {
    // Cek apakah ruangan sedang dipakai sekarang (jam sekarang overlap dengan booking)
    const sedangDipakai = todayBookings.some(
      (b) => b.roomId === room.id && b.jamMulai <= nowStr && b.jamSelesai > nowStr
    );

    let status: "tersedia" | "digunakan" | "perlu-izin" | "tidak-tersedia";
    if (!room.isAvailable) {
      status = "tidak-tersedia";
    } else if (room.needsPermit) {
      status = "perlu-izin";
    } else if (sedangDipakai) {
      status = "digunakan";
    } else {
      status = "tersedia";
    }

    return { ...room, status };
  });

  const gedungOptions = [
    "Semua Gedung",
    ...new Set(rooms.map((r) => r.namaGedung)),
  ];

  return (
    <>
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Ketersediaan Fasilitas
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Cek Ruangan
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Lihat ketersediaan seluruh ruangan dan fasilitas Telkom University
            secara real-time sebelum mengajukan peminjaman.
          </p>
        </div>
      </section>

      <RuanganClient
        rooms={roomsWithStatus}
        gedungOptions={gedungOptions}
        isLoggedIn={!!user}
      />
    </>
  );
}