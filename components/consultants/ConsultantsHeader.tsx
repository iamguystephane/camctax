// components/dashboard/tabs/consultants/ConsultantsHeader.tsx
import { Flag, Filter, Plus } from "lucide-react";

interface ConsultantsHeaderProps {
  onAddClick: () => void;
}

export default function ConsultantsHeader({ onAddClick }: ConsultantsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flag className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cameroon Consultant Management</h2>
        </div>
        <p className="text-gray-600">Manage consultants across Cameroon</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:shadow-lg transition-all"
          onClick={onAddClick}
        >
          <Plus className="w-4 h-4" />
          Add Consultant
        </button>
      </div>
    </div>
  );
}