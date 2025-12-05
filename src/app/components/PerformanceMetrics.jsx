"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, BarChart3 } from "lucide-react";

export default function PerformanceMetrics({ account, dailyData }) {
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

  // Calculate additional metrics from daily data
  const calculateMetrics = () => {
    if (!dailyData || dailyData.length === 0) {
      return {
        avgDailyProfit: 0,
        bestDay: null,
        worstDay: null,
        totalDays: 0,
      };
    }

    const profits = dailyData.map(day => parseFloat(day.profit || 0));
    const avgDailyProfit = profits.reduce((sum, p) => sum + p, 0) / profits.length;
    
    const bestDay = dailyData.reduce((best, day) => {
      return parseFloat(day.profit || 0) > parseFloat(best.profit || 0) ? day : best;
    }, dailyData[0]);

    const worstDay = dailyData.reduce((worst, day) => {
      return parseFloat(day.profit || 0) < parseFloat(worst.profit || 0) ? day : worst;
    }, dailyData[0]);

    return {
      avgDailyProfit,
      bestDay,
      worstDay,
      totalDays: dailyData.length,
    };
  };

  const metrics = calculateMetrics();

  const performanceData = [
    {
      label: "Monthly Gain",
      value: formatPercent(account.monthly || 0),
      icon: Calendar,
      trend: parseFloat(account.monthly || 0) >= 0 ? "up" : "down",
    },
    {
      label: "Daily Gain",
      value: formatPercent(account.daily || 0),
      icon: TrendingUp,
      trend: parseFloat(account.daily || 0) >= 0 ? "up" : "down",
    },
    {
      label: "Absolute Gain",
      value: formatPercent(account.absGain || 0),
      icon: BarChart3,
      trend: parseFloat(account.absGain || 0) >= 0 ? "up" : "down",
    },
    {
      label: "Profit Factor",
      value: parseFloat(account.profitFactor || 0).toFixed(2),
      icon: TrendingUp,
      trend: parseFloat(account.profitFactor || 0) >= 1 ? "up" : "down",
    },
  ];

  return (
    <div className="mobile-card crm-card p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        Performance Metrics
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        {performanceData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 sm:p-4 mobile-card crm-card interactive-element"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-neutral-400" />
                <p className="text-xs sm:text-sm text-neutral-400">{item.label}</p>
              </div>
              <p
                className={`text-base sm:text-lg md:text-xl font-bold ${
                  item.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {metrics.totalDays > 0 && (
        <div className="pt-4 sm:pt-6 border-t border-white/10">
          <h3 className="text-sm sm:text-base font-semibold text-neutral-300 mb-3 sm:mb-4">Daily Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 sm:p-4 mobile-card crm-card interactive-element"
            >
              <p className="text-xs text-neutral-400 mb-1">Average Daily Profit</p>
              <p className={`text-sm sm:text-base font-semibold ${
                metrics.avgDailyProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {account.currency} {formatCurrency(metrics.avgDailyProfit)}
              </p>
            </motion.div>
            {metrics.bestDay && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 sm:p-4 mobile-card crm-card border-green-500/30 bg-green-500/10 interactive-element"
              >
                <p className="text-xs text-green-400 mb-1">Best Day</p>
                <p className="text-sm sm:text-base font-semibold text-green-400">
                  {account.currency} {formatCurrency(metrics.bestDay.profit)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{metrics.bestDay.date}</p>
              </motion.div>
            )}
            {metrics.worstDay && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 sm:p-4 mobile-card crm-card border-red-500/30 bg-red-500/10 interactive-element"
              >
                <p className="text-xs text-red-400 mb-1">Worst Day</p>
                <p className="text-sm sm:text-base font-semibold text-red-400">
                  {account.currency} {formatCurrency(metrics.worstDay.profit)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{metrics.worstDay.date}</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

