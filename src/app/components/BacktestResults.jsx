"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Activity, Target, CheckCircle2, BarChart3 } from "lucide-react";
import { useMyFxBook } from "@/hooks/useMyFxBook";

export default function BacktestResults() {
  const { getAccounts, isAuthenticated, login } = useMyFxBook();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
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

  // Format currency
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Use real data if available, otherwise use defaults
  const stats = account
    ? [
        {
          value: parseFloat(account.gain || 0).toFixed(1),
          suffix: "%",
          label: "Total Gain Achieved",
          icon: TrendingUp,
          color: "from-cyan-400 to-cyan-600",
          bgColor: "from-cyan-500/20 to-cyan-600/10",
          borderColor: "border-cyan-400/30",
        },
        {
          value: formatCurrency(account.profit || 0),
          suffix: ` ${account.currency}`,
          label: "Total Profit",
          icon: DollarSign,
          color: "from-emerald-400 to-emerald-600",
          bgColor: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-400/30",
        },
        {
          value: formatCurrency(account.balance || 0),
          suffix: ` ${account.currency}`,
          label: "Current Balance",
          icon: BarChart3,
          color: "from-blue-400 to-blue-600",
          bgColor: "from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-400/30",
        },
      ]
    : [
        {
          value: "213.36",
          suffix: "%",
          label: "Total Gain Achieved",
          icon: TrendingUp,
          color: "from-cyan-400 to-cyan-600",
          bgColor: "from-cyan-500/20 to-cyan-600/10",
          borderColor: "border-cyan-400/30",
        },
        {
          value: "82,211",
          suffix: "+",
          label: "Trades Executed Accurately",
          icon: CheckCircle2,
          color: "from-emerald-400 to-emerald-600",
          bgColor: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-400/30",
        },
        {
          value: "100",
          suffix: "%",
          label: "Success Rate",
          icon: Target,
          color: "from-blue-400 to-blue-600",
          bgColor: "from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-400/30",
        },
      ];

  return (
    <section
      id="backtest"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Backtest Results
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            Proven performance through rigorous testing and real-world execution
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="relative flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative flex-1">
                {/* Vertical Divider - Only on desktop and between cards */}
                {index < stats.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="hidden md:block absolute -right-3 sm:-right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent z-10"
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6 sm:p-8 hover:border-opacity-50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-center items-center text-center h-full`}
                >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl`} />
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
                    index === 0 ? 'text-cyan-400' : 
                    index === 1 ? 'text-emerald-400' : 
                    'text-blue-400'
                  }`} />
                </div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="mb-2 text-center"
                >
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent inline-block`}>
                    {stat.value}
                    <span className="text-2xl sm:text-3xl md:text-4xl">{stat.suffix}</span>
                  </div>
                </motion.div>

                {/* Label */}
                <p className="text-sm sm:text-base text-neutral-300 font-medium text-center">
                  {stat.label}
                </p>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-5 rounded-bl-full rounded-tr-2xl`} />
              </motion.div>
              </div>
            );
          })}
        </div>

        {/* Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:4px_4px] opacity-30" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Performance Summary</h3>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed">
                {account
                  ? `Our AI-driven trading bot consistently executes trades with precision and efficiency. Current performance shows ${parseFloat(account.gain).toFixed(2)}% total gain with ${account.currency} ${parseFloat(account.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total profit.`
                  : "Our AI-driven trading bot consistently executes trades with precision and efficiency. Backtests demonstrate rapid equity growth and reliable performance across varied market conditions."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
