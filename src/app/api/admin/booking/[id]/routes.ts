// src/app/api/booking/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

// Helper: ambil user & booking, pastikan ownership
async function getBookingForUser(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401, booking: null, user: null };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking) return { error: "Booking tidak ditemukan.", status: 404, booking: null, user };

  // Hanya pemilik booking atau admin yang boleh akses
  const isOwner = booking.userId === user.id;
  const isAdmin = user.user_metadata?.role === "admin";
  if (!isOwner && !isAdmin) return { error: "Forbidden", status: 403, booking: null, user };

  return { error: null, status: 200, booking, user };
}

// PATCH /api/booking/[id] — edit booking (hanya jika status pending)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { error, status, booking } = await getBookingForUser(id);

  if (error || !booking) {
    return NextResponse.json({ error }, { status });
  }

  if (booking.status !== "pending") {
    return NextResponse.json(
      { error: "Hanya booking dengan status Pending yang dapat diedit." },
      { status: 409 }
    );
  }

  const body = await req.json();

  // Jika ganti ruangan atau jadwal, cek konflik dulu
  const roomId     = body.roomId     ?? booking.roomId;
  const tanggal    = body.tanggal    ?? booking.tanggal;
  const jamMulai   = body.jamMulai   ?? booking.jamMulai;
  const jamSelesai = body.jamSelesai ?? booking.jamSelesai;

  const conflicts = await prisma.booking.findMany({
    where: {
      id:       { not: id }, // Kecualikan booking ini sendiri
      roomId,
      tanggal,
      status:   "approved",
      AND: [
        { jamMulai:   { lt: jamSelesai } },
        { jamSelesai: { gt: jamMulai   } },
      ],
    },
  });

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: `Konflik jadwal: ruangan sudah dibooking pukul ${conflicts[0].jamMulai}–${conflicts[0].jamSelesai}.` },
      { status: 409 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(body.roomId     && { roomId:     body.roomId }),
      ...(body.tanggal    && { tanggal:    body.tanggal }),
      ...(body.jamMulai   && { jamMulai:   body.jamMulai }),
      ...(body.jamSelesai && { jamSelesai: body.jamSelesai }),
      ...(body.kegiatan   && { kegiatan:   body.kegiatan }),
      ...(body.instansi   && { instansi:   body.instansi }),
      ...(body.jabatan    && { jabatan:    body.jabatan }),
    },
    include: { room: true },
  });

  return NextResponse.json({ booking: updated });
}

// DELETE /api/booking/[id] — cancel booking (hanya jika status pending)
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { error, status, booking } = await getBookingForUser(id);

  if (error || !booking) {
    return NextResponse.json({ error }, { status });
  }

  if (booking.status !== "pending") {
    return NextResponse.json(
      { error: "Hanya booking Pending yang dapat dibatalkan." },
      { status: 409 }
    );
  }

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}