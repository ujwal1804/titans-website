"use client";

import React from "react";
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`p-4 sm:p-6 rounded-lg border ${stat.bgColor} ${stat.borderColor} backdrop-blur-sm transition-all hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

