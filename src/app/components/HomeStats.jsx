"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import { TrendingUp, DollarSign, Activity } from "lucide-react";

export default function HomeStats() {
  const { getAccounts, isAuthenticated, login } = useMyFxBook();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const loadAccountData = async () => {
        try {
          const result = await getAccounts();
          if (result.success && result.account) {
            setAccount(result.account);
          }
        } catch (error) {
          console.error("Error loading account data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadAccountData();
    }
  }, [isAuthenticated, getAccounts]);

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return null;
  }

  const stats = account
    ? [
        {
          icon: <TrendingUp className="w-5 h-5" />,
          value: `${parseFloat(account.gain || 0).toFixed(1)}%`,
          label: "Total Gain",
          color: "text-cyan-400",
        },
        {
          icon: <DollarSign className="w-5 h-5" />,
          value: `${account.currency} ${formatCurrency(account.profit)}`,
          label: "Total Profit",
          color: "text-emerald-400",
        },
        {
          icon: <Activity className="w-5 h-5" />,
          value: `${parseFloat(account.monthly || 0).toFixed(1)}%`,
          label: "Monthly Gain",
          color: "text-blue-400",
        },
      ]
    : null;

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-full"
        >
          <div className={stat.color}>{stat.icon}</div>
          <div>
            <div className={`${stat.color} text-sm sm:text-base font-bold`}>
              {stat.value}
            </div>
            <div className="text-xs text-neutral-400">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

