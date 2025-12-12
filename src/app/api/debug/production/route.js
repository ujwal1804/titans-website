import { NextResponse } from "next/server";
import { testConnection, getCollection } from "@/lib/mongodb";
import { getMyFxBookAccount, getMyFxBookDailyData } from "@/lib/mongodb-service";

export async function GET(request) {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + "..." : "NOT SET",
      connectionTest: false,
      collections: {},
      dataCheck: {},
      errors: []
    };

    // Test MongoDB connection
    try {
      debug.connectionTest = await testConnection();
      if (!debug.connectionTest) {
        debug.errors.push("MongoDB connection test failed");
      }
    } catch (error) {
      debug.errors.push(`Connection error: ${error.message}`);
      debug.connectionError = error.message;
    }

    // Check collections
    if (debug.connectionTest) {
      try {
        const collections = [
          'myfxbook_accounts',
          'myfxbook_daily_data',
          'myfxbook_gain',
          'myfxbook_daily_gain',
          'dashboard_data' // Legacy collection
        ];

        for (const collectionName of collections) {
          try {
            const collection = await getCollection(collectionName);
            const count = await collection.countDocuments();
            debug.collections[collectionName] = {
              exists: true,
              count: count
            };
          } catch (error) {
            debug.collections[collectionName] = {
              exists: false,
              error: error.message
            };
          }
        }
      } catch (error) {
        debug.errors.push(`Collection check error: ${error.message}`);
      }

      // Check for actual data
      try {
        const accountId = "11808068";
        const account = await getMyFxBookAccount(accountId);
        const dailyData = await getMyFxBookDailyData(accountId);

        debug.dataCheck = {
          accountFound: !!account,
          accountId: account ? (account.id || account.accountId) : null,
          dailyDataCount: dailyData ? dailyData.length : 0,
          sampleAccount: account ? {
            id: account.id || account.accountId,
            name: account.name,
            balance: account.balance
          } : null
        };
      } catch (error) {
        debug.errors.push(`Data check error: ${error.message}`);
        debug.dataCheckError = error.message;
      }
    }

    return NextResponse.json(debug, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      error: true,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

