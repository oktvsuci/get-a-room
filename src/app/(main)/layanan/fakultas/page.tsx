import Link from "next/link";

const FASILITAS = [
  {
    icon: "📋",
    title: "Ruang Kelas Reguler",
    desc: "Peminjaman kelas kosong untuk belajar mandiri, rapat himpunan, atau kelas pengganti di luar jadwal kuliah.",
    kapasitas: "30–60 orang",
  },
  {
    icon: "🧑‍🏫",
    title: "Ruang Sidang / Seminar",
    desc: "Ruangan kondusif untuk sidang skripsi, yudisium, seminar proposal, atau pertemuan formal akademik.",
    kapasitas: "20–40 orang",
    featured: true,
  },
  {
    icon: "🔬",
    title: "Laboratorium",
    desc: "Slot penggunaan lab komputer, hardware, dan teknis di luar jadwal praktikum resmi dengan pengawasan.",
    kapasitas: "30–40 orang",
  },
];

const ALUR = [
  { step: "01", title: "Isi Formulir Online", desc: "Lengkapi data pemohon, pilih ruangan fakultas, tanggal, dan jam." },
  { step: "02", title: "Upload Surat Permohonan", desc: "Lampirkan surat dari himpunan, dosen pembimbing, atau ketua program studi." },
  { step: "03", title: "Verifikasi Fakultas", desc: "Admin fakultas memverifikasi kesesuaian jadwal dan keperluan kegiatan." },
  { step: "04", title: "Konfirmasi & Gunakan", desc: "Notifikasi dikirim ke email. Lapor ke TU fakultas sebelum menggunakan ruangan." },
];

export default function LayananFakultasPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-grey-500 mb-4">
            <Link href="/layanan?kategori=Fakultas" className="hover:text-brand transition-colors">Layanan</Link>
            <span>/</span>
            <span className="text-grey-900 font-semibold">Fasilitas Fakultas</span>
          </div>
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Administrasi Fakultas
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Fasilitas Fakultas
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Reservasi ruang kelas, ruang sidang, dan laboratorium yang dikelola
            oleh administrasi fakultas masing-masing.
          </p>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="px-16 py-16">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[1.75rem] font-bold text-grey-900 mb-2">
            Daftar Fasilitas
          </h2>
          <p className="text-grey-500 mb-10">
            Dikelola oleh tata usaha dan administrasi masing-masing fakultas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FASILITAS.map((f) => (
              <div
                key={f.title}
                className={[
                  "bg-white rounded-xl p-8 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
                  f.featured ? "border-2 border-brand" : "border border-grey-200",
                ].join(" ")}
              >
                <div className={[
                  "w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5",
                  f.featured ? "bg-brand text-white" : "bg-grey-100",
                ].join(" ")}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-grey-900 mb-2">{f.title}</h3>
                <p className="text-sm text-grey-600 leading-relaxed flex-1 mb-4">{f.desc}</p>
                <p className="text-xs font-semibold text-brand mb-5">
                  Kapasitas: {f.kapasitas}
                </p>
                <Link
                  href="/booking"
                  className={[
                    "w-full py-2.5 rounded-md text-sm font-semibold text-center transition-all block border",
                    f.featured
                      ? "bg-brand text-white border-brand hover:bg-brand-dark"
                      : "border-brand text-brand hover:bg-brand hover:text-white",
                  ].join(" ")}
                >
                  Booking Sekarang
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur */}
      <section className="px-16 py-16 bg-grey-50">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[1.75rem] font-bold text-grey-900 mb-10 text-center">
            Alur Peminjaman
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ALUR.map((a) => (
              <div key={a.step} className="text-center">
                <div className="w-14 h-14 bg-grey-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {a.step}
                </div>
                <h3 className="font-semibold text-grey-900 mb-2">{a.title}</h3>
                <p className="text-sm text-grey-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-16 py-16">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-grey-900 mb-3">
            Siap Mengajukan Peminjaman?
          </h2>
          <p className="text-grey-500 mb-8">
            Hubungi tata usaha fakultas jika membutuhkan bantuan proses pengajuan.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/ruangan"
              className="px-6 py-3 border border-grey-300 rounded-md text-grey-700 font-semibold text-sm hover:bg-grey-100 transition-all"
            >
              Cek Ketersediaan
            </Link>
            <Link
              href="/booking"
              className="px-6 py-3 bg-brand text-white rounded-md font-semibold text-sm shadow-sm hover:bg-brand-dark transition-all"
            >
              Mulai Booking →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}