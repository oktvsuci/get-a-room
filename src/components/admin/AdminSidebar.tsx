// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin",          icon: "📊", label: "Overview" },
  { href: "/admin/booking",  icon: "📋", label: "Semua Booking" },
  { href: "/admin/ruangan",  icon: "🏛️", label: "Ruangan" },
  { href: "/admin/users",    icon: "👥", label: "Pengguna" },
];

type Props = { adminNama: string; adminEmail: string };

export function AdminSidebar({ adminNama, adminEmail }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-grey-900 text-white flex flex-col flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-grey-800">
        <span className="font-display font-bold text-xl text-white">GAR</span>
        <span className="ml-2 text-[10px] font-semibold text-grey-500 uppercase tracking-widest">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map(({ href, icon, label }) => {
          // "Overview" hanya aktif jika path persis /admin
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-brand text-white"
                  : "text-grey-400 hover:bg-grey-800 hover:text-white",
              ].join(" ")}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-grey-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
            {adminNama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminNama}</p>
            <p className="text-xs text-grey-500 truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-md bg-grey-800 text-grey-400 text-xs font-semibold hover:bg-red-900 hover:text-red-300 transition-all"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}