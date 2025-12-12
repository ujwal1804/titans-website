import { NextResponse } from "next/server";
import { getMyFxBookGain } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";
    const startDate = searchParams.get("start") || null;
    const endDate = searchParams.get("end") || null;

    const gain = await getMyFxBookGain(accountId, startDate, endDate);

    if (!gain) {
      return NextResponse.json({
        success: false,
        error: true,
        message: `No gain data found for account ID ${accountId}`,
        value: null,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      error: false,
      message: "Gain data retrieved from MongoDB",
      value: gain.value || gain,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
    });
  } catch (error) {
    console.error("Error getting gain data from MongoDB:", error);
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed to retrieve gain data from MongoDB",
      details: error.message,
      value: null,
    }, { status: 500 });
  }
}

