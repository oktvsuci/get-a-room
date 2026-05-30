"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Step1Pemohon } from "./Step1Pemohon";
import { Step2Kegiatan } from "./Step2Kegiatan";
import { Step3Dokumen } from "./Step3Dokumen";
import { Step4Review } from "./Step4Review";

export type BookingData = {
  nama: string;
  nim: string;
  email: string;
  hp: string;
  instansi: string;
  jabatan: string;
  ruangan: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kegiatan: string;
  fileSurat: File | null;
  setuju: boolean;
};

export type StepProps = {
  data: BookingData;
  update: (fields: Partial<BookingData>) => void;
};

const INITIAL: BookingData = {
  nama: "", nim: "", email: "", hp: "",
  instansi: "", jabatan: "", ruangan: "",
  tanggal: "", jamMulai: "", jamSelesai: "",
  kegiatan: "", fileSurat: null, setuju: false,
};

const STEPS = [
  { num: 1, label: "Data Pemohon" },
  { num: 2, label: "Detail Kegiatan" },
  { num: 3, label: "Dokumen" },
  { num: 4, label: "Review & Kirim" },
];

// ── Success Modal ────────────────────────────────────────
function SuccessModal({
  data,
  onClose,
}: {
  data: BookingData;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-2 w-full bg-green-500" />
        <div className="px-8 py-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 ring-8 ring-green-50">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">
            Pengajuan Berhasil Dikirim!
          </h2>
          <p className="text-[0.95rem] text-grey-500 mb-8">
            Permohonan peminjaman ruangan kamu telah kami terima dan sedang diproses oleh admin.
          </p>
          <div className="w-full bg-grey-50 border border-grey-200 rounded-xl overflow-hidden mb-8 text-left">
            {[
              { label: "Pemohon",          val: data.nama },
              { label: "Ruangan",          val: data.ruangan },
              { label: "Tanggal",          val: data.tanggal },
              { label: "Jam",              val: `${data.jamMulai} – ${data.jamSelesai}` },
              { label: "Email Konfirmasi", val: data.email },
            ].map((r, i) => (
              <div
                key={r.label}
                className={`flex items-center px-5 py-3 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-grey-50"
                }`}
              >
                <span className="w-36 font-semibold text-grey-500 flex-shrink-0">
                  {r.label}
                </span>
                <span className="text-grey-900 font-medium truncate">{r.val}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-bold text-[1rem] tracking-wide shadow-md transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-lg cursor-pointer"
          >
            Kembali ke Beranda
          </button>
          <p className="mt-4 text-xs text-grey-400">
            Notifikasi akan dikirim ke{" "}
            <span className="font-semibold text-grey-600">{data.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Wizard ──────────────────────────────────────────
export function BookingWizard() {
  const router = useRouter();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState<BookingData>(INITIAL);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const update = (fields: Partial<BookingData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const next = () => setCurrent((c) => Math.min(c + 1, 4));
  const prev = () => setCurrent((c) => Math.max(c - 1, 1));

  const handleSubmit = async () => {
    if (!data.setuju) {
      alert("Centang persetujuan Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    if (!data.fileSurat) {
      alert("Upload surat permohonan terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("nama",       data.nama);
      formData.append("nim",        data.nim);
      formData.append("email",      data.email);
      formData.append("hp",         data.hp);
      formData.append("instansi",   data.instansi);
      formData.append("jabatan",    data.jabatan);
      formData.append("ruangan",    data.ruangan);
      formData.append("tanggal",    data.tanggal);
      formData.append("jamMulai",   data.jamMulai);
      formData.append("jamSelesai", data.jamSelesai);
      formData.append("kegiatan",   data.kegiatan);
      formData.append("fileSurat",  data.fileSurat);

      const res = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        alert("Gagal mengirim pengajuan. Coba lagi.");
        return;
      }

      setShowSuccess(true);

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    router.push("/");
  };

  const renderStep = () => {
    switch (current) {
      case 1: return <Step1Pemohon data={data} update={update} />;
      case 2: return <Step2Kegiatan data={data} update={update} />;
      case 3: return <Step3Dokumen data={data} update={update} />;
      case 4: return <Step4Review data={data} update={update} />;
      default: return null;
    }
  };

  return (
    <>
      {showSuccess && <SuccessModal data={data} onClose={handleClose} />}

      <div className="bg-white border border-grey-200 rounded-lg shadow-sm overflow-hidden w-full">

        {/* Progress Header */}
        <div className="flex bg-grey-50 border-b border-grey-200 px-4 sm:px-8 py-4 sm:py-6">
          {STEPS.map((s, i) => {
            const done = current > s.num;
            const active = current === s.num;
            return (
              <div key={s.num} className="flex-1 text-center relative">
                {i < STEPS.length - 1 && (
                  <span
                    className={[
                      "absolute top-3.5 sm:top-4 left-1/2 w-full h-[3px] z-0 transition-all duration-300",
                      done ? "bg-brand" : "bg-grey-300",
                    ].join(" ")}
                  />
                )}
                <div
                  className={[
                    "relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full inline-flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300",
                    done
                      ? "bg-brand text-white border-2 border-brand"
                      : "",
                    active
                      ? "bg-brand text-white border-2 border-brand shadow-[0_0_0_4px_rgba(163,20,31,0.15)]"
                      : "",
                    !done && !active
                      ? "bg-white text-grey-400 border-2 border-grey-300"
                      : "",
                  ].join(" ")}
                >
                  {done ? "✓" : s.num}
                </div>
                <span
                  className={[
                    "block text-[10px] sm:text-xs font-semibold mt-2 sm:mt-3 uppercase tracking-wide",
                    active ? "text-brand" : "text-grey-500",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-8 md:p-16">
          <div className="w-full overflow-x-hidden">{renderStep()}</div>

          {/* Nav Buttons */}
          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-grey-200">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              <button
                type="button"
                onClick={prev}
                style={{ visibility: current === 1 ? "hidden" : "visible" }}
                className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-3 rounded-md bg-white text-grey-700 font-semibold text-sm sm:text-[0.95rem] border border-grey-300 transition-all duration-200 hover:bg-grey-100 hover:border-grey-400 cursor-pointer"
              >
                ← Sebelumnya
              </button>

              {current < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-3 rounded-md bg-brand text-white font-semibold text-sm sm:text-[0.95rem] shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md cursor-pointer"
                >
                  Selanjutnya →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-3 rounded-md bg-brand text-white font-semibold text-sm sm:text-[0.95rem] shadow-sm transition-all duration-200 hover:bg-brand-dark cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "⏳ Mengirim..." : "✅ Kirim Pengajuan"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}