"use client";

import { useState } from "react";
import Link from "next/link";

const RUANGAN = [
  {
    id: 1,
    nama: "TUCH Convention Hall",
    gedung: "TUCH",
    kategori: "Universitas",
    kapasitas: 1000,
    fasilitas: ["AC", "Proyektor", "Sound System", "WiFi"],
    status: "tersedia",
    lantai: "1",
  },
  {
    id: 2,
    nama: "GSG Aula Besar",
    gedung: "GSG",
    kategori: "Universitas",
    kapasitas: 500,
    fasilitas: ["AC", "Proyektor", "Sound System"],
    status: "tersedia",
    lantai: "1",
  },
  {
    id: 3,
    nama: "TULT Auditorium Lt. 16",
    gedung: "TULT",
    kategori: "Fakultas",
    kapasitas: 200,
    fasilitas: ["AC", "Proyektor", "Mic", "WiFi"],
    status: "digunakan",
    lantai: "16",
  },
  {
    id: 4,
    nama: "TULT R. Rapat 1601",
    gedung: "TULT",
    kategori: "Fakultas",
    kapasitas: 30,
    fasilitas: ["AC", "Proyektor", "Whiteboard"],
    status: "tersedia",
    lantai: "16",
  },
  {
    id: 5,
    nama: "Selaru Aula FIT",
    gedung: "Selaru",
    kategori: "Fakultas",
    kapasitas: 150,
    fasilitas: ["AC", "Proyektor", "Sound System", "WiFi"],
    status: "tersedia",
    lantai: "1",
  },
  {
    id: 6,
    nama: "Batek Mulmed A",
    gedung: "Batek",
    kategori: "Fakultas",
    kapasitas: 40,
    fasilitas: ["AC", "Komputer", "Proyektor", "WiFi"],
    status: "digunakan",
    lantai: "2",
  },
  {
    id: 7,
    nama: "Sport Center Basket",
    gedung: "Sport Center",
    kategori: "Universitas",
    kapasitas: 200,
    fasilitas: ["Lighting", "Scoreboard", "Tribun"],
    status: "tersedia",
    lantai: "1",
  },
  {
    id: 8,
    nama: "Sebatik Aula FIK",
    gedung: "Sebatik",
    kategori: "Fakultas",
    kapasitas: 120,
    fasilitas: ["AC", "Proyektor", "Sound System"],
    status: "perlu-izin",
    lantai: "1",
  },
  {
    id: 9,
    nama: "TULT Aula Lt. 2",
    gedung: "TULT",
    kategori: "Fakultas",
    kapasitas: 80,
    fasilitas: ["AC", "Proyektor", "Mic", "Whiteboard"],
    status: "tersedia",
    lantai: "2",
  },
];

const GEDUNG_OPTIONS = ["Semua Gedung", "TUCH", "GSG", "TULT", "Selaru", "Batek", "Sport Center", "Sebatik"];
const KATEGORI_OPTIONS = ["Semua Kategori", "Universitas", "Fakultas"];
const STATUS_OPTIONS = ["Semua Status", "tersedia", "digunakan", "perlu-izin"];

