// src/components/admin/RoomForm.tsx
"use client";

import { useState } from "react";
import type { Room } from "@prisma/client";

const FASILITAS_OPTIONS = [
  "AC", "Proyektor", "Sound System", "WiFi", "Whiteboard",
  "Mic", "Komputer", "Lighting", "Scoreboard", "Tribun", "Kamera",
];

const inputCls =
  "w-full px-4 py-2.5 border border-grey-300 rounded-md text-sm text-grey-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all";
const labelCls = "block text-sm font-semibold text-grey-700 mb-1.5";

type Props = {
  room?: Room | null;
  onSaved: (room: Room) => void;
};

export function RoomForm({ room, onSaved }: Props) {
  const isEdit = !!room;

  const [form, setForm] = useState({
    namaGedung:   room?.namaGedung   ?? "",
    nomorRuangan: room?.nomorRuangan ?? "",
    kategori:     room?.kategori     ?? "Fakultas",
    lantai:       room?.lantai       ?? "1",
    kapasitas:    room?.kapasitas    ?? 30,
    fasilitas:    room?.fasilitas    ?? [] as string[],
    isAvailable:  room?.isAvailable  ?? true,
    needsPermit:  room?.needsPermit  ?? false,
    keterangan:   room?.keterangan   ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleFasilitas(item: string) {
    setForm((prev) => ({
      ...prev,
      fasilitas: prev.fasilitas.includes(item)
        ? prev.fasilitas.filter((f) => f !== item)
        : [...prev.fasilitas, item],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.namaGedung.trim() || !form.nomorRuangan.trim()) {
      setError("Nama gedung dan nomor ruangan wajib diisi.");
      return;
    }
    if (form.kapasitas < 1) {
      setError("Kapasitas harus lebih dari 0.");
      return;
    }

    setLoading(true);

    const url    = isEdit ? `/api/rooms/${room!.id}` : "/api/rooms";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
      return;
    }

    onSaved(data.room);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nama Gedung */}
      <div>
        <label className={labelCls}>Nama Gedung <span className="text-brand">*</span></label>
        <input
          type="text"
          placeholder="Contoh: TULT, GSG, TUCH"
          value={form.namaGedung}
          onChange={(e) => setForm((p) => ({ ...p, namaGedung: e.target.value }))}
          className={inputCls}
          required
        />
      </div>

      {/* Nomor / Nama Ruangan */}
      <div>
        <label className={labelCls}>Nama / Nomor Ruangan <span className="text-brand">*</span></label>
        <input
          type="text"
          placeholder="Contoh: Auditorium Lt.16, R. Rapat 1601"
          value={form.nomorRuangan}
          onChange={(e) => setForm((p) => ({ ...p, nomorRuangan: e.target.value }))}
          className={inputCls}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Kategori */}
        <div>
          <label className={labelCls}>Kategori</label>
          <select
            value={form.kategori}
            onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}
            className={inputCls}
          >
            <option value="Universitas">Universitas</option>
            <option value="Fakultas">Fakultas</option>
          </select>
        </div>

        {/* Lantai */}
        <div>
          <label className={labelCls}>Lantai</label>
          <input
            type="text"
            placeholder="1"
            value={form.lantai}
            onChange={(e) => setForm((p) => ({ ...p, lantai: e.target.value }))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Kapasitas */}
      <div>
        <label className={labelCls}>Kapasitas (orang) <span className="text-brand">*</span></label>
        <input
          type="number"
          min={1}
          value={form.kapasitas}
          onChange={(e) => setForm((p) => ({ ...p, kapasitas: Number(e.target.value) }))}
          className={inputCls}
          required
        />
      </div>

      {/* Fasilitas (multi-select checkbox) */}
      <div>
        <label className={labelCls}>Fasilitas</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {FASILITAS_OPTIONS.map((item) => {
            const checked = form.fasilitas.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleFasilitas(item)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  checked
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-grey-600 border-grey-300 hover:border-brand hover:text-brand",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3 pt-2 border-t border-grey-200">
        <label className={labelCls}>Status Ketersediaan</label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))}
            className="w-4 h-4 accent-brand"
          />
          <span className="text-sm text-grey-700">
            Ruangan <strong>tersedia</strong> untuk dipinjam
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.needsPermit}
            onChange={(e) => setForm((p) => ({ ...p, needsPermit: e.target.checked }))}
            className="w-4 h-4 accent-brand"
          />
          <span className="text-sm text-grey-700">
            Memerlukan <strong>izin direktorat</strong> tambahan
          </span>
        </label>
      </div>

      {/* Keterangan (jika tidak tersedia) */}
      {(!form.isAvailable || form.needsPermit) && (
        <div>
          <label className={labelCls}>Keterangan (opsional)</label>
          <textarea
            rows={2}
            placeholder="Contoh: Sedang renovasi, estimasi selesai akhir bulan..."
            value={form.keterangan}
            onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
            className={inputCls}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-md bg-brand text-white font-semibold text-sm shadow-sm hover:bg-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? (isEdit ? "Menyimpan..." : "Menambahkan...")
          : (isEdit ? "Simpan Perubahan" : "Tambah Ruangan")}
      </button>
    </form>
  );
}