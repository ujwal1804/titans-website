import { NextResponse } from "next/server";
import { getMyFxBookDailyData } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";
    const startDate = searchParams.get("start") || null;
    const endDate = searchParams.get("end") || null;

    const dailyData = await getMyFxBookDailyData(accountId, startDate, endDate);

    return NextResponse.json({
      success: true,
      error: false,
      message: "Daily data retrieved from MongoDB",
      dataDaily: dailyData,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
      count: dailyData.length,
    });
  } catch (error) {
    console.error("Error getting daily data from MongoDB:", error);
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed to retrieve daily data from MongoDB",
      details: error.message,
      dataDaily: [],
    }, { status: 500 });
  }
}

