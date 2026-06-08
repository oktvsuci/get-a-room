// src/components/dashboard/BookingList.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookingEditModal } from "./BookingEditModal";

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

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
  pending:  { label: "Menunggu Persetujuan", bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200", icon: "⏳" },
  approved: { label: "Disetujui",            bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200",  icon: "✅" },
  rejected: { label: "Ditolak",              bg: "bg-red-50",     text: "text-red-700",    border: "border-red-200",    icon: "❌" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function BookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bookings, setBookings]   = useState(initialBookings);
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCanceling, setIsCanceling]   = useState(false);
  const [cancelError, setCancelError]   = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("semua");

  const filtered = filterStatus === "semua"
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  function handleEdited(updated: Booking) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
    setEditTarget(null);
    startTransition(() => router.refresh());
  }

  async function handleCancel() {
    if (!cancelTarget) return;
    setIsCanceling(true);
    setCancelError(null);

    const res  = await fetch(`/api/booking/${cancelTarget.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setCancelError(data.error ?? "Gagal membatalkan booking.");
      setIsCanceling(false);
      return;
    }

    setBookings((prev) => prev.filter((b) => b.id !== cancelTarget.id));
    setCancelTarget(null);
    setIsCanceling(false);
    startTransition(() => router.refresh());
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-grey-200 rounded-xl">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="font-display text-xl font-bold text-grey-900 mb-2">Belum Ada Pengajuan</h3>
        <p className="text-grey-500 text-sm mb-6">Kamu belum pernah mengajukan peminjaman ruangan.</p>
        <a
          href="/booking"
          className="px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-md hover:bg-brand-dark transition-all"
        >
          Ajukan Peminjaman Pertama →
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { val: "semua",    label: `Semua (${bookings.length})` },
          { val: "pending",  label: `Menunggu (${bookings.filter(b => b.status === "pending").length})` },
          { val: "approved", label: `Disetujui (${bookings.filter(b => b.status === "approved").length})` },
          { val: "rejected", label: `Ditolak (${bookings.filter(b => b.status === "rejected").length})` },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilterStatus(f.val)}
            className={[
              "px-4 py-2 rounded-full text-sm font-semibold border transition-all",
              filterStatus === f.val
                ? "bg-brand text-white border-brand"
                : "bg-white text-grey-600 border-grey-300 hover:border-brand hover:text-brand",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-grey-400 bg-white border border-grey-200 rounded-xl">
            Tidak ada booking dengan status ini.
          </div>
        ) : filtered.map((booking) => {
          const cfg   = STATUS_CFG[booking.status] ?? STATUS_CFG.pending;
          const isPendingAction = booking.status === "pending";

          return (
            <div
              key={booking.id}
              className="bg-white border border-grey-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Status bar */}
              <div className={`h-1.5 w-full ${
                booking.status === "approved" ? "bg-green-500" :
                booking.status === "rejected" ? "bg-red-500" : "bg-yellow-400"
              }`} />

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info utama */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-xs text-grey-400">
                        Diajukan {new Date(booking.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-grey-900 mb-1">
                      {booking.room.namaGedung} — {booking.room.nomorRuangan}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-grey-600 mb-3">
                      <span>📅 {formatDate(booking.tanggal)}</span>
                      <span>🕐 {booking.jamMulai} – {booking.jamSelesai}</span>
                    </div>

                    <p className="text-sm text-grey-500 line-clamp-2">{booking.kegiatan}</p>

                    {/* Catatan admin jika ditolak */}
                    {booking.status === "rejected" && booking.catatanAdmin && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                        <strong>Alasan penolakan:</strong> {booking.catatanAdmin}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 sm:items-end flex-shrink-0">
                    <a
                      href={booking.fileSuratUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold border border-grey-300 rounded-md text-grey-600 hover:bg-grey-100 transition-all"
                    >
                      Lihat Surat
                    </a>

                    {isPendingAction && (
                      <>
                        <button
                          onClick={() => setEditTarget(booking)}
                          className="px-3 py-1.5 text-xs font-semibold border border-brand rounded-md text-brand hover:bg-brand hover:text-white transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => { setCancelError(null); setCancelTarget(booking); }}
                          className="px-3 py-1.5 text-xs font-semibold border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-all"
                        >
                          Batalkan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <BookingEditModal
          booking={editTarget}
          onSaved={handleEdited}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Cancel Confirm Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="font-display text-xl font-bold text-grey-900 text-center mb-2">
              Batalkan Pengajuan?
            </h3>
            <p className="text-sm text-grey-500 text-center mb-1">
              Pengajuan untuk <strong className="text-grey-800">
                {cancelTarget.room.namaGedung} — {cancelTarget.room.nomorRuangan}
              </strong>
            </p>
            <p className="text-sm text-grey-500 text-center mb-4">
              tanggal <strong className="text-grey-800">{cancelTarget.tanggal}</strong> akan dibatalkan.
            </p>
            {cancelError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4 text-center">
                {cancelError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setCancelTarget(null); setCancelError(null); }}
                className="flex-1 py-2.5 rounded-md border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-100 transition-all"
              >
                Kembali
              </button>
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="flex-1 py-2.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-60"
              >
                {isCanceling ? "Membatalkan..." : "Ya, Batalkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}