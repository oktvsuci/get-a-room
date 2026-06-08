import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "./action";

export default async function ProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-slate-800 mb-10">
        Profil Saya
      </h1>

      <div className="bg-white rounded-2xl shadow-md border p-8">
        <form action={updateProfile} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nama
            </label>

            <input
              type="text"
              name="nama"
              defaultValue={profile?.nama ?? ""}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-slate-100"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nomor HP
            </label>

            <input
              type="text"
              name="hp"
              defaultValue={profile?.hp ?? ""}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* NIM */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              NIM
            </label>

            <input
              type="text"
              name="nim"
              defaultValue={profile?.nim ?? ""}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </main>
  );
}