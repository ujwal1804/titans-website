import { NextResponse } from "next/server";
import { saveAccountData, saveDailyData } from "@/lib/dashboard-db";
import { getCollection } from "@/lib/mongodb";

// Use the base URL for internal API calls
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Default to localhost for development
  return 'http://localhost:3000';
};

/**
 * Helper function to login and get session
 */
async function getSessionFromLogin() {
  try {
    const email = process.env.MYFXBOOK_EMAIL;
    let password = process.env.MYFXBOOK_PASSWORD;
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    if (password) {
      password = password.replace(/^["']|["']$/g, '');
    }

    if (!email || !password) {
      throw new Error("MyFxBook credentials are not configured");
    }

    const loginUrl = `${apiBaseUrl}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const response = await fetch(loginUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.error === false && data.session) {
      return data.session;
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error getting session from login:", error);
    throw error;
  }
}

/**
 * Get bot start date (August 1, 2025)
 */
function getBotStartDate() {
  return "2025-08-01";
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

export async function GET(request) {
  try {
    const results = {
      success: false,
      accountSaved: false,
      dailyDataSaved: false,
      accountData: null,
      dailyDataCount: 0,
      errors: [],
      messages: []
    };

    // Step 1: Login to get session
    let session;
    try {
      session = await getSessionFromLogin();
      results.messages.push("✓ Successfully logged in to MyFxBook");
      results.sessionLength = session ? session.length : 0;
    } catch (error) {
      results.errors.push(`Login failed: ${error.message}`);
      return NextResponse.json(results, { status: 500 });
    }

    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";
    const accountId = "11808068";
    const startDate = getBotStartDate();
    const endDate = getCurrentDate();

    // Helper function to get fresh session if needed
    const getFreshSession = async () => {
      try {
        return await getSessionFromLogin();
      } catch (error) {
        throw new Error(`Failed to get fresh session: ${error.message}`);
      }
    };

    // Step 2: Get account data using our internal API route (which handles sessions correctly)
    try {
      const baseUrl = getBaseUrl();
      const accountsApiUrl = `${baseUrl}/api/myfxbook/get-accounts`;
      
      // Use our internal API which handles login automatically
      const accountsResponse = await fetch(accountsApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Don't use cache
        cache: 'no-store'
      });

      const accountsData = await accountsResponse.json();

      if (accountsData.success && accountsData.account) {
        // The API already returns the filtered account
        const targetAccount = accountsData.account;
        results.accountData = {
          id: targetAccount.id,
          name: targetAccount.name,
          balance: targetAccount.balance,
          profit: targetAccount.profit,
          gain: targetAccount.gain
        };

        // Save account data to MongoDB (the API route should have already saved it, but we'll save again to be sure)
        const saveAccountResult = await saveAccountData(targetAccount);
        if (saveAccountResult.success) {
          results.accountSaved = true;
          results.messages.push(`✓ Account data saved to MongoDB (${saveAccountResult.inserted ? 'inserted' : 'updated'})`);
        } else {
          results.errors.push(`Failed to save account data: ${saveAccountResult.error}`);
        }
      } else {
        results.errors.push(`Failed to get accounts: ${accountsData.message || 'Unknown error'}`);
      }
    } catch (error) {
      results.errors.push(`Error fetching account data: ${error.message}`);
    }

    // Step 3: Get daily data using our internal API route
    try {
      const baseUrl = getBaseUrl();
      const dailyApiUrl = `${baseUrl}/api/myfxbook/get-data-daily?id=${accountId}&start=${startDate}&end=${endDate}`;
      
      // Use our internal API which handles login automatically
      const dailyResponse = await fetch(dailyApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Don't use cache
        cache: 'no-store'
      });

      const dailyData = await dailyResponse.json();

      if (dailyData.success && dailyData.dataDaily) {
        // Flatten the nested array structure
        const flattenedData = Array.isArray(dailyData.dataDaily) ? dailyData.dataDaily.flat() : [];
        results.dailyDataCount = flattenedData.length;

        if (flattenedData.length > 0) {
          // Save daily data to MongoDB
          const saveDailyResult = await saveDailyData(flattenedData, accountId, startDate, endDate);
          if (saveDailyResult.success) {
            results.dailyDataSaved = true;
            results.messages.push(`✓ Daily data saved to MongoDB: ${saveDailyResult.saved} entries (${saveDailyResult.inserted} inserted, ${saveDailyResult.modified} updated)`);
          } else {
            results.errors.push(`Failed to save daily data: ${saveDailyResult.error}`);
          }
        } else {
          results.messages.push("⚠ No daily data to save");
        }
      } else {
        results.errors.push(`Failed to get daily data: ${dailyData.message || 'Unknown error'}`);
      }
    } catch (error) {
      results.errors.push(`Error fetching daily data: ${error.message}`);
    }

    // Step 4: Verify data in MongoDB
    try {
      const collection = await getCollection('dashboard_data');
      
      // Count account documents
      const accountCount = await collection.countDocuments({ type: 'account', accountId: accountId });
      
      // Count daily documents
      const dailyCount = await collection.countDocuments({ type: 'daily', accountId: accountId });
      
      results.mongodbStats = {
        accountDocuments: accountCount,
        dailyDocuments: dailyCount
      };
      
      results.messages.push(`✓ MongoDB verification: ${accountCount} account document(s), ${dailyCount} daily document(s)`);
    } catch (error) {
      results.errors.push(`Error verifying MongoDB data: ${error.message}`);
    }

    results.success = results.accountSaved && results.dailyDataSaved;

    return NextResponse.json(results, {
      status: results.success ? 200 : 500
    });
  } catch (error) {
    console.error("Error in save-to-mongodb:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

