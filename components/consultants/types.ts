export interface CoverageArea {
  region: string;
  cities: string[];
}

export interface NewConsultant {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  assignedCities: string[];
  coverageAreas?: CoverageArea[];
  status: boolean;
  hourlyRate?: number;
}

export interface Consultant {
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
