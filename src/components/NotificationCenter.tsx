"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Sesuaikan dengan path client supabase kamu
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationCenter({ userId, initialNotifications }: { userId: string; initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Hitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // 1. Langganan (Subscribe) perubahan data secara real-time ke tabel Notification
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Dengarkan hanya saat ada data notif baru masuk
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`, // Hanya ambil jika userId cocok dengan yang login
        },
        (payload) => {
          // 2. Masukkan notifikasi baru ke baris paling atas state
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Fungsi menandai sudah dibaca (Bisa dibuatkan Server Action terpisah nanti)
  const handleMarkAsRead = async (id: string) => {
    // Update di state lokal dulu biar instan kelihatannya
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    
    // Kamu bisa panggil server action di sini untuk update ke DB via Prisma
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Tombol Lonceng */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown List Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-bold text-gray-700">Pemberitahuan</div>
          <div className="divide-y">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">Tidak ada notifikasi baru.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-4 hover:bg-gray-50 transition ${!notif.isRead ? "bg-red-50/50" : ""}`}>
                  <h4 className="font-semibold text-sm text-gray-800">{notif.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  {!notif.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.id)} 
                      className="text-[10px] text-red-600 hover:underline mt-2 block font-medium"
                    >
                      Tandai Sudah Dibaca
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}