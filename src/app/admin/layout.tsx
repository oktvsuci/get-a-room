// src/app/admin/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard: hanya admin yang boleh masuk
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin");
  if (user.user_metadata?.role !== "admin") redirect("/");

  const nama =
    (user.user_metadata?.nama as string) ||
    user.email?.split("@")[0] ||
    "Admin";

  return (
    <div className="flex min-h-screen bg-grey-50">
      <AdminSidebar adminNama={nama} adminEmail={user.email ?? ""} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-grey-200 flex items-center justify-between px-6 flex-shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-grey-500">Admin Panel</span>
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
              {nama.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}