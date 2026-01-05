'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";
import { useState } from "@/hooks/useState";

export default function TrustSection() {
  const { setOnboardingData } = useState();

  const handleLeadSource = () => {
    setOnboardingData((prev) => ({
      ...prev,
      leadSource: {
        sourceDetail: `homepage_hero_section_page_end`,
      },
    }));
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              Why businesses trust us
            </h2>
            <div className="space-y-4">
              {[
                "Expertise in OHADA accounting standards",
                "Direct relationships with tax administration offices",
                "Transparent pricing - no hidden 'facilitation' fees",
                "Digital-first approach - track everything online",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-lg text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/start" onClick={handleLeadSource}>
                <Button size="lg" className="h-12 px-8 font-semibold">
                  Speak with a Consultant
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* Abstract visual representation of dashboard/documents */}
            <div className="aspect-square rounded-2xl bg-linear-to-tr from-slate-100 to-slate-50 border border-slate-200 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-size-[32px_32px]" />
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 absolute top-12 left-12 right-0 bottom-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-20 bg-slate-50 rounded-lg w-full animate-pulse delay-75" />
                  <div className="h-20 bg-slate-50 rounded-lg w-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
