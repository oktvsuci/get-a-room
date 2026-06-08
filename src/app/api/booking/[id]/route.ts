import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// DELETE — cancel booking (hanya jika pending & milik user)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  if (booking.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (booking.status !== "pending") return NextResponse.json({ error: "Hanya booking pending yang bisa dibatalkan." }, { status: 400 });

  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

// PATCH — edit booking (hanya jika pending & milik user)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  if (booking.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (booking.status !== "pending") return NextResponse.json({ error: "Hanya booking pending yang bisa diedit." }, { status: 400 });

  const body = await req.json();

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      roomId:     body.roomId     ?? booking.roomId,
      tanggal:    body.tanggal    ?? booking.tanggal,
      jamMulai:   body.jamMulai   ?? booking.jamMulai,
      jamSelesai: body.jamSelesai ?? booking.jamSelesai,
      kegiatan:   body.kegiatan   ?? booking.kegiatan,
      instansi:   body.instansi   ?? booking.instansi,
      jabatan:    body.jabatan    ?? booking.jabatan,
    },
    include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
  });

  return NextResponse.json({ success: true, booking: updated });
}