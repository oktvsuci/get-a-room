// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reason = searchParams.get("reason");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau kata sandi tidak valid.");
      setLoading(false);
      return;
    }

    // Arahkan berdasarkan role
    const role = data.user?.user_metadata?.role;
    router.push(role === "admin" ? "/admin" : redirectTo);
    router.refresh(); // Paksa Server Components ikut refresh session
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <span className="font-display font-bold text-3xl text-brand">GAR</span>
        <p className="text-sm text-grey-500 mt-1">Get a Room · Telkom University</p>
      </div>

      <div className="bg-white border border-grey-200 rounded-xl shadow-sm p-8">
        <h1 className="font-display text-2xl font-bold text-grey-900 mb-1">
          Masuk ke Akun
        </h1>
        <p className="text-sm text-grey-500 mb-6">
          Gunakan akun SSO Telkom University kamu
        </p>

        {reason === "booking" && (
          <div className="mb-5 flex items-start gap-3 bg-brand/5 border border-brand/20 rounded-lg px-4 py-3.5">
            <span className="text-lg flex-shrink-0">🔒</span>
            <p className="text-sm text-grey-700">
              <strong className="text-grey-900">Login diperlukan untuk booking.</strong>
              <br />
              Masuk dengan akun SSO Telkom University untuk mengajukan peminjaman ruangan.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-1.5">
              Email SSO
            </label>
            <input
              type="email"
              required
              placeholder="nim@student.telkomuniversity.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-grey-300 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-grey-700">
                Kata Sandi
              </label>
              <Link
                href="/reset-password"
                className="text-xs text-brand hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-grey-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-brand font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}