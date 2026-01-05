"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "@/hooks/useState";

export default function HomeHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const { setOnboardingData } = useState();
  const handleLeadSource = () => {
    setOnboardingData((prev) => ({
      ...prev,
      leadSource: {
        sourceDetail: `homepage_hero_section_page_start`,
      },
    }));
  };

  return (
    <main className="grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden lg:min-h-screen pt-16 pb-24 lg:pt-22">
        <div className="">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-primaryColor via-secondaryColor to-primaryColor overflow-hidden text-black text-sm font-bold mb-8 border border-blue-100 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Find a competent and verified consultant
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Make your business{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                legal {" "}
              </span>
              and {" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-green-500">
                compliant
              </span>
              . Get accurate tax advice.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              We help entrepreneurs and small businesses register
              properly, file taxes, manage their records, and understand Cameroon's business/compliant environment.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            >
              <Link
                href='/start'
                className="w-full sm:w-auto"
                onClick={handleLeadSource}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg h-14 px-20! rounded-xl shadow-sm shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold border border-white/20"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-2">No accounts. No long forms.</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-125 h-125 bg-blue-100/50 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-125 h-125 bg-green-100/50 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-blob animation-delay-2000"></div>
        </div>
      </section>
    </main>
  );
}
