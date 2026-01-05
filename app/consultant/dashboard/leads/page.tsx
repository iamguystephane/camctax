"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Building2, Clock, User, Mail, Phone, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/API";
import { useToast } from "@/hooks/useToast";

interface Lead {
  _id: string;
  contact?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
  goal?: { value?: string; title?: string };
  businessStructure?: string;
  sector?: string;
  location?: { city?: string; region?: string };
  status?: string;
  createdAt: string;
  leadSource?: { sourceDetail?: string };
}

const INTENT_LABELS: Record<string, string> = {
  registration_fix: "Business Registration",
  tax_records: "Tax Records",
  merchant_account: "Merchant Account",
  guidance: "General Guidance",
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  ets: "ETS (Sole Proprietorship)",
  sarl: "SARL (LLC)",
  sa: "SA (Corporation)",
  ngo: "Association / NGO",
  gie: "GIE",
  none: "Not Registered Yet",
};

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Lost: "bg-gray-100 text-gray-800 border-gray-200",
  Spam: "bg-orange-100 text-orange-800 border-orange-200",
};

const STATUS_OPTIONS = ["In Progress", "Completed", "Lost", "Spam"];
// Cameroon Regions and Cities
const CAMEROON_LOCATIONS: Record<string, { label: string; cities: string[] }> = {
  littoral: {
    label: "Littoral",
    cities: ["Douala", "Edea", "Nkongsamba", "Loum", "Mbanga"],
  },
  center: {
    label: "Centre",
    cities: ["Yaounde", "Mbalmayo", "Obala", "Eseka", "Nanga Eboko"],
  },
  west: {
    label: "West",
    cities: ["Bafoussam", "Dschang", "Mbouda", "Foumban", "Bandjoun"],
  },
  south_west: {
    label: "South West",
    cities: ["Buea", "Limbe", "Kumba", "Tiko", "Mamfe"],
  },
  north_west: {
    label: "North West",
    cities: ["Bamenda", "Wum", "Kumbo", "Ndop", "Fundong"],
  },
  south: {
    label: "South",
    cities: ["Ebolowa", "Kribi", "Sangmelima", "Ambam"],
  },
  east: {
    label: "East",
    cities: ["Bertoua", "Batouri", "Yokadouma", "Abong-Mbang"],
  },
  adamawa: {
    label: "Adamawa",
    cities: ["Ngaoundere", "Meiganga", "Tibati", "Banyo"],
  },
  north: {
    label: "North",
    cities: ["Garoua", "Guider", "Pitoa", "Figuil"],
  },
  far_north: {
    label: "Far North",
    cities: ["Maroua", "Kousseri", "Mokolo", "Mora", "Yagoua"],
  },
};

export default function ConsultantLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/leads/get-leads-by-consultant-id`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        } else {
          setLeads([]);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leads",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [toast]);

  // Get cities based on selected region
  const availableCities = regionFilter !== "all" 
    ? CAMEROON_LOCATIONS[regionFilter]?.cities || []
    : Object.values(CAMEROON_LOCATIONS).flatMap(r => r.cities);

  // Reset city filter when region changes
  const handleRegionChange = (value: string) => {
    setRegionFilter(value);
    setCityFilter("all");
  };

  // Filter and search leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    // Match region (normalize the stored region value)
    const leadRegion = lead.location?.region?.toLowerCase().replace(/\s+/g, "_") || "";
    const matchesRegion = regionFilter === "all" || 
      leadRegion === regionFilter ||
      leadRegion.includes(regionFilter.replace("_", " "));
    
    // Match city
    const leadCity = lead.location?.city?.toLowerCase() || "";
    const matchesCity = cityFilter === "all" || 
      leadCity === cityFilter.toLowerCase();
    
    const fullName = `${lead.contact?.firstName || ""} ${lead.contact?.lastName || ""}`.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      (lead.contact?.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.contact?.phone || "").includes(searchQuery);
    
    return matchesStatus && matchesRegion && matchesCity && matchesSearch;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  const updateStatus = (leadId: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const openWhatsApp = (lead: Lead) => {
    const firstName = lead.contact?.firstName || "there";
    const intent = lead.goal?.title || lead.goal?.value || "assistance";
    const message = `Hello ${firstName}, I'm following up on your request for ${INTENT_LABELS[intent] || intent}.`;
    const encoded = encodeURIComponent(message);
    const phoneNumber = (lead.contact?.phone || "").replace(/\D/g, "");
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Leads</h1>
          <p className="text-slate-500 mt-1">Manage and track your assigned leads</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {["all", ...STATUS_OPTIONS].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-black hover:bg-black/90" : ""}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>

          {/* Region Filter */}
          <Select value={regionFilter} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-44">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(CAMEROON_LOCATIONS).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest")}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads List */}
      {sortedLeads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <User className="w-12 h-12 text-slate-300" />
              <p className="text-slate-500 font-medium">No leads found</p>
              <p className="text-sm text-slate-400">
                {searchQuery || statusFilter !== "all" || regionFilter !== "all" || cityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You don't have any assigned leads yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-slate-500 mb-2">
            Showing {sortedLeads.length} lead{sortedLeads.length !== 1 ? "s" : ""}
          </div>
        <div className="grid gap-4">
          {sortedLeads.map((lead, index) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" />
                        {lead.contact?.firstName} {lead.contact?.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.contact?.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.contact?.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                    <Select
                      value={lead.status || "New"}
                      onValueChange={(value) => updateStatus(lead._id, value)}
                    >
                      <SelectTrigger className={`w-36 ${STATUS_COLORS[lead.status || "New"] || STATUS_COLORS.New}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <strong>Need:</strong> {lead.goal?.title || lead.goal?.value || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <strong>Location:</strong> {lead.location?.city || "Unknown"}{lead.location?.region ? `, ${lead.location.region}` : ""}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Business Type:</strong> {BUSINESS_TYPE_LABELS[lead.businessStructure || ""] || lead.businessStructure || "N/A"}
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Sector:</strong> {lead.sector || "N/A"}
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
                    <Button
                      size="sm"
                      onClick={() => openWhatsApp(lead)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}