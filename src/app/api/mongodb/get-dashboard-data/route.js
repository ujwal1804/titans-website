import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard-db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";

    const dashboardData = await getDashboardData(accountId);

    if (!dashboardData.success) {
      return NextResponse.json({
        success: false,
        error: true,
        message: dashboardData.error || "Failed to retrieve dashboard data",
        account: null,
        dailyData: [],
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      error: false,
      message: "Dashboard data retrieved from MongoDB",
      account: dashboardData.account,
      dailyData: dashboardData.dailyData,
      accountId: accountId,
      accountCount: dashboardData.account ? 1 : 0,
      dailyDataCount: dashboardData.dailyData ? dashboardData.dailyData.length : 0,
    });
  } catch (error) {
    console.error("Error getting dashboard data from MongoDB:", error);
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

