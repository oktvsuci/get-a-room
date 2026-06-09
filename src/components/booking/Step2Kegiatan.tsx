"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Fields } from "@/lib/validations/booking.schema";
import { StepProps } from "./BookingWizard";

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

type RoomOption = { id: string; label: string; isAvailable: boolean; needsPermit: boolean };

export function Step2Kegiatan({ data, update }: StepProps) {
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
  fetch("/api/rooms")
    .then(async (r) => {
      const text = await r.text();
      if (!text) throw new Error("Response kosong dari /api/rooms");
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Response bukan JSON: ${text.slice(0, 200)}`);
      }
    })
    .then(({ rooms: rawRooms }) => {
      if (!rawRooms) return;
      setRooms(
        rawRooms.map((r: {
          id: string;
          namaGedung: string;
          nomorRuangan: string;
          isAvailable: boolean;
          needsPermit: boolean;
        }) => ({
          id: r.id,
          label: `${r.namaGedung} — ${r.nomorRuangan}`,
          isAvailable: r.isAvailable,
          needsPermit: r.needsPermit,
        }))
      );
    })
    .catch((err) => console.error("Error fetch rooms:", err))
    .finally(() => setLoadingRooms(false));
}, []);

  const { register, watch, formState: { errors } } = useForm<Step2Fields>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      instansi:   data.instansi,
      jabatan:    data.jabatan,
      ruangan:    data.ruangan,
      tanggal:    data.tanggal,
      jamMulai:   data.jamMulai,
      jamSelesai: data.jamSelesai,
      kegiatan:   data.kegiatan,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      update({
        instansi:   values.instansi   ?? "",
        jabatan:    values.jabatan    ?? "",
        tanggal:    values.tanggal    ?? "",
        jamMulai:   values.jamMulai   ?? "",
        jamSelesai: values.jamSelesai ?? "",
        kegiatan:   values.kegiatan   ?? "",
        // ruangan & roomId TIDAK di-update dari watch,
        // karena dihandle manual di onChange dropdown
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  return (
    <div>
      <h2 className="text-[1.5rem] font-bold text-grey-900 mb-1">Detail Kegiatan</h2>
      <p className="text-[0.95rem] text-grey-500 mb-10">
        Isi informasi kegiatan dan pilih ruangan yang dibutuhkan.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Instansi */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Instansi / Organisasi <span className="text-brand">*</span></label>
          <input type="text" placeholder="Contoh: Himpunan Mahasiswa IF"
            className={errors.instansi ? inputError : inputNormal} {...register("instansi")} />
          <FieldError message={errors.instansi?.message} />
        </div>

        {/* Jabatan */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Jabatan Pemohon <span className="text-brand">*</span></label>
          <input type="text" placeholder="Contoh: Ketua Panitia"
            className={errors.jabatan ? inputError : inputNormal} {...register("jabatan")} />
          <FieldError message={errors.jabatan?.message} />
        </div>

        {/* Ruangan — fix: simpan id ke roomId, label ke ruangan */}
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={labelClass}>Pilih Ruangan <span className="text-brand">*</span></label>
          {loadingRooms ? (
            <div className={`${inputNormal} text-grey-400`}>Memuat daftar ruangan...</div>
          ) : (
            <select
              className={data.roomId === "" && errors.ruangan ? inputError : inputNormal}
              value={data.roomId}
              onChange={(e) => {
                const selected = rooms.find((r) => r.id === e.target.value);
                update({
                  roomId:  selected?.id    ?? "",
                  ruangan: selected?.label ?? "",
                });
              }}
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id} disabled={!r.isAvailable}>
                  {r.label}
                  {!r.isAvailable ? " (Tidak Tersedia)" : r.needsPermit ? " (Perlu Izin)" : ""}
                </option>
              ))}
            </select>
          )}
          {data.roomId === "" && errors.ruangan && (
            <FieldError message={errors.ruangan?.message} />
          )}
        </div>

        {/* Tanggal */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Tanggal Kegiatan <span className="text-brand">*</span></label>
          <input type="date" className={errors.tanggal ? inputError : inputNormal} {...register("tanggal")} />
          <FieldError message={errors.tanggal?.message} />
        </div>

        {/* Jam Mulai */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Jam Mulai <span className="text-brand">*</span></label>
          <input type="time" className={errors.jamMulai ? inputError : inputNormal} {...register("jamMulai")} />
          <FieldError message={errors.jamMulai?.message} />
        </div>

        {/* Jam Selesai */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Jam Selesai <span className="text-brand">*</span></label>
          <input type="time" className={errors.jamSelesai ? inputError : inputNormal} {...register("jamSelesai")} />
          <FieldError message={errors.jamSelesai?.message} />
        </div>

        {/* Detail Kegiatan */}
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={labelClass}>Detail Kegiatan <span className="text-brand">*</span></label>
          <textarea rows={4} placeholder="Jelaskan nama kegiatan, tujuan, dan perkiraan jumlah peserta..."
            className={errors.kegiatan ? inputError : inputNormal} {...register("kegiatan")} />
          <FieldError message={errors.kegiatan?.message} />
        </div>
      </div>
    </div>
  );
}

