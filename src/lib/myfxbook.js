/**
 * MyFxBook API Service
 * Handles authentication and API calls to MyFxBook
 */

const API_BASE_URL = "/api/myfxbook";

/**
 * Login to MyFxBook and get session token
 * @param {string} email - User email (optional, uses default if not provided)
 * @param {string} password - User password (optional, uses default if not provided)
 * @returns {Promise<{success: boolean, session?: string, message?: string, error?: boolean}>}
 */
export async function loginToMyFxBook(email, password) {
  try {
    const url = `${API_BASE_URL}/login`;
    
    // If credentials are provided, use POST, otherwise use GET with defaults
    const options = email && password
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      : {
          method: "GET",
        };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.success && data.session) {
      // Store session in localStorage for future use
      if (typeof window !== "undefined") {
        localStorage.setItem("myfxbook_session", data.session);
      }
      return data;
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("MyFxBook login error:", error);
    return {
      success: false,
      error: true,
      message: error.message || "Failed to login to MyFxBook",
    };
  }
}

/**
 * Get stored session token from localStorage
 * @returns {string|null}
 */
export function getStoredSession() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("myfxbook_session");
  }
  return null;
}

/**
 * Clear stored session token
 */
export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("myfxbook_session");
  }
}

/**
 * Check if user is authenticated (has valid session)
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getStoredSession() !== null;
}

/**
 * Get MyFxBook accounts using session token
 * @param {string} session - Session token (optional, will auto-login if not provided)
 * @returns {Promise<{success: boolean, accounts?: Array, message?: string, error?: boolean}>}
 */
export async function getMyFxBookAccounts(session, retryCount = 0) {
  try {
    // If session is provided, use it; otherwise let the API auto-login
    const url = session 
      ? `${API_BASE_URL}/get-accounts?session=${encodeURIComponent(session)}`
      : `${API_BASE_URL}/get-accounts`; // API will auto-login if no session provided
    
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (data.success && data.accounts) {
      return data;
    } else {
      // If session is invalid and we haven't retried yet, clear stored session and retry without session (will auto-login)
      if (data.message && (data.message.includes("Invalid session") || data.message.includes("Session parameter is required")) && retryCount === 0) {
        console.log("Session invalid, clearing and retrying...");
        clearSession();
        // Retry without session to trigger auto-login
        return getMyFxBookAccounts(null, 1);
      }
      throw new Error(data.message || "Failed to retrieve accounts");
    }
  } catch (error) {
    console.error("MyFxBook get accounts error:", error);
    // If error is about invalid session and we haven't retried, clear it and retry once
    if (error.message && error.message.includes("Invalid session") && retryCount === 0) {
      clearSession();
      // Retry without session to trigger auto-login
      return getMyFxBookAccounts(null, 1);
    }
    return {
      success: false,
      error: true,
      message: error.message || "Failed to retrieve accounts from MyFxBook",
      accounts: [],
    };
  }
}

/**
 * Get bot start date (August 1, 2025)
 * @returns {string} Date in YYYY-MM-DD format
 */
function getBotStartDate() {
  // Bot has been running since August 2025
  return "2025-08-01";
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get daily data for MyFxBook account
 * @param {string} session - Session token (optional, will auto-login if not provided)
 * @param {string} accountId - Account ID (defaults to 11808068)
 * @param {string} startDate - Start date in YYYY-MM-DD format (optional, defaults to August 1, 2025)
 * @param {string} endDate - End date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<{success: boolean, dataDaily?: Array, message?: string, error?: boolean}>}
 */
