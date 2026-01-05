// components/dashboard/DashboardContent.tsx
"use client";

import { motion } from "framer-motion";
import OverviewTab from "./tabs/OverviewTab";
import UsersTab from "./tabs/UsersTab";
import ConsultantsTab from "./tabs/ConsultantsTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import ReportsTab from "./tabs/ReportsTab";
import BillingTab from "./tabs/BillingTab";
import SettingsTab from "./tabs/SettingsTab";
import LeadsTab from "./tabs/LeadsTab";
import BlogsTab from "./tabs/BlogsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AdminsTab from "./tabs/AdminsTab";

interface DashboardContentProps {
  activeTab: string;
  searchQuery: string;
}

export default function DashboardContent({
  activeTab,
  searchQuery,
}: DashboardContentProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "users":
        return <UsersTab searchQuery={searchQuery} />;
      case "consultants":
        return <ConsultantsTab searchQuery={searchQuery} />;
      case "admins":
        return <AdminsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "reports":
        return <ReportsTab />;
      case "leads":
        return <LeadsTab />;
      case "billing":
        return <BillingTab />;
      case "settings":
        return <SettingsTab />;
      case "blogs":
        return <BlogsTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </main>
  );
}
