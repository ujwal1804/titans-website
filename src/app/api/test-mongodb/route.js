import { NextResponse } from "next/server";
import { testConnection } from "@/lib/mongodb";
import { saveAccountData, saveDailyData } from "@/lib/dashboard-db";
import { getCollection } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const results = {
      connectionTest: false,
      envCheck: false,
      saveTest: false,
      collectionTest: false,
      errors: []
    };

    // Check if MONGODB_URI is set
    if (process.env.MONGODB_URI) {
      results.envCheck = true;
      results.mongodbUri = process.env.MONGODB_URI.substring(0, 30) + "..."; // Show first 30 chars only
    } else {
      results.errors.push("MONGODB_URI environment variable is not set");
      return NextResponse.json(results, { status: 500 });
    }

    // Test connection
    try {
      results.connectionTest = await testConnection();
      if (!results.connectionTest) {
        results.errors.push("MongoDB connection test failed");
      }
    } catch (error) {
      results.errors.push(`Connection test error: ${error.message}`);
      results.connectionError = error.message;
    }

    // Test collection access
    try {
      const collection = await getCollection('dashboard_data');
      const count = await collection.countDocuments();
      results.collectionTest = true;
      results.documentCount = count;
    } catch (error) {
      results.errors.push(`Collection test error: ${error.message}`);
      results.collectionError = error.message;
    }

    // Test save operation
    try {
      const testAccount = {
        id: 999999,
        name: "Test Account",
        balance: 1000,
        profit: 100,
        gain: 10,
        currency: "USD"
      };
      
      const saveResult = await saveAccountData(testAccount);
      results.saveTest = saveResult.success;
      if (saveResult.success) {
        results.saveDetails = {
          inserted: saveResult.inserted,
          modified: saveResult.modified
        };
      } else {
        results.errors.push(`Save test failed: ${saveResult.error}`);
      }
    } catch (error) {
      results.errors.push(`Save test error: ${error.message}`);
      results.saveError = error.message;
    }

    return NextResponse.json({
      success: results.connectionTest && results.collectionTest && results.saveTest,
      ...results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

