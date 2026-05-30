import Link from "next/link";

const STEPS = [
  {
    num: "1",
    title: "Baca & Pahami Ketentuan",
    desc: "Sebelum mengajukan peminjaman, pastikan kamu telah membaca seluruh syarat dan ketentuan penggunaan fasilitas. Pelanggaran terhadap ketentuan dapat berakibat pada pencabutan hak peminjaman.",
    detail: "Ketentuan tersedia di halaman Layanan.",
  },
  {
    num: "2",
    title: "Siapkan Dokumen",
    desc: "Siapkan surat permohonan resmi yang ditandatangani oleh pejabat berwenang (Ketua Himpunan / Dosen Pembimbing / Pimpinan Unit).",
    detail: "Format surat tersedia untuk diunduh di bawah.",
  },
  {
    num: "3",
    title: "Pilih Ruangan & Tanggal",
    desc: 'Buka halaman "Cek Ruangan", gunakan filter gedung dan tanggal untuk melihat ketersediaan slot. Klik ruangan berstatus tersedia untuk memulai booking.',
    detail: "Pastikan tanggal tidak bentrok dengan jadwal akademik.",
  },
  {
    num: "4",
    title: "Isi Form Pengajuan",
    desc: "Lengkapi seluruh data pada form booking: identitas pemohon (Nama, NIM, Email SSO, No. HP), instansi/organisasi, detail kegiatan, dan unggah surat permohonan PDF.",
    detail: "Semua kolom bertanda (*) wajib diisi.",
  },
  {
    num: "5",
    title: "Tunggu Verifikasi",
    desc: "Pengajuan akan diverifikasi oleh admin dalam waktu maksimal 1×24 jam kerja. Status pengajuan dapat dipantau melalui email konfirmasi yang dikirim ke Email SSO kamu.",
    detail: "Pastikan email SSO aktif dan dapat menerima pesan.",
  },
  {
    num: "6",
    title: "Konfirmasi & Gunakan Ruangan",
    desc: "Setelah mendapat email persetujuan, tunjukkan bukti konfirmasi kepada petugas gedung sebelum menggunakan ruangan. Kembalikan ruangan dalam kondisi bersih dan rapi.",
    detail: "Keterlambatan pengembalian akan dicatat dalam sistem.",
  },
];

const DOWNLOADS = [
  { label: "Template Surat Permohonan Universitas", file: "#" },
  { label: "Template Surat Permohonan Fakultas", file: "#" },
  { label: "Panduan Penggunaan GAR (PDF)", file: "#" },
];

const FAQS = [
  {
    q: "Berapa lama proses persetujuan?",
    a: "Maksimal 1×24 jam kerja setelah pengajuan masuk ke sistem.",
  },
  {
    q: "Apakah bisa membatalkan booking?",
    a: "Pembatalan dapat dilakukan minimal H-2 sebelum tanggal penggunaan dengan menghubungi admin melalui email SSO.",
  },
  {
    q: "Format file apa yang diterima untuk surat?",
    a: "Hanya file PDF dengan ukuran maksimal 5MB.",
  },
  {
    q: "Apakah mahasiswa luar Telkom bisa meminjam?",
    a: "Peminjaman dari pihak eksternal harus didampingi oleh sivitas akademika Telkom University sebagai penanggung jawab.",
  },
];

export default function PetunjukPage() {
  return (
    <>
      {/* ══════════════ PAGE HEADER ══════════════ */}
      <section className="bg-white border-b border-grey-200 px-16 py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
            Panduan Penggunaan
          </p>
          <h1 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
            Alur & Prosedur Peminjaman
          </h1>
          <p className="text-[1.05rem] text-grey-500 max-w-2xl">
            Ikuti langkah-langkah berikut untuk memastikan pengajuan peminjaman
            ruangan kamu diproses dengan lancar dan cepat.
          </p>
        </div>
      </section>

      {/* ══════════════ STEPS ══════════════ */}
      <section className="px-16 py-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="bg-white border border-grey-200 rounded-lg p-10 shadow-sm flex flex-col"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-light text-white rounded-md font-bold text-[1.25rem] mb-6 shadow-sm">
                  {s.num}
                </div>
                <h3 className="font-display text-[1.35rem] font-semibold text-grey-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-[0.95rem] text-grey-600 leading-[1.7] flex-1">
                  {s.desc}
                </p>
                <p className="mt-4 text-[0.85rem] text-brand font-semibold border-t border-grey-100 pt-4">
                  💡 {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DOWNLOAD TEMPLATE ══════════════ */}
      <section className="px-16 pb-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-white border border-grey-200 rounded-lg p-10 shadow-sm">
            <h2 className="font-display text-[1.5rem] font-bold text-grey-900 mb-2">
              Unduh Template Dokumen
            </h2>
            <p className="text-[0.95rem] text-grey-500 mb-8">
              Gunakan template resmi berikut agar surat permohonan kamu langsung
              diproses tanpa revisi.
            </p>
            <div className="flex flex-col gap-3">
              {DOWNLOADS.map((d) => (
                <a   
                  key={d.label}
                  href={d.file}
                  className="inline-flex items-center gap-3 text-[0.85rem] font-semibold text-brand border border-brand px-4 py-3 rounded-md transition-all duration-200 hover:bg-brand hover:text-white w-fit"
                >
                  📄 {d.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="px-16 pb-20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-[2.25rem] font-bold text-grey-900 mb-2">
              Pertanyaan Umum
            </h2>
            <p className="text-[1.05rem] text-grey-500">
              Pertanyaan yang sering ditanyakan seputar proses peminjaman
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-white border border-grey-200 rounded-lg p-8 shadow-sm"
              >
                <h4 className="font-bold text-grey-900 mb-3 text-[0.95rem]">
                  ❓ {faq.q}
                </h4>
                <p className="text-[0.9rem] text-grey-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-brand text-white font-semibold text-[0.95rem] shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md"
            >
              🗓️ Mulai Booking Sekarang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}