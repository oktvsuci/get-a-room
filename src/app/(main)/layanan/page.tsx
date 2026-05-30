import Link from "next/link";

const KATEGORI = [
  {
    icon: "🏛️",
    label: "Direktorat Kemahasiswaan",
    title: "Fasilitas Universitas",
    desc: "Akses peminjaman aula utama, ruang serbaguna, dan fasilitas olahraga untuk kegiatan skala universitas atau UKM.",
    href: "/layanan/universitas",
    highlight: true,
  },
  {
    icon: "🎓",
    label: "Administrasi Fakultas",
    title: "Fasilitas Fakultas",
    desc: "Layanan reservasi spesifik untuk peminjaman ruang kelas reguler, ruang sidang, dan laboratorium praktikum.",
    href: "/layanan/fakultas",
    highlight: false,
  },
];

const FASILITAS_UNIV = [
  { icon: "📖", title: "Auditorium Utama", desc: "Gedung kapasitas besar (TUCH / Tokong Nanas) untuk seminar nasional dan konferensi." },
  { icon: "🏛️", title: "Ruang Serbaguna", desc: "Fasilitas GSG fleksibel tanpa sekat kursi permanen untuk berbagai acara dan eksibisi." },
  { icon: "⚽", title: "Fasilitas Olahraga", desc: "Sport Center, lapangan basket, bulutangkis, tenis, dan kolam renang untuk event kemahasiswaan." },
];

const FASILITAS_FAK = [
  { icon: "📋", title: "Ruang Kelas Reguler", desc: "Peminjaman kelas kosong untuk belajar mandiri, rapat himpunan, atau kelas pengganti." },
  { icon: "🧑‍🏫", title: "Ruang Sidang / Seminar", desc: "Ruangan kondusif untuk sidang skripsi, yudisium, atau seminar proposal.", featured: true },
  { icon: "🔬", title: "Laboratorium", desc: "Slot penggunaan lab komputer, hardware, dan teknis di luar jadwal praktikum resmi." },
];

const KETENTUAN = [
  "Pemohon wajib merupakan sivitas akademika Telkom University (mahasiswa aktif, dosen, atau tendik).",
  "Pengajuan dilakukan minimal H-3 sebelum tanggal penggunaan ruangan.",
  "Surat permohonan resmi wajib diunggah dalam format PDF maksimal 5MB.",
  "Ruangan wajib dikembalikan dalam kondisi bersih, rapi, dan tepat waktu sesuai durasi yang disetujui.",
  "Dilarang memindahkan furnitur atau peralatan tanpa izin dari pengelola gedung.",
  "Kegiatan yang bersifat komersial atau tidak sesuai dengan nilai akademik akan ditolak.",
  "Pelanggaran terhadap ketentuan dapat berakibat pada pemblokiran akun peminjam.",
];

