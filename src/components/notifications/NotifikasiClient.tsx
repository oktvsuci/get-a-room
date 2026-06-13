// src/components/notifications/NotifikasiClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  createdAt: Date | string;
  type: string;
  title: string;
  message: string;
  href: string | null;  // ← tambah | null
  isRead: boolean;
};

const TYPE_CFG: Record<string, { dot: string; bg: string }> = {
  booking_submitted: { dot: "bg-blue-500",   bg: "bg-blue-50"   },
  booking_approved:  { dot: "bg-green-500",  bg: "bg-green-50"  },
  booking_rejected:  { dot: "bg-red-500",    bg: "bg-red-50"    },
  booking_cancelled: { dot: "bg-yellow-500", bg: "bg-yellow-50" },
};

function timeAgo(dateStr: Date | string) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return "Baru saja";
  if (mins  < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export function NotifikasiClient({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const router = useRouter();
  const [notifs, setNotifs] = useState(initialNotifications);

  const unread = notifs.filter((n) => !n.isRead).length;

  async function markRead(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  }

  async function markAllRead() {
    const ids = notifs.filter((n) => !n.isRead).map((n) => n.id);
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await Promise.all(ids.map((id) => fetch(`/api/notifications/${id}`, { method: "PATCH" })));
  }

  async function deleteNotif(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
  }

  async function handleClick(notif: Notification) {
    await markRead(notif.id);
    if (notif.href) router.push(notif.href);  // ← guard null sebelum push
  }

  if (notifs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-grey-200 rounded-xl text-center">
        <div className="text-6xl mb-4">🔔</div>
        <h3 className="font-display text-xl font-bold text-grey-900 mb-2">
          Belum Ada Notifikasi
        </h3>
        <p className="text-grey-500 text-sm">
          Kamu akan menerima notifikasi saat ada update pengajuan.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-grey-500">
          <span className="font-bold text-grey-900">{unread}</span> belum dibaca
          dari {notifs.length} notifikasi
        </p>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-brand font-semibold hover:underline"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white border border-grey-200 rounded-xl overflow-hidden shadow-sm divide-y divide-grey-100">
        {notifs.map((notif) => {
          const cfg = TYPE_CFG[notif.type] ?? { dot: "bg-grey-400", bg: "bg-grey-50" };

          return (
            <div
              key={notif.id}
              className={[
                "flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors group",
                notif.isRead ? "hover:bg-grey-50" : `${cfg.bg} hover:brightness-95`,
              ].join(" ")}
              onClick={() => handleClick(notif)}
            >
              {/* Dot */}
              <div className="flex-shrink-0 mt-1.5">
                <div
                  className={[
                    "w-2.5 h-2.5 rounded-full transition-all",
                    notif.isRead ? "bg-grey-200" : cfg.dot,
                  ].join(" ")}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={[
                    "text-sm mb-0.5",
                    notif.isRead
                      ? "text-grey-600"
                      : "text-grey-900 font-semibold",
                  ].join(" ")}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-grey-500 leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-[10px] text-grey-400 mt-1.5">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div
                className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {!notif.isRead && (
                  <button
                    onClick={() => markRead(notif.id)}
                    className="text-[10px] px-2 py-1 rounded border border-grey-300 text-grey-500 hover:border-brand hover:text-brand transition-all"
                  >
                    Baca
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(notif.id)}
                  className="text-[10px] px-2 py-1 rounded border border-grey-200 text-grey-400 hover:border-red-300 hover:text-red-500 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}