
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users,Clock,CheckCircle,XCircle,Briefcase,Building2,User, Phone, Mail, Shield,MapPin,Calendar} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { API_URL } from "@/API";

interface Lead {
  _id: string;
  goal: { value: string; title: string; description: string };
  sector: string;
  status: string;
  createdAt: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  coverage?: string[];
  createdAt?: string;
}

export default function ConsultantDashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultantData, setConsultantData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
const leadsRes = await fetch(`${API_URL}/leads/get-leads-by-consultant-id`, {
          credentials: "include",
        });
        const leadsData = await leadsRes.json();
        if (leadsData.success) {
          setLeads(leadsData.leads || []);
        }

        
        const userRes = await fetch(`${API_URL}/users/get-user`, {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (userData.success && userData.userData) {
          setConsultantData(userData.userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 
  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const inProgressCount = leads.filter((l) => l.status === "In Progress").length;
  const completedCount = leads.filter((l) => l.status === "Completed").length;
  const lostSpamCount = leads.filter(
    (l) => l.status === "Lost" || l.status === "Discontinued"
  ).length;

  
  const serviceRequests = leads.reduce((acc, lead) => {
    const service = lead.goal?.title || "Other";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  
  const businessTypes = leads.reduce((acc, lead) => {
    const sector = lead.sector || "Other";
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {user.firstName || "Consultant"}! Here is your overview.
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">
                    {user.phone || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Shield className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-100">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Coverage</p>
                  <p className="font-medium text-slate-900">
                    {user.coverage && user.coverage.length > 0
                      ? user.coverage.join(", ")
                      : "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-pink-100">
                  <Calendar className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Joined</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(consultantData?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                New Leads
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {newLeadsCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Awaiting action</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Service Requests
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-100">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.keys(serviceRequests).length > 0 ? (
                  Object.entries(serviceRequests).map(([service, count]) => (
                    <div
                      key={service}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600 truncate">{service}</span>
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No requests yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Business Types
              </CardTitle>
              <div className="p-2 rounded-lg bg-teal-100">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.keys(businessTypes).length > 0 ? (
                  Object.entries(businessTypes).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600 truncate">{type}</span>
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Lead Status
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    In Progress
                  </span>
                  <span className="font-semibold text-slate-900">
                    {inProgressCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Completed
                  </span>
                  <span className="font-semibold text-slate-900">
                    {completedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Lost/Spam
                  </span>
                  <span className="font-semibold text-slate-900">
                    {lostSpamCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/consultant/dashboard/leads?status=new">
              <Button className="gap-2">
                <Users className="w-4 h-4" />
                View New Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}