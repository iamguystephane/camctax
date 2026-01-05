"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser) {
      const isAdminOrSuperAdmin =
        user.role === "admin" || user.role === "superadmin";

      if (!user.email || !isAdminOrSuperAdmin) {
        router.push("/auth");
      }
    }
  }, [user, isLoadingUser, router]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isAdminOrSuperAdmin =
    user.role === "admin" || user.role === "superadmin";

  if (!user.email || !isAdminOrSuperAdmin) {
    return null;
  }

  const sidebarRole = user.role === "superadmin" ? "superadmin" : "admin";
  const sidebarUser = {
    fullName: `${user.firstName} ${user.lastName}`.trim() || "Admin",
    email: user.email || "",
    role: sidebarRole as "admin" | "superadmin",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="">{children}</div>
      </main>
    </div>
  );
}
