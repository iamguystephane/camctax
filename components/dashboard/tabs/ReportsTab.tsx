// components/dashboard/tabs/ReportsTab.tsx
"use client";

import {
  FileText,
  Download,
  Calendar,
  Filter,
  Users,
  Share2,
  Eye,
  DollarSign,
  Activity,
} from "lucide-react";

export default function ReportsTab() {
  const reports = [
    {
      id: 1,
      title: "Monthly User Analytics",
      description: "Detailed analysis of user growth and engagement",
      date: "Apr 2024",
      type: "PDF",
      size: "2.4 MB",
      downloads: 124,
    },
    {
      id: 2,
      title: "Consultant Performance",
      description: "Quarterly performance report of all consultants",
      date: "Q1 2024",
      type: "Excel",
      size: "4.8 MB",
      downloads: 89,
    },
    {
      id: 3,
      title: "Revenue Report",
      description: "Monthly revenue breakdown by service",
      date: "Mar 2024",
      type: "PDF",
      size: "1.8 MB",
      downloads: 156,
    },
    {
      id: 4,
      title: "Platform Usage",
      description: "Detailed platform usage statistics",
      date: "Feb 2024",
      type: "CSV",
      size: "3.2 MB",
      downloads: 67,
    },
  ];

  const quickReports = [
    { title: "Generate User Report", icon: <Users className="w-5 h-5" /> },
    { title: "Revenue Summary", icon: <DollarSign className="w-5 h-5" /> },
    { title: "Activity Log", icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600">Generate and manage platform reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-green-400 text-white rounded-xl hover:shadow-lg">
            <FileText className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickReports.map((report, index) => (
          <button
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-blue-600">{report.icon}</div>
              </div>
              <div>
                <p className="font-medium text-gray-800">{report.title}</p>
                <p className="text-sm text-gray-500">Generate instantly</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-r from-blue-100 to-green-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">{report.date}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{report.type}</span>
                      <span className="text-xs text-gray-500">{report.size}</span>
                      <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Stats */}
        <div className="p-6 bg-gray-50">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-800">436</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Avg. Size</p>
              <p className="text-2xl font-bold text-gray-800">2.8 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}