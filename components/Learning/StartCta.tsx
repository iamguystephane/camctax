"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "@/hooks/useState";

type Props = {
  leadSourceDetail: string;
  intentPrimary?: "merchant_account" | "tax_records" | "registration_fix";
  className?: string;
};

export default function StartCta({
  leadSourceDetail,
  intentPrimary,
  className,
}: Props) {
  const params = new URLSearchParams();
  params.set("lead_source_detail", leadSourceDetail);
  if (intentPrimary) params.set("intent_primary", intentPrimary);
  const href = `/start?${params.toString()}`;

  const { setOnboardingData } = useState();
  const SaveLeadSource = () => {
    setOnboardingData((prev) => ({
      ...prev,
      leadSource: {
        sourceDetail: leadSourceDetail,
        intentPrimary: intentPrimary as
          | "merchant_account"
          | "tax_records"
          | "registration_fix",
      },
    }));
  };
  return (
    <div className={className}>
      <Link href={href} className="w-full sm:w-auto">
        <Button
          size="lg"
          onClick={SaveLeadSource}
          className="w-full sm:w-auto px-10 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
        >
          Start Here
        </Button>
      </Link>
    </div>
  );
}
