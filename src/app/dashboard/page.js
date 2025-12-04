"use client";

import { useEffect, useState } from "react";
import { useMyFxBook } from "@/hooks/useMyFxBook";
import AccountOverview from "../components/AccountOverview";
import DailyDataChart from "../components/DailyDataChart";
import PerformanceMetrics from "../components/PerformanceMetrics";
import TradingStats from "../components/TradingStats";
import ForecastCalculator from "../components/ForecastCalculator";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { session, loading, error, login, getAccounts, getDailyData, isAuthenticated } = useMyFxBook();
  const [account, setAccount] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      // Auto-login on mount
      handleLogin();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    await login();
  };

  const loadData = async () => {
    setDataLoading(true);
    
    try {
      // Load account data
      const accountsResult = await getAccounts();
      if (accountsResult.success && accountsResult.account) {
        setAccount(accountsResult.account);
        
        // Load daily data for this account
        const dailyResult = await getDailyData(accountsResult.account.id || "11808068");
        if (dailyResult.success && dailyResult.dataDaily) {
          // Flatten the nested array structure
          const flattened = dailyResult.dataDaily.flat();
          setDailyData(flattened);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Logging in to MyFxBook...</p>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors"
          >
            Retry Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-[95vw] md:w-[85vw] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Trading Dashboard
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg">
            Real-time performance metrics and trading analytics
          </p>
        </div>

        {/* Loading State */}
        {dataLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading trading data...</p>
          </div>
        )}

        {/* Account Overview */}
        {account && !dataLoading && (
          <>
            <AccountOverview account={account} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
              {/* Performance Metrics */}
              <div className="lg:col-span-2">
                <PerformanceMetrics account={account} dailyData={dailyData} />
              </div>
              
              {/* Trading Stats */}
              <div>
                <TradingStats account={account} />
              </div>
            </div>

            {/* Daily Data Chart */}
            {dailyData.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <DailyDataChart dailyData={dailyData} account={account} />
              </div>
            )}

            {/* Forecast Calculator */}
            <div className="mt-6 sm:mt-8">
              <ForecastCalculator account={account} dailyData={dailyData} />
            </div>
          </>
        )}

        {/* No Data State */}
        {!account && !dataLoading && isAuthenticated && (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-4">No account data available</p>
            <button
              onClick={loadData}
              className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors"
            >
              Load Data
            </button>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}

