// components/dashboard/tabs/consultants/ConsultantsStats.tsx
import { UserCheck, CheckCircle, Clock, Star } from "lucide-react";

interface Consultant {
  id: string;
  status: "available" | "busy" | "offline";
  rating: number;
  projects: number;
  city?: string;
}

interface ConsultantsStatsProps {
  consultants: Consultant[];
}

export default function ConsultantsStats({ consultants }: ConsultantsStatsProps) {
  const stats = {
    totalConsultants: consultants.length,
    available: consultants.filter(c => c.status === 'available').length,
    totalProjects: consultants.reduce((sum, c) => sum + c.projects, 0),
    avgRating: (consultants.reduce((sum, c) => sum + c.rating, 0) / consultants.length).toFixed(1),
    cameroonCoverage: new Set(consultants.map(c => c.city)).size,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Consultants</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalConsultants}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-600" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Across {stats.cameroonCoverage} cities
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Available Now</p>
            <p className="text-2xl font-bold text-gray-800">{stats.available}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Ready for assignments
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Projects</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalProjects}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Completed this year
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg. Rating</p>
            <p className="text-2xl font-bold text-gray-800">{stats.avgRating} ⭐</p>
          </div>
          <Star className="w-8 h-8 text-yellow-600" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Customer satisfaction
        </div>
      </div>
    </div>
  );
}