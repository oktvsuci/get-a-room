// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "../notifications/NotificationBell";

const NAV = [
  { href: "/admin",          icon: "📊", label: "Overview" },
  { href: "/admin/booking",  icon: "📋", label: "Semua Booking" },
  { href: "/admin/ruangan",  icon: "🏛️", label: "Ruangan" },
  { href: "/admin/users",    icon: "👥", label: "Pengguna" },
];

type Props = { adminNama: string; adminEmail: string; adminId: string };

export function AdminSidebar({ adminNama, adminEmail, adminId }: Props) {
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
      {/* ... Logo dan Nav sama ... */}

      <div className="p-4 border-t border-grey-800">
        {/* Bell di sidebar admin */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
              {adminNama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{adminNama}</p>
              <p className="text-xs text-grey-500 truncate">{adminEmail}</p>
            </div>
          </div>
          {/* Bell icon untuk admin — pakai div wrapper agar warna bell sesuai dark bg */}
          <div className="[&_button]:hover:bg-grey-800 [&_svg]:text-grey-400 [&_.rounded-full]:hover:bg-grey-800">
            <NotificationBell userId={adminId} />
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