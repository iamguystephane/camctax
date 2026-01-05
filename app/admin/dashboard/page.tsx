// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSideBar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Menu, X } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* Top Header */}
      <DashboardHeader
        {...({
          searchQuery,
          onSearchChange: setSearchQuery,
          onMenuClick: () => setSidebarOpen(prev => !prev),
          sidebarOpen,
        } as any)}
      />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed bg-black/50 md:relative z-50 md:z-0
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:transition-none
          h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]
          top-16 md:top-auto
        `}
        >
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (isMobile) setSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <DashboardContent activeTab={activeTab} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
