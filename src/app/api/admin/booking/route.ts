// src/app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama       = formData.get("nama")       as string;
    const nim        = formData.get("nim")        as string;
    const email      = formData.get("email")      as string;
    const hp         = formData.get("hp")         as string;
    const instansi   = formData.get("instansi")   as string;
    const jabatan    = formData.get("jabatan")    as string;
    const roomId     = formData.get("roomId")     as string;
    const tanggal    = formData.get("tanggal")    as string;
    const jamMulai   = formData.get("jamMulai")   as string;
    const jamSelesai = formData.get("jamSelesai") as string;
    const kegiatan   = formData.get("kegiatan")   as string;

    // Satu instance supabase server untuk semua operasi
    const supabase = await createServerClient();

    // Ambil userId dari session (opsional)
    let userId: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Tidak login — lanjutkan tanpa userId
    }

    // Validasi room ada dan tersedia
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ success: false, message: "Ruangan tidak ditemukan." }, { status: 400 });
    }
    if (!room.isAvailable) {
      return NextResponse.json({ success: false, message: "Ruangan sedang tidak tersedia." }, { status: 409 });
    }

    // Cek konflik jadwal
    const conflicts = await prisma.booking.findMany({
      where: {
        roomId, tanggal, status: "approved",
        AND: [
          { jamMulai: { lt: jamSelesai } },
          { jamSelesai: { gt: jamMulai } },
        ],
      },
    });
    if (conflicts.length > 0) {
      return NextResponse.json(
        { success: false, message: `Ruangan sudah dibooking pada ${tanggal} pukul ${conflicts[0].jamMulai}–${conflicts[0].jamSelesai}.` },
        { status: 409 }
      );
    }

    // Upload PDF ke Supabase Storage
    const file = formData.get("fileSurat") as File;
    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, message: "File surat tidak ditemukan." }, { status: 400 });
    }

    const fileName   = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("surat-permohonan")
      .upload(fileName, fileBuffer, { contentType: "application/pdf", upsert: false });

    if (uploadError) {
      return NextResponse.json({ success: false, message: `Gagal upload file: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("surat-permohonan").getPublicUrl(uploadData.path);

    // Simpan ke database
    const booking = await prisma.booking.create({
      data: {
        nama, nim, email, hp, instansi, jabatan,
        roomId, tanggal, jamMulai, jamSelesai, kegiatan,
        fileSuratUrl: urlData.publicUrl,
        userId,
      },
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}