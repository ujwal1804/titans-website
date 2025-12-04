"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { useMyFxBook } from "@/hooks/useMyFxBook";

function LiveResults() {
  const { getAccounts, isAuthenticated } = useMyFxBook();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

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
      className="flex flex-col w-full py-16 sm:py-20 md:py-24 lg:py-32 text-white text-center px-4 sm:px-6 lg:px-8"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12"
      >
        Live Trading Results
      </motion.h2>
      <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4">
        {account
          ? `Real-time performance for ${account.name || "Titansfx2.0"}`
          : "Verified performance data"}
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] mx-auto">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="w-full sm:w-[280px] mx-auto"
          >
            <button
              className="group w-full overflow-hidden border border-border rounded-[24px] sm:rounded-[32px] aspect-square transition-colors duration-200 hover:border-[#0ea5e9] focus:outline-[5px] focus:outline-[Highlight]"
              style={{ "--active-color": "text-neutral-500" }}
            >
              <PixelCanvas
                gap={10}
                speed={25}
                colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                variant="icon"
              />
              <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-3 sm:px-4">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-500 group-hover:text-[var(--active-color)] transition-colors break-words">
                  {item.value}
                </span>
                <span className="text-neutral-400 text-xs sm:text-sm mt-2 leading-tight">
                  {item.label}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
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
