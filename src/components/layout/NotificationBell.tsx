"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
  bookingId?: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function fetchNotifs() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifs(data.notifications ?? []);
    } catch {}
  }

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  async function deleteNotif(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  async function markAllRead() {
    const unread = notifs.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => fetch(`/api/notifications/${n.id}`, { method: "PATCH" })));
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const typeColor: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    error:   "bg-red-100 text-red-700",
    info:    "bg-blue-100 text-blue-700",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-grey-100 transition"
        aria-label="Notifikasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-grey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-grey-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-grey-100">
            <span className="font-bold text-sm text-grey-800">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand font-semibold hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-grey-100">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-grey-400">
                Tidak ada notifikasi
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 flex gap-3 items-start transition ${!n.isRead ? "bg-blue-50/40" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColor[n.type] ?? "bg-grey-100 text-grey-600"}`}>
                        {n.type.toUpperCase()}
                      </span>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-brand rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-grey-800 truncate">{n.title}</p>
                    <p className="text-xs text-grey-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[10px] text-brand hover:underline font-semibold"
                      >
                        Baca
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(n.id)}
                      className="text-[10px] text-red-400 hover:underline font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-grey-100">
            <button
              onClick={() => { setOpen(false); router.push("/notifikasi"); }}
              className="w-full text-xs text-center text-brand font-semibold hover:underline py-1"
            >
              Lihat semua notifikasi →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}