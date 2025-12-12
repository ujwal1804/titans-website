import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";

    // Log environment info for debugging
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('Getting dashboard data from MongoDB:', {
      accountId,
      environment: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      timestamp: new Date().toISOString()
    });

    const dashboardData = await getDashboardData(accountId);

    console.log('Dashboard data result:', {
      success: dashboardData.success,
      hasAccount: !!dashboardData.account,
      dailyDataCount: dashboardData.dailyData ? dashboardData.dailyData.length : 0,
      error: dashboardData.error,
      environment: process.env.NODE_ENV
    });

    // Return data even if partial (account or dailyData exists)
    if (dashboardData.account || (dashboardData.dailyData && dashboardData.dailyData.length > 0)) {
      return NextResponse.json({
        success: true,
        error: false,
        message: "Dashboard data retrieved from MongoDB",
        account: dashboardData.account,
        dailyData: dashboardData.dailyData || [],
        accountId: accountId,
        accountCount: dashboardData.account ? 1 : 0,
        dailyDataCount: dashboardData.dailyData ? dashboardData.dailyData.length : 0,
      });
    }

    // No data found - return 200 with empty data instead of 404
    // This allows the frontend to handle the empty state gracefully
    return NextResponse.json({
      success: false,
      error: false,
      message: dashboardData.error || "No data found in MongoDB",
      account: null,
      dailyData: [],
      accountId: accountId,
      accountCount: 0,
      dailyDataCount: 0,
    });
  } catch (error) {
    console.error("Error getting dashboard data from MongoDB:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed to retrieve dashboard data from MongoDB",
      details: error.message,
      account: null,
      dailyData: [],
    }, { status: 500 });
  }
}

