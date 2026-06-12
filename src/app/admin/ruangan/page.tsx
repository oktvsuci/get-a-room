// src/app/admin/ruangan/page.tsx
import { prisma } from "@/lib/prisma";
import { RoomManager } from "@/components/admin/RoomManager";
import { Link } from "lucide-react";

export const dynamic = "force-dynamic"; // Selalu fetch fresh, tidak di-cache

export default async function AdminRuanganPage() {
  const rooms = await prisma.room.findMany({
    orderBy: [{ namaGedung: "asc" }, { nomorRuangan: "asc" }],
    include: {
      _count: { select: { bookings: true } }, // Tampilkan jumlah booking
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <Link href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-grey-500 hover:text-brand transition-colors mb-4"
      >
        Kembali
      </Link>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-grey-900 mb-1">
          Manajemen Ruangan
        </h1>
        <p className="text-grey-500 text-sm">
          Kelola data master seluruh ruangan dan fasilitas Telkom University.
        </p>
      </div>
      <RoomManager initialRooms={rooms} />
    </div>
  );
}