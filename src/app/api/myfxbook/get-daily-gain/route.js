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
  return new Date().toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

export async function GET(request) {
  try {
    // Get parameters from query string
    const { searchParams } = new URL(request.url);
    let session = searchParams.get("session");
    const accountId = searchParams.get("id") || "11808068"; // Default account ID
    const startDate = searchParams.get("start") || getBotStartDate();
    const endDate = searchParams.get("end") || getCurrentDate();

    // If no session provided, automatically login to get one
    if (!session) {
      try {
        session = await getSessionFromLogin();
        console.log("Auto-logged in to get session for get-daily-gain (GET)");
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: true,
            message: `Failed to get session for daily gain: ${error.message}`,
            dailyGain: [],
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
    const apiUrl = `${apiBaseUrl}/get-daily-gain.json?session=${encodeURIComponent(decodedSession)}&id=${accountId}&start=${startDate}&end=${endDate}`;

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
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Daily gain retrieved successfully",
        dailyGain: data.dailyGain || [],
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Failed to retrieve daily gain",
          dailyGain: [],
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook get daily gain:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
        dailyGain: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { session, accountId, start, end } = body;
    accountId = accountId || "11808068"; // Default account ID
    const startDate = start || getBotStartDate();
    const endDate = end || getCurrentDate();

    // If no session provided, automatically login to get one
    if (!session) {
      try {
        session = await getSessionFromLogin();
        console.log("Auto-logged in to get session for get-daily-gain (POST)");
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: true,
            message: `Failed to get session for daily gain: ${error.message}`,
            dailyGain: [],
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
    const apiUrl = `${apiBaseUrl}/get-daily-gain.json?session=${encodeURIComponent(decodedSession)}&id=${accountId}&start=${startDate}&end=${endDate}`;

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
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Daily gain retrieved successfully",
        dailyGain: data.dailyGain || [],
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Failed to retrieve daily gain",
          dailyGain: [],
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook get daily gain:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
        dailyGain: [],
      },
      { status: 500 }
    );
  }
}

