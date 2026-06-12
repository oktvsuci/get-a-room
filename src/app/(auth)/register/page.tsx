// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validasi email domain
    const validDomains = [
      "@student.telkomuniversity.ac.id",
      "@telkomuniversity.ac.id",
    ];
    if (!validDomains.some((d) => form.email.endsWith(d))) {
      setError("Email harus menggunakan akun SSO Telkom University.");
      return;
    }

    if (form.password !== form.konfirmasi) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nama: form.nama,
          role: "user", // Default role, admin diset manual di Supabase Dashboard
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white border border-grey-200 rounded-xl shadow-sm p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="font-display text-xl font-bold text-grey-900 mb-2">
            Cek Email Kamu!
          </h2>
          <p className="text-sm text-grey-600 mb-6">
            Kami mengirim link konfirmasi ke{" "}
            <strong className="text-grey-900">{form.email}</strong>. Klik link
            tersebut untuk mengaktifkan akunmu.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-md bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <span className="font-display font-bold text-3xl text-brand">GAR</span>
        <p className="text-sm text-grey-500 mt-1">Get a Room · Telkom University</p>
      </div>

      <div className="bg-white border border-grey-200 rounded-xl shadow-sm p-8">
        <h1 className="font-display text-2xl font-bold text-grey-900 mb-1">
          Buat Akun Baru
        </h1>
        <p className="text-sm text-grey-500 mb-6">
          Gunakan email SSO Telkom University
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Nama sesuai identitas"
              value={form.nama}
              onChange={(e) => update("nama", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-grey-300 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-1.5">
              Email SSO
            </label>
            <input
              type="email"
              required
              placeholder="nim@student.telkomuniversity.ac.id"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-grey-300 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-grey-300 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="Ulangi kata sandi"
              value={form.konfirmasi}
              onChange={(e) => update("konfirmasi", e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-grey-300 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-brand text-white font-semibold text-sm shadow-sm hover:bg-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-grey-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}