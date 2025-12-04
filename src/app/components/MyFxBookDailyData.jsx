"use client";

import React, { useState, useEffect } from "react";
import { useMyFxBook } from "@/hooks/useMyFxBook";

/**
 * MyFxBook Daily Data Component
 * Displays daily trading data for the past 4 months
 */
export default function MyFxBookDailyData({ accountId = "11808068" }) {
  const { session, loading, error, getDailyData, isAuthenticated } = useMyFxBook();
  const [dailyData, setDailyData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    if (isAuthenticated) {
      loadDailyData();
    }
  }, [isAuthenticated, accountId]);

  const loadDailyData = async () => {
    setDataLoading(true);
    setDataError(null);
    
    const result = await getDailyData(accountId);
    
    if (result.success && result.dataDaily) {
      // Flatten the nested array structure
      const flattened = result.dataDaily.flat();
      setDailyData(flattened);
      if (result.startDate && result.endDate) {
        setDateRange({ start: result.startDate, end: result.endDate });
      }
    } else {
      setDataError(result.message || "Failed to retrieve daily data");
    }
    
    setDataLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400">Please login first to view daily data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-2">
            Daily Trading Data
          </h2>
          {dateRange.start && dateRange.end && (
            <p className="text-sm text-neutral-400">
              {dateRange.start} to {dateRange.end} (Past 4 Months)
            </p>
          )}
        </div>
        <button
          onClick={loadDailyData}
          disabled={dataLoading || loading}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dataLoading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      {dataError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <p className="text-red-400">{dataError}</p>
        </div>
      )}

      {dataLoading && (
        <div className="p-8 text-center">
          <p className="text-neutral-400">Loading daily data...</p>
        </div>
      )}

      {dailyData.length === 0 && !dataLoading && !dataError && (
        <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
          <p className="text-neutral-400">No daily data found. Click "Refresh Data" to load.</p>
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left p-3 text-sm font-semibold text-neutral-300">Date</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Balance</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Profit</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Pips</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Lots</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Growth Equity</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Floating PL</th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-300">Floating Pips</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="p-3 text-sm text-neutral-300">{day.date}</td>
                  <td className="p-3 text-sm text-white text-right font-mono">
                    {parseFloat(day.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`p-3 text-sm text-right font-mono font-semibold ${
                    parseFloat(day.profit) >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {parseFloat(day.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-sm text-neutral-300 text-right font-mono">
                    {parseFloat(day.pips).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-sm text-neutral-300 text-right font-mono">
                    {parseFloat(day.lots).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`p-3 text-sm text-right font-mono ${
                    parseFloat(day.growthEquity) >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {parseFloat(day.growthEquity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                  </td>
                  <td className={`p-3 text-sm text-right font-mono ${
                    parseFloat(day.floatingPL) >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {parseFloat(day.floatingPL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-sm text-neutral-300 text-right font-mono">
                    {parseFloat(day.floatingPips).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-800/30 border border-neutral-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-400">Total Days</p>
              <p className="text-xl font-bold text-white">{dailyData.length}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Latest Balance</p>
              <p className="text-xl font-bold text-white">
                {dailyData.length > 0 && parseFloat(dailyData[dailyData.length - 1].balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Profit</p>
              <p className={`text-xl font-bold ${
                dailyData.reduce((sum, day) => sum + parseFloat(day.profit || 0), 0) >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {dailyData.reduce((sum, day) => sum + parseFloat(day.profit || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Pips</p>
              <p className="text-xl font-bold text-white">
                {dailyData.reduce((sum, day) => sum + parseFloat(day.pips || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

