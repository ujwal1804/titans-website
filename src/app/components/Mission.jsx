"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Users, Shield, TrendingUp, Clock, DollarSign, CheckCircle2, Headphones } from "lucide-react";
import { useMyFxBook } from "@/hooks/useMyFxBook";

export default function Mission() {
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Calculate months since first trade
  const getMonthsTrading = () => {
    if (!account?.firstTradeDate) return "4+";
    try {
      const dateStr = account.firstTradeDate.split(' ')[0];
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const tradeDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        const now = new Date();
        const months = Math.floor((now - tradeDate) / (1000 * 60 * 60 * 24 * 30));
        return months > 0 ? `${months}+` : "4+";
      }
    } catch (e) {}
    return "4+";
  };

  const stats = account
    ? [
        {
          value: getMonthsTrading(),
          label: "Months Trading",
          icon: Clock,
          color: "from-cyan-400 to-cyan-600",
          bgColor: "from-cyan-500/20 to-cyan-600/10",
          borderColor: "border-cyan-400/30",
        },
        {
          value: formatCurrency(account.profit),
          suffix: ` ${account.currency}`,
          label: "Total Profit",
          icon: DollarSign,
          color: "from-emerald-400 to-emerald-600",
          bgColor: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-400/30",
        },
        {
          value: parseFloat(account.gain || 0).toFixed(1),
          suffix: "%",
          label: "Total Gain",
          icon: TrendingUp,
          color: "from-blue-400 to-blue-600",
          bgColor: "from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-400/30",
        },
        {
          value: "24/7",
          label: "Support",
          icon: Headphones,
          color: "from-purple-400 to-purple-600",
          bgColor: "from-purple-500/20 to-purple-600/10",
          borderColor: "border-purple-400/30",
        },
      ]
    : [
        {
          value: "4+",
          label: "Years R&D",
          icon: Clock,
          color: "from-cyan-400 to-cyan-600",
          bgColor: "from-cyan-500/20 to-cyan-600/10",
          borderColor: "border-cyan-400/30",
        },
        {
          value: "$50M+",
          label: "Volume Traded",
          icon: DollarSign,
          color: "from-emerald-400 to-emerald-600",
          bgColor: "from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-400/30",
        },
        {
          value: "99.9%",
          label: "Uptime",
          icon: CheckCircle2,
          color: "from-blue-400 to-blue-600",
          bgColor: "from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-400/30",
        },
        {
          value: "24/7",
          label: "Support",
          icon: Headphones,
          color: "from-purple-400 to-purple-600",
          bgColor: "from-purple-500/20 to-purple-600/10",
          borderColor: "border-purple-400/30",
        },
      ];

  const missionPoints = [
    {
      icon: Target,
      title: "Democratize Trading",
      description: "Make institutional-grade trading technology accessible to everyone, not just hedge funds and Wall Street elites.",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our mathematicians, data scientists, and financial analysts have spent years perfecting our algorithms.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Shield,
      title: "Transparency & Security",
      description: "We value transparency, security, and performance above all else. Your success is our success.",
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            Empowering traders with cutting-edge technology and unwavering commitment to your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">
          {/* Mission Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            {missionPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl`} />
                  
                  <div className="relative z-10 flex items-start gap-4 sm:gap-5">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
                        index === 0 ? 'text-cyan-400' : 
                        index === 1 ? 'text-blue-400' : 
                        'text-emerald-400'
                      }`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl rounded-3xl" />
            
            {/* Stats Card */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:4px_4px] opacity-30" />
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
                  Our Track Record
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`group text-center p-4 sm:p-5 rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10`}
                      >
                        {/* Icon */}
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            index === 0 ? 'text-cyan-400' : 
                            index === 1 ? 'text-emerald-400' : 
                            index === 2 ? 'text-blue-400' : 
                            'text-purple-400'
                          }`} />
                        </div>
                        
                        {/* Value */}
                        <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-1`}>
                          {stat.value}
                          {stat.suffix && <span className="text-xl sm:text-2xl md:text-3xl">{stat.suffix}</span>}
                        </div>
                        
                        {/* Label */}
                        <div className="text-xs sm:text-sm text-neutral-400 font-medium uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 md:mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:4px_4px] opacity-30" />
            <div className="relative z-10">
              <p className="text-base sm:text-lg md:text-xl text-neutral-200 leading-relaxed max-w-3xl mx-auto">
                We combine cutting-edge machine learning with time-tested trading strategies to deliver consistent, reliable results. Our profit-sharing model ensures that our interests are perfectly aligned with yours – <span className="text-cyan-300 font-semibold">we only succeed when you succeed.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
