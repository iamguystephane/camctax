'use client'

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState as useStates } from '@/hooks/useState';

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "Who is this for?",
    answer: (
      <div className="space-y-3">
        <p>This service is for you if:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>You run a small or informal business and want to make it official</li>
          <li>You're registered but unsure about tax obligations or records</li>
          <li>You were told you need "documents" but don't know which ones</li>
          <li>You want a Mobile Money merchant account and keep getting blocked</li>
          <li>You're tired of conflicting advice and trial-and-error</li>
        </ul>
        <p className="text-slate-500 italic">If you're unsure where you fit, that's fine—we'll guide you.</p>
      </div>
    ),
  },
  {
    question: "Do I need to already know what documents I need?",
    answer: "No. That's the point. We help you figure that out.",
  },
  {
    question: "Is this only for registered businesses?",
    answer: "No. We work with informal businesses, new businesses, and registered SMEs.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. You just answer a few questions and continue on WhatsApp.",
  },
  {
    question: "How do I pay for services?",
    answer: "Pricing depends on what you need. This first step helps us understand your situation before providing accurate cost estimates.",
  },
  {
    question: "How fast will I get a response?",
    answer: "You'll be connected on WhatsApp immediately. Response time depends on volume, but your request will already be clear and structured.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

     const { setOnboardingData } = useStates();
     const handleLeadSource = () => {
       setOnboardingData((prev) => ({
         ...prev,
         leadSource: {
           sourceDetail: `Landing_page_faq_section`,
         },
       }));
     };

  return (
    <section id="faq" className="py-10 border-t bg-gradient-to-br from-primaryColor via-secondaryColor to-primaryColor overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map(({ question, answer }, i) => {
            const isOpen = i === openIndex;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm"
              >
                <button
                  onClick={() => toggleIndex(i)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center p-6 text-left text-slate-900 font-semibold rounded-2xl focus:outline-none focus-visible:ring focus-visible:ring-blue-400"
                >
                  <span>{question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden px-6 pb-6 text-slate-600"
                    >
                      {typeof answer === "string" ? <p>{answer}</p> : answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
           Speak with a consultant
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/start" onClick={handleLeadSource}>
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            </div>
          <p className="mt-8 text-lg text-slate-600 font-medium">
            Clear guidance. Real support.
          </p>
        </div>
      </div>
    </section>
  );
}
