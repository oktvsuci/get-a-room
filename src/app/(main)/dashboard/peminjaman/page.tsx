// src/app/(main)/dashboard/peminjaman/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingList } from "@/components/dashboard/BookingList";

export const dynamic = "force-dynamic";

export default async function RiwayatPeminjamanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard/peminjaman");

  const bookings = await prisma.booking.findMany({
    where:   { userId: user.id },
    include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-grey-900 mb-1">Riwayat Peminjaman</h1>
        <p className="text-grey-500 text-sm">Pantau semua pengajuan peminjaman ruangan kamu.</p>
      </div>
      <BookingList initialBookings={bookings} />
    </main>
  );
}