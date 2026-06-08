// src/app/(main)/ruangan/page.tsx
import { prisma } from "@/lib/prisma";
import { RuanganClient } from "@/components/ruangan/RuanganClient";

export const dynamic = "force-dynamic";

export default async function RuanganPage() {
  const rooms = await prisma.room.findMany({
    orderBy: [{ namaGedung: "asc" }, { nomorRuangan: "asc" }],
  });

  // Hitung nama gedung unik dari DB (bukan hardcode lagi)
  const gedungOptions = ["Semua Gedung", ...new Set(rooms.map((r) => r.namaGedung))];
  const kategoriOptions = ["Semua Kategori", "Universitas", "Fakultas"];

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
        rooms={rooms}
        gedungOptions={gedungOptions}
        kategoriOptions={kategoriOptions}
      />
    </>
  );
}