"use client";

import React from "react";
import { User, Phone, MapPin, Building2, Target, Clock, Mail, Tag } from "lucide-react";

type ConsultantOption = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
};

type Lead = {
  _id: string;
  consultantId?: string | { _id?: string; firstName?: string; lastName?: string } | null;
  createdAt: string;
  contact?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
  location?: { city?: string; region?: string };
  goal?: { value?: string; title?: string };
  businessStructure?: string;
  sector?: string;
  status?: string;
  leadSource?: { sourceDetail?: string };
};

interface LeadCardProps {
  lead: Lead;
  consultants: ConsultantOption[];
  onReassign: (leadId: string, consultantId: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 border border-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Lost: "bg-gray-100 text-gray-700 border border-gray-200",
  Discontinued: "bg-red-100 text-red-700 border border-red-200",
};

export default function LeadCard({
  lead,
  consultants,
  onReassign,
}: LeadCardProps) {
  const assigned = lead.consultantId;
  const assignedId =
    typeof assigned === "string" ? assigned : assigned && (assigned._id || "");
  
  const assignedName = 
    typeof assigned === "object" && assigned 
      ? `${assigned.firstName || ""} ${assigned.lastName || ""}`.trim() 
      : null;

  const createdAt = new Date(lead.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusStyle = STATUS_STYLES[lead.status || "New"] || STATUS_STYLES.New;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {lead.contact?.firstName?.[0] || "?"}{lead.contact?.lastName?.[0] || ""}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {lead.contact?.firstName} {lead.contact?.lastName}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {lead.contact?.phone || "No phone"}
                </span>
                {lead.contact?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {lead.contact.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusStyle}`}>
            {lead.status || "New"}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Target className="w-3.5 h-3.5" />
              Intent
            </div>
            <div className="text-sm font-medium text-gray-800">
              {lead.goal?.title || lead.goal?.value || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Building2 className="w-3.5 h-3.5" />
              Business Type
            </div>
            <div className="text-sm font-medium text-gray-800">
              {lead.businessStructure || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Tag className="w-3.5 h-3.5" />
              Sector
            </div>
            <div className="text-sm font-medium text-gray-800">
              {lead.sector || "Not specified"}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5" />
              Location
            </div>
            <div className="text-sm font-medium text-gray-800">
              {lead.location?.city || "Unknown"}{lead.location?.region ? `, ${lead.location.region}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {createdAt}
            </span>
            {lead.leadSource?.sourceDetail && (
              <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                {lead.leadSource.sourceDetail}
              </span>
            )}
          </div> */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={assignedId || ""}
                onChange={(e) => onReassign(lead._id, e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[160px]"
              >
                <option value="">Unassigned</option>
                {consultants.map((c: ConsultantOption) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.firstName ? `${c.firstName} ${c.lastName || ""}` : c.name}
                  </option>
                ))}
              </select>
            </div>
            {assignedName && (
              <span className="text-xs text-gray-500">
                Currently: <span className="font-medium text-gray-700">{assignedName}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
