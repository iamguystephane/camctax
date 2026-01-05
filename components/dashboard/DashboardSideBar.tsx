// components/dashboard/DashboardSidebar.tsx
"use client";

import {
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  TrendingUp,
  Bell,
  Users as UsersIcon,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  onClose,
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isSuperAdmin = user?.role === "superadmin";

  const handleLogout = async () => {
    await logout();
  };

  // Main Dashboard Pages
  const dashboardPages = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    //{ id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "leads", label: "Leads", icon: <UsersIcon className="w-4 h-4" /> },
    {
      id: "consultants",
      label: "Consultants",
      icon: <UserCheck className="w-4 h-4" />,
    },
    // Admins tab - only visible to superadmin
    ...(isSuperAdmin
      ? [
          {
            id: "admins",
            label: "Admins",
            icon: <Shield className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    // {
    //   id: "notifications",
    //   label: "Notifications",
    //   icon: <Bell className="w-4 h-4" />,
    // },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: <Settings className="w-4 h-4" />,
    // },
  ];

  return (
    <aside className="w-64 md:w-72 bg-secondary border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 md:p-6">
        {/* Dashboard Pages */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Admin Dashboard
          </h3>
          <nav className="space-y-1">
            {dashboardPages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  onTabChange(page.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === page.id
                    ? "bg-primary text-primary-foreground border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page.icon}
                <span className="font-medium text-sm">{page.label}</span>
                {activeTab === page.id && (
                  <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

       
        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
