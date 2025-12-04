import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get credentials and URL from environment variables
    const email = process.env.MYFXBOOK_EMAIL;
    let password = process.env.MYFXBOOK_PASSWORD;
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    // Debug: Log what we're getting (remove in production)
    console.log("Email from env:", email ? "✓ Set" : "✗ Missing");
    console.log("Password from env:", password ? `✓ Set (length: ${password.length})` : "✗ Missing");
    
    // Handle password - if it's wrapped in quotes, Next.js might include them, so we strip them
    if (password) {
      password = password.replace(/^["']|["']$/g, '');
    }

    // Validate required environment variables
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "MyFxBook credentials are not configured. Please set MYFXBOOK_EMAIL and MYFXBOOK_PASSWORD in .env.local",
        },
        { status: 500 }
      );
    }

    // Construct the API URL
    const apiUrl = `${apiBaseUrl}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    // Make the API call to MyFxBook
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response
    const data = await response.json();

    // Check if login was successful
    if (data.error === false && data.session) {
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Login successful",
        session: data.session,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Login failed",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook login:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Get API base URL from environment variables
    const apiBaseUrl = process.env.MYFXBOOK_API_URL || "https://www.myfxbook.com/api";

    // Construct the API URL
    const apiUrl = `${apiBaseUrl}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    // Make the API call to MyFxBook
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response
    const data = await response.json();

    // Check if login was successful
    if (data.error === false && data.session) {
      return NextResponse.json({
        success: true,
        error: false,
        message: data.message || "Login successful",
        session: data.session,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: data.message || "Login failed",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in MyFxBook login:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Failed to connect to MyFxBook API",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

