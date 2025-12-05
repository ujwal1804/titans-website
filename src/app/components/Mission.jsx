"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
          color: "text-cyan-400",
        },
        {
          value: `${account.currency} ${formatCurrency(account.profit)}`,
          label: "Total Profit",
          color: "text-blue-400",
        },
        {
          value: `${parseFloat(account.gain || 0).toFixed(1)}%`,
          label: "Total Gain",
          color: "text-purple-400",
        },
        {
          value: "24/7",
          label: "Support",
          color: "text-emerald-400",
        },
      ]
    : [
        { value: "4+", label: "Years R&D", color: "text-cyan-400" },
        { value: "$50M+", label: "Volume Traded", color: "text-blue-400" },
        { value: "99.9%", label: "Uptime", color: "text-purple-400" },
        { value: "24/7", label: "Support", color: "text-emerald-400" },
      ];

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="mobile-app-container md:w-[85vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 mb-6">
              Our Mission
            </h2>
            <div className="space-y-6 text-neutral-300 text-lg leading-relaxed">
              <p>
                At Titans Trading, we are driven by a singular vision: to democratize access to institutional-grade trading technology. We believe that sophisticated algorithmic trading shouldn't be reserved for hedge funds and Wall Street elites.
              </p>
              <p>
                Our team of expert mathematicians, data scientists, and financial analysts have spent years perfecting our algorithms. We combine cutting-edge machine learning with time-tested trading strategies to deliver consistent, reliable results.
              </p>
              <p>
                We value transparency, security, and performance above all else. Our profit-sharing model ensures that our interests are perfectly aligned with yours – we only succeed when you succeed.
              </p>
            </div>
          </motion.div>

          {/* Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full" />
            <div className="relative mobile-card crm-card p-6 sm:p-7 md:p-8 grid grid-cols-2 gap-6 sm:gap-7 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`${stat.color} text-4xl font-bold mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
