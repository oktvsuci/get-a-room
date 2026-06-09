"use client";

import { useTransition } from "react";
import { updateProfile } from "../action";

interface ProfilFormProps {
  profile: {
    nama: string;
    hp: string;
    nim: string;
  } | null;
  email: string;
  onCancel: () => void;
}

export default function ProfilForm({ profile, email, onCancel }: ProfilFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData);
      onCancel();
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-700">Edit Profil</h2>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Nama</label>
          <input
            type="text"
            name="nama"
            defaultValue={profile?.nama ?? ""}
            className="w-full border rounded-lg px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border rounded-lg px-4 py-3 bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Nomor HP</label>
          <input
            type="text"
            name="hp"
            defaultValue={profile?.hp ?? ""}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">NIM</label>
          <input
            type="text"
            name="nim"
            defaultValue={profile?.nim ?? ""}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}