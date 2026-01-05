"use client";

import DashboardSidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser) {
      if (!user.email || user.role !== "consultant") {
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

  if (!user.email || user.role !== "consultant") {
    return null;
  }

  const sidebarUser = {
    fullName: `${user.firstName} ${user.lastName}`.trim() || "Consultant",
    email: user.email || "",
    role: user.role as "consultant",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar user={sidebarUser} />
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
