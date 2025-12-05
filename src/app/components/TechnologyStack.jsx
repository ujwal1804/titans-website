"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Network, Shield, Zap, BarChart } from "lucide-react";

const technologies = [
  {
    icon: <Cpu className="w-8 h-8" />,
    name: "MQL5 Algorithms",
    description: "Advanced MetaTrader 5 programming for precise trade execution",
  },
  {
    icon: <Database className="w-8 h-8" />,
    name: "Real-Time Data",
    description: "Live market data feeds with millisecond latency",
  },
  {
    icon: <Network className="w-8 h-8" />,
    name: "Cloud Infrastructure",
    description: "Scalable, reliable cloud-based trading infrastructure",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    name: "Risk Management",
    description: "Multi-layer risk controls and position sizing algorithms",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    name: "High-Speed Execution",
    description: "Sub-millisecond order execution for optimal entry/exit",
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    name: "Performance Analytics",
    description: "Comprehensive tracking and analysis of all trades",
  },
];

export default function TechnologyStack() {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mobile-app-container md:w-[85vw] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-3 sm:mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Built on cutting-edge infrastructure designed for institutional-grade performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div className="mobile-card crm-card p-6 sm:p-7 md:p-8 h-full interactive-element relative overflow-hidden">
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="text-cyan-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                    {tech.name}
                  </h3>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    {tech.description}
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

