"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/lib/learning";

const CATEGORY_LABELS: Record<Category | "all", string> = {
  all: "All Categories",
  registration: "Registration",
  taxes: "Taxes",
  "merchant-accounts": "Merchant Accounts",
  compliance: "Compliance",
};

type Props = {
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
};

export default function CategoryFilter({ selectedCategory, onCategoryChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const categories: (Category | "all")[] = ["all", "registration", "taxes", "merchant-accounts", "compliance"];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-secondaryColor transition-colors shadow-sm"
      >
        <span>{CATEGORY_LABELS[selectedCategory]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-secondaryColor/10 text-green-300 font-medium"
                    : "text-slate-700 hover:bg-secondaryColor"
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


