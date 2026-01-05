// components/dashboard/tabs/consultants/AddConsultantModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  X,
  User,
  Lock,
  MessageSquare,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Flag,
  Copy,
  Plus,
} from "lucide-react";
import ConsultantForm from "./ConsultantForm";

import { API_URL } from "@/API";
import { useToast } from "@/hooks/useToast";

interface NewConsultant {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  assignedCities: string[];
  status: boolean; // active
}

interface AddConsultantModalProps {
  open: boolean;
  onClose: () => void;
  newConsultant: NewConsultant;
  setNewConsultant: React.Dispatch<React.SetStateAction<NewConsultant>>;
  onAddConsultant: (consultant: any) => void;
}

export default function AddConsultantModal({
  open,
  onClose,
  newConsultant,
  setNewConsultant,
  onAddConsultant,
}: AddConsultantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // MVP: limit to the 5 primary city coverages and allow multiple selection
  const cameroonCities = [
    "Yaoundé (Centre)",
    "Douala (Littoral)",
    "Bamenda (Northwest)",
    "Bafoussam (West)",
    "Garoua (North)",
    "Limbe (Southwest)",
    "Maroua (Far North)",
    "Nkongsamba (Littoral)",
    "Ebolowa (South)",
    "Bertoua (East)",
    "Buea (Southwest)",
    "Kribi (South)",
    "Kumba (Southwest)",
    "Foumban (West)",
    "Dschang (West)",
    "Ngoundéré (Adamawa)",
  ];

  const { toast } = useToast();

  const handleInputChange = (
    field: keyof NewConsultant,
    value: string | boolean | string[]
  ) => {
    setNewConsultant({
      ...newConsultant,
      [field]: value,
    } as any);
  };

  const toggleCity = (city: string) => {
    const cities = newConsultant.assignedCities || [];
    if (cities.includes(city)) {
      handleInputChange(
        "assignedCities",
        cities.filter((c) => c !== city)
      );
    } else {
      handleInputChange("assignedCities", [...cities, city]);
    }
  };

  const handlePhoneChange = (value: string) => {
    let formatted = value.replace(/\D/g, "");

    if (formatted.startsWith("237")) {
      formatted = formatted.slice(3);
    }

    if (formatted.length > 0) {
      formatted = "+237 " + formatted;
    }

    if (formatted.length <= 14) {
      handleInputChange("phone", formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        firstName: newConsultant.firstName,
        lastName: newConsultant.lastName,
        email: newConsultant.email,
        password: newConsultant.password,
        phone: newConsultant.phone,
        role: "consultant",
        coverage: newConsultant.assignedCities || [],
        isActive: newConsultant.status,
      };

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("Failed to create consultant:", json);
        toast({
          title: "Error",
          description: json.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const user = json.data.user;

      const newConsultantData = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        specialty: "Consultant",
        email: user.email,
        phone: user.phone,
        rate: "FCFA 50,000/hr",
        status: user.isActive ? "available" : "offline",
        rating: 0,
        projects: 0,
        city: (user.coverage && user.coverage[0]) || "",
      };

      onAddConsultant(newConsultantData);

      toast({
        title: "Success",
        description: json.message,
        variant: "success",
      });

      // Reset form
      setNewConsultant({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "+237 6",
        assignedCities: [],
        status: true,
      });

      onClose();
    } catch (err) {
      console.error("Create consultant error", err);
      toast({
        title: "Error",
        description: "Failed to create consultant due to internal server error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewConsultant({ ...newConsultant, password });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }; // use with newConsultant.password

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4"
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
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Add New Consultant
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          Cameroon
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Register consultant for Cameroon operations
                      </p>
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

              <ConsultantForm
                newConsultant={newConsultant}
                cameroonCities={cameroonCities}
                isSubmitting={isSubmitting}
                copied={copied}
                onInputChange={handleInputChange}
                onPhoneChange={handlePhoneChange}
                onGeneratePassword={generatePassword}
                onCopyPassword={copyToClipboard}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
