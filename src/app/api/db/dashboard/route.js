import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";

    console.log('Getting dashboard data from MongoDB for accountId:', accountId);

    const dashboardData = await getDashboardData(accountId);

    console.log('Dashboard data result:', {
      success: dashboardData.success,
      hasAccount: !!dashboardData.account,
      dailyDataCount: dashboardData.dailyData ? dashboardData.dailyData.length : 0,
      error: dashboardData.error
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

    // No data found
    return NextResponse.json({
      success: false,
      error: true,
      message: dashboardData.error || "No data found in MongoDB",
      account: null,
      dailyData: [],
      accountId: accountId,
    }, { status: 404 });
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

