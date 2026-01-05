"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Building2, Clock, User, Mail, Phone, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Lead = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  intentPrimary: string;
  businessType: string;
  sector: string;
  locationCity: string;
  locationRegion: string;
  status: "new" | "in_progress" | "lost" | "spam";
  createdAt: string;
  leadSourceDetail: string;
  assignedToConsultantId: string | null;
  assignedToConsultantName: string | null;
};

// Extended mock data with assignment info
const mockAllLeads: Lead[] = [
  {
    _id: "1",
    firstName: "Marie",
    lastName: "Nkeng",
    phone: "237672280977",
    email: "marie.nkeng@example.com",
    intentPrimary: "registration_fix",
    businessType: "ets",
    sector: "Retail / Shop",
    locationCity: "Douala",
    locationRegion: "littoral",
    status: "new",
    createdAt: "2025-01-15T10:30:00Z",
    leadSourceDetail: "homepage_cta",
    assignedToConsultantId: "consultant-1",
    assignedToConsultantName: "John Doe",
  },
  {
    _id: "2",
    firstName: "Paul",
    lastName: "Fotso",
    phone: "237677123456",
    email: "paul.fotso@example.com",
    intentPrimary: "tax_records",
    businessType: "sarl",
    sector: "Services",
    locationCity: "Yaoundé",
    locationRegion: "center",
    status: "in_progress",
    createdAt: "2025-01-14T14:20:00Z",
    leadSourceDetail: "learning_article_niu-rccm",
    assignedToConsultantId: "consultant-2",
    assignedToConsultantName: "Jane Smith",
  },
  {
    _id: "3",
    firstName: "Sarah",
    lastName: "Mbah",
    phone: "237678901234",
    email: "sarah.mbah@example.com",
    intentPrimary: "merchant_account",
    businessType: "none",
    sector: "Online business",
    locationCity: "Bafoussam",
    locationRegion: "west",
    status: "new",
    createdAt: "2025-01-15T09:15:00Z",
    leadSourceDetail: "faq_cta",
    assignedToConsultantId: null,
    assignedToConsultantName: null,
  },
];

const INTENT_LABELS: Record<string, string> = {
  registration_fix: "Business Registration",
  tax_records: "Tax Records",
  merchant_account: "Merchant Account",
  guidance: "General Guidance",
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  ets: "ETS",
  sarl: "SARL",
  sa: "SA",
  ngo: "NGO",
  gie: "GIE",
  none: "Not Registered",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  lost: "bg-gray-100 text-gray-800 border-gray-200",
  spam: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  lost: "Lost",
  spam: "Spam",
};

const SOURCE_LABELS: Record<string, string> = {
  homepage_cta: "Homepage CTA",
  "learning_article_niu-rccm": "Learning Article",
  faq_cta: "FAQ CTA",
  "start_here_menu": "Start Here Menu",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockAllLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads =
    statusFilter === "all"
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  const updateStatus = (leadId: string, newStatus: "new" | "in_progress" | "lost" | "spam") => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const reassignLead = (leadId: string, consultantId: string) => {
    // Mock reassignment
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId
          ? {
              ...lead,
              assignedToConsultantId: consultantId,
              assignedToConsultantName: "John Doe", // Mock name
            }
          : lead
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Leads</h1>
          <p className="text-slate-500 mt-1">View and manage all leads across consultants</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "new", "in_progress", "lost", "spam"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? "bg-black hover:bg-black/90" : ""}
          >
            {status === "all" ? "All" : STATUS_LABELS[status]}
          </Button>
        ))}
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No leads found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" />
                        {lead.firstName} {lead.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={lead.status}
                        onValueChange={(value) =>
                          updateStatus(lead._id, value as typeof lead.status)
                        }
                      >
                        <SelectTrigger className={`w-32 ${STATUS_COLORS[lead.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <strong>Need:</strong> {INTENT_LABELS[lead.intentPrimary]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <strong>Location:</strong> {lead.locationCity}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Source:</strong> {SOURCE_LABELS[lead.leadSourceDetail] || lead.leadSourceDetail}
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Business:</strong> {BUSINESS_TYPE_LABELS[lead.businessType]}
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Sector:</strong> {lead.sector}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UserCog className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <strong>Assigned:</strong> {lead.assignedToConsultantName || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={lead.assignedToConsultantId || "unassigned"}
                        onValueChange={(value) => reassignLead(lead._id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Reassign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="consultant-1">John Doe</SelectItem>
                          <SelectItem value="consultant-2">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => {
                          const message = `Hello ${lead.firstName}, I'm following up on your request.`;
                          const encoded = encodeURIComponent(message);
                          const phoneNumber = lead.phone.replace(/\D/g, "");
                          window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

