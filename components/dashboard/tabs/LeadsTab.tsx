"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/API";
import LeadCard from "../../LeadCard";
import { useToast } from "@/hooks/useToast";
import { Users, UserX } from "lucide-react";

type ViewMode = "all" | "dropoffs";

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [dropOffs, setDropOffs] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [leadsRes, consultantsRes] = await Promise.all([
          fetch(`${API_URL}/leads/get-all-leads`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_URL}/users/public/get-all-consultants`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        const leadsData = await leadsRes.json();
        const consultantsData = await consultantsRes.json();

        // Leads
        if (leadsData.success && Array.isArray(leadsData.leads)) {
          setLeads(leadsData.leads);
        } else {
          setLeads([]);
        }
        // Consultants
        if (consultantsData.success && Array.isArray(consultantsData.data)) {
          setConsultants(consultantsData.data);
        } else {
          setConsultants([]);
        }
        // Drop-offs - Set to empty array since we're not fetching this data anymore
        setDropOffs([]);
      } catch (err: any) {
        console.error("Error fetching data", err);
        setError(err.message || "Failed to load data");
        setLeads([]);
        setConsultants([]);
        setDropOffs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReassign = async (leadId: string, consultantId: string) => {
    try {
      const res = await fetch(`${API_URL}/leads/reassign-lead`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, consultantId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Reassign failed");
      }

      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, consultantId } : l))
      );

      toast({
        title: "Success",
        description: "Lead reassigned successfully",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Reassign failed", err);
      toast({
        title: "Error",
        description: "Failed to reassign lead due to internal server error",
        variant: "destructive",
      });
    }
  };

  const displayedLeads = viewMode === "all" ? leads : dropOffs;

  return (
    <div className="space-y-6">
      {/* Header with Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
          <p className="text-gray-600">View and manage all leads</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <Users className="w-4 h-4" />
            All Leads
            <span className={`px-2 py-0.5 rounded-full text-xs ${viewMode === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
              }`}>
              {leads.length}
            </span>
          </button>
          <button
            onClick={() => setViewMode("dropoffs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "dropoffs"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <UserX className="w-4 h-4" />
            Drop Offs
            <span className={`px-2 py-0.5 rounded-full text-xs ${viewMode === "dropoffs" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-600"
              }`}>
              {dropOffs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Info Banner for Drop Offs */}
      {viewMode === "dropoffs" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <UserX className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Drop-off Leads</h4>
              <p className="text-sm text-amber-700 mt-1">
                These are users who started the onboarding process but did not complete it.
                Consider reaching out to help them complete their registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && displayedLeads.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {viewMode === "all" ? (
              <Users className="w-8 h-8 text-gray-400" />
            ) : (
              <UserX className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {viewMode === "all" ? "No leads yet" : "No drop-offs"}
          </h3>
          <p className="text-gray-500">
            {viewMode === "all"
              ? "Leads will appear here when users complete the onboarding process."
              : "Great news! No users have abandoned the onboarding process."}
          </p>
        </div>
      )}

      {!loading && !error && displayedLeads.length > 0 && (
        <div className="grid gap-4">
          {displayedLeads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              consultants={consultants}
              onReassign={handleReassign}
            />
          ))}
        </div>
      )}
    </div>
  );
}
