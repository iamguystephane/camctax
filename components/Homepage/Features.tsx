'use client'

import { ShieldCheck, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="services" className="overflow-hidden py-10 bg-linear-to-br from-primaryColor via-secondaryColor to-primaryColor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            What We Do
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Business Registration",
              desc: "We help you register a new business or update an existing registration.",
            },
            {
              icon: TrendingUp,
              title: "Tax Assistance & Declaration",
              desc: "We provide technical advice on Cameroon's tax system and assist with declaring your monthly and quarterly taxes.",
            },
            {
              icon: Users,
              title: "Bank/Merchant Accounts",
              desc: "We get your business ready for Bank/Merchant Account approval.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-center items-center md:items-start"
            >
              
                <div className="w-14 h-14 bg-primaryColor rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-7 h-7 text-green-500" />
                </div>
              
              <h3 className="text-xl font-bold mb-3 text-slate-900 text-center md:text-left">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-center md:text-left">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
          <p className="col-span-3 text-center text-slate-600 mt-8 text-lg font-medium max-w-3xl mx-auto">
            Whether you’re just starting or already operating, we help you take the right next step and ensure you spend as little money as possible to be compliant.
          </p>
      </div>
    </section>
  );
}
