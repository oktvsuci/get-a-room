"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Fields } from "@/lib/validations/booking.schema";
import { StepProps } from "./BookingWizard";

// ── Style helpers ────────────────────────────────────────
const inputNormal =
  "w-full px-4 py-3 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none transition-all duration-200 focus:border-brand focus:shadow-[0_0_0_3px_rgba(163,20,31,0.1)]";
const inputError =
  "w-full px-4 py-3 border border-red-400 rounded-md text-[0.95rem] text-grey-900 bg-red-50/30 outline-none transition-all duration-200 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]";
const labelClass = "text-[0.9rem] font-semibold text-grey-800";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1 font-medium">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

export function Step1Pemohon({ data, update }: StepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Step1Fields>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nama:  data.nama,
      nim:   data.nim,
      email: data.email,
      hp:    data.hp,
    },
    mode: "onTouched",
  });

  // Sync nilai RHF → BookingWizard state
  useEffect(() => {
    const subscription = watch((values) => {
      update({
        nama:  values.nama  ?? "",
        nim:   values.nim   ?? "",
        email: values.email ?? "",
        hp:    values.hp    ?? "",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  return (
    <div>
      <h2 className="text-[1.5rem] font-bold text-grey-900 mb-1">
        Data Pemohon
      </h2>
      <p className="text-[0.95rem] text-grey-500 mb-10">
        Isi identitas diri kamu sebagai pemohon peminjaman ruangan.
      </p>

      <div className="grid grid-cols-2 gap-6">

        {/* Nama */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Nama Lengkap <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Budi Santoso"
            className={errors.nama ? inputError : inputNormal}
            {...register("nama")}
          />
          <FieldError message={errors.nama?.message} />
        </div>

        {/* NIM */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            NIM <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 1301234567"
            className={errors.nim ? inputError : inputNormal}
            {...register("nim")}
          />
          <FieldError message={errors.nim?.message} />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Email SSO Telkom <span className="text-brand">*</span>
          </label>
          <input
            type="email"
            placeholder="nama@student.telkomuniversity.ac.id"
            className={errors.email ? inputError : inputNormal}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
          {!errors.email && (
            <p className="text-xs text-grey-400">
              Notifikasi persetujuan dikirim ke email ini.
            </p>
          )}
        </div>

        {/* No HP */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            No. HP / WhatsApp <span className="text-brand">*</span>
          </label>
          <input
            type="tel"
            placeholder="Contoh: 08123456789"
            className={errors.hp ? inputError : inputNormal}
            {...register("hp")}
          />
          <FieldError message={errors.hp?.message} />
        </div>

      </div>

      <div className="mt-8 p-5 bg-grey-50 border border-grey-200 rounded-md">
        <p className="text-xs text-grey-500 leading-relaxed">
          💡 <strong className="text-grey-700">Catatan:</strong> Pastikan data
          sesuai identitas resmi mahasiswa Telkom University. Data akan
          diverifikasi admin.
        </p>
      </div>
    </div>
  );
}