const STATUS_CONFIG = {
  tersedia:    { label: "Tersedia",      bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200" },
  digunakan:   { label: "Sedang Digunakan", bg: "bg-grey-100", text: "text-grey-500",  border: "border-grey-200" },
  "perlu-izin":{ label: "Perlu Izin Direktorat", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
};

export default function RuanganPage() {
  const [gedung, setGedung]       = useState("Semua Gedung");
  const [kategori, setKategori]   = useState("Semua Kategori");
  const [status, setStatus]       = useState("Semua Status");
  const [search, setSearch]       = useState("");

  const filtered = RUANGAN.filter((r) => {
    const matchGedung   = gedung   === "Semua Gedung"    || r.gedung   === gedung;
    const matchKategori = kategori === "Semua Kategori"  || r.kategori === kategori;
    const matchStatus   = status   === "Semua Status"    || r.status   === status;
    const matchSearch   = r.nama.toLowerCase().includes(search.toLowerCase());
    return matchGedung && matchKategori && matchStatus && matchSearch;
  });

  return (
    <>
      {/* ══════════════ PAGE HEADER ══════════════ */}
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Ketersediaan Fasilitas
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Cek Ruangan
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Lihat ketersediaan seluruh ruangan dan fasilitas Telkom University
            secara real-time sebelum mengajukan peminjaman.
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4">
        {/* ══════════════ SIDEBAR FILTER ══════════════ */}
        <aside className="w-full lg:w-1/4 border-grey-200 p-6 sm:p-10 bg-white sticky top-[100px] lg:h-fit lg:border-r">
          <p className="text-xs font-bold tracking-widest text-grey-500 uppercase mb-6">
            Filter Ruangan
          </p>

          {/* Search */}
          <div className="mb-6">
            <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">
              Cari Nama Ruangan
            </label>
            <input
              type="text"
              placeholder="Contoh: TULT, Aula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none transition-all duration-200 focus:border-brand shadow-sm"
            />
          </div>

          {/* Gedung */}
          <div className="mb-6">
            <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">
              Gedung
            </label>
            <select
              value={gedung}
              onChange={(e) => setGedung(e.target.value)}
              className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer transition-all duration-200 focus:border-brand shadow-sm"
            >
              {GEDUNG_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Kategori */}
          <div className="mb-6">
            <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">
              Kategori
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer transition-all duration-200 focus:border-brand shadow-sm"
            >
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-8">
            <label className="text-[0.9rem] font-semibold text-grey-800 mb-2 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-grey-300 rounded-md text-[0.95rem] text-grey-900 bg-white outline-none cursor-pointer transition-all duration-200 focus:border-brand shadow-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={() => { setGedung("Semua Gedung"); setKategori("Semua Kategori"); setStatus("Semua Status"); setSearch(""); }}
            className="w-full py-3 bg-grey-900 text-white rounded-md font-semibold text-[0.95rem] transition-all duration-200 hover:bg-brand cursor-pointer"
          >
            Reset Filter
          </button>

          {/* Legend */}
          <div className="mt-8 pt-8 border-t border-grey-200">
            <p className="text-xs font-bold tracking-widest text-grey-500 uppercase mb-4">
              Keterangan Status
            </p>
            <div className="flex flex-col gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${val.bg} ${val.text} ${val.border}`}>
                    {val.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ══════════════ GRID RUANGAN ══════════════ */}
        <section className="flex-1 p-6 sm:p-10 bg-grey-50">
          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[0.9rem] text-grey-500">
              Menampilkan <span className="font-bold text-grey-900">{filtered.length}</span> ruangan
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-bold text-grey-900 mb-2">
                Ruangan Tidak Ditemukan
              </h3>
              <p className="text-grey-500 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-3/4">
              {filtered.map((r) => {
                const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
                const bisa = r.status === "tersedia";
                return (
                  <div
                    key={r.id}
                    className="bg-white border border-grey-200 rounded-lg overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-grey-300"
                  >
                    {/* Card image area */}
                    <div className="h-[140px] bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-5xl">
                      🏛️
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Badge status */}
                      <span className={`self-start text-xs font-bold px-2 py-1 rounded border mb-3 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>

                      {/* Nama & info */}
                      <h3 className="font-display text-[1.1rem] font-bold text-grey-900 mb-1">
                        {r.nama}
                      </h3>
                      <p className="text-xs text-grey-500 mb-4">
                        {r.gedung} · Lt. {r.lantai} · Kapasitas {r.kapasitas} orang
                      </p>

                      {/* Fasilitas tags */}
                      <div className="flex flex-wrap gap-2 mb-6 flex-1">
                        {r.fasilitas.map((f) => (
                          <span
                            key={f}
                            className="text-xs px-2 py-1 bg-grey-100 text-grey-600 rounded font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link
                        href={bisa ? `/booking?ruangan=${encodeURIComponent(r.nama)}` : "#"}
                        className={[
                          "w-full py-2.5 rounded-md text-[0.9rem] font-semibold text-center transition-all duration-200 border block",
                          bisa
                            ? "border-brand text-brand hover:bg-brand hover:text-white cursor-pointer"
                            : "border-grey-200 text-grey-400 cursor-not-allowed bg-grey-50",
                        ].join(" ")}
                      >
                        {bisa ? "Booking Ruangan Ini" : "Tidak Tersedia"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}