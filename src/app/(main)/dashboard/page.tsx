// src/app/(main)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const nama = (user.user_metadata?.nama as string) || user.email?.split("@")[0] || "Pengguna";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Greeting */}
      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-grey-900 mb-1">
          Halo, {nama}! 👋
        </h1>
        <p className="text-grey-500">Selamat datang di portal peminjaman ruangan Telkom University.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/booking"
          className="group flex items-start gap-4 p-6 bg-brand text-white rounded-xl shadow-sm hover:bg-brand-dark transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="text-3xl">📝</span>
          <div>
            <p className="font-bold text-lg mb-0.5">Ajukan Peminjaman Baru</p>
            <p className="text-sm text-white/80">Isi formulir online untuk meminjam ruangan.</p>
          </div>
        </Link>

        <Link
          href="/dashboard/peminjaman"
          className="group flex items-start gap-4 p-6 bg-white border border-grey-200 rounded-xl shadow-sm hover:border-brand hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-bold text-lg text-grey-900 mb-0.5">Riwayat Peminjaman</p>
            <p className="text-sm text-grey-500">Pantau status pengajuan kamu.</p>
          </div>
        </Link>

        <Link
          href="/ruangan"
          className="group flex items-start gap-4 p-6 bg-white border border-grey-200 rounded-xl shadow-sm hover:border-brand hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <span className="text-3xl">🏛️</span>
          <div>
            <p className="font-bold text-lg text-grey-900 mb-0.5">Cek Ketersediaan Ruangan</p>
            <p className="text-sm text-grey-500">Lihat ruangan yang tersedia saat ini.</p>
          </div>
        </Link>

        <Link
          href="/dashboard/profil"
          className="group flex items-start gap-4 p-6 bg-white border border-grey-200 rounded-xl shadow-sm hover:border-brand hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <span className="text-3xl">👤</span>
          <div>
            <p className="font-bold text-lg text-grey-900 mb-0.5">Profil Saya</p>
            <p className="text-sm text-grey-500">Perbarui nama dan nomor HP kamu.</p>
          </div>
        </Link>
      </div>

      {/* Info box */}
      <div className="p-5 bg-grey-50 border border-grey-200 rounded-xl text-sm text-grey-600">
        💡 <strong className="text-grey-800">Cara kerja:</strong> Setelah mengajukan peminjaman, admin akan memverifikasi dan memberi keputusan dalam 1×24 jam kerja. Notifikasi akan dikirim ke email kamu.
      </div>
    </main>
  );
}