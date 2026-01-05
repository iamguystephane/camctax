import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/lib/learning";
import { ArrowRight, FileText, BookOpen, Receipt, CreditCard, Shield } from "lucide-react";

const LABELS: Record<Category, string> = {
  registration: "Registration",
  taxes: "Taxes",
  "merchant-accounts": "Merchant Accounts",
  compliance: "Compliance",
};

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  registration: "Business registration and compliance documents",
  taxes: "Tax records, declarations, and compliance",
  "merchant-accounts": "Mobile money and payment account setup",
  compliance: "Ongoing compliance requirements and best practices",
};

const CATEGORY_ICONS: Record<Category, typeof FileText> = {
  registration: FileText,
  taxes: Receipt,
  "merchant-accounts": CreditCard,
  compliance: Shield,
};

const CATEGORY_COLORS: Record<Category, { bg: string; icon: string; hover: string }> = {
  registration: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    hover: "group-hover:bg-blue-100",
  },
  taxes: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    hover: "group-hover:bg-emerald-100",
  },
  "merchant-accounts": {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    hover: "group-hover:bg-purple-100",
  },
  compliance: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    hover: "group-hover:bg-amber-100",
  },
};

export default function CategoryTile({ category, count }: { category: Category; count: number }) {
  const Icon = CATEGORY_ICONS[category];

  return (
    <Link href={`/learning/${category}`} className="block h-full group">
      <Card className="h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 bg-white border-slate-200/80 overflow-hidden flex flex-col">
        <CardHeader className="pb-4 pt-6 text-center flex flex-col items-center justify-center flex-1">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
              <Icon className="w-8 h-8 text-slate-900 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold text-slate-900 group-hover:text-primary transition-colors mb-2 text-center w-full">
            {LABELS[category]}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col items-center text-center">
          <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed text-center w-full">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
          <div className="flex items-center justify-center pt-4 border-t border-slate-100 w-full">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {count} article{count === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
