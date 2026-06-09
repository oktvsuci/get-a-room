// src/app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

async function getNotifForUser(notifId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const, notif: null };

  const notif = await prisma.notification.findUnique({ where: { id: notifId } });
  if (!notif) return { error: "Not found", status: 404 as const, notif: null };
  if (notif.userId !== user.id) return { error: "Forbidden", status: 403 as const, notif: null };

  return { error: null, status: 200 as const, notif };
}

// PATCH /api/notifications/[id] — mark as read
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { error, status, notif } = await getNotifForUser(id);
  if (error || !notif) return NextResponse.json({ error }, { status });

  const updated = await prisma.notification.update({
    where: { id },
    data:  { isRead: true },
  });

  return NextResponse.json({ notification: updated });
}

// DELETE /api/notifications/[id] — hapus satu notif
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { error, status, notif } = await getNotifForUser(id);
  if (error || !notif) return NextResponse.json({ error }, { status });

  await prisma.notification.delete({ where: { id } });
  return NextResponse.json({ success: true });
}