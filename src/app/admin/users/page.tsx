// src/app/admin/users/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") redirect("/");

  // Ambil list user dari Supabase Auth Admin API
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-grey-500 hover:text-brand transition-colors mb-4"
        >
          ← Kembali ke Overview
        </Link>
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-1">
          Admin Panel
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-grey-900 mb-1">
          Manajemen Pengguna
        </h1>
        <p className="text-grey-500 text-sm">
          Daftar seluruh pengguna terdaftar di sistem GAR.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          ⚠️ Gagal memuat data pengguna: {error.message}
        </div>
      )}

      <div className="bg-white border border-grey-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-grey-200 flex items-center justify-between">
          <h2 className="font-semibold text-grey-900">
            Semua Pengguna
            <span className="ml-2 text-sm font-normal text-grey-500">
              ({users?.length ?? 0} akun)
            </span>
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-grey-50 border-b border-grey-200">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide">
                Pengguna
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden md:table-cell">
                Role
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden lg:table-cell">
                Terdaftar
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide hidden lg:table-cell">
                Login Terakhir
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-grey-500 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-grey-400">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const nama     = (u.user_metadata?.nama as string) || "-";
                const role     = (u.user_metadata?.role as string) || "user";
                const isAdmin  = role === "admin";
                const verified = !!u.email_confirmed_at;

                return (
                  <tr key={u.id} className="hover:bg-grey-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-grey-900">{nama}</p>
                          <p className="text-xs text-grey-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={[
                        "inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border",
                        isAdmin
                          ? "bg-brand/10 text-brand border-brand/20"
                          : "bg-grey-100 text-grey-600 border-grey-200",
                      ].join(" ")}>
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-grey-600 text-xs hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-grey-600 text-xs hidden lg:table-cell">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={[
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border",
                        verified
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200",
                      ].join(" ")}>
                        <span className={`w-1.5 h-1.5 rounded-full ${verified ? "bg-green-500" : "bg-yellow-400"}`} />
                        {verified ? "Terverifikasi" : "Belum Verifikasi"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}