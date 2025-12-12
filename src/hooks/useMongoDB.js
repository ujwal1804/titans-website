"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for fetching data from MongoDB
 * @returns {Object} Hook object with data fetching functions and loading/error states
 */
export function useMongoDB() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get account data from MongoDB
   */
  const getAccount = useCallback(async (accountId = "11808068") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/mongodb/get-account?id=${accountId}`);
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          account: data.account,
        };
      } else {
        setError(data.message || "Failed to get account data");
        return {
          success: false,
          error: true,
          message: data.message,
          account: null,
        };
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        account: null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get daily data from MongoDB
   */
  const getDailyData = useCallback(async (accountId = "11808068", startDate = null, endDate = null) => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/mongodb/get-daily-data?id=${accountId}`;
      if (startDate) url += `&start=${startDate}`;
      if (endDate) url += `&end=${endDate}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          dataDaily: data.dataDaily,
          count: data.count,
        };
      } else {
        setError(data.message || "Failed to get daily data");
        return {
          success: false,
          error: true,
          message: data.message,
          dataDaily: [],
        };
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        dataDaily: [],
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all dashboard data (account + daily data) from MongoDB
   */
  const getDashboardData = useCallback(async (accountId = "11808068") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/db/dashboard?id=${accountId}`);
      const data = await response.json();
      
      // Return data even if success is false, as long as we have some data
      // This handles cases where data exists but response format isn't perfect
      // Also handle 200 responses with empty data gracefully
      if (data.account || (data.dailyData && data.dailyData.length > 0)) {
        return {
          success: true,
          account: data.account || null,
          dailyData: data.dailyData || [],
        };
      } else {
        // No data found - this is not necessarily an error
        // Data may not be available yet
        setError(data.message || "No data found in MongoDB");
        return {
          success: false,
          error: false, // Not an error, just no data
          message: data.message || "No data found in MongoDB",
          account: null,
          dailyData: [],
        };
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        account: null,
        dailyData: [],
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAccount,
    getDailyData,
    getDashboardData,
  };
}

