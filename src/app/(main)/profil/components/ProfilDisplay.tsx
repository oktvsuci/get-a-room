"use client";

interface ProfilDisplayProps {
  profile: {
    nama: string;
    hp: string;
    nim: string;
  } | null;
  email: string;
  onEdit: () => void;
}

export default function ProfilDisplay({ profile, email, onEdit }: ProfilDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-700">Informasi Akun</h2>
        <button
          onClick={onEdit}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
        >
          Edit Profil
        </button>
      </div>

      <div className="grid gap-4">
        <div className="border rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">Nama</p>
          <p className="font-medium text-slate-800">{profile?.nama || "-"}</p>
        </div>

        <div className="border rounded-lg px-4 py-3 bg-slate-50">
          <p className="text-xs text-slate-400 mb-1">Email</p>
          <p className="font-medium text-slate-800">{email}</p>
        </div>

        <div className="border rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">Nomor HP</p>
          <p className="font-medium text-slate-800">{profile?.hp || "-"}</p>
        </div>

        <div className="border rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">NIM</p>
          <p className="font-medium text-slate-800">{profile?.nim || "-"}</p>
        </div>
      </div>
    </div>
  );
}