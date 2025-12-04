"use client";

import React from "react";
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
    <div className="p-4 sm:p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        Trading Statistics
      </h2>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>
              <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          );
        })}

        {account.server && (
          <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg mt-4">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-5 h-5 text-neutral-400" />
              <p className="text-sm text-neutral-400">Trading Server</p>
            </div>
            <p className="text-lg font-semibold text-white">{account.server.name}</p>
          </div>
        )}

        {account.lastUpdateDate && (
          <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-neutral-400" />
              <p className="text-sm text-neutral-400">Last Update</p>
            </div>
            <p className="text-sm font-semibold text-white">{account.lastUpdateDate}</p>
          </div>
        )}
      </div>
    </div>
  );
}

