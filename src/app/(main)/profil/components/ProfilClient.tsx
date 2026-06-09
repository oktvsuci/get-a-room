"use client";

import { useState } from "react";
import ProfilDisplay from "./ProfilDisplay";
import ProfilForm from "./ProfilForm";

interface ProfilClientProps {
  profile: {
    nama: string;
    hp: string;
    nim: string;
  } | null;
  email: string;
}

export default function ProfilClient({ profile, email }: ProfilClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md border p-8">
      {isEditing ? (
        <ProfilForm
          profile={profile}
          email={email}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfilDisplay
          profile={profile}
          email={email}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}