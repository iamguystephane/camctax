// components/dashboard/tabs/ConsultantsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/API";
import ConsultantsHeader from "../../consultants/ConsultantsHeader";
import ConsultantsStats from "../../consultants/ConsultantsStats";
import ConsultantsCoverage from "../../consultants/ConsultantsCoverage";
import ConsultantsGrid from "../../consultants/ConsultantsGrid";
import AddConsultantModal from "../../consultants/AddConsultantModal";
import EditConsultantModal from "../../consultants/EditConsultantModal";

interface ConsultantsTabProps {
  searchQuery: string;
}

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

type APIUser = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  coverage?: string[];
  coverageAreas?: CoverageArea[];
  hourlyRate?: number;
  isActive?: boolean;
};

interface NewConsultant {
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

export default function ConsultantsTab({ searchQuery }: ConsultantsTabProps) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/users/get-all-consultants`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.message || "Failed to fetch consultants");
        const users: APIUser[] = json.data || [];
        const mapped = users.map((u: APIUser) => ({
          id: u._id || u.id || "",
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          specialty: "Consultant",
          email: u.email || "",
          phone: u.phone || "",
          rate: u.hourlyRate ? `FCFA ${u.hourlyRate.toLocaleString()}/hr` : "FCFA 50,000/hr",
          status: (u.isActive ? "available" : "offline") as "available" | "offline",
          rating: 0,
          projects: 0,
          city: (u.coverage && u.coverage[0]) || "",
          coverage: u.coverage || [],
          coverageAreas: u.coverageAreas || [],
          hourlyRate: u.hourlyRate || 50000,
          isActive: u.isActive,
        }));
        setConsultants(mapped);
      } catch (err: unknown) {
        console.error("Error fetching consultants", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const [newConsultant, setNewConsultant] = useState<NewConsultant>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "+237 6",
    assignedCities: [],
    coverageAreas: [],
    status: true,
    hourlyRate: 50000,
  });

  const handleAddConsultant = (consultantData: Consultant) => {
    setConsultants((prev) => [consultantData, ...prev]);
  };

  const handleEditConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setEditModalOpen(true);
  };

  const handleUpdateConsultant = (updatedConsultant: Consultant) => {
    setConsultants((prev) =>
      prev.map((c) => (c.id === updatedConsultant.id ? updatedConsultant : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ConsultantsHeader onAddClick={() => setOpenModal(true)} />
        {loading && (
          <div className="text-sm text-gray-500">Loading consultants…</div>
        )}
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <ConsultantsCoverage consultants={consultants} />

      <ConsultantsStats consultants={consultants} />

      <ConsultantsGrid
        consultants={consultants}
        searchQuery={searchQuery}
        onEditConsultant={handleEditConsultant}
      />

      <AddConsultantModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        newConsultant={newConsultant}
        setNewConsultant={setNewConsultant}
        onAddConsultant={handleAddConsultant}
      />

      <EditConsultantModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedConsultant(null);
        }}
        consultant={selectedConsultant}
        onUpdate={handleUpdateConsultant}
      />
    </div>
  );
}
