// src/components/admin/RoomManager.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RoomForm } from "./RoomForm";
import type { Room } from "@prisma/client";

type RoomWithCount = Room & { _count: { bookings: number } };

const STATUS_CFG = {
  available:    { label: "Tersedia",        bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200" },
  unavailable:  { label: "Tidak Tersedia",  bg: "bg-grey-100",   text: "text-grey-500",   border: "border-grey-200" },
  needs_permit: { label: "Perlu Izin",      bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200" },
};

function getRoomStatus(room: Room) {
  if (room.needsPermit) return "needs_permit";
  if (!room.isAvailable) return "unavailable";
  return "available";
}

export function RoomManager({ initialRooms }: { initialRooms: RoomWithCount[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rooms, setRooms] = useState(initialRooms);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<RoomWithCount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomWithCount | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = rooms.filter(
    (r) =>
      `${r.namaGedung} ${r.nomorRuangan}`.toLowerCase().includes(search.toLowerCase())
  );

  function handleSaved(newRoom: Room) {
    setRooms((prev) => {
      const exists = prev.find((r) => r.id === newRoom.id);
      if (exists) {
        return prev.map((r) =>
          r.id === newRoom.id ? { ...r, ...newRoom } : r
        );
      }
      return [{ ...newRoom, _count: { bookings: 0 } }, ...prev];
    });
    setShowForm(false);
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await fetch(`/api/rooms/${deleteTarget.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setDeleteError(data.error ?? "Gagal menghapus ruangan.");
      setIsDeleting(false);
      return;
    }

    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsDeleting(false);
    startTransition(() => router.refresh());
  }

  return (
    <>
      {/* ── Header toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari nama atau gedung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
        />
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-md hover:bg-brand-dark transition-all shadow-sm whitespace-nowrap"
        >
          + Tambah Ruangan
        </button>
      </div>

      {/* ── Stats summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Ruangan", val: rooms.length },
          { label: "Tersedia",      val: rooms.filter((r) => r.isAvailable && !r.needsPermit).length },
          { label: "Tidak Tersedia",val: rooms.filter((r) => !r.isAvailable).length },
          { label: "Perlu Izin",    val: rooms.filter((r) => r.needsPermit).length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-grey-200 rounded-lg p-4">
            <p className="text-xs text-grey-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-grey-900">{s.val}</p>
          </div>
        ))}
      </div>

      {/* ── Room table ── */}
      <div className="bg-white border border-grey-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-grey-50 border-b border-grey-200">
              <th className="text-left px-5 py-3.5 font-semibold text-grey-600 text-xs uppercase tracking-wide">Ruangan</th>
              <th className="text-left px-4 py-3.5 font-semibold text-grey-600 text-xs uppercase tracking-wide hidden md:table-cell">Kategori</th>
              <th className="text-left px-4 py-3.5 font-semibold text-grey-600 text-xs uppercase tracking-wide hidden lg:table-cell">Kapasitas</th>
              <th className="text-left px-4 py-3.5 font-semibold text-grey-600 text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3.5 font-semibold text-grey-600 text-xs uppercase tracking-wide hidden lg:table-cell">Booking</th>
              <th className="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-grey-400">
                  Tidak ada ruangan ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((room) => {
                const status = getRoomStatus(room);
                const cfg = STATUS_CFG[status];
                return (
                  <tr key={room.id} className="hover:bg-grey-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-grey-900">
                        {room.namaGedung} — {room.nomorRuangan}
                      </p>
                      <p className="text-xs text-grey-500 mt-0.5">
                        Lt. {room.lantai} · {room.fasilitas.slice(0, 3).join(", ")}
                        {room.fasilitas.length > 3 ? ` +${room.fasilitas.length - 3}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-grey-600 hidden md:table-cell">
                      {room.kategori}
                    </td>
                    <td className="px-4 py-4 text-grey-600 hidden lg:table-cell">
                      {room.kapasitas.toLocaleString()} orang
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                      {room.keterangan && (
                        <p className="text-xs text-grey-400 mt-1 max-w-[200px] truncate" title={room.keterangan}>
                          {room.keterangan}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-grey-600 hidden lg:table-cell">
                      {room._count.bookings} booking
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditTarget(room); setShowForm(true); }}
                          className="px-3 py-1.5 text-xs font-semibold border border-grey-300 rounded-md text-grey-700 hover:bg-grey-100 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setDeleteError(null); setDeleteTarget(room); }}
                          className="px-3 py-1.5 text-xs font-semibold border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Form Modal (Tambah / Edit) ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-grey-200 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-grey-900">
                {editTarget ? "Edit Ruangan" : "Tambah Ruangan Baru"}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditTarget(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey-100 text-grey-500 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <RoomForm room={editTarget} onSaved={handleSaved} />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="font-display text-xl font-bold text-grey-900 text-center mb-2">
              Hapus Ruangan?
            </h3>
            <p className="text-sm text-grey-500 text-center mb-2">
              <strong className="text-grey-800">
                {deleteTarget.namaGedung} — {deleteTarget.nomorRuangan}
              </strong>{" "}
              akan dihapus permanen dari sistem.
            </p>
            {deleteTarget._count.bookings > 0 && (
              <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-2 text-center">
                ⚠️ Ruangan ini memiliki {deleteTarget._count.bookings} riwayat booking.
              </p>
            )}
            {deleteError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4 text-center">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                className="flex-1 py-2.5 rounded-md border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-100 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-60"
              >
                {isDeleting ? "Menghapus..." : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}