// src/app/api/bookings/mine/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where:   { userId: user.id },
    include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}