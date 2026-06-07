// src/app/api/rooms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return null;
  }
  return user;
}

// PATCH /api/rooms/[id] — update info ruangan
export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const room = await prisma.room.update({
    where: { id },
    data: {
      ...(body.namaGedung   !== undefined && { namaGedung:   body.namaGedung }),
      ...(body.nomorRuangan !== undefined && { nomorRuangan: body.nomorRuangan }),
      ...(body.kategori     !== undefined && { kategori:     body.kategori }),
      ...(body.lantai       !== undefined && { lantai:       body.lantai }),
      ...(body.kapasitas    !== undefined && { kapasitas:    Number(body.kapasitas) }),
      ...(body.fasilitas    !== undefined && { fasilitas:    body.fasilitas }),
      ...(body.fotoUrl      !== undefined && { fotoUrl:      body.fotoUrl }),
      ...(body.isAvailable  !== undefined && { isAvailable:  body.isAvailable }),
      ...(body.needsPermit  !== undefined && { needsPermit:  body.needsPermit }),
      ...(body.keterangan   !== undefined && { keterangan:   body.keterangan }),
    },
  });

  return NextResponse.json({ room });
}

// DELETE /api/rooms/[id] — hapus ruangan permanen
export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Cek apakah ada booking aktif
  const activeBookings = await prisma.booking.count({
    where: {
      roomId: id,
      status: { in: ["pending", "approved"] },
    },
  });

  if (activeBookings > 0) {
    return NextResponse.json(
      { error: `Tidak bisa hapus: ada ${activeBookings} booking aktif pada ruangan ini.` },
      { status: 409 }
    );
  }

  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ success: true });
}