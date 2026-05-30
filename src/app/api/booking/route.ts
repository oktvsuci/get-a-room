// src/app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  console.log("=== API BOOKING DIPANGGIL ===");

  try {
    console.log("Membaca formData...");
    const formData = await req.formData();
    console.log("FormData berhasil dibaca");

    // Ambil semua field teks
    const nama       = formData.get("nama") as string;
    const nim        = formData.get("nim") as string;
    const email      = formData.get("email") as string;
    const hp         = formData.get("hp") as string;
    const instansi   = formData.get("instansi") as string;
    const jabatan    = formData.get("jabatan") as string;
    const ruangan    = formData.get("ruangan") as string;
    const tanggal    = formData.get("tanggal") as string;
    const jamMulai   = formData.get("jamMulai") as string;
    const jamSelesai = formData.get("jamSelesai") as string;
    const kegiatan   = formData.get("kegiatan") as string;

    console.log("Data teks:", { nama, nim, email, ruangan, tanggal });

    // Ambil file PDF
    const file = formData.get("fileSurat") as File;
    console.log("File:", file?.name, file?.size);

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "File surat tidak ditemukan." },
        { status: 400 }
      );
    }

    // Upload PDF ke Supabase Storage
    console.log("Mengupload file ke Supabase Storage...");
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("surat-permohonan")
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: `Gagal upload file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log("File berhasil diupload:", uploadData.path);

    // Ambil public URL
    const { data: urlData } = supabase.storage
      .from("surat-permohonan")
      .getPublicUrl(uploadData.path);

    const fileSuratUrl = urlData.publicUrl;
    console.log("Public URL:", fileSuratUrl);

    // Simpan ke database
    console.log("Menyimpan ke database...");
    const booking = await prisma.booking.create({
      data: {
        nama,
        nim,
        email,
        hp,
        instansi,
        jabatan,
        ruangan,
        tanggal,
        jamMulai,
        jamSelesai,
        kegiatan,
        fileSuratUrl,
      },
    });

    console.log("Booking berhasil disimpan:", booking.id);

    return NextResponse.json(
      { success: true, bookingId: booking.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("=== BOOKING ERROR ===");
    console.error(error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}