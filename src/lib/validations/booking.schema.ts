import { z } from "zod";

// ── Step 1: Data Pemohon ─────────────────────────────────
export const step1Schema = z.object({
  nama: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z\s'.-]+$/, "Nama hanya boleh mengandung huruf"),

  nim: z
    .string()
    .min(1, "NIM wajib diisi")
    .regex(/^\d{10}$/, "NIM harus terdiri dari 10 digit angka"),

  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .refine(
      (val) =>
        val.endsWith("@student.telkomuniversity.ac.id") ||
        val.endsWith("@telkomuniversity.ac.id"),
      { message: "Email harus menggunakan akun SSO Telkom University" }
    ),

  hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(
      /^(\+62|62|0)[0-9]{9,12}$/,
      "Format nomor HP tidak valid (contoh: 08123456789)"
    ),
});

// ── Step 2: Detail Kegiatan ──────────────────────────────
const step2Base = z.object({
  instansi: z.string().min(3, "Nama instansi/organisasi minimal 3 karakter"),
  jabatan:  z.string().min(3, "Jabatan minimal 3 karakter"),
  ruangan:  z.string().min(1, "Ruangan wajib dipilih"),

  tanggal: z
    .string()
    .min(1, "Tanggal kegiatan wajib diisi")
    .refine((val) => {
      const picked = new Date(val);
      const today  = new Date();
      today.setHours(0, 0, 0, 0);
      return picked >= today;
    }, { message: "Tanggal kegiatan tidak boleh di masa lalu" }),

  jamMulai:   z.string().min(1, "Jam mulai wajib diisi"),
  jamSelesai: z.string().min(1, "Jam selesai wajib diisi"),

  kegiatan: z
    .string()
    .min(20, "Deskripsi kegiatan minimal 20 karakter")
    .max(500, "Deskripsi kegiatan maksimal 500 karakter"),
});

export const step2Schema = step2Base.refine(
  (val) => {
    if (!val.jamMulai || !val.jamSelesai) return true;
    return val.jamSelesai > val.jamMulai;
  },
  {
    message: "Jam selesai harus lebih akhir dari jam mulai",
    path:    ["jamSelesai"],
  }
);

// ── Step 3: Dokumen ──────────────────────────────────────
export const step3Schema = z.object({
  fileSurat: z
    .union([z.instanceof(File), z.null()])  // ← eksplisit File | null
    .refine((file) => file !== null, {
      message: "Surat permohonan wajib diunggah",
    })
    .refine((file) => file instanceof File && file.type === "application/pdf", {
      message: "File harus berformat PDF",
    })
    .refine((file) => file instanceof File && file.size <= 5 * 1024 * 1024, {
      message: "Ukuran file maksimal 5MB",
    }),
});

// ── Tipe inferensi ───────────────────────────────────────
export type Step1Fields = z.infer<typeof step1Schema>;
export type Step2Fields = z.infer<typeof step2Schema>;
export type Step3Fields = z.infer<typeof step3Schema>;

// ── Full schema ──────────────────────────────────────────
export const bookingSchema = step1Schema
  .merge(step2Base)
  .merge(step3Schema)
  .refine(
    (val) => {
      if (!val.jamMulai || !val.jamSelesai) return true;
      return val.jamSelesai > val.jamMulai;
    },
    {
      message: "Jam selesai harus lebih akhir dari jam mulai",
      path:    ["jamSelesai"],
    }
  );