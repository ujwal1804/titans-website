import React from "react";
import { motion } from "framer-motion";
import StatsCount from "@/components/ui/statscount";

export default function BacktestResults() {
  const stats = [
    { value: 200, suffix: "%", label: "Equity Growth in 4 Months" },
    { value: 30, suffix: "%", label: "Max Drawdown Recorded" },
    { value: 900, suffix: "+", label: "Trades Executed Accurately" },
  ];

  return (
    <section id="backtest" className="mt-16 sm:mt-20 lg:mt-24">
      {/* Section Heading */}
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight px-4 mb-8 sm:mb-10 lg:mb-12">
        Backtest Results
      </h2>

      {/* Stats Grid */}
      <StatsCount
        stats={stats}
        title="REAL RESULTS, PROVEN PERFORMANCE"
        showDividers={true}
        className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] mx-auto text-center px-4"
      />

      {/* Optional Description */}
      <motion.p
        className="max-w-4xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-neutral-200 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-neutral-500 dark:from-neutral-200 dark:to-white font-bold tracking-tight px-4 mt-8 sm:mt-10 lg:mt-12 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our AI-driven trading bot consistently executes trades with precision and efficiency. Backtests demonstrate rapid equity growth, minimal drawdowns, and reliable performance across varied market conditions.
      </motion.p>
    </section>
  );
}
