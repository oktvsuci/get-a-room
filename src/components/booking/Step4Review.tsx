// src/components/booking/Step4Review.tsx
"use client";

import { StepProps } from "./BookingWizard";

export function Step4Review({ data, update }: StepProps) {
  const rows = [
    { label: "Nama Lengkap",     val: data.nama },
    { label: "NIM",              val: data.nim },
    { label: "Email SSO",        val: data.email },
    { label: "No. HP",           val: data.hp },
    { label: "Instansi",         val: data.instansi },
    { label: "Jabatan",          val: data.jabatan },
    { label: "Ruangan",          val: data.ruangan },   // ← label display
    { label: "Tanggal",          val: data.tanggal },
    {
      label: "Jam",
      val: data.jamMulai && data.jamSelesai
        ? `${data.jamMulai} – ${data.jamSelesai}`
        : "-",
    },
    { label: "Detail Kegiatan",  val: data.kegiatan },
    { label: "Surat Permohonan", val: data.fileSurat?.name ?? "-" },
  ];

  // Deteksi field yang belum diisi
  const kosong = rows.filter((r) => !r.val || r.val === "-").map((r) => r.label);

  return (
    <div>
      <h2 className="text-[1.5rem] font-bold text-grey-900 mb-1">Review & Kirim</h2>
      <p className="text-[0.95rem] text-grey-500 mb-10">
        Periksa kembali seluruh data sebelum mengirim pengajuan.
      </p>

      {/* Warning jika ada field kosong */}
      {kosong.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          ⚠️ <strong>Belum lengkap:</strong> {kosong.join(", ")}. Kembali ke langkah sebelumnya untuk mengisi.
        </div>
      )}

      {/* Tabel ringkasan */}
      <div className="bg-grey-50 border border-grey-200 rounded-lg overflow-hidden mb-8">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={["flex px-6 py-4 text-[0.9rem]", i % 2 === 0 ? "bg-white" : "bg-grey-50"].join(" ")}
          >
            <span className="w-[180px] font-semibold text-grey-600 flex-shrink-0">
              {r.label}
            </span>
            <span className="text-grey-900 flex-1 break-words">
              {r.val || <span className="text-grey-400 italic">Belum diisi</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Checkbox S&K */}
      <div className="bg-grey-50 border border-grey-200 rounded-md p-6">
        <label className="flex items-start gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={data.setuju}
            onChange={(e) => update({ setuju: e.target.checked })}
            className="mt-0.5 w-5 h-5 accent-brand cursor-pointer"
          />
          <span className="text-[0.9rem] text-grey-700 leading-relaxed">
            Saya menyatakan bahwa seluruh data yang saya isi adalah benar dan saya menyetujui{" "}
            <strong className="text-grey-900">Syarat & Ketentuan</strong>{" "}
            penggunaan fasilitas Telkom University. Saya bersedia menerima sanksi jika terbukti melakukan pelanggaran.
          </span>
        </label>
      </div>
    </div>
  );
}