// src/lib/notifications.ts
import { prisma } from "@/lib/prisma";

type NotifType =
  | "booking_submitted"
  | "booking_approved"
  | "booking_rejected"
  | "booking_cancelled";

type CreateNotifParams = {
  userId: string;
  type: NotifType;
  bookingId: string;
  roomLabel: string;   // "TULT — Aula Lt.2"
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  nama?: string;       // Nama pemohon (untuk notif ke admin)
};

type NotifTemplate = (p: CreateNotifParams) => { title: string; message: string; href: string };

const NOTIF_TEMPLATES: Record<NotifType, NotifTemplate> = {
  booking_submitted: (p) => ({
    title:   "📋 Pengajuan Booking Baru",
    message: `${p.nama ?? "Seseorang"} mengajukan peminjaman ${p.roomLabel} pada ${p.tanggal}, pukul ${p.jamMulai}–${p.jamSelesai}.`,
    href:    "/admin/booking",
  }),
  booking_approved: (p) => ({
    title:   "✅ Pengajuan Disetujui",
    message: `Peminjaman ${p.roomLabel} pada ${p.tanggal}, pukul ${p.jamMulai}–${p.jamSelesai} telah disetujui.`,
    href:    "/dashboard/peminjaman",
  }),
  booking_rejected: (p) => ({
    title:   "❌ Pengajuan Ditolak",
    message: `Peminjaman ${p.roomLabel} pada ${p.tanggal}, pukul ${p.jamMulai}–${p.jamSelesai} tidak disetujui.`,
    href:    "/dashboard/peminjaman",
  }),
  booking_cancelled: (p) => ({
    title:   "🚫 Booking Dibatalkan",
    message: `${p.nama ?? "Pemohon"} membatalkan peminjaman ${p.roomLabel} pada ${p.tanggal}.`,
    href:    "/admin/booking",
  }),
};

export async function createNotification(params: CreateNotifParams) {
  const tpl = NOTIF_TEMPLATES[params.type](params);

  return prisma.notification.create({
    data: {
      userId:    params.userId,
      type:      params.type,
      title:     tpl.title,
      message:   tpl.message,
      href:      tpl.href,
      bookingId: params.bookingId,
    },
  });
}

// Notifikasi ke semua admin — ambil semua userId dengan role admin
// Karena role disimpan di Supabase Auth (bukan DB), kita butuh
// ADMIN_USER_IDS di .env sebagai fallback sederhana.
// Format: ADMIN_USER_IDS="uuid1,uuid2"
export async function notifyAdmins(params: Omit<CreateNotifParams, "userId">) {
  const adminIds = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

  if (adminIds.length === 0) {
    console.warn("[Notif] ADMIN_USER_IDS tidak diset di .env — notif admin dilewati.");
    return;
  }

  await Promise.all(
    adminIds.map((userId) => createNotification({ ...params, userId }))
  );
}