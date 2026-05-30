import Link from "next/link";

const FEATURES = [
  {
    icon: "🏛️",
    title: "Fasilitas Lengkap",
    desc: "Akses ratusan ruangan mulai dari aula besar, ruang kelas, laboratorium, hingga fasilitas olahraga dalam satu platform.",
  },
  {
    icon: "📅",
    title: "Booking Real-Time",
    desc: "Cek ketersediaan dan ajukan peminjaman ruangan secara langsung. Tidak perlu antre atau datang ke kantor administrasi.",
  },
  {
    icon: "✅",
    title: "Proses Terstruktur",
    desc: "Sistem persetujuan bertahap yang transparan. Status pengajuan dapat dipantau dan notifikasi dikirim via Email SSO.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Pilih Ruangan",
    desc: 'Buka menu "Cek Ruangan", filter berdasarkan gedung dan tanggal, lalu klik ruangan yang tersedia.',
  },
  {
    num: "2",
    title: "Isi Form Booking",
    desc: "Lengkapi data pemohon, detail kegiatan, dan unggah surat permohonan resmi dalam format PDF.",
  },
  {
    num: "3",
    title: "Tunggu Persetujuan",
    desc: "Pengajuan diproses dalam 1×24 jam. Notifikasi persetujuan atau penolakan dikirim ke Email SSO kamu.",
  },
];

export default function BerandaPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-grey-900" />

        {/* Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c8.25 0 15 6.75 15 15v15H15V30c0-8.25 6.75-15 15-15zm0 4c-6.05 0-11 4.95-11 11v11h22V30c0-6.05-4.95-11-11-11z' fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Arch */}
        <div
          className="absolute bottom-[-2px] left-0 right-0 h-[120px] bg-grey-50"
          style={{ clipPath: "ellipse(65% 100% at 50% 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-8 py-12 w-full max-w-[850px]">
          <div className="bg-white/5 border border-white/15 rounded-xl p-14 backdrop-blur-md shadow-lg">
            <h1 className="font-display text-5xl font-bold text-white leading-tight mb-5">
              Reservasi Ruangan<br />
              <span className="text-white/80">Telkom University</span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Platform digital terpusat untuk peminjaman seluruh fasilitas ruangan
              Telkom University. Cepat, transparan, dan tanpa birokrasi manual.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-semibold text-[0.95rem] shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md"
              >
                🗓️ Booking Sekarang
              </Link>
              <Link
                href="/ruangan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-transparent text-white font-semibold text-[0.95rem] border border-white/40 transition-all duration-200 hover:bg-white/10 hover:border-white"
              >
                🔍 Cek Ketersediaan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="px-16 py-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
              Mengapa Menggunakan GAR?
            </h2>
            <p className="text-[1.05rem] text-grey-500">
              Solusi peminjaman ruangan yang dirancang untuk sivitas akademika Telkom University
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-grey-200 rounded-lg p-10 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-grey-300"
              >
                <div className="w-16 h-16 bg-grey-100 text-brand rounded-md flex items-center justify-center mx-auto mb-6 text-[1.75rem]">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[1.15rem] text-grey-900 mb-3">{f.title}</h3>
                <p className="text-[0.95rem] text-grey-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="px-16 pb-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
              Cara Peminjaman
            </h2>
            <p className="text-[1.05rem] text-grey-500">
              Tiga langkah mudah untuk mendapatkan ruangan yang kamu butuhkan
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="bg-white border border-grey-200 rounded-lg p-10 shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-light text-white rounded-md font-bold text-[1.25rem] mb-6 shadow-sm">
                  {s.num}
                </div>
                <h3 className="font-display text-[1.35rem] font-semibold text-grey-900 mb-4">
                  {s.title}
                </h3>
                <p className="text-[0.95rem] text-grey-600 leading-[1.7]">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/petunjuk"
              className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-brand border border-brand px-6 py-3 rounded-md transition-all duration-200 hover:bg-brand hover:text-white"
            >
              Lihat Petunjuk Lengkap →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}