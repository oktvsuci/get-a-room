// src/components/ruangan/RuanganClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RoomWithStatus = {
  id: string;
  namaGedung: string;
  nomorRuangan: string;
  kategori: string;
  lantai: string;
  kapasitas: number;
  fasilitas: string[];
  fotoUrl: string | null;
  keterangan: string | null;
  isAvailable: boolean;
  needsPermit: boolean;
  status: "tersedia" | "digunakan" | "perlu-izin" | "tidak-tersedia";
};

type Props = {
  rooms: RoomWithStatus[];
  gedungOptions: string[];
  isLoggedIn: boolean;
};

const STATUS_CONFIG = {
  tersedia:       { label: "Tersedia",               bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200"  },
  digunakan:      { label: "Sedang Digunakan",        bg: "bg-grey-100",   text: "text-grey-500",   border: "border-grey-200"   },
  "perlu-izin":   { label: "Perlu Izin Direktorat",   bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200" },
  "tidak-tersedia":{ label: "Tidak Tersedia",         bg: "bg-red-50",     text: "text-red-400",    border: "border-red-200"    },
};

function getRoomIcon(room: RoomWithStatus): string {
  const name = room.nomorRuangan.toLowerCase();
  if (name.includes("basket") || name.includes("sport")) return "🏀";
  if (name.includes("lab") || name.includes("komputer") || name.includes("mulmed")) return "💻";
  if (name.includes("rapat")) return "🤝";
  if (room.kapasitas >= 500) return "🏛️";
  if (room.kapasitas >= 100) return "🎭";
  return "🏫";
}

const KATEGORI_OPTIONS = ["Semua Kategori", "Universitas", "Fakultas"];
const STATUS_OPTIONS   = ["Semua Status", "tersedia", "digunakan", "perlu-izin", "tidak-tersedia"];

export function RuanganClient({ rooms, gedungOptions, isLoggedIn }: Props) {
  const router = useRouter();
  const [gedung,    setGedung]    = useState("Semua Gedung");
  const [kategori,  setKategori]  = useState("Semua Kategori");
  const [status,    setStatus]    = useState("Semua Status");
  const [search,    setSearch]    = useState("");
  const [onlyAvail, setOnlyAvail] = useState(false);

  const filtered = rooms.filter((r) => {
    const matchGedung   = gedung   === "Semua Gedung"   || r.namaGedung === gedung;
    const matchKategori = kategori === "Semua Kategori" || r.kategori   === kategori;
    const matchStatus   = status   === "Semua Status"   || r.status     === status;
    const matchSearch   = `${r.namaGedung} ${r.nomorRuangan}`.toLowerCase().includes(search.toLowerCase());
    const matchAvail    = !onlyAvail || r.status === "tersedia";
    return matchGedung && matchKategori && matchStatus && matchSearch && matchAvail;
  });

  function handleBookingClick(room: RoomWithStatus) {
    if (!isLoggedIn) {
      // Guest → redirect ke login dengan pesan
      router.push(`/login?redirectTo=/booking?roomId=${room.id}&ruangan=${encodeURIComponent(`${room.namaGedung} — ${room.nomorRuangan}`)}&reason=booking`);
      return;
    }
    router.push(`/booking?roomId=${room.id}&ruangan=${encodeURIComponent(`${room.namaGedung} — ${room.nomorRuangan}`)}`);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-2">
      {/* ── Sidebar Filter ── */}
      <aside className="w-full lg:w-1/4 border-grey-200 p-6 sm:p-10 bg-white sticky top-[100px] lg:h-fit lg:border-r">
        <p className="text-xs font-bold tracking-widest text-grey-500 uppercase mb-6">
          Filter Ruangan
        </p>

        <div className="mb-6">
          <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">Cari</label>
          <input
            type="text"
            placeholder="Nama ruangan atau gedung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none focus:border-brand shadow-sm transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">Gedung</label>
          <select
            value={gedung}
            onChange={(e) => setGedung(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer focus:border-brand shadow-sm transition-all"
          >
            {gedungOptions.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer focus:border-brand shadow-sm transition-all"
          >
            {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer focus:border-brand shadow-sm transition-all"
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <label className="flex items-center gap-3 mb-8 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvail}
            onChange={(e) => setOnlyAvail(e.target.checked)}
            className="w-4 h-4 accent-brand"
          />
          <span className="text-sm font-semibold text-grey-700">Tersedia saja</span>
        </label>

        <button
          onClick={() => { setGedung("Semua Gedung"); setKategori("Semua Kategori"); setStatus("Semua Status"); setSearch(""); setOnlyAvail(false); }}
          className="w-full py-3 bg-grey-900 text-white rounded-md font-semibold text-[0.95rem] transition-all hover:bg-brand cursor-pointer"
        >
          Reset Filter
        </button>

        {/* Legend */}
        <div className="mt-8 pt-8 border-t border-grey-200">
          <p className="text-xs font-bold tracking-widest text-grey-500 uppercase mb-4">
            Keterangan
          </p>
          <div className="flex flex-col gap-2.5">
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <span key={key} className={`self-start text-xs font-semibold px-2 py-1 rounded border ${val.bg} ${val.text} ${val.border}`}>
                {val.label}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Grid Ruangan ── */}
      <section className="flex-1 p-6 sm:p-10 bg-grey-50">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[0.9rem] text-grey-500">
            Menampilkan <span className="font-bold text-grey-900">{filtered.length}</span>{" "}
            dari {rooms.length} ruangan
          </p>
        </div>

        {/* Banner login untuk guest */}
        {!isLoggedIn && (
          <div className="mb-6 flex items-center gap-3 bg-brand/5 border border-brand/20 rounded-xl px-5 py-4">
            <span className="text-xl">🔒</span>
            <p className="text-sm text-grey-700 flex-1">
              <strong className="text-grey-900">Login diperlukan untuk booking.</strong>{" "}
              Kamu bisa melihat ketersediaan ruangan, tapi harus login terlebih dahulu untuk mengajukan peminjaman.
            </p>
            <Link
              href="/login?redirectTo=/ruangan"
              className="flex-shrink-0 px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-all"
            >
              Login Sekarang
            </Link>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-grey-900 mb-2">Ruangan Tidak Ditemukan</h3>
            <p className="text-grey-500 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {filtered.map((room) => {
              const cfg  = STATUS_CONFIG[room.status];
              const bisa = room.status === "tersedia";
              const icon = getRoomIcon(room);

              return (
                <div
                  key={room.id}
                  className="bg-white border border-grey-200 rounded-lg overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-grey-300"
                >
                  <div className="h-[140px] bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-5xl">
                    {room.fotoUrl
                      ? <img src={room.fotoUrl} alt={room.nomorRuangan} className="w-full h-full object-cover" />
                      : icon
                    }
                  </div>

                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <span className={`self-start text-xs font-bold px-2 py-1 rounded border mb-3 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>

                    <h3 className="font-display text-[1.05rem] font-bold text-grey-900 mb-1">
                      {room.namaGedung} — {room.nomorRuangan}
                    </h3>
                    <p className="text-xs text-grey-500 mb-3">
                      {room.kategori} · Lt. {room.lantai} · Kapasitas {room.kapasitas.toLocaleString()} orang
                    </p>

                    {room.keterangan && (
                      <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded px-2 py-1 mb-3">
                        ℹ️ {room.keterangan}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {room.fasilitas.map((f) => (
                        <span key={f} className="text-xs px-2 py-1 bg-grey-100 text-grey-600 rounded font-medium">
                          {f}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => bisa && handleBookingClick(room)}
                      disabled={!bisa}
                      className={[
                        "w-full py-2.5 rounded-md text-[0.9rem] font-semibold text-center transition-all duration-200 border",
                        bisa
                          ? "border-brand text-brand hover:bg-brand hover:text-white cursor-pointer"
                          : "border-grey-200 text-grey-400 cursor-not-allowed bg-grey-50",
                      ].join(" ")}
                    >
                      {!bisa
                        ? "Tidak Tersedia"
                        : isLoggedIn
                          ? "Booking Ruangan Ini →"
                          : "🔒 Login untuk Booking"
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}