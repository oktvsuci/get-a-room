"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema } from "@/lib/validations/booking.schema";
import { StepProps } from "./BookingWizard";

// Tipe internal form — file boleh null (untuk defaultValues)
type Step3FormValues = {
  fileSurat: File | null;
};

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

export function Step3Dokumen({ data, update }: StepProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(step3Schema) as any,
    defaultValues: {
      fileSurat: null,
    },
    mode: "onTouched",
  });

  // Sync nilai RHF → BookingWizard state
  useEffect(() => {
    const subscription = watch((values) => {
      update({ fileSurat: values.fileSurat ?? null });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("fileSurat", file, { shouldValidate: true });
    update({ fileSurat: file });
  };

  const fileSurat = watch("fileSurat");

  return (
    <div>
      <h2 className="text-[1.5rem] font-bold text-grey-900 mb-1">
        Unggah Dokumen
      </h2>
      <p className="text-[0.95rem] text-grey-500 mb-10">
        Unggah surat permohonan resmi yang sudah ditandatangani.
      </p>

      <div className={[
        "flex items-center justify-between p-8 rounded-md border-2 border-dashed transition-all duration-200",
        errors.fileSurat
          ? "border-red-400 bg-red-50/30"
          : "border-grey-300 bg-grey-50 hover:border-brand hover:bg-red-50/20",
      ].join(" ")}>
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white border border-grey-200 rounded-md flex items-center justify-center text-2xl shadow-sm">
            📄
          </div>
          <div>
            <h4 className="text-[1rem] font-semibold text-grey-900 mb-1">
              {fileSurat ? fileSurat.name : "Surat Permohonan Resmi"}
            </h4>
            <p className="text-[0.85rem] text-grey-500">
              {fileSurat
                ? `${(fileSurat.size / 1024 / 1024).toFixed(2)} MB`
                : "Format PDF · Maksimal 5MB"}
            </p>
          </div>
        </div>

        <label className="inline-flex items-center px-5 py-2.5 border border-grey-300 rounded-md bg-white text-[0.9rem] font-semibold text-grey-700 cursor-pointer transition-all duration-200 hover:border-brand hover:text-brand shadow-sm">
          {fileSurat ? "Ganti File" : "Pilih File"}
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>

      <FieldError message={errors.fileSurat?.message as string} />

      {fileSurat && !errors.fileSurat && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-semibold">
            ✅ File berhasil diunggah: {fileSurat.name}
          </p>
        </div>
      )}

      <div className="mt-6 p-5 bg-grey-50 border border-grey-200 rounded-md">
        <p className="text-xs text-grey-500 leading-relaxed">
          💡 <strong className="text-grey-700">Belum punya template?</strong>{" "}
          <a href="#" className="text-brand font-semibold hover:underline">
            Unduh template surat resmi di sini.
          </a>
        </p>
      </div>
    </div>
  );
}