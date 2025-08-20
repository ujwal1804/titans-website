import React from "react";
import { motion } from "framer-motion";
import StatsCount from "@/components/ui/statscount";

export default function BacktestResults() {
  const stats = [
    { value: 200, suffix: "%", label: "Equity Growth in 4 Months" },
    { value: 10, suffix: "%", label: "Max Drawdown Recorded" },
    { value: 120, suffix: "+", label: "Trades Executed Accurately" },
  ];

  return (
    <section id="backtest" className="py-32 px-6 relative">
      {/* Section Heading */}
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-200 dark:to-white text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight ">
        Backtest Results
      </h2>

      {/* Stats Grid */}
      <StatsCount
        stats={stats}
        title="REAL RESULTS, PROVEN PERFORMANCE"
        showDividers={true}
        className="max-w-5xl mx-auto text-center"
      />

      {/* Optional Description */}
      <motion.p
        className="max-w-4xl mx-auto text-base md:text-lg text-neutral-400 text-center bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-200 dark:to-white text-3xl  font-bold tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our AI-driven trading bot consistently executes trades with precision and efficiency. Backtests demonstrate rapid equity growth, minimal drawdowns, and reliable performance across varied market conditions.
      </motion.p>
    </section>
  );
}
