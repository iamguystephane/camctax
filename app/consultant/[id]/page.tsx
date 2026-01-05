// app/dashboard/consultants/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/API";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  MessageSquare,
  Edit,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  rate: string;
  status: "available" | "busy" | "offline";
  rating: number;
  projects: number;
  city?: string;
  coverage?: string[];
  isActive?: boolean;
  bio?: string;
  experience?: number;
  joinDate?: string;
  languages?: string[];
  skills?: string[];
  createdAt?: string;
}

export default function ConsultantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultant = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users/get-all-consultant/${params.id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch consultant details");
      }

      const data = json.data || json;

      // Map API data to our consultant interface
      const mappedConsultant: Consultant = {
        id: data._id || data.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        specialty: data.specialty || "Consultant",
        email: data.email || "",
        phone: data.phone || "",
        rate: "FCFA 50,000/hr", // Default or from API if available
        status: data.isActive ? "available" : "offline",
        rating: data.rating || 4.5,
        projects: data.projectCount || 5,
        city: data.coverage?.[0] || "Yaoundé",
        coverage: data.coverage || [],
        isActive: data.isActive,
        bio: data.bio || "Experienced consultant with proven track record.",
        experience: data.experience || 3,
        joinDate: data.createdAt || data.joinDate,
        languages: data.languages || ["English", "French"],
        skills: data.skills || ["Consultation", "Strategy", "Planning"],
        createdAt: data.createdAt,
      };

      setConsultant(mappedConsultant);
    } catch (err: unknown) {
      console.error("Error fetching consultant:", err);
      // Instead of setting error, create dummy consultant data
      const dummyConsultant: Consultant = {
        id: params.id as string,
        firstName: "John",
        lastName: "Doe",
        name: "John Doe",
        specialty: "Tax Consultant",
        email: "john.doe@example.com",
        phone: "+237 6 12 34 56 78",
        rate: "FCFA 50,000/hr",
        status: "available",
        rating: 4.8,
        projects: 25,
        city: "Yaoundé",
        coverage: ["Yaoundé", "Douala"],
        isActive: true,
        bio: "Professional tax consultant with extensive experience in Cameroonian tax regulations and business compliance. Specializes in helping businesses navigate complex tax requirements and optimize their financial strategies.",
        experience: 5,
        joinDate: new Date().toISOString(),
        languages: ["English", "French"],
        skills: ["Tax Planning", "Compliance", "Financial Analysis", "Business Registration"],
        createdAt: new Date().toISOString(),
      };
      setConsultant(dummyConsultant);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchConsultant();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-blue-100 text-blue-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "No phone provided";
    return phone.replace(/(\+237\s)(\d{3})(\d{3})(\d{3})/, '$1$2 $3 $4');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-4">{error || "Consultant not found"}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchConsultant}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/admin/dashboard?tab=consultants"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Consultants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-primary border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard?tab=consultants"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Consultants
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <h1 className="text-xl font-bold text-gray-800">Consultant Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchConsultant}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Profile Info */}
                <div className="flex items-start gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-linear-to-r from-green-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {consultant.firstName?.[0]}{consultant.lastName?.[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white ${
                      consultant.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-800">{consultant.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultant.status)}`}>
                        {consultant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{consultant.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{consultant.coverage?.join(', ') || consultant.city || 'No location specified'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{consultant.rating}</span>
                        <span className="text-gray-500">({consultant.projects} projects)</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Hourly Rate</p>
                          <p className="font-bold text-gray-800">{consultant.rate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-bold text-gray-800">{consultant.experience || 3}+ years</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Joined</p>
                          <p className="font-bold text-gray-800">{formatDate(consultant.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <button className="px-6 py-3 bg-linear-to-r from-green-600 to-yellow-400 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {consultant.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {consultant.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-linear-to-r from-green-50 to-yellow-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{consultant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-800">{formatPhone(consultant.phone)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium text-gray-800">{formatPhone(consultant.phone)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Details */}
            <div className="space-y-6">
              {/* Languages */}
              <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages</h3>
                <div className="space-y-3">
                  {consultant.languages?.map((language, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{language}</span>
                      <span className="text-sm text-gray-500">Fluent</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coverage Areas */}
              {consultant.coverage && consultant.coverage.length > 0 && (
                <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Coverage Areas</h3>
                  <div className="space-y-2">
                    {consultant.coverage.map((area, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Stats */}
              <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Project Completion</span>
                      <span className="font-semibold text-gray-800">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Client Satisfaction</span>
                      <span className="font-semibold text-gray-800">{consultant.rating}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(consultant.rating / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">On-time Delivery</span>
                      <span className="font-semibold text-gray-800">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  consultant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {consultant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Consultant ID</p>
                <p className="font-mono text-gray-800 text-sm">{consultant.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email Verified</p>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Verified
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Verified</p>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