export async function getMyFxBookDailyData(session, accountId = "11808068", startDate, endDate, retryCount = 0) {
  try {
    // Use provided dates or calculate defaults (August 2025 to today)
    const start = startDate || getBotStartDate();
    const end = endDate || getCurrentDate();

    // If session is provided, use it; otherwise let the API auto-login
    const url = session
      ? `${API_BASE_URL}/get-data-daily?session=${encodeURIComponent(session)}&id=${accountId}&start=${start}&end=${end}`
      : `${API_BASE_URL}/get-data-daily?id=${accountId}&start=${start}&end=${end}`; // API will auto-login if no session provided
    
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (data.success && data.dataDaily) {
      return data;
    } else {
      // If session is invalid and we haven't retried yet, clear stored session and retry without session (will auto-login)
      if (data.message && (data.message.includes("Invalid session") || data.message.includes("Session parameter is required")) && retryCount === 0) {
        console.log("Session invalid, clearing and retrying...");
        clearSession();
        // Retry without session to trigger auto-login
        return getMyFxBookDailyData(null, accountId, startDate, endDate, 1);
      }
      throw new Error(data.message || "Failed to retrieve daily data");
    }
  } catch (error) {
    console.error("MyFxBook get daily data error:", error);
    // If error is about invalid session and we haven't retried, clear it and retry once
    if (error.message && error.message.includes("Invalid session") && retryCount === 0) {
      clearSession();
      // Retry without session to trigger auto-login
      return getMyFxBookDailyData(null, accountId, startDate, endDate, 1);
    }
    return {
      success: false,
      error: true,
      message: error.message || "Failed to retrieve daily data from MyFxBook",
      dataDaily: [],
    };
  }
}

/**
 * Get MyFxBook gain for a specific account and date range
 * @param {string} session - Session token (optional, will auto-login if not provided)
 * @param {string} accountId - Account ID (defaults to 11808068)
 * @param {string} startDate - Start date in YYYY-MM-DD format (optional, defaults to August 1, 2025)
 * @param {string} endDate - End date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<{success: boolean, value?: number, message?: string, error?: boolean}>}
 */
export async function getMyFxBookGain(session, accountId = "11808068", startDate, endDate) {
  try {
    // Use provided dates or calculate defaults (August 2025 to today)
    const start = startDate || getBotStartDate();
    const end = endDate || getCurrentDate();

    // If session is provided, use it; otherwise let the API auto-login
    const url = session
      ? `${API_BASE_URL}/get-gain?session=${encodeURIComponent(session)}&id=${accountId}&start=${start}&end=${end}`
      : `${API_BASE_URL}/get-gain?id=${accountId}&start=${start}&end=${end}`; // API will auto-login if no session provided
    
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (data.success && data.value !== undefined) {
      return data;
    } else {
      throw new Error(data.message || "Failed to retrieve gain");
    }
  } catch (error) {
    console.error("MyFxBook get gain error:", error);
    return {
      success: false,
      error: true,
      message: error.message || "Failed to retrieve gain from MyFxBook",
      value: null,
    };
  }
}

/**
 * Get MyFxBook daily gain for a specific account and date range
 * @param {string} session - Session token (optional, will auto-login if not provided)
 * @param {string} accountId - Account ID (defaults to 11808068)
 * @param {string} startDate - Start date in YYYY-MM-DD format (optional, defaults to August 1, 2025)
 * @param {string} endDate - End date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<{success: boolean, dailyGain?: Array, message?: string, error?: boolean}>}
 */
export async function getMyFxBookDailyGain(session, accountId = "11808068", startDate, endDate) {
  try {
    // Use provided dates or calculate defaults (August 2025 to today)
    const start = startDate || getBotStartDate();
    const end = endDate || getCurrentDate();

    // If session is provided, use it; otherwise let the API auto-login
    const url = session
      ? `${API_BASE_URL}/get-daily-gain?session=${encodeURIComponent(session)}&id=${accountId}&start=${start}&end=${end}`
      : `${API_BASE_URL}/get-daily-gain?id=${accountId}&start=${start}&end=${end}`; // API will auto-login if no session provided
    
    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (data.success && data.dailyGain) {
      return data;
    } else {
      throw new Error(data.message || "Failed to retrieve daily gain");
    }
  } catch (error) {
    console.error("MyFxBook get daily gain error:", error);
    return {
      success: false,
      error: true,
      message: error.message || "Failed to retrieve daily gain from MyFxBook",
      dailyGain: [],
    };
  }
}

