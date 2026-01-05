// components/dashboard/tabs/SettingsTab.tsx
"use client";

import {
  Settings,
  Shield,
  Bell,
  User,
  Lock,
  Globe,
  Database,
 
  Save,
  Users,
  Key,
} from "lucide-react";
import { useState } from "react";

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
    general: {
      language: "en",
      timezone: "UTC",
      theme: "light",
    },
  });

  const handleToggle = (category: string, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: !((prev[category as keyof typeof prev] as Record<string, any>)[key])
      }
    }));
  };

  const settingSections = [
    {
      title: "General Settings",
      icon: <Settings className="w-5 h-5" />,
      settings: [
        { label: "Language", value: "English", type: "select", options: ["English", "Spanish", "French", "German"] },
        { label: "Timezone", value: "UTC", type: "select", options: ["UTC", "EST", "PST", "GMT"] },
        { label: "Theme", value: "Light", type: "select", options: ["Light", "Dark", "Auto"] },
      ],
    },
    {
      title: "Security",
      icon: <Shield className="w-5 h-5" />,
      settings: [
        { label: "Two-Factor Authentication", value: settings.security.twoFactor, type: "toggle" },
        { label: "Session Timeout", value: `${settings.security.sessionTimeout} minutes`, type: "slider" },
        { label: "Password Policy", value: "Strong", type: "select", options: ["Weak", "Medium", "Strong"] },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      settings: [
        { label: "Email Notifications", value: settings.notifications.email, type: "toggle" },
        { label: "Push Notifications", value: settings.notifications.push, type: "toggle" },
        { label: "Marketing Emails", value: settings.notifications.marketing, type: "toggle" },
      ],
    },
  ];

  const systemSettings = [
    { title: "User Management", icon: <Users className="w-5 h-5" />, description: "Configure user roles and permissions" },
    { title: "API Settings", icon: <Key className="w-5 h-5" />, description: "Manage API keys and access" },
    { title: "Database", icon: <Database className="w-5 h-5" />, description: "Database configuration and backup" },
    { title: "Global Settings", icon: <Globe className="w-5 h-5" />, description: "Platform-wide configuration" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:shadow-lg">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <div className="text-blue-600">{section.icon}</div>
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{setting.label}</p>
                      <p className="text-sm text-gray-600">Configure {setting.label.toLowerCase()}</p>
                    </div>
                    
                    {setting.type === "toggle" ? (
                      <button
                        onClick={() => handleToggle(
                          section.title.toLowerCase().includes('security') ? 'security' :
                          section.title.toLowerCase().includes('notification') ? 'notifications' : 'general',
                          setting.label.toLowerCase().replace(/ /g, '')
                        )}
                        className={`w-12 h-6 rounded-full transition-colors ${setting.value ? 'bg-green-400' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${setting.value ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    ) : setting.type === "select" ? (
                      <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                        {setting.options?.map((option, i) => (
                          <option key={i} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-700">{setting.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System Settings Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="font-medium text-blue-600">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memory</span>
                <span className="font-medium text-purple-600">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="font-medium text-orange-600">1.2 TB</span>
              </div>
            </div>
          </div> */}

          {/* Quick Settings
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <div className="space-y-3">
              {systemSettings.map((setting, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <div className="text-gray-600">{setting.icon}</div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{setting.title}</p>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div> */}

          {/* Backup & Restore */}
          {/* <div className="bg-linear-to-r from-blue-600 to-green-400 text-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Backup & Restore</h3>
            <p className="text-sm opacity-90 mb-4">Last backup: 2 hours ago</p>
            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Backup Now
              </button>
              <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                Restore
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}