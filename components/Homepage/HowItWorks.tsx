'use client'

import {
  ShieldCheck,
  MessageCircle,
  ClipboardList,
  } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    title: "You answer a few quick questions",
    desc: "Our simplified form helps you describe your needs. Most people finish the questions in under 90 seconds.",
  },
  {
    icon: ShieldCheck,
    title: "We review your needs",
    desc: "Your answers help us determine the right support for you.",
  },
  {
    icon: MessageCircle,
    title: "We link you to the right consultant.",
    desc: "We connect you directly with the best consultant to handle your situation.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t py-10 border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to get your business support started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-center items-center md:items-start"
            >
              <div className="w-14 h-14 bg-primaryColor rounded-xl flex items-center justify-center mb-6 text-primary">
                <Icon className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 text-center md:text-start">{title}</h3>
              <p className="text-slate-500 leading-relaxed text-center md:text-start">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
