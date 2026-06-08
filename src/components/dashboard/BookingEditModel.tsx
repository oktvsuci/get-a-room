// src/components/dashboard/BookingEditModal.tsx
"use client";

import { useState, useEffect } from "react";

type Room = { namaGedung: string; nomorRuangan: string };
type Booking = {
  id: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kegiatan: string;
  instansi: string;
  jabatan: string;
  roomId: string;
  room: Room;
};

type RoomOption = { id: string; label: string; isAvailable: boolean };

const inputCls =
  "w-full px-4 py-2.5 border border-grey-300 rounded-md text-sm text-grey-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all";
const labelCls = "block text-sm font-semibold text-grey-700 mb-1.5";

type Props = {
  booking: Booking;
  onSaved: (updated: Booking) => void;
  onClose: () => void;
};

export function BookingEditModal({ booking, onSaved, onClose }: Props) {
  const [form, setForm] = useState({
    roomId:     booking.roomId,
    tanggal:    booking.tanggal,
    jamMulai:   booking.jamMulai,
    jamSelesai: booking.jamSelesai,
    kegiatan:   booking.kegiatan,
    instansi:   booking.instansi,
    jabatan:    booking.jabatan,
  });

  const [rooms, setRooms]       = useState<RoomOption[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then(({ rooms: raw }) => {
        setRooms(raw.map((r: { id: string; namaGedung: string; nomorRuangan: string; isAvailable: boolean }) => ({
          id: r.id,
          label: `${r.namaGedung} — ${r.nomorRuangan}`,
          isAvailable: r.isAvailable,
        })));
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.jamSelesai <= form.jamMulai) {
      setError("Jam selesai harus lebih akhir dari jam mulai.");
      return;
    }

    setLoading(true);

    const res  = await fetch(`/api/booking/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Gagal menyimpan perubahan.");
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
            <h2 className="font-display text-xl font-bold text-grey-900">Edit Pengajuan</h2>
            <p className="text-xs text-grey-500 mt-0.5">Hanya pengajuan Pending yang bisa diedit.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey-100 text-grey-500 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Ruangan */}
          <div>
            <label className={labelCls}>Ruangan</label>
            <select
              value={form.roomId}
              onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}
              className={inputCls}
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id} disabled={!r.isAvailable && r.id !== booking.roomId}>
                  {r.label}{!r.isAvailable && r.id !== booking.roomId ? " (Tidak Tersedia)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className={labelCls}>Tanggal Kegiatan</label>
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

          {/* Instansi & Jabatan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Instansi</label>
              <input
                type="text"
                value={form.instansi}
                onChange={(e) => setForm((p) => ({ ...p, instansi: e.target.value }))}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Jabatan</label>
              <input
                type="text"
                value={form.jabatan}
                onChange={(e) => setForm((p) => ({ ...p, jabatan: e.target.value }))}
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Detail Kegiatan */}
          <div>
            <label className={labelCls}>Detail Kegiatan</label>
            <textarea
              rows={3}
              value={form.kegiatan}
              onChange={(e) => setForm((p) => ({ ...p, kegiatan: e.target.value }))}
              className={inputCls}
              required
            />
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}