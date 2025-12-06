"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PageHero({ title, subtitle, className = "" }) {
  return (
    <section className={`relative pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-4 sm:mb-6 tracking-tight px-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed px-4"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
