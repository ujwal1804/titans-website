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
 * Cron job endpoint to sync data from MyFxBook API to MongoDB
 * This should be called once per day
 * 
 * To use with Vercel Cron, add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-data",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 * 
 * Or use an external cron service like cron-job.org to call this endpoint daily
 */
export async function GET(request) {
  try {
    // Optional: Add authentication to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized"
      }, { status: 401 });
    }

    const results = {
      success: false,
      accountSaved: false,
      dailyDataSaved: false,
      gainSaved: false,
      dailyGainSaved: false,
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
        // Filter to only get account with ID 11808068
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

          // Save account data to MongoDB
          const saveAccountResult = await saveMyFxBookAccount(targetAccount);
          if (saveAccountResult.success) {
            results.accountSaved = true;
            results.messages.push(`✓ Account data saved to MongoDB (${saveAccountResult.inserted ? 'inserted' : 'updated'})`);
          } else {
            results.errors.push(`Failed to save account data: ${saveAccountResult.error}`);
          }
        } else {
          results.errors.push(`Account ${accountId} not found in accounts list`);
        }
      } else {
        // If session is invalid, try to login again and retry
        if (accountsData.message && accountsData.message.includes("Invalid session")) {
          try {
            results.messages.push("⚠ Session invalid, retrying with fresh session...");
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
                const saveAccountResult = await saveAccountData(targetAccount);
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
        // Flatten the nested array structure
        const flattenedData = Array.isArray(dailyData.dataDaily) ? dailyData.dataDaily.flat() : [];
        results.dailyDataCount = flattenedData.length;

        if (flattenedData.length > 0) {
          // Save daily data to MongoDB
          const saveDailyResult = await saveMyFxBookDailyData(flattenedData, accountId, startDate, endDate);
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
        // If session is invalid, try to login again and retry
        if (dailyData.message && dailyData.message.includes("Invalid session")) {
          try {
            results.messages.push("⚠ Session invalid for daily data, retrying with fresh session...");
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
                  results.messages.push(`✓ Daily data saved to MongoDB (retry): ${saveDailyResult.saved} entries`);
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

    // Step 4: Get and save gain data
    try {
      const gainUrl = `${apiBaseUrl}/get-gain.json?session=${encodeURIComponent(session)}&id=${accountId}&start=${startDate}&end=${endDate}`;
      const gainResponse = await fetch(gainUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const gainData = await gainResponse.json();

      if (gainData.error === false && gainData.value !== undefined) {
        const saveGainResult = await saveMyFxBookGain({ value: gainData.value }, accountId, startDate, endDate);
        if (saveGainResult.success) {
          results.gainSaved = true;
          results.messages.push(`✓ Gain data saved to MongoDB`);
        }
      }
    } catch (error) {
      results.errors.push(`Error fetching/saving gain data: ${error.message}`);
    }

    // Step 5: Get and save daily gain data
    try {
      const dailyGainUrl = `${apiBaseUrl}/get-daily-gain.json?session=${encodeURIComponent(session)}&id=${accountId}&start=${startDate}&end=${endDate}`;
      const dailyGainResponse = await fetch(dailyGainUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dailyGainData = await dailyGainResponse.json();

      if (dailyGainData.error === false && dailyGainData.dailyGain && Array.isArray(dailyGainData.dailyGain)) {
        const saveDailyGainResult = await saveMyFxBookDailyGain(dailyGainData.dailyGain, accountId, startDate, endDate);
        if (saveDailyGainResult.success) {
          results.dailyGainSaved = true;
          results.messages.push(`✓ Daily gain data saved: ${saveDailyGainResult.saved} entries`);
        }
      }
    } catch (error) {
      results.errors.push(`Error fetching/saving daily gain data: ${error.message}`);
    }

    // Step 6: Verify data in MongoDB
    try {
      const accountsCollection = await getCollection('myfxbook_accounts');
      const dailyCollection = await getCollection('myfxbook_daily_data');
      const gainCollection = await getCollection('myfxbook_gain');
      const dailyGainCollection = await getCollection('myfxbook_daily_gain');
      
      const accountIdStr = String(accountId);
      const accountCount = await accountsCollection.countDocuments({ accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] } });
      const dailyCount = await dailyCollection.countDocuments({ accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] } });
      const gainCount = await gainCollection.countDocuments({ accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] } });
      const dailyGainCount = await dailyGainCollection.countDocuments({ accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] } });
      
      results.mongodbStats = {
        accountDocuments: accountCount,
        dailyDocuments: dailyCount,
        gainDocuments: gainCount,
        dailyGainDocuments: dailyGainCount
      };
      
      results.messages.push(`✓ MongoDB verification: ${accountCount} account(s), ${dailyCount} daily entries, ${gainCount} gain(s), ${dailyGainCount} daily gain entries`);
    } catch (error) {
      results.errors.push(`Error verifying MongoDB data: ${error.message}`);
    }

    results.success = results.accountSaved && results.dailyDataSaved;

    // Log the results
    console.log('Cron job completed:', {
      success: results.success,
      accountSaved: results.accountSaved,
      dailyDataSaved: results.dailyDataSaved,
      timestamp: results.timestamp
    });

    return NextResponse.json(results, {
      status: results.success ? 200 : 500
    });
  } catch (error) {
    console.error("Error in cron sync-data:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

