// src/app/admin/booking/page.tsx
import { prisma } from "@/lib/prisma";
import { AdminBookingTable } from "@/components/admin/AdminBookingTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingPage() {
  // Initial data — ambil pending dulu + semua rooms untuk filter
  const [initialBookings, totalCount, rooms] = await Promise.all([
    prisma.booking.findMany({
      take:    15,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
    }),
    prisma.booking.count(),
    prisma.room.findMany({
      select: { id: true, namaGedung: true, nomorRuangan: true },
      orderBy: { namaGedung: "asc" },
    }),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-1">
          Admin Panel
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-grey-900 mb-1">
          Manajemen Booking
        </h1>
        <p className="text-grey-500 text-sm">
          Kelola seluruh pengajuan peminjaman ruangan.
        </p>
      </div>

      <AdminBookingTable
        initialBookings={initialBookings}
        initialTotal={totalCount}
        rooms={rooms}
      />
    </div>
  );
}