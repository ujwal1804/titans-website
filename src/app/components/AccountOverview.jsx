"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Activity } from "lucide-react";

export default function AccountOverview({ account }) {
  if (!account) return null;

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  const stats = [
    {
      label: "Account Balance",
      value: `${account.currency} ${formatCurrency(account.balance)}`,
      icon: DollarSign,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
    {
      label: "Total Profit",
      value: `${account.currency} ${formatCurrency(account.profit)}`,
      icon: TrendingUp,
      color: parseFloat(account.profit) >= 0 ? "text-green-400" : "text-red-400",
      bgColor: parseFloat(account.profit) >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      borderColor: parseFloat(account.profit) >= 0 ? "border-green-500/30" : "border-red-500/30",
    },
    {
      label: "Total Gain",
      value: formatPercent(account.gain),
      icon: Activity,
      color: parseFloat(account.gain) >= 0 ? "text-green-400" : "text-red-400",
      bgColor: parseFloat(account.gain) >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      borderColor: parseFloat(account.gain) >= 0 ? "border-green-500/30" : "border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`mobile-card crm-card p-4 sm:p-5 md:p-6 border ${stat.bgColor} ${stat.borderColor} interactive-element relative overflow-hidden group`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-wide font-medium">
                  {stat.label}
                </p>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${stat.color} leading-tight`}>
                {stat.value}
              </p>
            </div>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.div>
        );
      })}
    </div>
  );
}

