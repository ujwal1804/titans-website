"use client";

import { useState, useCallback, useEffect } from "react";
import { loginToMyFxBook, getStoredSession, clearSession, getMyFxBookAccounts, getMyFxBookDailyData, getMyFxBookGain, getMyFxBookDailyGain } from "@/lib/myfxbook";

/**
 * Custom hook for MyFxBook authentication
 * @returns {Object} Hook object with login function, session state, and loading/error states
 */
export function useMyFxBook() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize session from localStorage
  useEffect(() => {
    const storedSession = getStoredSession();
    if (storedSession) {
      setSession(storedSession);
    }
  }, []);

  /**
   * Login to MyFxBook
   * @param {string} email - Optional email (uses default if not provided)
   * @param {string} password - Optional password (uses default if not provided)
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginToMyFxBook(email, password);

      if (result.success && result.session) {
        setSession(result.session);
        return result;
      } else {
        setError(result.message || "Login failed");
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout and clear session
   */
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setError(null);
  }, []);

  /**
   * Get accounts using current session
   */
  const getAccounts = useCallback(async (customSession) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyFxBookAccounts(customSession || session);
      return result;
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        accounts: [],
      };
    } finally {
      setLoading(false);
    }
  }, [session]);

  /**
   * Get daily data for an account (past 4 months by default)
   */
  const getDailyData = useCallback(async (accountId = "11808068", startDate, endDate, customSession) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyFxBookDailyData(customSession || session, accountId, startDate, endDate);
      return result;
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
  }, [session]);

  /**
   * Get gain for an account for a specific date range
   */
  const getGain = useCallback(async (accountId = "11808068", startDate, endDate, customSession) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyFxBookGain(customSession || session, accountId, startDate, endDate);
      return result;
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        value: null,
      };
    } finally {
      setLoading(false);
    }
  }, [session]);

  /**
   * Get daily gain for an account (past 4 months by default)
   */
  const getDailyGain = useCallback(async (accountId = "11808068", startDate, endDate, customSession) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyFxBookDailyGain(customSession || session, accountId, startDate, endDate);
      return result;
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: true,
        message: errorMessage,
        dailyGain: [],
      };
    } finally {
      setLoading(false);
    }
  }, [session]);

  return {
    session,
    loading,
    error,
    login,
    logout,
    getAccounts,
    getDailyData,
    getGain,
    getDailyGain,
    isAuthenticated: !!session,
  };
}

