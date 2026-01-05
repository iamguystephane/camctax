"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/API";
import { Users, UserCheck, DollarSign, Activity, ArrowUp, ArrowDown, X, Calendar } from "lucide-react";
import Link from "next/link";

export default function OverviewTab() {
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [consultantsCount, setConsultantsCount] = useState<number>(0);
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [weekLeads, setWeekLeads] = useState<number>(0);
  const [monthLeads, setMonthLeads] = useState<number>(0);
  const [yearLeads, setYearLeads] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leadsRes, consultantsListRes, leadCountsRes] = await Promise.all([
          fetch(`${API_URL}/leads/get-all-lead-counts`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_URL}/users/get-consultants-auth-status`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_URL}/leads/get-leads-count`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        const leadsData = await leadsRes.json();
        const consultantsListData = await consultantsListRes.json();
        const leadCountsData = await leadCountsRes.json();

        setLeadsCount(leadCountsData.success ? leadCountsData.data?.count || 0 : 0);
        setConsultantsCount(consultantsListData.success ? consultantsListData.count || 0 : 0);
        setConsultants(consultantsListData.success ? consultantsListData.data || [] : []);
        
        // Set lead counts by period
        if (leadsData.success && leadsData.data) {
          setTotalLeads(leadsData.data.total || 0);
          setWeekLeads(leadsData.data.week || 0);
          setMonthLeads(leadsData.data.month || 0);
          setYearLeads(leadsData.data.year || 0);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Leads",
      value: loading ? "Loading..." : leadsCount.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Consultants",
      value: loading ? "Loading..." : consultantsCount.toLocaleString(),
      change: "+3",
      trend: "up",
      icon: <UserCheck className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Monthly Revenue",
      value: "0.00 FCFA",
      change: "+24.3%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. Response Time",
      value: "4 hrs",
      change: "-12%",
      trend: "down",
      icon: <Activity className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];



  const quickActions = [
    { label: "View Reports", icon: <Activity className="w-5 h-5" />, href: "/dashboard?tab=reports" },
    { label: "Manage Consultants", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard?tab=consultants" },
    { label: "Check Analytics", icon: <Activity className="w-5 h-5" />, href: "/dashboard?tab=analytics" },
  ];

  return (
    <>
      <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
            <p className="opacity-90">Here's what's happening with your platform today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-secondary rounded-2xl p-6 border border-gray-200 shadow-sm ${index === 0 ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            onClick={index === 0 ? () => setLeadsModalOpen(true) : undefined}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.trend === "up" ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                {stat.change}
              </span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Consultants Status */}
        <div className="bg-secondary rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Consultants Status</h3>
            <Link href="/admin/dashboard?tab=consultants" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {consultants.slice(0, 5).map((consultant) => (
              <div key={consultant.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-700">
                      {consultant.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{consultant.name}</p>
                    <p className="text-sm text-gray-600">{consultant.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{consultant.city || 'N/A'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    consultant.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {consultant.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href.replace('/dashboard?', '/admin/dashboard?')}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="text-blue-600">{action.icon}</div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </div>
    </div>

    <AnimatePresence>
      {leadsModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setLeadsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-secondary rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-primary border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary-foreground">Leads Breakdown</h3>
                  <button
                    onClick={() => setLeadsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {loading ? "Loading..." : weekLeads.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-green-800">
                      {loading ? "Loading..." : monthLeads.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600">This Year</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {loading ? "Loading..." : yearLeads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  </>
  );
}
