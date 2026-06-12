// src/components/notifications/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Notification = {
  id: string;
  createdAt: string;
  type: string;
  title: string;
  message: string;
  href: string;
  bookingId: string | null;
  isRead: boolean;
};

// Warna & ikon berdasarkan type
const TYPE_CFG: Record<string, { dot: string }> = {
  booking_submitted: { dot: "bg-blue-500"   },
  booking_approved:  { dot: "bg-green-500"  },
  booking_rejected:  { dot: "bg-red-500"    },
  booking_cancelled: { dot: "bg-yellow-500" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return "Baru saja";
  if (mins  < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export function NotificationBell({ userId }: { userId: string }) {
  const router = useRouter();
  const [notifs,       setNotifs]       = useState<Notification[]>([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [open,         setOpen]         = useState(false);
  const [loading,      setLoading]      = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch awal
  const fetchNotifs = useCallback(async () => {
    const res  = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = await res.json();
    setNotifs(data.notifications ?? []);
    setUnreadCount(data.unreadCount ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  // ── Supabase Realtime subscription ──────────────────────
  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase
      .channel(`notifications:${userId}`)   // Channel unik per user
      .on(
        "postgres_changes",
        {
          event:  "INSERT",
          schema: "public",
          table:  "Notification",
          filter: `userId=eq.${userId}`,    // Hanya notif milik user ini
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          // Tambahkan ke list tanpa fetch ulang
          setNotifs((prev) => [newNotif, ...prev]);
          setUnreadCount((c) => c + 1);
          // Efek suara / shake badge (opsional)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Tutup panel saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Mark as read
  async function markRead(notif: Notification) {
    if (notif.isRead) return;
    setNotifs((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    await fetch(`/api/notifications/${notif.id}`, { method: "PATCH" });
  }

  // Mark semua sebagai read
  async function markAllRead() {
    const unreadIds = notifs.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    await Promise.all(
      unreadIds.map((id) => fetch(`/api/notifications/${id}`, { method: "PATCH" }))
    );
  }

  // Hapus notif
  async function deleteNotif(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    const wasUnread = notifs.find((n) => n.id === id)?.isRead === false;
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
  }

  // Klik notif → mark read + navigate
  async function handleNotifClick(notif: Notification) {
    await markRead(notif);
    setOpen(false);
    router.push(notif.href);
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-grey-100 transition-all"
        aria-label="Notifikasi"
      >
        {/* Bell icon SVG */}
        <svg
          className="w-5 h-5 text-grey-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center leading-none animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 w-[360px] bg-white border border-grey-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-grey-100 bg-grey-50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-grey-900 text-sm">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand font-semibold hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-grey-100">
            {loading ? (
              <div className="py-10 text-center">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-grey-400">Memuat notifikasi...</p>
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm font-semibold text-grey-700">Belum ada notifikasi</p>
                <p className="text-xs text-grey-400 mt-1">
                  Kamu akan menerima update di sini.
                </p>
              </div>
            ) : (
              notifs.map((notif) => {
                const cfg = TYPE_CFG[notif.type] ?? { dot: "bg-grey-400" };
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={[
                      "flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors group",
                      notif.isRead
                        ? "hover:bg-grey-50"
                        : "bg-brand/[0.03] hover:bg-brand/[0.06]",
                    ].join(" ")}
                  >
                    {/* Status dot */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${notif.isRead ? "bg-grey-200" : cfg.dot}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug mb-0.5 ${notif.isRead ? "text-grey-600" : "text-grey-900 font-semibold"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-grey-500 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-grey-400 mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => deleteNotif(e, notif.id)}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-grey-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-2.5 border-t border-grey-100 bg-grey-50">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/notifikasi");
                }}
                className="w-full text-xs text-brand font-semibold hover:underline text-center"
              >
                Lihat riwayat peminjaman →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}