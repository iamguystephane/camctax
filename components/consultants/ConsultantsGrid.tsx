// components/dashboard/tabs/consultants/ConsultantsGrid.tsx
import ConsultantCard from "./ConsultantsCard";

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

interface ConsultantsGridProps {
  consultants: Consultant[];
  searchQuery: string;
  onEditConsultant?: (consultant: Consultant) => void;
}

export default function ConsultantsGrid({ consultants, searchQuery, onEditConsultant }: ConsultantsGridProps) {
  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (consultant.city && consultant.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredConsultants.map((consultant) => (
        <ConsultantCard
          key={consultant.id}
          consultant={consultant}
          onEdit={onEditConsultant}
        />
      ))}
    </div>
  );
}