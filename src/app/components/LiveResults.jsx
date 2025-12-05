"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { useMyFxBook } from "@/hooks/useMyFxBook";

function LiveResults() {
  const { getAccounts, isAuthenticated, login } = useMyFxBook();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        // Auto-login if not authenticated
        await login();
      }
    };
    loadData();
  }, [isAuthenticated, login]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAccountData();
    }
  }, [isAuthenticated]);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      const result = await getAccounts();
      if (result.success && result.account) {
        setAccount(result.account);
      }
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format percentage
  const formatPercent = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Calculate results from account data
  const results = account
    ? [
        {
          label: "Total Profit",
          value: `${account.currency} ${formatCurrency(account.profit)}`,
        },
        {
          label: "Total Gain",
          value: `+${formatPercent(account.gain)}`,
        },
        {
          label: "Last Update",
          value: account.lastUpdateDate || "N/A",
        },
      ]
    : [
        { label: "Profit Achieved", value: "+18.7%" },
        { label: "Growth in Equity", value: "1.18x" },
        { label: "Duration", value: "August 2025" },
      ];

  return (
    <section
      id="live-results"
      className="flex flex-col w-full py-8 sm:py-12 md:py-16 lg:py-20 text-white text-center"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-4"
      >
        Live Trading Results
      </motion.h2>
      <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16 lg:mb-20 px-4">
        {account
          ? `Real-time performance for ${account.name || "Titansfx2.0"}`
          : "Verified performance data"}
      </p>

      {/* Results Grid - Mobile App Style */}
      <div className="mobile-app-container md:w-[85vw] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {results.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <div className="mobile-card crm-card p-6 sm:p-8 aspect-square flex flex-col items-center justify-center text-center group interactive-element relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pixel canvas effect */}
                <div className="absolute inset-0 opacity-30">
                  <PixelCanvas
                    gap={10}
                    speed={25}
                    colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                    variant="icon"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-full">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors break-words block mb-3">
                    {item.value}
                  </span>
                  <span className="text-neutral-400 text-sm sm:text-base uppercase tracking-wider font-medium">
                    {item.label}
                  </span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">Loading live data...</p>
        </div>
      )}
    </section>
  );
}

export default LiveResults;
