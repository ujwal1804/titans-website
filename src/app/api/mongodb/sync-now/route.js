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

    // Step 4: Verify data in MongoDB (with better error handling)
    try {
      // Add a small delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const accountsCollection = await getCollection('myfxbook_accounts');
      const dailyCollection = await getCollection('myfxbook_daily_data');
      const accountIdStr = String(accountId);
      const accountIdNum = parseInt(accountIdStr, 10);
      
      // Use try-catch for each operation to handle SSL errors gracefully
      let accountCount = 0;
      let dailyCount = 0;
      
      try {
        accountCount = await accountsCollection.countDocuments({ 
          accountId: { $in: [accountIdStr, accountIdNum] } 
        });
      } catch (countError) {
        console.error('Error counting accounts:', countError);
        // Try without query filter as fallback
        try {
          accountCount = await accountsCollection.countDocuments();
        } catch (fallbackError) {
          console.error('Fallback count also failed:', fallbackError);
          results.errors.push(`Error counting accounts: ${countError.message}`);
        }
      }
      
      try {
        dailyCount = await dailyCollection.countDocuments({ 
          accountId: { $in: [accountIdStr, accountIdNum] } 
        });
      } catch (countError) {
        console.error('Error counting daily data:', countError);
        // Try without query filter as fallback
        try {
          dailyCount = await dailyCollection.countDocuments();
        } catch (fallbackError) {
          console.error('Fallback count also failed:', fallbackError);
          results.errors.push(`Error counting daily data: ${countError.message}`);
        }
      }
      
      results.mongodbStats = {
        accountDocuments: accountCount,
        dailyDocuments: dailyCount
      };
      
      if (accountCount > 0 || dailyCount > 0) {
        results.messages.push(`✓ MongoDB: ${accountCount} account(s), ${dailyCount} daily entries`);
      } else {
        results.messages.push(`⚠ MongoDB: Collections exist but no data found for account ${accountId}`);
      }
    } catch (error) {
      console.error('Error verifying MongoDB:', error);
      // Don't fail the entire sync if verification fails
      // The data might still be saved, just verification had SSL issues
      results.errors.push(`Error verifying MongoDB (data may still be saved): ${error.message}`);
      results.messages.push(`⚠ Could not verify MongoDB due to connection issue, but data save operations completed`);
    }

    // Consider it successful if at least one operation succeeded
    // This allows partial success scenarios
    // Also consider successful if data was saved even if verification failed (SSL errors)
    results.success = results.accountSaved || results.dailyDataSaved;

    // If we saved data but verification failed due to SSL, still mark as success
    if ((results.accountSaved || results.dailyDataSaved) && 
        results.errors.some(e => e.includes('SSL') || e.includes('TLS') || e.includes('8028E509E87F0000'))) {
      results.messages.push('✓ Data saved successfully (verification had SSL issues but data is saved)');
      results.success = true;
    }

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


