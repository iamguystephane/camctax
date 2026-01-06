// components/dashboard/tabs/consultants/ConsultantForm.tsx
import { useState } from "react";
import {
  User,
  Lock,
  MessageSquare,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Flag,
  Copy,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Loading from "../Loading";
import { Button } from "../ui/button";

// Cameroon Regions with their major cities
const CAMEROON_REGIONS: Record<string, { label: string; cities: string[] }> = {
  littoral: {
    label: "Littoral",
    cities: ["Douala", "Edea", "Nkongsamba", "Loum", "Mbanga"],
  },
  centre: {
    label: "Centre",
    cities: ["Yaoundé", "Mbalmayo", "Obala", "Eseka", "Nanga Eboko"],
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
    cities: ["Ngaoundéré", "Meiganga", "Tibati", "Banyo"],
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

import { CoverageArea, NewConsultant } from "./types";

interface ConsultantFormProps {
  newConsultant: NewConsultant;
  cameroonCities: string[];
  isSubmitting: boolean;
  copied: boolean;
  onInputChange: (
    field: keyof NewConsultant,
    value: string | number | boolean | string[] | CoverageArea[]
  ) => void;
  onPhoneChange: (value: string) => void;
  onGeneratePassword: () => void;
  onCopyPassword: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ConsultantForm({
  newConsultant,
  cameroonCities,
  isSubmitting,
  copied,
  onInputChange,
  onPhoneChange,
  onGeneratePassword,
  onCopyPassword,
  onSubmit,
  onCancel,
}: ConsultantFormProps) {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const coverageAreas = newConsultant.coverageAreas || [];

  const toggleRegionExpand = (regionKey: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionKey)
        ? prev.filter((r) => r !== regionKey)
        : [...prev, regionKey]
    );
  };

  const isRegionSelected = (regionKey: string) => {
    return coverageAreas.some((area) => area.region === regionKey);
  };

  const getSelectedCitiesForRegion = (regionKey: string) => {
    const area = coverageAreas.find((a) => a.region === regionKey);
    return area?.cities || [];
  };

  const toggleRegion = (regionKey: string) => {
    const regionData = CAMEROON_REGIONS[regionKey];
    if (!regionData) return;

    if (isRegionSelected(regionKey)) {
      // Remove region
      const newAreas = coverageAreas.filter((a) => a.region !== regionKey);
      onInputChange("coverageAreas", newAreas);
      // Also update legacy assignedCities
      const allCities = newAreas.flatMap((a) =>
        a.cities.map((c) => `${c} (${CAMEROON_REGIONS[a.region]?.label})`)
      );
      onInputChange("assignedCities", allCities);
    } else {
      // Add region with all cities selected by default
      const newAreas = [
        ...coverageAreas,
        { region: regionKey, cities: [...regionData.cities] },
      ];
      onInputChange("coverageAreas", newAreas);
      // Expand the region to show cities
      if (!expandedRegions.includes(regionKey)) {
        setExpandedRegions((prev) => [...prev, regionKey]);
      }
      // Also update legacy assignedCities
      const allCities = newAreas.flatMap((a) =>
        a.cities.map((c) => `${c} (${CAMEROON_REGIONS[a.region]?.label})`)
      );
      onInputChange("assignedCities", allCities);
    }
  };

  const toggleCity = (regionKey: string, city: string) => {
    const regionData = CAMEROON_REGIONS[regionKey];
    if (!regionData) return;

    const existingArea = coverageAreas.find((a) => a.region === regionKey);
    let newAreas: CoverageArea[];

    if (existingArea) {
      const citySelected = existingArea.cities.includes(city);
      if (citySelected) {
        // Remove city
        const newCities = existingArea.cities.filter((c) => c !== city);
        if (newCities.length === 0) {
          // Remove entire region if no cities left
          newAreas = coverageAreas.filter((a) => a.region !== regionKey);
        } else {
          newAreas = coverageAreas.map((a) =>
            a.region === regionKey ? { ...a, cities: newCities } : a
          );
        }
      } else {
        // Add city
        newAreas = coverageAreas.map((a) =>
          a.region === regionKey ? { ...a, cities: [...a.cities, city] } : a
        );
      }
    } else {
      // Add new region with this city
      newAreas = [...coverageAreas, { region: regionKey, cities: [city] }];
    }

    onInputChange("coverageAreas", newAreas);
    // Also update legacy assignedCities
    const allCities = newAreas.flatMap((a) =>
      a.cities.map((c) => `${c} (${CAMEROON_REGIONS[a.region]?.label})`)
    );
    onInputChange("assignedCities", allCities);
  };

  const totalSelectedCities = coverageAreas.reduce(
    (sum, area) => sum + area.cities.length,
    0
  );

  return (
    <form onSubmit={onSubmit} className="p-6">
      <div className="space-y-6">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              First Name *
            </label>
            <input
              type="text"
              value={newConsultant.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="First name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Last Name
            </label>
            <input
              type="text"
              value={newConsultant.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Email *
          </label>
          <input
            type="email"
            value={newConsultant.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="consultant@example.com"
            required
          />
          <p className="text-xs text-gray-500">
            Login email for the consultant
          </p>
        </div>

        {/* Temporary Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Temporary Password *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onGeneratePassword}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Generate
              </button>
              {newConsultant.password && (
                <button
                  type="button"
                  onClick={() => onCopyPassword(newConsultant.password)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={newConsultant.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
            placeholder="Click Generate to create password"
            required
          />
          <p className="text-xs text-gray-500">
            Share this securely with the consultant. They must change it on
            first login.
          </p>
        </div>

        {/* WhatsApp Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            WhatsApp Phone Number *
          </label>
          <div className="flex items-center">
            <div className="px-4 py-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50 text-gray-700 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              +237
            </div>
            <input
              type="tel"
              value={newConsultant.phone.replace("+237 ", "")}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="6XX XXX XXX"
              maxLength={9}
              required
            />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="font-medium">Format:</span> +237 6XX XXX XXX (9
            digits)
          </div>
        </div>

        {/* Coverage Areas - Multi-Region/City Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Coverage Areas (Regions & Cities) *
          </label>

          {/* Selected Coverage Summary */}
          {coverageAreas.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">
                  Selected Coverage
                </span>
                <span className="text-xs text-green-600">
                  {coverageAreas.length} regions, {totalSelectedCities} cities
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {coverageAreas.map((area) => (
                  <div
                    key={area.region}
                    className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-green-200"
                  >
                    <span className="text-xs font-medium text-green-700">
                      {CAMEROON_REGIONS[area.region]?.label}
                    </span>
                    <span className="text-xs text-green-500">
                      ({area.cities.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRegion(area.region)}
                      className="ml-1 text-green-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Region List with Expandable Cities */}
          <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            {Object.entries(CAMEROON_REGIONS).map(([regionKey, regionData]) => {
              const isSelected = isRegionSelected(regionKey);
              const isExpanded = expandedRegions.includes(regionKey);
              const selectedCities = getSelectedCitiesForRegion(regionKey);

              return (
                <div key={regionKey} className="border-b border-gray-100 last:border-b-0">
                  {/* Region Header */}
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-green-50" : ""
                      }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1"
                      onClick={() => toggleRegion(regionKey)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRegion(regionKey)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          {regionData.label}
                        </span>
                        {isSelected && (
                          <span className="ml-2 text-xs text-green-600">
                            ({selectedCities.length}/{regionData.cities.length}{" "}
                            cities)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleRegionExpand(regionKey)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Cities List (Expandable) */}
                  {isExpanded && (
                    <div className="bg-gray-50 px-3 pb-3">
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {regionData.cities.map((city) => {
                          const isCitySelected = selectedCities.includes(city);
                          return (
                            <label
                              key={city}
                              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm ${isCitySelected
                                  ? "bg-green-100 border border-green-300"
                                  : "bg-white border border-gray-200 hover:border-green-200"
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isCitySelected}
                                onChange={() => toggleCity(regionKey, city)}
                                className="w-3 h-3 text-green-600 rounded"
                              />
                              <span
                                className={
                                  isCitySelected
                                    ? "text-green-800"
                                    : "text-gray-700"
                                }
                              >
                                {city}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Select regions, then customize cities within each region
            </span>
            <span>
              {Object.keys(CAMEROON_REGIONS).length} regions available
            </span>
          </div>
        </div>

        {/* Active/Inactive Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Account Status
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {newConsultant.status
                  ? "Consultant can login immediately"
                  : "Account created but login disabled"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onInputChange("status", !newConsultant.status)}
              className="flex flex-col items-center"
            >
              {newConsultant.status ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">
                      Active
                    </span>
                    <div className="relative">
                      <ToggleRight className="w-12 h-12 text-green-500" />
                      <div className="absolute top-1/2 right-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 mt-1">
                    ● Ready for work
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Inactive
                    </span>
                    <div className="relative">
                      <ToggleLeft className="w-12 h-12 text-gray-400" />
                      <div className="absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">
                    ● Onboarding phase
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Note:</span> Consultant will receive
          welcome email with login instructions
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loading />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Consultant
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
