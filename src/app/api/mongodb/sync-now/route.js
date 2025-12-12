import { NextResponse } from "next/server";
import { 
  saveMyFxBookAccount, 
  saveMyFxBookDailyData, 
  saveMyFxBookGain, 
  saveMyFxBookDailyGain 
} from "@/lib/mongodb-service";
import { getCollection } from "@/lib/mongodb";

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

/**
 * Manual sync endpoint - directly syncs data from MyFxBook API to MongoDB
 * This can be used to manually trigger a data sync
 */
export async function GET(request) {
  try {
    const results = {
      success: false,
      accountSaved: false,
      dailyDataSaved: false,
      accountData: null,
      dailyDataCount: 0,
      timestamp: new Date().toISOString(),
      errors: [],
      messages: []
    };

    // Step 1: Login to get session
    let session;
    try {
      session = await getSessionFromLogin();
      results.messages.push("✓ Successfully logged in to MyFxBook");
    } catch (error) {
      results.errors.push(`Login failed: ${error.message}`);
      return NextResponse.json(results, { status: 500 });
    }

    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";
    const accountId = "11808068";
    const startDate = getBotStartDate();
    const endDate = getCurrentDate();

    // Step 2: Get account data
    try {
      const accountsUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(session)}`;
      const accountsResponse = await fetch(accountsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const accountsData = await accountsResponse.json();

      if (accountsData.error === false && accountsData.accounts) {
        const targetAccount = accountsData.accounts.find(
          account => account.id === accountId || account.accountId === accountId
        );

        if (targetAccount) {
          results.accountData = {
            id: targetAccount.id,
            name: targetAccount.name,
            balance: targetAccount.balance,
            profit: targetAccount.profit,
            gain: targetAccount.gain
          };

          const saveAccountResult = await saveMyFxBookAccount(targetAccount);
          if (saveAccountResult.success) {
            results.accountSaved = true;
            results.messages.push(`✓ Account data saved to MongoDB`);
          } else {
            results.errors.push(`Failed to save account data: ${saveAccountResult.error}`);
          }
        } else {
          results.errors.push(`Account ${accountId} not found`);
        }
      } else {
        // Retry with fresh session
        if (accountsData.message && accountsData.message.includes("Invalid session")) {
          try {
            session = await getSessionFromLogin();
            const retryUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(session)}`;
            const retryResponse = await fetch(retryUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const retryData = await retryResponse.json();
            
            if (retryData.error === false && retryData.accounts) {
              const targetAccount = retryData.accounts.find(
                account => account.id === accountId || account.accountId === accountId
              );
              if (targetAccount) {
                const saveAccountResult = await saveMyFxBookAccount(targetAccount);
                if (saveAccountResult.success) {
                  results.accountSaved = true;
                  results.messages.push(`✓ Account data saved to MongoDB (retry)`);
                }
              }
            }
          } catch (retryError) {
            results.errors.push(`Retry failed: ${retryError.message}`);
          }
        } else {
          results.errors.push(`Failed to get accounts: ${accountsData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error fetching account data: ${error.message}`);
    }

    // Step 3: Get daily data
    try {
      const dailyUrl = `${apiBaseUrl}/get-data-daily.json?session=${encodeURIComponent(session)}&id=${accountId}&start=${startDate}&end=${endDate}`;
      const dailyResponse = await fetch(dailyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dailyData = await dailyResponse.json();

      if (dailyData.error === false && dailyData.dataDaily) {
        const flattenedData = Array.isArray(dailyData.dataDaily) ? dailyData.dataDaily.flat() : [];
        results.dailyDataCount = flattenedData.length;

        if (flattenedData.length > 0) {
          const saveDailyResult = await saveMyFxBookDailyData(flattenedData, accountId, startDate, endDate);
          if (saveDailyResult.success) {
            results.dailyDataSaved = true;
            results.messages.push(`✓ Daily data saved: ${saveDailyResult.saved} entries`);
          } else {
            results.errors.push(`Failed to save daily data: ${saveDailyResult.error}`);
          }
        }
      } else {
        // Retry with fresh session
        if (dailyData.message && dailyData.message.includes("Invalid session")) {
          try {
            session = await getSessionFromLogin();
            const retryUrl = `${apiBaseUrl}/get-data-daily.json?session=${encodeURIComponent(session)}&id=${accountId}&start=${startDate}&end=${endDate}`;
            const retryResponse = await fetch(retryUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const retryData = await retryResponse.json();
            
            if (retryData.error === false && retryData.dataDaily) {
              const flattenedData = Array.isArray(retryData.dataDaily) ? retryData.dataDaily.flat() : [];
              if (flattenedData.length > 0) {
                const saveDailyResult = await saveMyFxBookDailyData(flattenedData, accountId, startDate, endDate);
                if (saveDailyResult.success) {
                  results.dailyDataSaved = true;
                  results.messages.push(`✓ Daily data saved (retry): ${saveDailyResult.saved} entries`);
                }
              }
            }
          } catch (retryError) {
            results.errors.push(`Daily data retry failed: ${retryError.message}`);
          }
        } else {
          results.errors.push(`Failed to get daily data: ${dailyData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error fetching daily data: ${error.message}`);
    }

    // Step 4: Verify data in MongoDB
    try {
      const accountsCollection = await getCollection('myfxbook_accounts');
      const dailyCollection = await getCollection('myfxbook_daily_data');
      const accountIdStr = String(accountId);
      const accountIdNum = parseInt(accountIdStr, 10);
      
      const accountCount = await accountsCollection.countDocuments({ 
        accountId: { $in: [accountIdStr, accountIdNum] } 
      });
      const dailyCount = await dailyCollection.countDocuments({ 
        accountId: { $in: [accountIdStr, accountIdNum] } 
      });
      
      results.mongodbStats = {
        accountDocuments: accountCount,
        dailyDocuments: dailyCount
      };
      
      results.messages.push(`✓ MongoDB: ${accountCount} account(s), ${dailyCount} daily entries`);
    } catch (error) {
      console.error('Error verifying MongoDB:', error);
      results.errors.push(`Error verifying MongoDB: ${error.message}`);
    }

    // Consider it successful if at least one operation succeeded
    // This allows partial success scenarios
    results.success = results.accountSaved || results.dailyDataSaved;

    // Return 200 even if there were errors, as long as we have some data or attempted sync
    // The frontend can check the success flag and errors array
    return NextResponse.json(results, {
      status: 200
    });
  } catch (error) {
    console.error("Error in sync-now:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      success: false,
      error: error.message,
      errors: [error.message],
      messages: [],
      timestamp: new Date().toISOString(),
    }, { status: 200 }); // Return 200 so frontend can handle the error
  }
}


