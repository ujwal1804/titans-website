"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PageHero({ title, subtitle, className = "" }) {
  return (
    <section className={`relative pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-24 overflow-hidden ${className}`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-left">
          {/* Badge/Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 backdrop-blur-sm border border-cyan-400/30 rounded-full"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-cyan-300 font-medium">Download Platform</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Decorative Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-1.5 w-32 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded-full mb-6 origin-left"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
