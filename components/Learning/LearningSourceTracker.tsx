"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useState } from "@/hooks/useState";

interface Props {
  slug: string;
  category?: string;
}

export default function LearningSourceTracker({ slug, category }: Props) {
  const pathname = usePathname();
  const { setOnboardingData } = useState();

  useEffect(() => {
    // Set the sourceDetail based on the current learning page
    let sourceDetail = "";
    
    if (category) {
      // This is a category page
      sourceDetail = `learning_category_${category}`;
    } else {
      // This is an article page
      sourceDetail = `learning_article_${slug}`;
    }

    setOnboardingData((prev) => ({
      ...prev,
      leadSource: {
        sourceDetail,
        intentPrimary: prev.leadSource?.intentPrimary || "merchant_account",
      },
    }));
  }, [slug, category, pathname, setOnboardingData]);

  // This component doesn't render anything visible
  return null;
}
