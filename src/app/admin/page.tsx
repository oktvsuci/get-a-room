// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Ambil semua stats dalam satu kali round-trip (Promise.all)
  const [
    totalBooking,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalRooms,
    availableRooms,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending"  } }),
    prisma.booking.count({ where: { status: "approved" } }),
    prisma.booking.count({ where: { status: "rejected" } }),
    prisma.room.count(),
    prisma.room.count({ where: { isAvailable: true, needsPermit: false } }),
    prisma.booking.findMany({
      take:    8,
      orderBy: { createdAt: "desc" },
      include: { room: { select: { namaGedung: true, nomorRuangan: true } } },
    }),
  ]);

  const STATUS_CFG = {
    pending:  { label: "Menunggu", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-400" },
    approved: { label: "Disetujui", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
    rejected: { label: "Ditolak",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
  } as const;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-1">
          Admin Panel
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-grey-900">
          Overview
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Booking",
            value: totalBooking,
            sub: "Semua waktu",
            icon: "📋",
            color: "border-l-brand",
          },
          {
            label: "Menunggu Persetujuan",
            value: pendingCount,
            sub: pendingCount > 0 ? "Perlu tindakan" : "Semua sudah diproses",
            icon: "⏳",
            color: pendingCount > 0 ? "border-l-yellow-400" : "border-l-grey-300",
            urgent: pendingCount > 0,
          },
          {
            label: "Disetujui",
            value: approvedCount,
            sub: `${totalBooking > 0 ? Math.round((approvedCount / totalBooking) * 100) : 0}% dari total`,
            icon: "✅",
            color: "border-l-green-500",
          },
          {
            label: "Ruangan Tersedia",
            value: availableRooms,
            sub: `dari ${totalRooms} ruangan`,
            icon: "🏛️",
            color: "border-l-blue-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={[
              "bg-white border border-grey-200 rounded-xl p-5 border-l-4 shadow-sm",
              s.color,
              s.urgent ? "ring-1 ring-yellow-300" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              {s.urgent && (
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </div>
            <p className="text-3xl font-bold text-grey-900 mb-1">{s.value}</p>
            <p className="text-sm font-semibold text-grey-700">{s.label}</p>
            <p className="text-xs text-grey-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Pending alert CTA */}
      {pendingCount > 0 && (
        <div className="mb-6 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-semibold text-yellow-800">
              Ada <strong>{pendingCount}</strong> pengajuan yang menunggu persetujuan kamu.
            </p>
          </div>
          <Link
            href="/admin/booking?status=pending"
            className="px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-all whitespace-nowrap"
          >
            Proses Sekarang →
          </Link>
        </div>
      )}

      {/* Status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(["pending", "approved", "rejected"] as const).map((s) => {
          const cfg = STATUS_CFG[s];
          const count = s === "pending" ? pendingCount : s === "approved" ? approvedCount : rejectedCount;
          const pct = totalBooking > 0 ? Math.round((count / totalBooking) * 100) : 0;
          return (
            <div key={s} className="bg-white border border-grey-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  {cfg.label}
                </span>
                <span className="text-2xl font-bold text-grey-900">{count}</span>
              </div>
              <div className="h-2 bg-grey-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cfg.dot} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-grey-400 mt-2">{pct}% dari total booking</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            href:  "/admin/booking",
            icon:  "📋",
            label: "Kelola Booking",
            desc:  "Setujui atau tolak pengajuan peminjaman",
            color: "border-l-brand",
          },
          {
            href:  "/admin/ruangan",
            icon:  "🏛️",
            label: "Kelola Ruangan",
            desc:  "Tambah, edit, atau hapus data ruangan",
            color: "border-l-blue-400",
          },
          {
            href:  "/admin/users",
            icon:  "👥",
            label: "Kelola Pengguna",
            desc:  "Lihat dan kelola akun pengguna",
            color: "border-l-green-400",
          },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`bg-white border border-grey-200 border-l-4 ${a.color} rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
          >
            <span className="text-2xl mb-3 block">{a.icon}</span>
            <p className="font-bold text-grey-900 mb-1">{a.label}</p>
            <p className="text-xs text-grey-500">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings table */}
      <div className="bg-white border border-grey-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <h2 className="font-semibold text-grey-900">Pengajuan Terbaru</h2>
          <Link
            href="/admin/booking"
            className="text-xs text-brand font-semibold hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-grey-50 border-b border-grey-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-grey-500 uppercase tracking-wide">Pemohon</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden md:table-cell">Ruangan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden lg:table-cell">Tanggal</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-grey-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-grey-400">
                  Belum ada pengajuan.
                </td>
              </tr>
            ) : (
              recentBookings.map((b) => {
                const cfg = STATUS_CFG[b.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
                return (
                  <tr key={b.id} className="hover:bg-grey-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-grey-900">{b.nama}</p>
                      <p className="text-xs text-grey-500">{b.nim}</p>
                    </td>
                    <td className="px-4 py-3.5 text-grey-600 hidden md:table-cell">
                      {b.room.namaGedung} — {b.room.nomorRuangan}
                    </td>
                    <td className="px-4 py-3.5 text-grey-600 hidden lg:table-cell">
                      {b.tanggal}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}