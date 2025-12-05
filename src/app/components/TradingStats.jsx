"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, ArrowUpDown, Clock, Server } from "lucide-react";

export default function TradingStats({ account }) {
  if (!account) return null;

  const formatNumber = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const stats = [
    {
      label: "Total Pips",
      value: formatNumber(account.pips || 0),
      icon: Target,
      color: "text-blue-400",
    },
    {
      label: "Deposits",
      value: `${account.currency} ${formatNumber(account.deposits || 0)}`,
      icon: ArrowUpDown,
      color: "text-green-400",
    },
    {
      label: "Withdrawals",
      value: `${account.currency} ${formatNumber(account.withdrawals || 0)}`,
      icon: ArrowUpDown,
      color: "text-orange-400",
    },
    {
      label: "Account Type",
      value: account.demo ? "Demo" : "Live",
      icon: Target,
      color: account.demo ? "text-purple-400" : "text-cyan-400",
    },
  ];

  return (
    <div className="mobile-card crm-card p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        Trading Statistics
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 sm:p-4 mobile-card crm-card interactive-element"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`${stat.color} p-2 rounded-lg bg-white/5`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <p className="text-xs sm:text-sm text-neutral-400">{stat.label}</p>
              </div>
              <p className={`text-base sm:text-lg md:text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          );
        })}

        {account.server && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 sm:p-4 mobile-card crm-card interactive-element mt-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-neutral-400 p-2 rounded-lg bg-white/5">
                <Server className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">Trading Server</p>
            </div>
            <p className="text-sm sm:text-base font-semibold text-white">{account.server.name}</p>
          </motion.div>
        )}

        {account.lastUpdateDate && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 sm:p-4 mobile-card crm-card interactive-element"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-neutral-400 p-2 rounded-lg bg-white/5">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400">Last Update</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">{account.lastUpdateDate}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

