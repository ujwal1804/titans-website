"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Calculator, TrendingUp, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";

export default function ForecastCalculator({ account, dailyData = [] }) {
  const [dailyGainData, setDailyGainData] = useState([]);
  const { getDailyGain } = useMyFxBook();

  // Fetch daily gain data when component mounts or account changes
  useEffect(() => {
    const fetchDailyGain = async () => {
      if (account && account.id) {
        try {
          const result = await getDailyGain(account.id);
          if (result.success && result.dailyGain) {
            // Flatten the nested array structure
            const flattened = result.dailyGain.flat();
            setDailyGainData(flattened);
          }
        } catch (error) {
          console.error("Error fetching daily gain:", error);
        }
      }
    };
    fetchDailyGain();
  }, [account, getDailyGain]);

  // Calculate average monthly growth rate from historical data
  const calculateAverageMonthlyGrowth = useMemo(() => {
    // Helper to parse MyFxBook date format: "MM/DD/YYYY HH:MM" or "MM/DD/YYYY"
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const datePart = dateStr.split(' ')[0];
      const parts = datePart.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month - 1, day);
        }
      }
      return null;
    };

    // Method 1: Calculate from daily gain data (most accurate, matches MyFxBook)
    if (dailyGainData && dailyGainData.length > 0) {
      try {
        // Calculate average daily gain percentage
        const dailyGains = dailyGainData
          .map(d => parseFloat(d.value || 0))
          .filter(g => !isNaN(g));
        
        if (dailyGains.length > 0) {
          // MyFxBook calculates monthly growth from daily gains using compound formula
          // First, calculate the cumulative gain over the period
          // Then convert to monthly rate
          
          // Calculate total gain from daily gains (compound)
          let cumulativeMultiplier = 1;
          dailyGains.forEach(gain => {
            cumulativeMultiplier *= (1 + gain / 100);
          });
          
          // Calculate total gain percentage
          const totalGain = (cumulativeMultiplier - 1) * 100;
          
          // Calculate number of months from the data
          if (dailyGainData.length > 0) {
            const firstDate = dailyGainData[0]?.date;
            const lastDate = dailyGainData[dailyGainData.length - 1]?.date;
            
            if (firstDate && lastDate) {
              const parseDate = (dateStr) => {
                if (!dateStr) return null;
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                  const month = parseInt(parts[0], 10);
                  const day = parseInt(parts[1], 10);
                  const year = parseInt(parts[2], 10);
                  if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
                    return new Date(year, month - 1, day);
                  }
                }
                return null;
              };
              
              const first = parseDate(firstDate);
              const last = parseDate(lastDate);
              
              if (first && last) {
                const daysDiff = (last - first) / (1000 * 60 * 60 * 24);
                const monthsDiff = daysDiff / 30.44;
                
                if (monthsDiff > 0) {
                  // Calculate monthly growth from total gain
                  const monthlyGrowth = (Math.pow(1 + totalGain / 100, 1 / monthsDiff) - 1) * 100;
                  return monthlyGrowth;
                }
              }
            }
            
            // Fallback: assume 30 days per month
            const monthsFromDays = dailyGains.length / 30.44;
            if (monthsFromDays > 0) {
              const monthlyGrowth = (Math.pow(1 + totalGain / 100, 1 / monthsFromDays) - 1) * 100;
              return monthlyGrowth;
            }
          }
        }
      } catch (error) {
        console.error("Error calculating from daily gain:", error);
      }
    }

    // Method 2: Use account's monthly gain if available (direct)
    if (account && account.monthly) {
      const monthlyGain = parseFloat(account.monthly);
      if (!isNaN(monthlyGain) && monthlyGain !== 0) {
        return monthlyGain;
      }
    }

    // Method 2: Use account's total gain percentage and calculate monthly average
    if (account && account.gain) {
      const accountGain = parseFloat(account.gain);
      if (!isNaN(accountGain) && accountGain !== 0) {
        const creationDate = account.creationDate ? parseDate(account.creationDate) : null;
        const lastUpdateDate = account.lastUpdateDate ? parseDate(account.lastUpdateDate) : null;

        if (creationDate && lastUpdateDate) {
          // Calculate exact months between dates
          const timeDiff = lastUpdateDate - creationDate;
          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
          const exactMonths = daysDiff / 30.44; // Average days per month

          if (exactMonths > 0.1) { // At least 3 days
            // Calculate monthly growth from total gain using compound formula
            // If gain is positive, use compound growth; if negative, use simple average
            let monthlyGrowth;
            if (accountGain > 0) {
              monthlyGrowth = (Math.pow(1 + accountGain / 100, 1 / exactMonths) - 1) * 100;
            } else {
              monthlyGrowth = accountGain / exactMonths;
            }
            
            // Return the calculated monthly growth
            return monthlyGrowth;
          }
        }
      }
    }

    // Method 2: Calculate from daily data balance changes
    if (!dailyData || dailyData.length < 2) {
      return null;
    }

    try {
      // Parse date helper - MyFxBook format is MM/DD/YYYY
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0], 10);
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
            return new Date(year, month - 1, day);
          }
        }
        return null;
      };

      // Calculate from first and last balance
      const firstData = dailyData[0];
      const lastData = dailyData[dailyData.length - 1];
      
      if (!firstData || !lastData) return null;

      const firstBalance = parseFloat(firstData.balance || 0);
      const lastBalance = parseFloat(lastData.balance || 0);
      
      if (firstBalance === 0 || firstBalance === lastBalance) return null;

      // Calculate total growth percentage
      const totalGrowth = ((lastBalance - firstBalance) / firstBalance) * 100;
      
      const firstDate = parseDate(firstData.date);
      const lastDate = parseDate(lastData.date);
      
      if (!firstDate || !lastDate) return null;
      
      // Calculate exact months difference
      const yearsDiff = lastDate.getFullYear() - firstDate.getFullYear();
      const monthsDiff = yearsDiff * 12 + (lastDate.getMonth() - firstDate.getMonth());
      const daysDiff = lastDate.getDate() - firstDate.getDate();
      
      // Add fractional month based on days
      const exactMonths = monthsDiff + (daysDiff / 30.44);
      
      if (exactMonths <= 0) return null;

      // Calculate average monthly growth rate using compound growth formula
      const monthlyGrowth = (Math.pow(1 + totalGrowth / 100, 1 / exactMonths) - 1) * 100;
      
      return monthlyGrowth > 0 ? monthlyGrowth : null;
    } catch (error) {
      console.error("Error calculating average monthly growth:", error);
      return null;
    }
  }, [dailyData, account, dailyGainData]);

  // Calculate actual monthly gains from daily data
  const monthlyGains = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];

    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          return new Date(year, month - 1, day);
        }
      }
      return null;
    };

    // Group data by month
    const monthlyData = {};
    dailyData.forEach((day) => {
      const date = parseDate(day.date);
      if (date) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            monthKey,
            monthName,
            dates: [],
            balances: [],
            firstBalance: null,
            lastBalance: null,
            firstDate: null,
            lastDate: null,
          };
        }
        
        const balance = parseFloat(day.balance || 0);
        monthlyData[monthKey].dates.push(date);
        monthlyData[monthKey].balances.push(balance);
        
        if (!monthlyData[monthKey].firstBalance || date < monthlyData[monthKey].firstDate) {
          monthlyData[monthKey].firstBalance = balance;
          monthlyData[monthKey].firstDate = date;
        }
        if (!monthlyData[monthKey].lastBalance || date > monthlyData[monthKey].lastDate) {
          monthlyData[monthKey].lastBalance = balance;
          monthlyData[monthKey].lastDate = date;
        }
      }
    });

    // Calculate monthly gain percentages
    return Object.values(monthlyData)
      .map((month) => {
        if (month.firstBalance && month.firstBalance > 0) {
          const gain = ((month.lastBalance - month.firstBalance) / month.firstBalance) * 100;
          return {
            month: month.monthName,
            monthKey: month.monthKey,
            gain: gain,
            firstBalance: month.firstBalance,
            lastBalance: month.lastBalance,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [dailyData]);

  const [startingEquity, setStartingEquity] = useState(10000);
  const [growthRate, setGrowthRate] = useState(5); // Monthly growth rate in %
  const [timePeriod, setTimePeriod] = useState(12); // Months
  const [compoundingMode, setCompoundingMode] = useState("compounding"); // "compounding" or "non-compounding"
  const [isUsingHistoricalData, setIsUsingHistoricalData] = useState(false);

  // Update growth rate when historical data is available
  useEffect(() => {
    if (calculateAverageMonthlyGrowth !== null && !isUsingHistoricalData) {
      setGrowthRate(parseFloat(calculateAverageMonthlyGrowth.toFixed(2)));
      setIsUsingHistoricalData(true);
    }
  }, [calculateAverageMonthlyGrowth, isUsingHistoricalData]);

  // Update starting equity from account balance if available
  useEffect(() => {
    if (account && account.balance) {
      setStartingEquity(parseFloat(account.balance) || 10000);
    }
  }, [account]);

  // Calculate forecast
  const forecast = useMemo(() => {
    if (!startingEquity || !growthRate || !timePeriod) {
      return {
        finalEquity: 0,
        totalProfit: 0,
        totalReturn: 0,
        monthlyBreakdown: [],
      };
    }

    const monthlyBreakdown = [];
    let currentEquity = parseFloat(startingEquity);

    if (compoundingMode === "compounding") {
      // Compounding: Each month's growth is calculated on the new balance
      for (let month = 1; month <= timePeriod; month++) {
        const monthlyGrowth = currentEquity * (parseFloat(growthRate) / 100);
        const previousEquity = currentEquity;
        currentEquity = currentEquity + monthlyGrowth;
        monthlyBreakdown.push({
          month,
          startingBalance: previousEquity,
          growth: monthlyGrowth,
          endingBalance: currentEquity,
        });
      }
    } else {
      // Non-compounding: Growth is calculated on the original starting equity each month
      const monthlyGrowth = parseFloat(startingEquity) * (parseFloat(growthRate) / 100);
      for (let month = 1; month <= timePeriod; month++) {
        const previousEquity = currentEquity;
        currentEquity = currentEquity + monthlyGrowth;
        monthlyBreakdown.push({
          month,
          startingBalance: previousEquity,
          growth: monthlyGrowth,
          endingBalance: currentEquity,
        });
      }
    }

    const finalEquity = currentEquity;
    const totalProfit = finalEquity - parseFloat(startingEquity);
    const totalReturn = (totalProfit / parseFloat(startingEquity)) * 100;

    return {
      finalEquity,
      totalProfit,
      totalReturn,
      monthlyBreakdown,
    };
  }, [startingEquity, growthRate, timePeriod, compoundingMode]);

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl relative overflow-hidden">
      {/* Premium Apple-style glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.06] backdrop-blur-3xl rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5 rounded-3xl"></div>
      <div className="absolute inset-0 border border-white/25 rounded-3xl"></div>
      <div className="absolute inset-[0.5px] border border-white/15 rounded-3xl"></div>
      
      {/* Premium inner highlights */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-3xl pointer-events-none"></div>
      <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] rounded-3xl pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-neutral-400" />
        <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Equity Forecast Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-neutral-300 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                Starting Equity
              </div>
              {account && account.balance && (
                <button
                  onClick={() => setStartingEquity(parseFloat(account.balance) || 10000)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
                  title="Use current account balance"
                >
                  <RefreshCw className="w-3 h-3" />
                  Use Current
                </button>
              )}
            </label>
            <input
              type="number"
              value={startingEquity}
              onChange={(e) => setStartingEquity(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all"
              placeholder={account && account.balance ? `Current: ${parseFloat(account.balance).toLocaleString()}` : "Enter starting equity"}
              min="0"
              step="0.01"
            />
            {account && account.balance && (
              <p className="text-xs text-neutral-500 mt-1">
                Current balance: {account.currency} {parseFloat(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-neutral-300 mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-400" />
                Monthly Growth Rate (%)
              </div>
              {calculateAverageMonthlyGrowth !== null && (
                <button
                  onClick={() => {
                    setGrowthRate(parseFloat(calculateAverageMonthlyGrowth.toFixed(2)));
                    setIsUsingHistoricalData(true);
                  }}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
                  title="Use historical average growth rate"
                >
                  <RefreshCw className="w-3 h-3" />
                  Use Historical
                </button>
              )}
            </label>
            <input
              type="number"
              value={growthRate}
              onChange={(e) => {
                setGrowthRate(parseFloat(e.target.value) || 0);
                setIsUsingHistoricalData(false);
              }}
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all"
              placeholder={calculateAverageMonthlyGrowth !== null ? `Historical: ${calculateAverageMonthlyGrowth.toFixed(2)}%` : "Enter monthly growth rate"}
              min="0"
              max="100"
              step="0.1"
            />
            {calculateAverageMonthlyGrowth !== null && isUsingHistoricalData && (
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                <span>✓</span> Using historical average: {calculateAverageMonthlyGrowth.toFixed(2)}% per month
              </p>
            )}
            {calculateAverageMonthlyGrowth === null && dailyData.length > 0 && (
              <p className="text-xs text-yellow-400 mt-1">
                Unable to calculate historical growth rate. Please enter manually.
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              Time Period (Months)
            </label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all"
              placeholder="Enter time period in months"
              min="1"
              max="120"
              step="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
              <Calculator className="w-4 h-4 text-neutral-400" />
              Calculation Mode
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCompoundingMode("compounding")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  compoundingMode === "compounding"
                    ? "bg-neutral-700/30 border-2 border-neutral-500 text-neutral-400"
                    : "bg-neutral-800/50 border-2 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                Compounding
              </button>
              <button
                onClick={() => setCompoundingMode("non-compounding")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  compoundingMode === "non-compounding"
                    ? "bg-neutral-700/30 border-2 border-neutral-500 text-neutral-400"
                    : "bg-neutral-800/50 border-2 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                Non-Compounding
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              {compoundingMode === "compounding"
                ? "Growth is calculated on the new balance each month"
                : "Growth is calculated on the original starting equity each month"}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-lg">
            <h3 className="text-lg font-semibold text-neutral-300 mb-4">Forecast Results</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Final Equity</p>
                <p className="text-2xl font-bold text-neutral-400">
                  ${formatCurrency(forecast.finalEquity)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Profit</p>
                <p className={`text-xl font-semibold ${forecast.totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${formatCurrency(forecast.totalProfit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Return</p>
                <p className={`text-xl font-semibold ${forecast.totalReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {forecast.totalReturn >= 0 ? "+" : ""}{forecast.totalReturn.toFixed(2)}%
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Starting Equity</p>
                <p className="text-lg font-semibold text-white">
                  ${formatCurrency(startingEquity)}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          {compoundingMode === "compounding" && (
            <div className="p-4 bg-neutral-800/30 border border-neutral-500/30 rounded-lg">
              <p className="text-xs text-neutral-300">
                💡 With compounding, your returns grow exponentially as each month's profit is reinvested.
              </p>
            </div>
          )}
          {compoundingMode === "non-compounding" && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-300">
                💡 With non-compounding, growth is linear as it's calculated on the original equity each month.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Monthly Gain Chart */}
      {monthlyGains.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-neutral-200 mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Monthly Gain (Change)
          </h3>
          
          {/* Mobile/Tablet: Compact Bar Chart */}
          <div className="block md:hidden">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyGains}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 30,
                    }}
                  >
                    <defs>
                      {monthlyGains.map((_, index) => {
                        const colors = [
                          { start: '#3b82f6', end: '#2563eb' },
                          { start: '#8b5cf6', end: '#7c3aed' },
                          { start: '#06b6d4', end: '#0891b2' },
                          { start: '#10b981', end: '#059669' },
                          { start: '#6366f1', end: '#4f46e5' },
                        ];
                        const color = colors[index % colors.length] || { start: '#3b82f6', end: '#2563eb' };
                        return (
                          <linearGradient key={`barGradMobile-${index}`} id={`barGradMobile-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color.start} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={color.end} stopOpacity={0.7} />
                          </linearGradient>
                        );
                      })}
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.15} vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      fontSize={9}
                      tick={{ fill: '#9ca3af', fontSize: 9 }}
                      angle={-30}
                      textAnchor="end"
                      height={40}
                      interval={0}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={9}
                      tick={{ fill: '#9ca3af', fontSize: 9 }}
                      tickFormatter={(value) => `${value}%`}
                      width={35}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-600/50 rounded-lg px-3 py-2 text-[10px] shadow-2xl backdrop-blur-sm">
                              <div className="text-neutral-300 font-bold mb-1 text-[11px] border-b border-neutral-700 pb-1">
                                {data.month}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between gap-4 items-center">
                                  <span className="text-neutral-400 text-[9px]">Gain:</span>
                                  <span className={`font-bold text-[10px] ${
                                    data.gain >= 0 ? "text-green-400" : "text-red-400"
                                  }`}>
                                    {data.gain >= 0 ? "+" : ""}{data.gain.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" opacity={0.4} />
                    <Bar dataKey="gain" radius={[4, 4, 0, 0]}>
                      {monthlyGains.map((entry, index) => {
                        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#6366f1'];
                        const barColor = entry.gain >= 0 ? colors[index % colors.length] : '#ef4444';
                        return (
                          <Cell key={`cell-${index}`} fill={entry.gain >= 0 ? `url(#barGradMobile-${index})` : '#ef4444'} />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Desktop: Full Featured Chart */}
          <div className="hidden md:block relative rounded-2xl lg:rounded-3xl p-6 lg:p-8 mb-8 overflow-hidden">
            {/* Premium Apple glassmorphism for chart */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.06] backdrop-blur-3xl rounded-2xl lg:rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5 rounded-2xl lg:rounded-3xl"></div>
            <div className="absolute inset-0 border border-white/25 rounded-2xl lg:rounded-3xl"></div>
            <div className="absolute inset-[0.5px] border border-white/15 rounded-2xl lg:rounded-3xl"></div>
            
            {/* Premium inner highlights */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-2xl lg:rounded-t-3xl pointer-events-none"></div>
            <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] rounded-2xl lg:rounded-3xl pointer-events-none"></div>
            
            {/* Content container */}
            <div className="relative z-10">
              <div className="h-80 lg:h-[28rem] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyGains}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 0,
                      bottom: 40,
                    }}
                  >
                    <defs>
                      {monthlyGains.map((_, index) => {
                        const colors = [
                          { start: '#3b82f6', end: '#2563eb' },
                          { start: '#8b5cf6', end: '#7c3aed' },
                          { start: '#06b6d4', end: '#0891b2' },
                          { start: '#10b981', end: '#059669' },
                          { start: '#6366f1', end: '#4f46e5' },
                        ];
                        const color = colors[index % colors.length] || { start: '#3b82f6', end: '#2563eb' };
                        return (
                          <linearGradient key={`barGrad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color.start} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={color.end} stopOpacity={0.7} />
                          </linearGradient>
                        );
                      })}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      fontSize={11}
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={11}
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      tickFormatter={(value) => `${value}%`}
                      width={50}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-neutral-600/50 rounded-xl px-4 py-3 text-xs shadow-2xl backdrop-blur-sm">
                              <div className="text-neutral-300 font-bold mb-2 text-sm border-b border-neutral-700 pb-2">
                                {data.month}
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between gap-6 items-center">
                                  <span className="text-neutral-400 text-xs">Gain:</span>
                                  <span className={`font-bold text-sm ${
                                    data.gain >= 0 ? "text-green-400" : "text-red-400"
                                  }`}>
                                    {data.gain >= 0 ? "+" : ""}{data.gain.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" opacity={0.5} />
                    <Bar dataKey="gain" radius={[6, 6, 0, 0]}>
                      {monthlyGains.map((entry, index) => {
                        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#6366f1'];
                        return (
                          <Cell key={`cell-${index}`} fill={entry.gain >= 0 ? `url(#barGrad-${index})` : '#ef4444'} />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Table */}
      {forecast.monthlyBreakdown.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-neutral-300 mb-4">Monthly Breakdown</h3>
          <div className="bg-neutral-800/30 rounded-lg overflow-hidden border border-neutral-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-900/50">
                  <tr>
                    <th className="text-left p-3 text-neutral-400">Month</th>
                    <th className="text-right p-3 text-neutral-400">Starting Balance</th>
                    <th className="text-right p-3 text-neutral-400">Growth</th>
                    <th className="text-right p-3 text-neutral-400">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.monthlyBreakdown.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-neutral-700/50 hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-3 text-neutral-300 font-semibold">{row.month}</td>
                      <td className="p-3 text-white text-right font-mono">
                        ${formatCurrency(row.startingBalance)}
                      </td>
                      <td className={`p-3 text-right font-mono font-semibold ${
                        row.growth >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {row.growth >= 0 ? "+" : ""}${formatCurrency(row.growth)}
                      </td>
                      <td className={`p-3 text-right font-mono font-semibold ${
                        (row.growth / row.startingBalance) * 100 >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {((row.growth / row.startingBalance) * 100 >= 0 ? "+" : "")}{((row.growth / row.startingBalance) * 100).toFixed(2)}%
                      </td>
                      <td className="p-3 text-neutral-400 text-right font-mono font-bold">
                        ${formatCurrency(row.endingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

