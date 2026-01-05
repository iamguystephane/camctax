"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Plus, MapPin, Mail, Phone, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

// Mock consultants data
const mockConsultants = [
  {
    _id: "consultant-1",
    fullName: "John Doe",
    username: "john.doe@example.com",
    whatsappPhoneE164: "+237672280977",
    assignedCities: ["Douala", "Yaoundé"],
    isActive: true,
    role: "consultant" as const,
  },
  {
    _id: "consultant-2",
    fullName: "Jane Smith",
    username: "jane.smith@example.com",
    whatsappPhoneE164: "+237677123456",
    assignedCities: ["Bafoussam", "Bamenda"],
    isActive: true,
    role: "consultant" as const,
  },
  {
    _id: "consultant-3",
    fullName: "Mike Johnson",
    username: "mike.johnson@example.com",
    whatsappPhoneE164: "+237678901234",
    assignedCities: ["Buea"],
    isActive: false,
    role: "consultant" as const,
  },
];

const CITIES = ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Buea"];

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState(mockConsultants);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleActive = (consultantId: string) => {
    setConsultants((prev) =>
      prev.map((c) =>
        c._id === consultantId ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consultants</h1>
          <p className="text-slate-500 mt-1">Manage consultant accounts and city assignments</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-black hover:bg-black/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Consultant
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create New Consultant</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Email (Username)
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="+237672280977"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Assigned Cities
                    </label>
                    <select
                      multiple
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent min-h-25"
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Hold Ctrl/Cmd to select multiple
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-black hover:bg-black/90">
                    Create Consultant
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Consultants List */}
      <div className="grid gap-4">
        {consultants.map((consultant, index) => (
          <motion.div
            key={consultant._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCog className="w-5 h-5 text-slate-400" />
                      {consultant.fullName}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {consultant.username}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {consultant.whatsappPhoneE164}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {consultant.isActive ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                      Assigned Cities:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {consultant.assignedCities.map((city) => (
                      <span
                        key={city}
                        className="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(consultant._id)}
                  >
                    {consultant.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

