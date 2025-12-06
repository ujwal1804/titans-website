"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetStarted } from "@/contexts/GetStartedContext";
import { Rocket, Sparkles, Lock, TrendingUp } from "lucide-react";

function LeadForm() {
  const { openModal } = useGetStarted();

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20">
        <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                  <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                </div>
              </div>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-3 sm:mb-4 md:mb-6">
              Get Early Access
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed px-4">
              Be among the first to experience our revolutionary algorithm-based
              trading bot. Join the waitlist and get exclusive early access.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              {[
                { icon: Sparkles, text: "Exclusive Access", color: "text-yellow-400" },
                { icon: Lock, text: "Secure & Private", color: "text-emerald-400" },
                { icon: TrendingUp, text: "Proven Results", color: "text-cyan-400" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                    <span className="text-xs sm:text-sm text-neutral-400">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center items-center"
          >
            <button
              onClick={openModal}
              className="cursor-pointer font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] relative overflow-hidden hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 inline-flex items-center gap-2 interactive-element group"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              <span className="relative z-10">Get Early Access</span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm text-neutral-400 text-center mt-4 sm:mt-6 md:mt-8 max-w-md mx-auto px-4"
          >
            We respect your privacy. No spam, ever.
          </motion.p>
        </div>
      </section>

    </>
  );
}

export default LeadForm;
