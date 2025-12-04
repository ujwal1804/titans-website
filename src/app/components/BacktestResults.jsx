"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCount from "@/components/ui/statscount";
import { useMyFxBook } from "@/hooks/useMyFxBook";

export default function BacktestResults() {
  const { getAccounts, isAuthenticated } = useMyFxBook();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAccountData();
    }
  }, [isAuthenticated]);

  const loadAccountData = async () => {
    try {
      const result = await getAccounts();
      if (result.success && result.account) {
        setAccount(result.account);
      }
    } catch (error) {
      console.error("Error loading account data:", error);
    }
  };

  // Use real data if available, otherwise use defaults
  const stats = account
    ? [
        {
          value: parseFloat(account.gain || 0),
          suffix: "%",
          label: "Total Gain Achieved",
        },
        {
          value: parseFloat(account.profit || 0),
          suffix: "",
          label: `Profit in ${account.currency}`,
        },
        {
          value: parseFloat(account.balance || 0),
          suffix: "",
          label: `Balance in ${account.currency}`,
        },
      ]
    : [
        { value: 200, suffix: "%", label: "Equity Growth in 4 Months" },
        { value: 900, suffix: "+", label: "Trades Executed Accurately" },
        { value: 100, suffix: "%", label: "Success Rate" },
      ];

  return (
    <section
      id="backtest"
      className="flex flex-col w-full py-16 sm:py-20 md:py-24 lg:py-32"
    >
      {/* Section Heading */}
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        Backtest Results
      </h2>

      {/* Stats Grid */}
      <StatsCount
        stats={stats}
        title=""
        showDividers={true}
        className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] mx-auto text-center px-4 sm:px-6 lg:px-8"
      />

      {/* Optional Description */}
      <motion.p
        className="max-w-4xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-neutral-200 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-neutral-500 dark:from-neutral-200 dark:to-white font-bold tracking-tight px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-24 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {account
          ? `Our AI-driven trading bot consistently executes trades with precision and efficiency. Current performance shows ${parseFloat(account.gain).toFixed(2)}% total gain with ${account.currency} ${parseFloat(account.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total profit.`
          : "Our AI-driven trading bot consistently executes trades with precision and efficiency. Backtests demonstrate rapid equity growth and reliable performance across varied market conditions."}
      </motion.p>
    </section>
  );
}
