import { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/learning";
import LearningPageClient from "@/components/Learning/LearningPageClient";

export const metadata: Metadata = {
  title: "Learning Hub | Cameroon Tax Assistant",
  description:
    "Practical, plain-language guides to help you register your business, stay compliant on taxes, and set up merchant accounts in Cameroon.",
  openGraph: {
    title: "Learning Hub | Cameroon Tax Assistant",
    description:
      "Practical guides on registration, taxes, and merchant accounts in Cameroon.",
    type: "website",
  },
};

export default function LearningLandingPage() {
  const allPosts = getAllPostsMeta();
  return <LearningPageClient initialPosts={allPosts} />;
}
