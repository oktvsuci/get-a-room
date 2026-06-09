"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { NotificationBell } from "./NotificationBell";

const NAV_LINKS = [
  { label: "Beranda",      href: "/" },
  { label: "Petunjuk",    href: "/petunjuk" },
  { label: "Layanan",     href: "/layanan" },
  { label: "Cek Ruangan", href: "/ruangan" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isAdmin = user?.user_metadata?.role === "admin";

  return (
    <header className="w-full flex flex-row items-center justify-between px-2 md:px-6 py-3 bg-white border-b border-grey-200 sticky top-0 z-50 shadow-sm transition-all duration-300">

      <Link href="/" className="flex items-center gap-2 sm:gap-6">
        <span className="font-display font-bold text-lg sm:text-2xl text-brand">GAR</span>
        <div className="hidden sm:flex items-center h-[50px] border-l-2 border-grey-200 pl-3 sm:pl-6">
          <span className="text-[10px] sm:text-sm font-semibold text-grey-500 tracking-wide">
            Telkom University
          </span>
        </div>
      </Link>

      <nav className="flex flex-row items-center gap-1.5 md:gap-4 text-[10px] sm:text-xs md:text-base whitespace-nowrap">
        {NAV_LINKS.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "relative font-semibold px-3 py-2 rounded-md transition-all duration-200",
                active
                  ? "text-brand bg-grey-100"
                  : "text-grey-600 hover:text-brand hover:bg-grey-100",
              ].join(" ")}
            >
              {label}
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-brand rounded-t-sm" />
              )}
            </Link>
          );
        })}

        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-2 py-1 md:px-3 md:py-2 text-[10px] sm:text-xs md:text-sm rounded border border-brand text-brand font-semibold transition-all hover:bg-brand hover:text-white"
              >
                Admin Panel
              </Link>
            )}
            <NotificationBell />
            <Link
              href="/dashboard"
              className="px-2 py-1 md:px-3 md:py-2 text-[10px] sm:text-xs md:text-sm rounded bg-grey-100 text-grey-700 font-semibold transition-all hover:bg-grey-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-2 py-1 md:px-3 md:py-2 text-[10px] sm:text-xs md:text-sm rounded bg-brand text-white font-semibold shadow-sm transition-all hover:bg-brand-dark"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-2 py-1 md:px-3 md:py-2 text-[10px] sm:text-xs md:text-sm rounded border border-grey-300 text-grey-600 font-semibold transition-all hover:bg-grey-100"
            >
              Masuk
            </Link>
            <Link
              href="/booking"
              className={[
                "px-2 py-1 md:px-4 md:py-2 text-[10px] sm:text-xs md:text-sm rounded bg-brand text-white shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md",
                pathname === "/booking" ? "ring-2 ring-brand ring-offset-2" : "",
              ].join(" ")}
            >
              Booking
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}