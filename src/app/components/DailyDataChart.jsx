"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

export default function DailyDataChart({ dailyData, account }) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];

    return dailyData.map((day) => ({
      date: day.date,
      dateShort: day.date.split('/').slice(0, 2).join('/'), // MM/DD format
      balance: parseFloat(day.balance || 0),
      profit: parseFloat(day.profit || 0),
      pips: parseFloat(day.pips || 0),
      equity: parseFloat(day.balance || 0) + parseFloat(day.floatingPL || 0),
      growthEquity: parseFloat(day.growthEquity || 0),
    }));
  }, [dailyData]);

  // Calculate summary stats
  const summary = useMemo(() => {
    if (chartData.length === 0) return null;

    const profits = chartData.map(d => d.profit);
    const totalProfit = profits.reduce((sum, p) => sum + p, 0);
    const avgProfit = totalProfit / profits.length;

    return {
      totalProfit,
      avgProfit,
      totalDays: chartData.length,
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="mobile-card crm-card p-6 text-center">
        <p className="text-neutral-400">No daily data available</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-600/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs shadow-2xl backdrop-blur-sm">
          <div className="text-neutral-300 font-bold mb-1 sm:mb-2 text-[11px] sm:text-sm border-b border-neutral-700 pb-1 sm:pb-2">
            {label}
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between gap-3 sm:gap-6 items-center">
              <span className="text-neutral-400 text-[10px] sm:text-xs">Equity Gain:</span>
              <span className={`font-bold text-[10px] sm:text-sm ${
                data.growthEquity >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {data.growthEquity >= 0 ? "+" : ""}{data.growthEquity.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6 items-center">
              <span className="text-neutral-400 text-[10px] sm:text-xs">Profit:</span>
              <span className={`font-bold text-[10px] sm:text-sm ${
                data.profit >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {account?.currency} {formatCurrency(data.profit)}
              </span>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6 items-center">
              <span className="text-neutral-400 text-[10px] sm:text-xs">Balance:</span>
              <span className="text-white font-bold text-[10px] sm:text-sm">
                {account?.currency} {formatCurrency(data.balance)}
              </span>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6 items-center">
              <span className="text-neutral-400 text-[10px] sm:text-xs">Pips:</span>
              <span className="text-white font-bold text-[10px] sm:text-sm">
                {formatCurrency(data.pips)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate interval for X-axis labels based on data length
  const getXAxisInterval = () => {
    const totalLabels = chartData.length;
    if (totalLabels <= 10) return 0; // Show all labels if 10 or fewer
    if (totalLabels <= 20) return 1; // Show every other
    if (totalLabels <= 50) return Math.floor(totalLabels / 8); // Show ~8 labels
    return Math.floor(totalLabels / 10); // Show ~10 labels max
  };

  return (
    <div className="mobile-card crm-card p-4 sm:p-5 md:p-6 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Daily Performance Chart
          </h2>
          {summary && (
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex-1 sm:flex-none min-w-[100px]">
                <p className="text-neutral-400 text-[10px] sm:text-xs mb-1">Total Profit</p>
                <p className={`font-semibold text-sm sm:text-base ${
                  summary.totalProfit >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {account?.currency} {formatCurrency(summary.totalProfit)}
                </p>
              </div>
              <div className="flex-1 sm:flex-none min-w-[100px]">
                <p className="text-neutral-400 text-[10px] sm:text-xs mb-1">Avg Daily</p>
                <p className={`font-semibold text-sm sm:text-base ${
                  summary.avgProfit >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {account?.currency} {formatCurrency(summary.avgProfit)}
                </p>
              </div>
              <div className="flex-1 sm:flex-none min-w-[100px]">
                <p className="text-neutral-400 text-[10px] sm:text-xs mb-1">Days Tracked</p>
                <p className="font-semibold text-sm sm:text-base text-white">{summary.totalDays}</p>
              </div>
            </div>
          )}
        </div>

        {/* Equity Gain Chart - Mobile/Tablet Optimized */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 mb-3 sm:mb-4 flex items-center gap-2">
            <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full"></div>
            Equity Gain Trend
          </h3>
          
          {/* Mobile/Tablet: Compact Card Layout */}
          <div className="block md:hidden">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 25,
                    }}
                  >
                    <defs>
                      <linearGradient id="equityGainGradientMobile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="50%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="2 2" 
                      stroke="#374151" 
                      opacity={0.15}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="dateShort"
                      stroke="#9ca3af"
                      fontSize={9}
                      tick={{ fill: '#9ca3af', fontSize: 9 }}
                      angle={-30}
                      textAnchor="end"
                      height={40}
                      interval={Math.floor(chartData.length / 5)}
                      tickMargin={5}
                      tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                      axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={10}
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={(value) => `${value.toFixed(0)}%`}
                      width={50}
                      domain={['auto', 'auto']}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" opacity={0.4} />
                    <Area
                      type="monotone"
                      dataKey="growthEquity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#equityGainGradientMobile)"
                      dot={false}
                      activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#3b82f6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Mobile Summary Cards */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-[9px] text-neutral-400 mb-1">Start</p>
                  <p className="text-[10px] font-semibold text-white">{chartData[0]?.dateShort}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-neutral-400 mb-1">End</p>
                  <p className="text-[10px] font-semibold text-white">{chartData[chartData.length - 1]?.dateShort}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Full Featured Layout */}
          <div className="hidden md:block w-full h-80 lg:h-96 rounded-xl lg:rounded-2xl p-4 lg:p-6 pb-12 lg:pb-16 relative overflow-hidden">
            {/* Apple-style glassmorphism for chart area */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-xl lg:rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-xl lg:rounded-2xl"></div>
            <div className="absolute inset-0 border border-white/20 rounded-xl lg:rounded-2xl"></div>
            <div className="absolute inset-[1px] border border-white/10 rounded-xl lg:rounded-2xl"></div>
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-xl lg:rounded-2xl pointer-events-none"></div>
            
            {/* Chart Content */}
            <div className="relative z-10 h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 30,
                  }}
                >
                  <defs>
                    <linearGradient id="equityGainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#374151" 
                    opacity={0.2}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dateShort"
                    stroke="#9ca3af"
                    fontSize={10}
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={getXAxisInterval()}
                    tickMargin={8}
                    tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                    axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={10}
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                    width={50}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                    allowEscapeViewBox={{ x: true, y: true }}
                  />
                  <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" opacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey="growthEquity"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#equityGainGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs px-4 font-medium z-20">
              <span className="bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 text-white shadow-xl text-xs">
                {chartData[0]?.date}
              </span>
              <span className="bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 text-white shadow-xl text-xs">
                {chartData[chartData.length - 1]?.date}
              </span>
            </div>
            <div className="absolute top-4 right-4 text-xs text-white font-semibold bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 shadow-xl z-20">
              Equity Gain (%)
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 mb-3 sm:mb-4">Recent Daily Data</h3>
          <div className="mobile-card crm-card overflow-hidden p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-xs sm:text-sm divide-y divide-white/10 min-w-[500px]">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-3 sm:p-4 text-neutral-400 font-semibold whitespace-nowrap">Date</th>
                    <th className="text-right p-3 sm:p-4 text-neutral-400 font-semibold whitespace-nowrap">Equity Gain</th>
                    <th className="text-right p-3 sm:p-4 text-neutral-400 font-semibold whitespace-nowrap">Profit</th>
                    <th className="text-right p-3 sm:p-4 text-neutral-400 font-semibold whitespace-nowrap">Pips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {chartData.slice(-10).reverse().map((day, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 sm:p-4 text-neutral-300 whitespace-nowrap">{day.date}</td>
                      <td className={`p-3 sm:p-4 text-right font-mono font-semibold whitespace-nowrap ${
                        day.growthEquity >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {day.growthEquity >= 0 ? "+" : ""}{day.growthEquity.toFixed(2)}%
                      </td>
                      <td className={`p-3 sm:p-4 text-right font-mono font-semibold whitespace-nowrap ${
                        day.profit >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {account?.currency} {formatCurrency(day.profit)}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 text-right font-mono whitespace-nowrap">
                        {formatCurrency(day.pips)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
