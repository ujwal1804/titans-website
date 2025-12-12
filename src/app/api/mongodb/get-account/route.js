import { NextResponse } from "next/server";
import { getLatestAccountData } from "@/lib/dashboard-db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id") || "11808068";

    const account = await getLatestAccountData(accountId);

    if (!account) {
      return NextResponse.json({
        success: false,
        error: true,
        message: `No account data found for account ID ${accountId}`,
        account: null,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      error: false,
      message: "Account data retrieved from MongoDB",
      account: account,
      accountId: accountId,
    });
  } catch (error) {
    console.error("Error getting account data from MongoDB:", error);
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed to retrieve account data from MongoDB",
      details: error.message,
      account: null,
    }, { status: 500 });
  }
}

