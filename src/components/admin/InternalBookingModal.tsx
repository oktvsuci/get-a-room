// src/components/admin/InternalBookingModal.tsx
"use client";

import { useState } from "react";

type RoomOption = { id: string; namaGedung: string; nomorRuangan: string };
type Booking = {
  id: string;
  createdAt: Date | string;
  nama: string;
  nim: string;
  email: string;
  hp: string;
  instansi: string;
  jabatan: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kegiatan: string;
  fileSuratUrl: string;
  status: string;
  catatanAdmin: string | null;
  room: { namaGedung: string; nomorRuangan: string };
  roomId: string;
};

const inputCls =
  "w-full px-4 py-2.5 border border-grey-300 rounded-md text-sm text-grey-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all";
const labelCls = "block text-sm font-semibold text-grey-700 mb-1.5";

type Props = {
  rooms: RoomOption[];
  onSaved: (booking: Booking) => void;
  onClose: () => void;
};

export function InternalBookingModal({ rooms, onSaved, onClose }: Props) {
  const [form, setForm] = useState({
    roomId:     rooms[0]?.id ?? "",
    tanggal:    "",
    jamMulai:   "08:00",
    jamSelesai: "10:00",
    kegiatan:   "",
    instansi:   "Telkom University",
    nama:       "Universitas (Internal)",
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.tanggal) { setError("Tanggal wajib diisi."); return; }
    if (!form.kegiatan.trim()) { setError("Detail kegiatan wajib diisi."); return; }
    if (form.jamSelesai <= form.jamMulai) {
      setError("Jam selesai harus lebih akhir dari jam mulai.");
      return;
    }

    setLoading(true);

    const res  = await fetch("/api/admin/bookings/internal", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Gagal membuat booking internal.");
      setLoading(false);
      return;
    }

    onSaved(data.booking);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-grey-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-grey-900">Booking Internal</h2>
            <p className="text-xs text-grey-500 mt-0.5">
              Jalur khusus admin — langsung berstatus Disetujui.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey-100 text-grey-500 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Nama kegiatan / keperluan */}
          <div>
            <label className={labelCls}>
              Nama Kegiatan / Keperluan <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Rapat Pimpinan Universitas"
              value={form.nama}
              onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
              className={inputCls}
              required
            />
          </div>

          {/* Instansi */}
          <div>
            <label className={labelCls}>Instansi / Unit</label>
            <input
              type="text"
              value={form.instansi}
              onChange={(e) => setForm((p) => ({ ...p, instansi: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Ruangan */}
          <div>
            <label className={labelCls}>
              Ruangan <span className="text-brand">*</span>
            </label>
            <select
              value={form.roomId}
              onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}
              className={inputCls}
              required
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.namaGedung} — {r.nomorRuangan}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className={labelCls}>
              Tanggal <span className="text-brand">*</span>
            </label>
            <input
              type="date"
              value={form.tanggal}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
              className={inputCls}
              required
            />
          </div>

          {/* Jam */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Jam Mulai</label>
              <input
                type="time"
                value={form.jamMulai}
                onChange={(e) => setForm((p) => ({ ...p, jamMulai: e.target.value }))}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Jam Selesai</label>
              <input
                type="time"
                value={form.jamSelesai}
                onChange={(e) => setForm((p) => ({ ...p, jamSelesai: e.target.value }))}
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Detail kegiatan */}
          <div>
            <label className={labelCls}>
              Detail Kegiatan <span className="text-brand">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan keperluan penggunaan ruangan..."
              value={form.kegiatan}
              onChange={(e) => setForm((p) => ({ ...p, kegiatan: e.target.value }))}
              className={inputCls}
              required
            />
          </div>

          {/* Info badge */}
          <div className="flex items-start gap-3 p-3 bg-brand/5 border border-brand/20 rounded-md">
            <span className="text-brand text-base flex-shrink-0">ℹ️</span>
            <p className="text-xs text-grey-600">
              Booking internal akan langsung berstatus <strong>Disetujui</strong> dan
              memblokir slot jadwal ruangan tersebut. Cek konflik terlebih dahulu.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-md bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all disabled:opacity-60"
            >
              {loading ? "Membuat..." : "Buat Booking Internal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}