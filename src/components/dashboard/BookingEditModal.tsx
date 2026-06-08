"use client";

import { useState, useEffect } from "react";

type Room = { namaGedung: string; nomorRuangan: string };
type Booking = {
  id: string;
  createdAt: Date | string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kegiatan: string;
  instansi: string;
  jabatan: string;
  status: string;
  catatanAdmin: string | null;
  fileSuratUrl: string;
  room: Room;
  roomId: string;
};

type RoomOption = { id: string; label: string; isAvailable: boolean };

export function BookingEditModal({
  booking,
  onSaved,
  onClose,
}: {
  booking: Booking;
  onSaved: (updated: Booking) => void;
  onClose: () => void;
}) {
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [form, setForm] = useState({
    roomId:     booking.roomId,
    tanggal:    booking.tanggal,
    jamMulai:   booking.jamMulai,
    jamSelesai: booking.jamSelesai,
    kegiatan:   booking.kegiatan,
    instansi:   booking.instansi,
    jabatan:    booking.jabatan,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then(({ rooms: raw }) =>
        setRooms(raw.map((r: { id: string; namaGedung: string; nomorRuangan: string; isAvailable: boolean }) => ({
          id: r.id,
          label: `${r.namaGedung} — ${r.nomorRuangan}`,
          isAvailable: r.isAvailable,
        })))
      );
  }, []);

  const inputClass = "w-full px-4 py-2.5 border border-grey-300 rounded-md text-sm text-grey-900 outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(163,20,31,0.1)] transition-all";
  const labelClass = "block text-sm font-semibold text-grey-700 mb-1.5";

  async function handleSave() {
    setError(null);
    if (!form.roomId || !form.tanggal || !form.jamMulai || !form.jamSelesai || !form.kegiatan) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.jamSelesai <= form.jamMulai) {
      setError("Jam selesai harus lebih dari jam mulai.");
      return;
    }

    setLoading(true);
    const res  = await fetch(`/api/booking/${booking.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Gagal menyimpan perubahan.");
      return;
    }

    onSaved(data.booking);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-1.5 w-full bg-brand" />
        <div className="px-6 py-5 border-b border-grey-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-grey-900">Edit Pengajuan</h2>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-700 text-2xl leading-none">&times;</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Ruangan */}
          <div>
            <label className={labelClass}>Ruangan</label>
            <select
              className={inputClass}
              value={form.roomId}
              onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))}
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id} disabled={!r.isAvailable}>
                  {r.label}{!r.isAvailable ? " (Tidak Tersedia)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className={labelClass}>Tanggal</label>
            <input type="date" className={inputClass} value={form.tanggal}
              onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))} />
          </div>

          {/* Jam */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Jam Mulai</label>
              <input type="time" className={inputClass} value={form.jamMulai}
                onChange={(e) => setForm((f) => ({ ...f, jamMulai: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Jam Selesai</label>
              <input type="time" className={inputClass} value={form.jamSelesai}
                onChange={(e) => setForm((f) => ({ ...f, jamSelesai: e.target.value }))} />
            </div>
          </div>

          {/* Instansi */}
          <div>
            <label className={labelClass}>Instansi / Organisasi</label>
            <input type="text" className={inputClass} value={form.instansi}
              onChange={(e) => setForm((f) => ({ ...f, instansi: e.target.value }))} />
          </div>

          {/* Jabatan */}
          <div>
            <label className={labelClass}>Jabatan</label>
            <input type="text" className={inputClass} value={form.jabatan}
              onChange={(e) => setForm((f) => ({ ...f, jabatan: e.target.value }))} />
          </div>

          {/* Kegiatan */}
          <div>
            <label className={labelClass}>Detail Kegiatan</label>
            <textarea rows={3} className={inputClass} value={form.kegiatan}
              onChange={(e) => setForm((f) => ({ ...f, kegiatan: e.target.value }))} />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-grey-100 flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-md border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-100 transition-all">
            Batal
          </button>
          <button onClick={handleSave} disabled={loading}
            className="px-5 py-2.5 rounded-md bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}