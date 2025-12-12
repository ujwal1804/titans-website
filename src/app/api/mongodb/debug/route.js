import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

/**
 * Debug endpoint to see what's actually in MongoDB
 */
export async function GET(request) {
  try {
    const collection = await getCollection('dashboard_data');
    
    // Get all documents
    const allDocs = await collection.find({}).toArray();
    
    // Count by type
    const accountCount = await collection.countDocuments({ type: 'account' });
    const dailyCount = await collection.countDocuments({ type: 'daily' });
    
    // Get sample account document
    const sampleAccount = await collection.findOne({ type: 'account' });
    
    // Get sample daily document
    const sampleDaily = await collection.findOne({ type: 'daily' });
    
    // Get all unique accountIds
    const accountIds = await collection.distinct('accountId');
    
    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments: allDocs.length,
        accountDocuments: accountCount,
        dailyDocuments: dailyCount,
        uniqueAccountIds: accountIds,
      },
      sampleAccount: sampleAccount ? {
        accountId: sampleAccount.accountId,
        accountIdType: typeof sampleAccount.accountId,
        hasData: !!sampleAccount.data,
        timestamp: sampleAccount.timestamp,
      } : null,
      sampleDaily: sampleDaily ? {
        accountId: sampleDaily.accountId,
        accountIdType: typeof sampleDaily.accountId,
        date: sampleDaily.date,
        hasData: !!sampleDaily.data,
      } : null,
      allAccountIds: accountIds,
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

