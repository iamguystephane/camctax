// components/dashboard/tabs/consultants/ConsultantsCoverage.tsx
import { MapPin } from "lucide-react";

interface Consultant {
  id: string;
  name: string;
  city?: string;
}

interface ConsultantsCoverageProps {
  consultants: Consultant[];
}

const cameroonRegions = [
  { name: "Centre", capital: "Yaoundé" },
  { name: "Littoral", capital: "Douala" },
  { name: "Northwest", capital: "Bamenda" },
  { name: "West", capital: "Bafoussam" },
  { name: "North", capital: "Garoua" },
  { name: "Far North", capital: "Maroua" },
  { name: "Adamawa", capital: "Ngaoundéré" },
  { name: "East", capital: "Bertoua" },
  { name: "South", capital: "Ebolowa" },
  { name: "Southwest", capital: "Buea" },
];

export default function ConsultantsCoverage({ consultants }: ConsultantsCoverageProps) {
  return (
    <div className="bg-linear-to-r from-green-50 to-yellow-50 border border-green-200 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-green-600" />
        Cameroon Coverage
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cameroonRegions.slice(0, 10).map((region) => {
          const regionConsultants = consultants.filter(c => 
            c.city?.toLowerCase().includes(region.capital.toLowerCase())
          ).length;
          return (
            <div key={region.name} className="p-3 bg-white/80 rounded-xl border border-green-100">
              <p className="text-sm font-medium text-gray-800">{region.name}</p>
              {/* <p className="text-xs text-gray-600 mb-2">{region.capital}</p> */}
              <p className="text-lg font-bold text-green-700">{regionConsultants}</p>
              <p className="text-xs text-gray-500">consultants</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}