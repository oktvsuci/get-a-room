// src/app/(main)/notifikasi/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NotifikasiClient } from "@/components/notifications/NotifikasiClient";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/notifikasi");

  const notifications = await prisma.notification.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: "desc" },
    take:    100,
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-brand uppercase mb-2">
          Pusat Notifikasi
        </p>
        <h1 className="font-display text-3xl font-bold text-grey-900 mb-1">
          Semua Notifikasi
        </h1>
        <p className="text-grey-500 text-sm">
          Riwayat seluruh aktivitas peminjaman kamu.
        </p>
      </div>

      <NotifikasiClient initialNotifications={notifications} />
    </main>
  );
}