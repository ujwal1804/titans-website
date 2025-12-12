"use client";

import { useEffect, useState } from "react";
import { useMongoDB } from "@/hooks/useMongoDB";
import AccountOverview from "../components/AccountOverview";
import DailyDataChart from "../components/DailyDataChart";
import PerformanceMetrics from "../components/PerformanceMetrics";
import TradingStats from "../components/TradingStats";
import ForecastCalculator from "../components/ForecastCalculator";
import Navbar from "../components/Navbar";
import MobileBottomNav from "../components/MobileBottomNav";

export default function DashboardPage() {
  const { loading, error, getDashboardData } = useMongoDB();
  const [account, setAccount] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    
    try {
      // Load dashboard data from MongoDB
      const result = await getDashboardData("11808068");
      if (result.success) {
        if (result.account) {
          setAccount(result.account);
        }
        if (result.dailyData) {
          // Ensure dailyData is an array
          const flattened = Array.isArray(result.dailyData) ? result.dailyData : [];
          setDailyData(flattened);
        }
      } else {
        console.error("Error loading data from MongoDB:", result.message);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setDataLoading(true);
    
    try {
      // Trigger manual sync
      const syncResponse = await fetch('/api/mongodb/sync-now');
      const syncResult = await syncResponse.json();
      
      if (syncResult.success) {
        // Wait a moment for data to be saved, then reload
        setTimeout(() => {
          loadData();
        }, 2000);
      } else {
        console.error("Sync failed:", syncResult.error);
        alert(`Sync failed: ${syncResult.error || syncResult.message}`);
        setDataLoading(false);
      }
    } catch (err) {
      console.error("Error syncing data:", err);
      alert(`Error syncing data: ${err.message}`);
      setDataLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Navbar */}
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-2 sm:mb-4">
            Trading Dashboard
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base lg:text-lg">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
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
              <div className="mt-4 sm:mt-6 md:mt-8">
                <DailyDataChart dailyData={dailyData} account={account} />
              </div>
            )}

            {/* Forecast Calculator */}
            <div className="mt-4 sm:mt-6 md:mt-8">
              <ForecastCalculator account={account} dailyData={dailyData} />
            </div>
          </>
        )}

        {/* No Data State */}
        {!account && !dataLoading && (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-4">
              {error ? `Error: ${error}` : "No account data available. The cron job may not have run yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={loadData}
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold transition-colors"
              >
                Reload Data
              </button>
              <button
                onClick={handleSyncNow}
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-semibold transition-colors"
              >
                Sync Data Now
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              Click "Sync Data Now" to fetch fresh data from MyFxBook API
            </p>
          </div>
        )}
        </div>
      </div>
      <MobileBottomNav />
    </main>
  );
}

