// src/app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status  = searchParams.get("status")  || "";
    const roomId  = searchParams.get("roomId")  || "";
    const tanggal = searchParams.get("tanggal") || "";
    const q       = searchParams.get("q")       || "";
    const page    = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit   = 15;

    const where: Record<string, unknown> = {};
    if (status)  where.status  = status;
    if (roomId)  where.roomId  = roomId;
    if (tanggal) where.tanggal = tanggal;
    if (q) {
      where.OR = [
        { nama:     { contains: q, mode: "insensitive" } },
        { nim:      { contains: q, mode: "insensitive" } },
        { email:    { contains: q, mode: "insensitive" } },
        { instansi: { contains: q, mode: "insensitive" } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        skip:  (page - 1) * limit,
        take:  limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("GET /api/admin/bookings error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data.", bookings: [], total: 0, page: 1, totalPages: 1 },
      { status: 500 }
    );
  }
}