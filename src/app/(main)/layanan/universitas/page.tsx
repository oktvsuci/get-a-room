import Link from "next/link";

const FASILITAS = [
  {
    icon: "📖",
    title: "Auditorium Utama (TUCH)",
    desc: "Gedung kapasitas besar untuk seminar nasional, konferensi, dan wisuda. Dilengkapi sound system profesional dan pencahayaan panggung.",
    kapasitas: "1.000+ orang",
  },
  {
    icon: "🏛️",
    title: "Gedung Serba Guna (GSG)",
    desc: "Fasilitas fleksibel tanpa sekat kursi permanen untuk berbagai acara, eksibisi, pameran, dan kegiatan kemahasiswaan skala besar.",
    kapasitas: "500 orang",
  },
  {
    icon: "⚽",
    title: "Sport Center",
    desc: "Lapangan basket, bulutangkis, tenis, dan fasilitas olahraga lainnya untuk event kemahasiswaan dan turnamen antar fakultas.",
    kapasitas: "200 orang",
  },
];

const ALUR = [
  { step: "01", title: "Isi Formulir Online", desc: "Lengkapi data pemohon, pilih ruangan, tanggal, dan jam kegiatan." },
  { step: "02", title: "Upload Surat Permohonan", desc: "Lampirkan surat resmi dari organisasi atau unit kegiatan mahasiswa." },
  { step: "03", title: "Verifikasi Admin", desc: "Tim Direktorat Kemahasiswaan akan memverifikasi dalam 1×24 jam kerja." },
  { step: "04", title: "Konfirmasi & Gunakan", desc: "Notifikasi persetujuan dikirim ke email. Tunjukkan bukti saat penggunaan." },
];

export default function LayananUniversitasPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-grey-500 mb-4">
            <Link href="/layanan" className="hover:text-brand transition-colors">Layanan</Link>
            <span>/</span>
            <span className="text-grey-900 font-semibold">Fasilitas Universitas</span>
          </div>
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Direktorat Kemahasiswaan
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Fasilitas Universitas
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Peminjaman aula utama, gedung serbaguna, dan fasilitas olahraga untuk
            kegiatan skala universitas atau UKM tingkat pusat.
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
            Tersedia untuk kegiatan resmi civitas akademika Telkom University
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FASILITAS.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-grey-200 rounded-xl p-8 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center text-2xl mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-grey-900 mb-2">{f.title}</h3>
                <p className="text-sm text-grey-600 leading-relaxed flex-1 mb-4">{f.desc}</p>
                <p className="text-xs font-semibold text-brand mb-5">
                  Kapasitas: {f.kapasitas}
                </p>
                <Link
                  href="/booking"
                  className="w-full py-2.5 border border-brand rounded-md text-brand text-sm font-semibold text-center hover:bg-brand hover:text-white transition-all block"
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
                <div className="w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
            Pastikan kamu sudah membaca syarat dan ketentuan sebelum mengisi formulir.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/ruangan?kategori=Universitas"
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