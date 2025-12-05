"use client";

import React, { useMemo, useState } from "react";

export default function DailyDataChart({ dailyData, account }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];

    return dailyData.map((day) => ({
      date: day.date,
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

  // Calculate chart dimensions for equity gain
  const equityGains = chartData.map(d => d.growthEquity);
  const maxEquityGain = Math.max(...equityGains);
  const minEquityGain = Math.min(...equityGains);
  const equityGainRange = maxEquityGain - minEquityGain || 1;

  // Chart dimensions
  const chartWidth = Math.max(chartData.length * 8, 800); // Minimum width for visibility
  const chartHeight = 200;
  const paddingLeft = 80; // Space for Y-axis labels
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40; // Space for X-axis labels
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const handleChartHover = (e, index) => {
    if (e.type === 'mouseenter' || e.type === 'mousemove') {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredIndex(index);
      setHoverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setHoveredIndex(null);
    }
  };

  const hoveredData = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  return (
    <div className="mobile-card crm-card p-4 sm:p-5 md:p-6 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Daily Performance Chart
        </h2>
        {summary && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-neutral-400">Total Profit</p>
              <p className={`font-semibold ${summary.totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {account?.currency} {formatCurrency(summary.totalProfit)}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Avg Daily</p>
              <p className={`font-semibold ${summary.avgProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {account?.currency} {formatCurrency(summary.avgProfit)}
              </p>
            </div>
            <div>
              <p className="text-neutral-400">Days Tracked</p>
              <p className="font-semibold text-white">{summary.totalDays}</p>
            </div>
          </div>
        )}
      </div>

      {/* Equity Gain Chart */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full"></div>
          Equity Gain Trend
        </h3>
        <div 
          className="h-96 rounded-2xl p-6 pb-16 relative overflow-hidden"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Apple-style glassmorphism for chart area */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-2xl"></div>
          <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
          <div className="absolute inset-[1px] border border-white/10 rounded-2xl"></div>
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10 h-full">
          
          <svg 
            className="w-full h-full" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Premium gradient with better visibility */}
              <linearGradient id="equityGainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              
              {/* Glow effect */}
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Grid pattern */}
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            
            {/* Grid background */}
            <rect x={paddingLeft} y={paddingTop} width={plotWidth} height={plotHeight} fill="url(#gridPattern)" opacity="0.3" />
            
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = paddingTop + plotHeight - (percent / 100) * plotHeight;
              return (
                <line
                  key={`grid-${percent}`}
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + plotWidth}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              );
            })}
            
            {/* Zero line */}
            {minEquityGain <= 0 && maxEquityGain >= 0 && (
              <line
                x1={paddingLeft}
                y1={paddingTop + plotHeight - ((0 - minEquityGain) / equityGainRange) * plotHeight}
                x2={paddingLeft + plotWidth}
                y2={paddingTop + plotHeight - ((0 - minEquityGain) / equityGainRange) * plotHeight}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            )}
            
            {/* Chart line */}
            <polyline
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              points={chartData.map((d, i) => {
                const x = paddingLeft + (i / (chartData.length - 1 || 1)) * plotWidth;
                const y = paddingTop + plotHeight - ((d.growthEquity - minEquityGain) / equityGainRange) * plotHeight;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Area fill */}
            <polygon
              fill="url(#equityGainGradient)"
              points={`${paddingLeft},${paddingTop + plotHeight} ${chartData.map((d, i) => {
                const x = paddingLeft + (i / (chartData.length - 1 || 1)) * plotWidth;
                const y = paddingTop + plotHeight - ((d.growthEquity - minEquityGain) / equityGainRange) * plotHeight;
                return `${x},${y}`;
              }).join(' ')} ${paddingLeft + plotWidth},${paddingTop + plotHeight}`}
            />
            {/* Interactive hover points with enhanced styling */}
            {chartData.map((d, i) => {
              const x = paddingLeft + (i / (chartData.length - 1 || 1)) * plotWidth;
              const y = paddingTop + plotHeight - ((d.growthEquity - minEquityGain) / equityGainRange) * plotHeight;
              const isHovered = hoveredIndex === i;
              return (
                <g key={i} className="cursor-pointer">
                  {/* Hover indicator line */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + plotHeight}
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeDasharray="5 5"
                      opacity="0.5"
                      className="transition-opacity"
                    />
                  )}
                  {/* Premium hover indicator */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="#3b82f6"
                      opacity="0.25"
                      className="blur-md"
                    />
                  )}
                  {/* Main point with premium styling */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "6" : "4"}
                    fill={isHovered ? "#2563eb" : "#3b82f6"}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? "3" : "2.5"}
                    opacity={isHovered ? "1" : "0.9"}
                    className="transition-all duration-200"
                    onMouseEnter={(e) => handleChartHover(e, i)}
                    onMouseMove={(e) => handleChartHover(e, i)}
                  />
                  {/* Inner highlight */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="#ffffff"
                      opacity="0.9"
                    />
                  )}
                </g>
              );
            })}
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const value = minEquityGain + (percent / 100) * equityGainRange;
              const y = paddingTop + plotHeight - (percent / 100) * plotHeight;
              return (
                <text
                  key={`y-label-${percent}`}
                  x={paddingLeft - 10}
                  y={y}
                  fill="#9ca3af"
                  fontSize="11"
                  textAnchor="end"
                  className="select-none"
                  dy="4"
                >
                  {value.toFixed(1)}%
                </text>
              );
            })}
            {/* Date labels on x-axis - show every Nth date to avoid crowding */}
            {chartData.map((d, i) => {
              const showDate = i === 0 || i === chartData.length - 1 || i % Math.ceil(chartData.length / 8) === 0;
              if (!showDate) return null;
              const x = paddingLeft + (i / (chartData.length - 1 || 1)) * plotWidth;
              return (
                <text
                  key={`date-equity-${i}`}
                  x={x}
                  y={paddingTop + plotHeight + 15}
                  fill="#9ca3af"
                  fontSize="10"
                  textAnchor="middle"
                  className="select-none font-medium"
                >
                  {d.date.split('/')[0]}/{d.date.split('/')[1]}
                </text>
              );
            })}
          </svg>
          {/* Tooltip */}
          {hoveredIndex !== null && hoveredData && (
            <div
              className="absolute bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-600/50 rounded-xl px-4 py-3 text-xs shadow-2xl z-20 pointer-events-none backdrop-blur-sm"
              style={{
                left: `${Math.min(Math.max(hoverPosition.x - 100, 10), (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220)}px`,
                top: `${Math.max(hoverPosition.y - 120, 10)}px`,
              }}
            >
              <div className="text-neutral-300 font-bold mb-2 text-sm border-b border-neutral-700 pb-2">{hoveredData.date}</div>
              <div className="space-y-2">
                <div className="flex justify-between gap-6 items-center">
                  <span className="text-neutral-400 text-xs">Equity Gain:</span>
                  <span className={`font-bold text-sm ${hoveredData.growthEquity >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {hoveredData.growthEquity >= 0 ? "+" : ""}{hoveredData.growthEquity.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between gap-6 items-center">
                  <span className="text-neutral-400 text-xs">Profit:</span>
                  <span className={`font-bold text-sm ${hoveredData.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {account?.currency} {formatCurrency(hoveredData.profit)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 items-center">
                  <span className="text-neutral-400 text-xs">Balance:</span>
                  <span className="text-white font-bold text-sm">
                    {account?.currency} {formatCurrency(hoveredData.balance)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 items-center">
                  <span className="text-neutral-400 text-xs">Pips:</span>
                  <span className="text-white font-bold text-sm">
                    {formatCurrency(hoveredData.pips)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs px-4 font-medium z-20">
            <span className="bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 text-white shadow-xl">{chartData[0]?.date}</span>
            <span className="bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 text-white shadow-xl">{chartData[chartData.length - 1]?.date}</span>
          </div>
          <div className="absolute top-4 right-4 text-xs text-white font-semibold bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-2xl px-4 py-2 rounded-xl border border-white/30 shadow-xl z-20">
            Equity Gain (%)
          </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8 overflow-x-auto">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Recent Daily Data</h3>
        <div className="mobile-card crm-card overflow-hidden">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 text-neutral-400">Date</th>
                <th className="text-right p-3 text-neutral-400">Equity Gain</th>
                <th className="text-right p-3 text-neutral-400">Profit</th>
                <th className="text-right p-3 text-neutral-400">Pips</th>
              </tr>
            </thead>
            <tbody>
              {chartData.slice(-10).reverse().map((day, index) => (
                <tr key={index} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-neutral-300">{day.date}</td>
                  <td className={`p-3 text-right font-mono font-semibold ${
                    day.growthEquity >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {day.growthEquity >= 0 ? "+" : ""}{day.growthEquity.toFixed(2)}%
                  </td>
                  <td className={`p-3 text-right font-mono font-semibold ${
                    day.profit >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {account?.currency} {formatCurrency(day.profit)}
                  </td>
                  <td className="p-3 text-neutral-300 text-right font-mono">
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
  );
}
