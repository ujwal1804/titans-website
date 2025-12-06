"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CloudLightning, Cpu, TrendingUp } from "react-feather";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import { useGetStarted } from "@/contexts/GetStartedContext";

export default function AboutBot() {
  const { getAccounts, isAuthenticated, login } = useMyFxBook();
  const { openModal } = useGetStarted();
  const [account, setAccount] = useState(null);

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
    try {
      const result = await getAccounts();
      if (result.success && result.account) {
        setAccount(result.account);
      }
    } catch (error) {
      console.error("Error loading account data:", error);
    }
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const features = [
    {
      icon: <Cpu size={32} />,
      title: "Mathematical Precision",
      description:
        "Executes trades with mathematical accuracy using sophisticated MQL5 algorithms that continuously adapt to evolving market dynamics.",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Proven Results",
      description: account
        ? `Live trading results show ${parseFloat(account.gain || 0).toFixed(2)}% total gain with ${account.currency} ${formatCurrency(account.profit)} in total profit, demonstrating consistent performance in real market conditions.`
        : "Comprehensive backtesting demonstrates consistent 200% equity growth within 4 months, with robust performance even in challenging market conditions.",
    },
    {
      icon: <CloudLightning size={32} />,
      title: "Lightning Fast Execution",
      description:
        "Engineered for optimal speed and reliability, seamlessly managing multiple concurrent trades across diverse market environments.",
    },
  ];

  return (
    <section
      id="about"
      className="py-8 sm:py-12 md:py-16 lg:py-20 z-50 flex flex-col justify-center items-center"
    >
      {/* Section Heading */}
      <h2 className="bg-clip-text mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl z-20 font-bold tracking-tight leading-tight px-4">
        Revolutionary Trading Technology
      </h2>

      {/* Features Grid - Mobile App Style */}
      <div className="mobile-app-container md:w-[85vw] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <SpotlightCard key={idx} className="" spotlightColor="34, 211, 238">
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-neutral-200">
                  {feature.icon}
                </h3>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white pb-1 sm:pb-2 pt-2 sm:pt-4 relative z-20 font-bold tracking-tight leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white pb-1 sm:pb-2 pt-2 sm:pt-4 relative z-20 font-bold tracking-tight leading-tight leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 px-4 z-50">
        <button
          onClick={openModal}
          className="cursor-pointer font-bold text-base sm:text-lg lg:text-xl px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] relative overflow-hidden hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 uppercase inline-block"
        >
          <span className="relative z-10">Join the Revolution</span>
        </button>
      </div>
    </section>
  );
}