export default function LayananPage() {
  return (
    <>
      {/* ══════════════ PAGE HEADER ══════════════ */}
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Katalog Fasilitas
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Layanan Peminjaman
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Pilih kategori fasilitas yang sesuai dengan kebutuhan kegiatan kamu.
            Setiap kategori memiliki alur persetujuan yang berbeda.
          </p>
        </div>
      </section>

      {/* ══════════════ KATEGORI CARDS ══════════════ */}
      <section className="px-16 py-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
              Kategori Fasilitas
            </h2>
            <p className="text-[1.05rem] text-grey-500">
              Pilih direktorat atau tingkat administrasi fasilitas yang kamu butuhkan
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {KATEGORI.map((k) => (
              <Link
                key={k.title}
                href={k.href}
                className="bg-white border border-grey-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-grey-300 block"
              >
                {/* Image area */}
                <div
                  className={[
                    "h-[240px] flex items-center justify-center text-[5rem]",
                    k.highlight
                      ? "bg-gradient-to-br from-brand-dark to-brand"
                      : "bg-gradient-to-br from-grey-800 to-grey-900",
                  ].join(" ")}
                >
                  {k.icon}
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">
                    {k.label}
                  </p>
                  <h3 className="font-display text-[1.75rem] font-bold text-grey-900 mb-3">
                    {k.title}
                  </h3>
                  <p className="text-[1rem] text-grey-600 leading-relaxed">
                    {k.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FASILITAS UNIVERSITAS ══════════════ */}
      <section className="px-16 pb-16 bg-grey-50">
        <div className="max-w-[1100px] mx-auto py-16">
          <h2 className="font-display text-[1.75rem] font-bold text-grey-900 mb-2">
            Fasilitas Universitas
          </h2>
          <p className="text-[0.95rem] text-grey-500 mb-10">
            Dikelola oleh Direktorat Kemahasiswaan
          </p>
          <div className="grid grid-cols-3 gap-8">
            {FASILITAS_UNIV.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-grey-200 rounded-lg p-10 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:border-grey-300 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 bg-grey-100 rounded-md flex items-center justify-center text-[1.5rem] mb-6">
                  {f.icon}
                </div>
                <h3 className="font-display text-[1.25rem] font-bold text-grey-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-[0.95rem] text-grey-600 leading-relaxed flex-1 mb-6">
                  {f.desc}
                </p>
                <Link
                  href="/booking"
                  className="w-full py-3 border border-brand rounded-md text-brand text-[0.95rem] font-semibold text-center transition-all duration-200 hover:bg-brand hover:text-white block"
                >
                  Ajukan Peminjaman
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FASILITAS FAKULTAS ══════════════ */}
      <section className="px-16 pb-16">
        <div className="max-w-[1100px] mx-auto py-16">
          <h2 className="font-display text-[1.75rem] font-bold text-grey-900 mb-2">
            Fasilitas Fakultas
          </h2>
          <p className="text-[0.95rem] text-grey-500 mb-10">
            Dikelola oleh Administrasi Fakultas masing-masing
          </p>
          <div className="grid grid-cols-3 gap-8">
            {FASILITAS_FAK.map((f) => (
              <div
                key={f.title}
                className={[
                  "bg-white rounded-lg p-10 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                  f.featured
                    ? "border-2 border-brand"
                    : "border border-grey-200 hover:border-grey-300",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-14 h-14 rounded-md flex items-center justify-center text-[1.5rem] mb-6",
                    f.featured ? "bg-brand text-white" : "bg-grey-100",
                  ].join(" ")}
                >
                  {f.icon}
                </div>
                <h3 className="font-display text-[1.25rem] font-bold text-grey-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-[0.95rem] text-grey-600 leading-relaxed flex-1 mb-6">
                  {f.desc}
                </p>
                <Link
                  href="/booking"
                  className={[
                    "w-full py-3 rounded-md text-[0.95rem] font-semibold text-center transition-all duration-200 block border",
                    f.featured
                      ? "bg-brand text-white border-brand hover:bg-brand-dark"
                      : "border-brand text-brand hover:bg-brand hover:text-white",
                  ].join(" ")}
                >
                  {f.featured ? "Cek Ketersediaan" : "Booking Sekarang"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SYARAT & KETENTUAN ══════════════ */}
      <section className="px-16 pb-20 bg-grey-50">
        <div className="max-w-[1100px] mx-auto py-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
              Syarat & Ketentuan
            </h2>
            <p className="text-[1.05rem] text-grey-500">
              Wajib dipahami sebelum mengajukan peminjaman ruangan
            </p>
          </div>

          <div className="bg-white border border-grey-200 rounded-lg p-10 shadow-sm">
            <ul className="flex flex-col gap-4">
              {KETENTUAN.map((k, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-brand text-white rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[0.95rem] text-grey-700 leading-relaxed">{k}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-grey-200 text-center">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-semibold text-[0.95rem] shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md"
              >
                🗓️ Saya Setuju — Mulai Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}