"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Lock, BarChart3, Globe, Headphones } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast Execution",
    description: "Advanced algorithms execute trades in milliseconds, ensuring you never miss an opportunity.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Bank-Level Security",
    description: "Your funds are held in segregated accounts with regulated brokers. We never touch your capital.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Proven Track Record",
    description: "Real-time performance data shows consistent gains with transparent, verifiable results.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Market Access",
    description: "Trade across multiple markets and currency pairs with 24/5 automated execution.",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Expert Support",
    description: "Our team is available around the clock to assist with any questions or concerns.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "No Hidden Fees",
    description: "Transparent profit-sharing model. We only succeed when you succeed.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="mobile-app-container md:w-[85vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-3 sm:mb-4">
            Why Choose Titans Trading?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Experience the difference that institutional-grade technology and transparent practices make.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div className="mobile-card crm-card p-5 sm:p-6 h-full interactive-element relative overflow-hidden">
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="text-cyan-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

