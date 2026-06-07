// src/app/api/admin/bookings/internal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { roomId, tanggal, jamMulai, jamSelesai, kegiatan, instansi, nama } = body;

  // Validasi room
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Ruangan tidak ditemukan." }, { status: 400 });
  }

  // Cek konflik — booking internal langsung berstatus "approved"
  const conflicts = await prisma.booking.findMany({
    where: {
      roomId,
      tanggal,
      status: "approved",
      AND: [
        { jamMulai:   { lt: jamSelesai } },
        { jamSelesai: { gt: jamMulai   } },
      ],
    },
  });

  if (conflicts.length > 0) {
    return NextResponse.json(
      {
        error: `Konflik jadwal: ruangan sudah dibooking pukul ${conflicts[0].jamMulai}–${conflicts[0].jamSelesai}.`,
      },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      nama:        nama || "Universitas (Internal)",
      nim:         "INTERNAL",
      email:       user.email ?? "admin@telkomuniversity.ac.id",
      hp:          "-",
      instansi:    instansi || "Telkom University",
      jabatan:     "Admin",
      roomId,
      tanggal,
      jamMulai,
      jamSelesai,
      kegiatan,
      fileSuratUrl: "",
      status:       "approved",   // Langsung approved
      userId:       user.id,
      catatanAdmin: "Booking internal oleh admin.",
    },
    include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
  });

  return NextResponse.json({ booking }, { status: 201 });
}