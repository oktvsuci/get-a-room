// src/app/api/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET /api/rooms — ambil semua ruangan (publik, untuk halaman /ruangan)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gedung   = searchParams.get("gedung");
  const kategori = searchParams.get("kategori");

  const rooms = await prisma.room.findMany({
    where: {
      ...(gedung   ? { namaGedung: gedung }   : {}),
      ...(kategori ? { kategori }              : {}),
    },
    orderBy: [{ namaGedung: "asc" }, { nomorRuangan: "asc" }],
  });

  return NextResponse.json({ rooms });
}

// POST /api/rooms — tambah ruangan baru (admin only)
export async function POST(req: NextRequest) {
  // Cek auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const room = await prisma.room.create({
    data: {
      namaGedung:   body.namaGedung,
      nomorRuangan: body.nomorRuangan,
      kategori:     body.kategori,
      lantai:       body.lantai,
      kapasitas:    Number(body.kapasitas),
      fasilitas:    body.fasilitas ?? [],
      fotoUrl:      body.fotoUrl ?? null,
      isAvailable:  body.isAvailable ?? true,
      needsPermit:  body.needsPermit ?? false,
      keterangan:   body.keterangan ?? null,
    },
  });

  return NextResponse.json({ room }, { status: 201 });
}