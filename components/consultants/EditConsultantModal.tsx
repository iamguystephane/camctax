// components/consultants/EditConsultantModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserCheck,
    X,
    User,
    MessageSquare,
    MapPin,
    ToggleLeft,
    ToggleRight,
    Flag,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Save,
} from "lucide-react";
import { API_URL } from "@/API";
import { useToast } from "@/hooks/useToast";
import Loading from "../Loading";
import { Button } from "../ui/button";

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

interface EditConsultantModalProps {
    open: boolean;
    onClose: () => void;
    consultant: Consultant | null;
    onUpdate: (updatedConsultant: Consultant) => void;
}

export default function EditConsultantModal({
    open,
    onClose,
    consultant,
    onUpdate,
}: EditConsultantModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        hourlyRate: 50000,
        isActive: true,
        coverageAreas: [] as CoverageArea[],
    });

    useEffect(() => {
        if (consultant) {
            const nameParts = consultant.name.split(" ");
            setFormData({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: consultant.email || "",
                phone: consultant.phone || "",
                hourlyRate: consultant.hourlyRate || 50000,
                isActive: consultant.status === "available",
                coverageAreas: consultant.coverageAreas || [],
            });
        }
    }, [consultant]);

    const toggleRegionExpand = (regionKey: string) => {
        setExpandedRegions((prev) =>
            prev.includes(regionKey)
                ? prev.filter((r) => r !== regionKey)
                : [...prev, regionKey]
        );
    };

    const isRegionSelected = (regionKey: string) => {
        return formData.coverageAreas.some((area) => area.region === regionKey);
    };

    const getSelectedCitiesForRegion = (regionKey: string) => {
        const area = formData.coverageAreas.find((a) => a.region === regionKey);
        return area?.cities || [];
    };

    const toggleRegion = (regionKey: string) => {
        const regionData = CAMEROON_REGIONS[regionKey];
        if (!regionData) return;

        if (isRegionSelected(regionKey)) {
            const newAreas = formData.coverageAreas.filter((a) => a.region !== regionKey);
            setFormData({ ...formData, coverageAreas: newAreas });
        } else {
            const newAreas = [
                ...formData.coverageAreas,
                { region: regionKey, cities: [...regionData.cities] },
            ];
            setFormData({ ...formData, coverageAreas: newAreas });
            if (!expandedRegions.includes(regionKey)) {
                setExpandedRegions((prev) => [...prev, regionKey]);
            }
        }
    };

    const toggleCity = (regionKey: string, city: string) => {
        const regionData = CAMEROON_REGIONS[regionKey];
        if (!regionData) return;

        const existingArea = formData.coverageAreas.find((a) => a.region === regionKey);
        let newAreas: CoverageArea[];

        if (existingArea) {
            const citySelected = existingArea.cities.includes(city);
            if (citySelected) {
                const newCities = existingArea.cities.filter((c) => c !== city);
                if (newCities.length === 0) {
                    newAreas = formData.coverageAreas.filter((a) => a.region !== regionKey);
                } else {
                    newAreas = formData.coverageAreas.map((a) =>
                        a.region === regionKey ? { ...a, cities: newCities } : a
                    );
                }
            } else {
                newAreas = formData.coverageAreas.map((a) =>
                    a.region === regionKey ? { ...a, cities: [...a.cities, city] } : a
                );
            }
        } else {
            newAreas = [...formData.coverageAreas, { region: regionKey, cities: [city] }];
        }

        setFormData({ ...formData, coverageAreas: newAreas });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consultant) return;

        setIsSubmitting(true);

        try {
            const coverage = formData.coverageAreas.flatMap((a) =>
                a.cities.map((c) => `${c} (${CAMEROON_REGIONS[a.region]?.label})`)
            );

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                hourlyRate: formData.hourlyRate,
                isActive: formData.isActive,
                coverage,
                coverageAreas: formData.coverageAreas,
            };

            const res = await fetch(`${API_URL}/users/consultant/${consultant.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Failed to update consultant");
            }

            const updatedConsultant: Consultant = {
                ...consultant,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                rate: `FCFA ${formData.hourlyRate.toLocaleString()}/hr`,
                status: formData.isActive ? "available" : "offline",
                hourlyRate: formData.hourlyRate,
                coverageAreas: formData.coverageAreas,
                coverage,
                city: coverage[0] || "",
            };

            onUpdate(updatedConsultant);

            toast({
                title: "Success",
                description: "Consultant updated successfully",
                variant: "success",
            });

            onClose();
        } catch (err: any) {
            console.error("Update consultant error:", err);
            toast({
                title: "Error",
                description: err.message || "Failed to update consultant",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSelectedCities = formData.coverageAreas.reduce(
        (sum, area) => sum + area.cities.length,
        0
    );

    if (!consultant) return null;

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <UserCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Edit Consultant</h3>
                                        <p className="text-sm text-gray-600">Update consultant information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="consultant@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    <div className="flex items-center">
                                        <div className="px-4 py-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50 text-gray-700 flex items-center gap-2">
                                            <Flag className="w-4 h-4" />
                                            +237
                                        </div>
                                        <input
                                            type="tel"
                                            value={formData.phone.replace("+237 ", "").replace("+237", "")}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                if (val.length <= 9) {
                                                    setFormData({ ...formData, phone: `+237 ${val}` });
                                                }
                                            }}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="6XX XXX XXX"
                                            maxLength={9}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Hourly Rate (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="50000"
                                        min={0}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Coverage Areas
                                    </label>

                                    {formData.coverageAreas.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-blue-800">Selected Coverage</span>
                                                <span className="text-xs text-blue-600">
                                                    {formData.coverageAreas.length} regions, {totalSelectedCities} cities
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.coverageAreas.map((area) => (
                                                    <div
                                                        key={area.region}
                                                        className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-blue-200"
                                                    >
                                                        <span className="text-xs font-medium text-blue-700">
                                                            {CAMEROON_REGIONS[area.region]?.label}
                                                        </span>
                                                        <span className="text-xs text-blue-500">({area.cities.length})</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRegion(area.region)}
                                                            className="ml-1 text-blue-400 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                                        {Object.entries(CAMEROON_REGIONS).map(([regionKey, regionData]) => {
                                            const isSelected = isRegionSelected(regionKey);
                                            const isExpanded = expandedRegions.includes(regionKey);
                                            const selectedCities = getSelectedCitiesForRegion(regionKey);

                                            return (
                                                <div key={regionKey} className="border-b border-gray-100 last:border-b-0">
                                                    <div
                                                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""
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
                                                                className="w-4 h-4 text-blue-600 rounded"
                                                            />
                                                            <div>
                                                                <span className="font-medium text-gray-800">{regionData.label}</span>
                                                                {isSelected && (
                                                                    <span className="ml-2 text-xs text-blue-600">
                                                                        ({selectedCities.length}/{regionData.cities.length} cities)
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

                                                    {isExpanded && (
                                                        <div className="bg-gray-50 px-3 pb-3">
                                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                                {regionData.cities.map((city) => {
                                                                    const isCitySelected = selectedCities.includes(city);
                                                                    return (
                                                                        <label
                                                                            key={city}
                                                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm ${isCitySelected
                                                                                ? "bg-blue-100 border border-blue-300"
                                                                                : "bg-white border border-gray-200 hover:border-blue-200"
                                                                                }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isCitySelected}
                                                                                onChange={() => toggleCity(regionKey, city)}
                                                                                className="w-3 h-3 text-blue-600 rounded"
                                                                            />
                                                                            <span className={isCitySelected ? "text-blue-800" : "text-gray-700"}>
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
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Account Status</label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.isActive
                                                ? "Consultant is active and can receive leads"
                                                : "Consultant is suspended"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className="flex items-center gap-2"
                                    >
                                        {formData.isActive ? (
                                            <>
                                                <span className="text-sm font-medium text-green-600">Active</span>
                                                <ToggleRight className="w-10 h-10 text-green-500" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium text-gray-600">Inactive</span>
                                                <ToggleLeft className="w-10 h-10 text-gray-400" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Loading />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
