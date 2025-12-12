import { NextResponse } from "next/server";
import { getMyFxBookDailyGain } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";
    const startDate = searchParams.get("start") || null;
    const endDate = searchParams.get("end") || null;

    const dailyGain = await getMyFxBookDailyGain(accountId, startDate, endDate);

    return NextResponse.json({
      success: true,
      error: false,
      message: "Daily gain data retrieved from MongoDB",
      dailyGain: dailyGain,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
      count: dailyGain.length,
    });
  } catch (error) {
    console.error("Error getting daily gain data from MongoDB:", error);
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed to retrieve daily gain data from MongoDB",
      details: error.message,
      dailyGain: [],
    }, { status: 500 });
  }
}

