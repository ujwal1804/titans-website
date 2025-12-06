"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetStarted } from "@/contexts/GetStartedContext";

function Pricing() {
  const { openModal } = useGetStarted();
  
  return (
    <section
      id="pricing"
      className="text-gray-100 py-20 relative overflow-hidden"
    >
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/4 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="mobile-app-container md:w-[85vw] max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-4 sm:mb-6">
            Bot Pricing
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-4">
            Profit-sharing made simple. Start with a minimum investment and
            withdraw profits anytime. Our bot handles everything with
            transparency and efficiency.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {/* Left Section - Features */}
          <div className="flex-1 w-full max-w-lg space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl mobile-card crm-card interactive-element group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Minimum Investment
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">Start with just $500</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl mobile-card crm-card interactive-element group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Flexible Withdrawals
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Withdraw profits anytime
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl mobile-card crm-card interactive-element group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Monthly Subscription
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">$50/month access fee</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl mobile-card crm-card interactive-element group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    No Hidden Fees
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">Complete transparency</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl mobile-card crm-card interactive-element group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                    Real-time Performance
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Live tracking & analytics
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Section - Premium Card */}
          <div className="flex-1 w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative group"
            >
              {/* Main glass card */}
              <div className="mobile-card crm-card p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)]">
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.15] via-transparent to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content container */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                    Profit Sharing Model
                  </h3>

                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      50%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">Profit Share</div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-300 text-sm sm:text-base">Monthly Subscription</span>
                      <span className="text-white font-semibold text-sm sm:text-base">$50</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-300 text-sm sm:text-base">Your Share</span>
                      <span className="text-white font-semibold text-sm sm:text-base">50%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-300 text-sm sm:text-base">Platform Fee</span>
                      <span className="text-white font-semibold text-sm sm:text-base">50%</span>
                    </div>
                    <div className="w-full bg-gray-600/30 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>

                  <button
                    onClick={openModal}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-2xl font-semibold tracking-wide shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] group/btn relative overflow-hidden hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 inline-block"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
