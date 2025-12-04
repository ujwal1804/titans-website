import { NextResponse } from "next/server";

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
      
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Accounts retrieved successfully",
        accounts: filteredAccounts,
        // Also return the account directly for convenience
        account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
      });
    } else {
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
      
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Accounts retrieved successfully",
        accounts: filteredAccounts,
        // Also return the account directly for convenience
        account: filteredAccounts.length > 0 ? filteredAccounts[0] : null,
      });
    } else {
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

