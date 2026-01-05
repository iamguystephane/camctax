// components/dashboard/tabs/consultants/ConsultantCard.tsx
import { UserCheck, Mail, MessageSquare, MapPin, Star, Eye, Edit } from "lucide-react";
import Link from "next/link";

interface CoverageArea {
  region: string;
  cities: string[];
}

interface Consultant {
  id: string;
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
  coverageAreas?: CoverageArea[];
  hourlyRate?: number;
  isActive?: boolean;
}

interface ConsultantCardProps {
  consultant: Consultant;
  onEdit?: (consultant: Consultant) => void;
}

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

const formatPhoneForDisplay = (phone: string) => {
  if (phone.length >= 9) {
    return phone.replace(/(\+237\s)(\d{3})(\d{3})(\d{3})/, '$1$2 $3 $4');
  }
  return phone;
};

export default function ConsultantCard({ consultant, onEdit }: ConsultantCardProps) {
  return (
    <div className="bg-secondary rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-r from-green-100 to-yellow-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{consultant.name}</h3>
            <p className="text-sm text-gray-600">{consultant.specialty}</p>
            {consultant.city && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">{consultant.city}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-1.5 hover:bg-blue-100 rounded-lg"
            onClick={() => onEdit?.(consultant)}
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{consultant.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare className="w-4 h-4" />
          <span>{formatPhoneForDisplay(consultant.phone)}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultant.status)}`}>
              {consultant.status}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{consultant.rating}</span>
              <span className="text-xs text-gray-500">({consultant.projects} projects)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{consultant.rate}</p>
            <p className="text-xs text-gray-500">hourly rate</p>
          </div>
        </div>
  </div>

  <Link
    href={`/consultant/${consultant.id}`}
    className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-all flex items-center justify-center"
  >
    View Profile
  </Link>
</div>
  );
}
