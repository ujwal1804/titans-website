"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import { TrendingUp, DollarSign, Clock, Shield } from "lucide-react";

export default function StatsSection() {
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

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const stats = account
    ? [
        {
          icon: <TrendingUp className="w-8 h-8" />,
          value: `${parseFloat(account.gain || 0).toFixed(2)}%`,
          label: "Total Gain",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          icon: <DollarSign className="w-8 h-8" />,
          value: `${account.currency} ${formatCurrency(account.profit)}`,
          label: "Total Profit",
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
        },
        {
          icon: <Clock className="w-8 h-8" />,
          value: "24/5",
          label: "Trading Hours",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          icon: <Shield className="w-8 h-8" />,
          value: `${parseFloat(account.profitFactor || 0).toFixed(2)}`,
          label: "Profit Factor",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
        },
      ]
    : [
        {
          icon: <TrendingUp className="w-8 h-8" />,
          value: "213%+",
          label: "Total Gain",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
        },
        {
          icon: <DollarSign className="w-8 h-8" />,
          value: "$82K+",
          label: "Total Profit",
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
        },
        {
          icon: <Clock className="w-8 h-8" />,
          value: "24/5",
          label: "Trading Hours",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          icon: <Shield className="w-8 h-8" />,
          value: "1.10",
          label: "Profit Factor",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
        },
      ];

  return (
    <section className="py-8 sm:py-12 md:py-20 relative overflow-hidden">
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group interactive-element"
            >
              <div className="mobile-card crm-card p-4 sm:p-5 md:p-6 h-full">
                <div className={`${stat.bgColor} ${stat.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`${stat.color} text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 leading-tight`}>
                  {stat.value}
                </div>
                <div className="text-neutral-400 text-xs sm:text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
                {/* Gradient glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

