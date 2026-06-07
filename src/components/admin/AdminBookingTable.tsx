// src/components/admin/AdminBookingTable.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { InternalBookingModal } from "./InternalBookingModal";

type Room = { namaGedung: string; nomorRuangan: string };
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
  room: Room;
  roomId: string;
};

const STATUS_CFG = {
  pending:  { label: "Menunggu", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-400" },
  approved: { label: "Disetujui", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  rejected: { label: "Ditolak",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
} as const;

type Props = {
  initialBookings: Booking[];
  initialTotal: number;
  rooms: RoomOption[];
};

export function AdminBookingTable({ initialBookings, initialTotal, rooms }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Data state
  const [bookings,   setBookings]   = useState(initialBookings);
  const [total,      setTotal]      = useState(initialTotal);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 15));

  // Filter state
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRoom,   setFilterRoom]   = useState("");
  const [filterQ,      setFilterQ]      = useState("");
  const [filterDate,   setFilterDate]   = useState("");

  // Action state
  const [actionTarget,  setActionTarget]  = useState<Booking | null>(null);
  const [actionType,    setActionType]    = useState<"approve" | "reject" | "delete" | null>(null);
  const [catatanAdmin,  setCatatanAdmin]  = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState<string | null>(null);
  const [expandedId,    setExpandedId]    = useState<string | null>(null);
  const [showInternal,  setShowInternal]  = useState(false);

  // Fetch dengan filter
  const fetchBookings = useCallback(async (params: {
    status?: string; roomId?: string; q?: string; tanggal?: string; page?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params.status)  sp.set("status",  params.status);
    if (params.roomId)  sp.set("roomId",  params.roomId);
    if (params.q)       sp.set("q",       params.q);
    if (params.tanggal) sp.set("tanggal", params.tanggal);
    if (params.page)    sp.set("page",    String(params.page));

    const res  = await fetch(`/api/admin/bookings?${sp.toString()}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
  }, []);

  async function applyFilter(overrides: Partial<{
    status: string; roomId: string; q: string; tanggal: string; page: number;
  }> = {}) {
    const newPage = overrides.page ?? 1;
    setPage(newPage);
    await fetchBookings({
      status:  overrides.status  ?? filterStatus,
      roomId:  overrides.roomId  ?? filterRoom,
      q:       overrides.q       ?? filterQ,
      tanggal: overrides.tanggal ?? filterDate,
      page:    newPage,
    });
  }

  function resetFilter() {
    setFilterStatus("");
    setFilterRoom("");
    setFilterQ("");
    setFilterDate("");
    setPage(1);
    fetchBookings({ page: 1 });
  }

  // Approve / Reject
  async function handleAction() {
    if (!actionTarget || !actionType || actionType === "delete") return;
    setActionLoading(true);
    setActionError(null);

    const res = await fetch(`/api/admin/bookings/${actionTarget.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: actionType, catatanAdmin }),
    });
    const data = await res.json();

    if (!res.ok) {
      setActionError(data.error ?? "Gagal memproses.");
      setActionLoading(false);
      return;
    }

    // Update lokal
    setBookings((prev) =>
      prev.map((b) => (b.id === actionTarget.id ? { ...b, ...data.booking } : b))
    );
    setActionTarget(null);
    setActionType(null);
    setCatatanAdmin("");
    setActionLoading(false);
    startTransition(() => router.refresh());
  }

  // Delete
  async function handleDelete() {
    if (!actionTarget) return;
    setActionLoading(true);
    setActionError(null);

    const res  = await fetch(`/api/admin/bookings/${actionTarget.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setActionError(data.error ?? "Gagal menghapus.");
      setActionLoading(false);
      return;
    }

    setBookings((prev) => prev.filter((b) => b.id !== actionTarget.id));
    setTotal((t) => t - 1);
    setActionTarget(null);
    setActionType(null);
    setActionLoading(false);
    startTransition(() => router.refresh());
  }

  function openAction(booking: Booking, type: "approve" | "reject" | "delete") {
    setActionError(null);
    setCatatanAdmin("");
    setActionTarget(booking);
    setActionType(type);
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="bg-white border border-grey-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-grey-600 mb-1">Cari nama / NIM</label>
            <input
              type="text"
              placeholder="Ketik dan tekan Enter..."
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilter({ q: filterQ })}
              className="w-full px-3 py-2 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-semibold text-grey-600 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); applyFilter({ status: e.target.value }); }}
              className="px-3 py-2 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand transition-all bg-white"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          {/* Room filter */}
          <div>
            <label className="block text-xs font-semibold text-grey-600 mb-1">Ruangan</label>
            <select
              value={filterRoom}
              onChange={(e) => { setFilterRoom(e.target.value); applyFilter({ roomId: e.target.value }); }}
              className="px-3 py-2 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand transition-all bg-white"
            >
              <option value="">Semua Ruangan</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.namaGedung} — {r.nomorRuangan}
                </option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div>
            <label className="block text-xs font-semibold text-grey-600 mb-1">Tanggal</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); applyFilter({ tanggal: e.target.value }); }}
              className="px-3 py-2 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand transition-all bg-white"
            />
          </div>

          <button
            onClick={resetFilter}
            className="px-3 py-2 border border-grey-300 rounded-md text-sm text-grey-600 hover:bg-grey-100 transition-all"
          >
            Reset
          </button>

          <button
            onClick={() => setShowInternal(true)}
            className="ml-auto px-4 py-2 bg-brand text-white text-sm font-semibold rounded-md hover:bg-brand-dark transition-all shadow-sm whitespace-nowrap"
          >
            + Booking Internal
          </button>
        </div>
      </div>

      {/* ── Summary row ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm text-grey-500">
          Menampilkan <strong className="text-grey-900">{bookings.length}</strong> dari{" "}
          <strong className="text-grey-900">{total}</strong> booking
        </p>
        {isPending && (
          <span className="text-xs text-brand animate-pulse font-semibold">Memperbarui...</span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-grey-200 rounded-xl shadow-sm overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-grey-50 border-b border-grey-200">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide">Pemohon</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden md:table-cell">Ruangan</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden lg:table-cell">Jadwal</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-grey-400">
                  Tidak ada booking ditemukan.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const cfg       = STATUS_CFG[b.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
                const isPending = b.status === "pending";
                const expanded  = expandedId === b.id;

                return (
                  <>
                    <tr
                      key={b.id}
                      className={["hover:bg-grey-50 transition-colors cursor-pointer", expanded ? "bg-grey-50" : ""].join(" ")}
                      onClick={() => setExpandedId(expanded ? null : b.id)}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-grey-900">{b.nama}</p>
                        <p className="text-xs text-grey-500">{b.nim} · {b.instansi}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-grey-700 font-medium">{b.room.namaGedung}</p>
                        <p className="text-xs text-grey-500">{b.room.nomorRuangan}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-grey-700">{b.tanggal}</p>
                        <p className="text-xs text-grey-500">{b.jamMulai} – {b.jamSelesai}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        {b.catatanAdmin && (
                          <p className="text-xs text-grey-400 mt-0.5 max-w-[140px] truncate" title={b.catatanAdmin}>
                            {b.catatanAdmin}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="flex items-center gap-1.5 justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isPending && (
                            <>
                              <button
                                onClick={() => openAction(b, "approve")}
                                className="px-2.5 py-1.5 text-xs font-bold bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => openAction(b, "reject")}
                                className="px-2.5 py-1.5 text-xs font-bold bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openAction(b, "delete")}
                            className="px-2.5 py-1.5 text-xs font-semibold border border-grey-300 text-grey-500 rounded-md hover:border-red-300 hover:text-red-500 transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expanded && (
                      <tr key={`${b.id}-expanded`} className="bg-grey-50 border-t border-grey-100">
                        <td colSpan={5} className="px-6 py-5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-1">Email</p>
                              <p className="text-grey-800">{b.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-1">No. HP</p>
                              <p className="text-grey-800">{b.hp}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-1">Jabatan</p>
                              <p className="text-grey-800">{b.jabatan}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-1">Diajukan</p>
                              <p className="text-grey-800">
                                {new Date(b.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <div className="col-span-2 md:col-span-4">
                              <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-1">Detail Kegiatan</p>
                              <p className="text-grey-800 leading-relaxed">{b.kegiatan}</p>
                            </div>
                            {b.fileSuratUrl && (
                              <div className="col-span-2 md:col-span-4">
                                
                                  href={b.fileSuratUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-grey-300 rounded-md text-xs font-semibold text-grey-700 hover:border-brand hover:text-brand transition-all"
                                >
                                  📄 Lihat Surat Permohonan
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-grey-500">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => { const p = page - 1; setPage(p); applyFilter({ page: p }); }}
              className="px-3 py-1.5 border border-grey-300 rounded-md text-sm text-grey-600 hover:bg-grey-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => { const p = page + 1; setPage(p); applyFilter({ page: p }); }}
              className="px-3 py-1.5 border border-grey-300 rounded-md text-sm text-grey-600 hover:bg-grey-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Action Modal (Approve / Reject / Delete) ── */}
      {actionTarget && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Color bar */}
            <div className={`h-1.5 w-full ${
              actionType === "approve" ? "bg-green-500" :
              actionType === "reject"  ? "bg-red-500"   : "bg-grey-400"
            }`} />

            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  actionType === "approve" ? "bg-green-100" :
                  actionType === "reject"  ? "bg-red-100"   : "bg-grey-100"
                }`}>
                  <span className="text-xl">
                    {actionType === "approve" ? "✅" : actionType === "reject" ? "❌" : "🗑️"}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-grey-900 mb-1">
                    {actionType === "approve" ? "Setujui Pengajuan?" :
                     actionType === "reject"  ? "Tolak Pengajuan?"   : "Hapus Booking?"}
                  </h3>
                  <p className="text-sm text-grey-500">
                    <strong className="text-grey-800">{actionTarget.nama}</strong> —{" "}
                    {actionTarget.room.namaGedung} {actionTarget.room.nomorRuangan},{" "}
                    {actionTarget.tanggal},{" "}
                    {actionTarget.jamMulai}–{actionTarget.jamSelesai}
                  </p>
                </div>
              </div>

              {/* Catatan admin — wajib untuk reject, opsional untuk approve */}
              {(actionType === "approve" || actionType === "reject") && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-grey-700 mb-1.5">
                    {actionType === "reject" ? "Alasan Penolakan *" : "Catatan (opsional)"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      actionType === "reject"
                        ? "Contoh: Jadwal bentrok dengan kegiatan resmi universitas..."
                        : "Catatan tambahan untuk pemohon (opsional)..."
                    }
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    className="w-full px-4 py-2.5 border border-grey-300 rounded-md text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                  />
                </div>
              )}

              {actionType === "delete" && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  ⚠️ Data booking ini akan dihapus permanen dan tidak bisa dikembalikan.
                </div>
              )}

              {actionError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {actionError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setActionTarget(null); setActionType(null); setActionError(null); }}
                  className="flex-1 py-2.5 rounded-md border border-grey-300 text-sm font-semibold text-grey-700 hover:bg-grey-100 transition-all"
                >
                  Batal
                </button>
                <button
                  disabled={
                    actionLoading ||
                    (actionType === "reject" && !catatanAdmin.trim())
                  }
                  onClick={actionType === "delete" ? handleDelete : handleAction}
                  className={[
                    "flex-1 py-2.5 rounded-md text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                    actionType === "approve" ? "bg-green-500 hover:bg-green-600" :
                    actionType === "reject"  ? "bg-red-500 hover:bg-red-600"    :
                    "bg-grey-700 hover:bg-grey-800",
                  ].join(" ")}
                >
                  {actionLoading ? "Memproses..." :
                   actionType === "approve" ? "Ya, Setujui" :
                   actionType === "reject"  ? "Ya, Tolak"   : "Hapus Permanen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Internal Booking Modal ── */}
      {showInternal && (
        <InternalBookingModal
          rooms={rooms}
          onSaved={(newBooking) => {
            setBookings((prev) => [newBooking, ...prev]);
            setTotal((t) => t + 1);
            setShowInternal(false);
            startTransition(() => router.refresh());
          }}
          onClose={() => setShowInternal(false)}
        />
      )}
    </>
  );
}