"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const nama = formData.get("nama") as string;
  const hp = formData.get("hp") as string;
  const nim = formData.get("nim") as string;

  await prisma.profile.upsert({
    where: {
      userId: user.id,
    },
    update: {
      nama,
      hp,
      nim,
    },
    create: {
      userId: user.id,
      nama,
      hp,
      nim,
    },
  });

  revalidatePath("/profil");
}