import HomeHero from "@/components/Homepage/hero";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import Features from "@/components/Homepage/Features";
import HowItWorks from "@/components/Homepage/HowItWorks";
import TrustSection from "@/components/Homepage/WhyTrustUs";
import FAQSection from "@/components/Homepage/FAQ";
import ProblemStatement from "@/components/Homepage/ProblemStatement";

export const metadata: Metadata = {
  title: "Cameroon Tax Assistant - Your AI-Powered Tax Filing Companion",
  description:
    "Simplify your tax filing process with Tax Assistant, an AI-powered tool designed to help you navigate tax forms, maximize deductions, and ensure compliance with ease.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Nav />
      <HomeHero />
      {/* <ProblemStatement /> */}
      <Features />
      <HowItWorks />
      <FAQSection />
      {/* <TrustSection /> */}
      <Footer />
    </div>
  );
}
