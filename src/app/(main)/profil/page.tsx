import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfilClient from "./components/ProfilClient";

export default async function ProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-slate-800 mb-10">Profil Saya</h1>
      <ProfilClient
        profile={profile ? { nama: profile.nama, hp: profile.hp, nim: profile.nim } : null}
        email={user.email ?? ""}
      />
    </main>
  );
}