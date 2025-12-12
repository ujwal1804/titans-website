import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";
import { saveAccountData } from "@/lib/dashboard-db";

/**
 * Helper function to login and get session
 */
async function getSessionFromLogin() {
  try {
    const email = process.env.MYFXBOOK_EMAIL;
    let password = process.env.MYFXBOOK_PASSWORD;
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    // Handle password - if it's wrapped in quotes, Next.js might include them, so we strip them
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

export async function GET(request) {
  try {
    // Check cache first
    const cacheKey = 'myfxbook_accounts_11808068';
    const cachedData = getCache(cacheKey);
    
    // Even if cached, ensure data is saved to MongoDB (in case it wasn't saved before)
    if (cachedData && cachedData.account) {
      try {
        const saveResult = await saveAccountData(cachedData.account);
        if (saveResult.success) {
          console.log('Saved cached account data to MongoDB');
        }
      } catch (dbError) {
        console.error('Error saving cached data to MongoDB:', dbError);
      }
      console.log('Returning cached accounts data');
      return NextResponse.json(cachedData);
    }

    // Get session from query parameters
    const { searchParams } = new URL(request.url);
    let session = searchParams.get("session");

    // If no session provided, automatically login to get one
    if (!session) {
      try {
        session = await getSessionFromLogin();
        console.log("Auto-logged in to get session");
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: true,
            message: `Failed to get session: ${error.message}`,
            accounts: [],
          },
          { status: 500 }
        );
      }
    }

    // Decode URL-encoded session if needed
    const decodedSession = decodeURIComponent(session);
    
    // Get API base URL from environment variables
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    // Construct the API URL
    const apiUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(decodedSession)}`;

    // Make the API call to MyFxBook
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response
    const data = await response.json();

    // Check if request was successful
    if (data.error === false) {
      // Filter to only return account with ID 11808068
      const targetAccountId = 11808068;
      const filteredAccounts = (data.accounts || []).filter(
        account => account.id === targetAccountId || account.accountId === targetAccountId
      );
      
      const responseData = {
        success: true,
        error: false,
        message: data.message || "Accounts retrieved successfully",
        accounts: filteredAccounts,
        // Also return the account directly for convenience
        account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
      };
      
      // Save to MongoDB if account exists
      if (responseData.account) {
        try {
          const saveResult = await saveAccountData(responseData.account);
          if (saveResult.success) {
            console.log('Saved account data to MongoDB');
          } else {
            console.error('Failed to save account data to MongoDB:', saveResult.error);
          }
        } catch (dbError) {
          console.error('Error saving to MongoDB:', dbError);
          // Don't fail the request if MongoDB save fails
        }
      }
      
      // Cache the response
      setCache(cacheKey, responseData);
      console.log('Cached accounts data');
      
      return NextResponse.json(responseData);
    } else {
      // If session is invalid, try to auto-login and retry once
      if (data.message && (data.message.includes("Invalid session") || data.message.includes("Session parameter is required"))) {
        try {
          console.log("Session invalid, attempting auto-login and retry...");
          const newSession = await getSessionFromLogin();
          const retryUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(newSession)}`;
          const retryResponse = await fetch(retryUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const retryData = await retryResponse.json();
          
          if (retryData.error === false) {
            const targetAccountId = 11808068;
            const filteredAccounts = (retryData.accounts || []).filter(
              account => account.id === targetAccountId || account.accountId === targetAccountId
            );
            const responseData = {
              success: true,
              error: false,
              message: retryData.message || "Accounts retrieved successfully",
              accounts: filteredAccounts,
              account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
            };
            
            // Save to MongoDB if account exists
            if (responseData.account) {
              try {
                const saveResult = await saveAccountData(responseData.account);
                if (saveResult.success) {
                  console.log('Saved account data to MongoDB (retry)');
                } else {
                  console.error('Failed to save account data to MongoDB:', saveResult.error);
                }
              } catch (dbError) {
                console.error('Error saving to MongoDB:', dbError);
                // Don't fail the request if MongoDB save fails
              }
            }
            
            // Cache the response
            setCache(cacheKey, responseData);
            console.log('Cached accounts data (retry)');
            
            return NextResponse.json(responseData);
          }
        } catch (retryError) {
          console.error("Error retrying with new session:", retryError);
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Failed to retrieve accounts",
          accounts: [],
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook get accounts:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
        accounts: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check cache first
    const cacheKey = 'myfxbook_accounts_11808068';
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached accounts data (POST)');
      return NextResponse.json(cachedData);
    }

    const body = await request.json();
    let { session } = body;

    // If no session provided, automatically login to get one
    if (!session) {
      try {
        session = await getSessionFromLogin();
        console.log("Auto-logged in to get session");
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: true,
            message: `Failed to get session: ${error.message}`,
            accounts: [],
          },
          { status: 500 }
        );
      }
    }

    // Decode URL-encoded session if needed
    const decodedSession = decodeURIComponent(session);
    
    // Get API base URL from environment variables
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    // Construct the API URL
    const apiUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(decodedSession)}`;

    // Make the API call to MyFxBook
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response
    const data = await response.json();

    // Check if request was successful
    if (data.error === false) {
      // Filter to only return account with ID 11808068
      const targetAccountId = 11808068;
      const filteredAccounts = (data.accounts || []).filter(
        account => account.id === targetAccountId || account.accountId === targetAccountId
      );
      
      const responseData = {
        success: true,
        error: false,
        message: data.message || "Accounts retrieved successfully",
        accounts: filteredAccounts,
        // Also return the account directly for convenience
        account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
      };
      
      // Save to MongoDB if account exists
      if (responseData.account) {
        try {
          const saveResult = await saveAccountData(responseData.account);
          if (saveResult.success) {
            console.log('Saved account data to MongoDB (POST)');
          } else {
            console.error('Failed to save account data to MongoDB:', saveResult.error);
          }
        } catch (dbError) {
          console.error('Error saving to MongoDB:', dbError);
          // Don't fail the request if MongoDB save fails
        }
      }
      
      // Cache the response
      setCache(cacheKey, responseData);
      console.log('Cached accounts data');
      
      return NextResponse.json(responseData);
    } else {
      // If session is invalid, try to auto-login and retry once
      if (data.message && (data.message.includes("Invalid session") || data.message.includes("Session parameter is required"))) {
        try {
          console.log("Session invalid, attempting auto-login and retry...");
          const newSession = await getSessionFromLogin();
          const retryUrl = `${apiBaseUrl}/get-my-accounts.json?session=${encodeURIComponent(newSession)}`;
          const retryResponse = await fetch(retryUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const retryData = await retryResponse.json();
          
          if (retryData.error === false) {
            const targetAccountId = 11808068;
            const filteredAccounts = (retryData.accounts || []).filter(
              account => account.id === targetAccountId || account.accountId === targetAccountId
            );
            const responseData = {
              success: true,
              error: false,
              message: retryData.message || "Accounts retrieved successfully",
              accounts: filteredAccounts,
              account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
            };
            
            // Save to MongoDB if account exists
            if (responseData.account) {
              try {
                const saveResult = await saveAccountData(responseData.account);
                if (saveResult.success) {
                  console.log('Saved account data to MongoDB (POST retry)');
                } else {
                  console.error('Failed to save account data to MongoDB:', saveResult.error);
                }
              } catch (dbError) {
                console.error('Error saving to MongoDB:', dbError);
                // Don't fail the request if MongoDB save fails
              }
            }
            
            // Cache the response
            setCache(cacheKey, responseData);
            console.log('Cached accounts data (retry)');
            
            return NextResponse.json(responseData);
          }
        } catch (retryError) {
          console.error("Error retrying with new session:", retryError);
        }
      }
      
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Failed to retrieve accounts",
          accounts: [],
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook get accounts:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
        accounts: [],
      },
      { status: 500 }
    );
  }
}

