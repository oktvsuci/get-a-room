"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Beranda",      href: "/" },
  { label: "Petunjuk",    href: "/petunjuk" },
  { label: "Layanan",     href: "/layanan" },
  { label: "Cek Ruangan", href: "/ruangan" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-grey-200 px-16 h-[100px] flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all duration-300">

      <Link href="/" className="flex items-center gap-6">
        <span className="font-display font-bold text-2xl text-brand">GAR</span>
        <div className="flex items-center h-[50px] border-l-2 border-grey-200 pl-6">
          <span className="text-sm font-semibold text-grey-500 tracking-wide">
            Telkom University
          </span>
        </div>
      </Link>

      <nav className="flex items-center gap-2">
        {NAV_LINKS.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "relative text-[0.95rem] font-semibold px-4 py-2 rounded-md transition-all duration-200",
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

        <Link
          href="/booking"
          className={[
            "text-[0.95rem] font-semibold px-[1.4rem] py-[0.6rem] rounded-md bg-brand text-white shadow-sm transition-all duration-200 hover:bg-brand-dark hover:-translate-y-px hover:shadow-md",
            pathname === "/booking" ? "ring-2 ring-brand ring-offset-2" : "",
          ].join(" ")}
        >
          Booking
        </Link>
      </nav>
    </header>
  );
}