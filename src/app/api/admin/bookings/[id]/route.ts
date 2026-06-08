// src/app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { action, catatanAdmin } = body as {
    action: "approve" | "reject";
    catatanAdmin?: string;
  };

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  }

  if (action === "approve") {
    const conflicts = await prisma.booking.findMany({
      where: {
        id:       { not: id },
        roomId:   booking.roomId,
        tanggal:  booking.tanggal,
        status:   "approved",
        AND: [
          { jamMulai:   { lt: booking.jamSelesai } },
          { jamSelesai: { gt: booking.jamMulai   } },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: `Konflik jadwal: sudah ada booking disetujui pukul ${conflicts[0].jamMulai}–${conflicts[0].jamSelesai}.` },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status:       action === "approve" ? "approved" : "rejected",
      catatanAdmin: catatanAdmin ?? null,
    },
    include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
  });

  return NextResponse.json({ booking: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  }

  if (booking.status === "approved") {
    const today = new Date().toISOString().split("T")[0];
    if (booking.tanggal >= today) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus booking approved yang belum berlangsung." },
        { status: 409 }
      );
    }
  }

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}