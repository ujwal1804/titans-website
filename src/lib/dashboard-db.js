import { getCollection } from './mongodb';

const COLLECTION_NAME = 'dashboard_data';

/**
 * Save account data to MongoDB
 * @param {Object} accountData - Account data from MyFxBook API
 * @returns {Promise<Object>} Result of the save operation
 */
export async function saveAccountData(accountData) {
  try {
    if (!accountData) {
      console.error('saveAccountData: accountData is null or undefined');
      return {
        success: false,
        error: 'Account data is required'
      };
    }

    const accountId = accountData.id || accountData.accountId;
    if (!accountId) {
      console.error('saveAccountData: accountId is missing', accountData);
      return {
        success: false,
        error: 'Account ID is required'
      };
    }

    const collection = await getCollection(COLLECTION_NAME);
    
    // Normalize accountId to string for consistency, but also keep number version for query
    const normalizedAccountId = String(accountId);
    const accountIdNum = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
    
    // Create document with account data and metadata
    const document = {
      type: 'account',
      accountId: normalizedAccountId,
      data: accountData,
      timestamp: new Date(),
      createdAt: new Date(),
    };

    // Use upsert to update if exists or insert if new
    // Update based on accountId and type - handle both number and string formats
    const result = await collection.updateOne(
      { 
        type: 'account',
        $or: [
          { accountId: normalizedAccountId },
          { accountId: accountIdNum },
          { accountId: accountId }
        ]
      },
      { 
        $set: document 
      },
      { 
        upsert: true 
      }
    );

    console.log('MongoDB save result:', {
      accountId,
      inserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0,
      matched: result.matchedCount
    });

    return {
      success: true,
      inserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0,
      matched: result.matchedCount,
      result
    };
  } catch (error) {
    console.error('Error saving account data to MongoDB:', error);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
      errorDetails: error.toString()
    };
  }
}

/**
 * Save daily data to MongoDB
 * @param {Array} dailyData - Array of daily data entries
 * @param {string} accountId - Account ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Result of the save operation
 */
export async function saveDailyData(dailyData, accountId, startDate, endDate) {
  try {
    if (!accountId) {
      console.error('saveDailyData: accountId is required');
      return {
        success: false,
        error: 'Account ID is required'
      };
    }

    const collection = await getCollection(COLLECTION_NAME);
    
    // Flatten the daily data array if it's nested
    const flattenedData = Array.isArray(dailyData) ? dailyData.flat() : [];
    
    if (flattenedData.length === 0) {
      console.log('saveDailyData: No daily data to save');
      return {
        success: true,
        message: 'No daily data to save',
        saved: 0
      };
    }

    console.log(`saveDailyData: Attempting to save ${flattenedData.length} entries for account ${accountId}`);

    // Save each daily entry
    const savePromises = flattenedData.map(async (entry) => {
      if (!entry) {
        console.warn('saveDailyData: Skipping null/undefined entry');
        return null;
      }

      // Create document for each daily entry
      const date = entry.date || entry.openTime || entry.closeTime || entry.time;
      if (!date) {
        console.warn('saveDailyData: Entry missing date field', entry);
        return null;
      }

      const document = {
        type: 'daily',
        accountId: String(accountId), // Ensure accountId is a string
        date: String(date),
        data: entry,
        startDate: startDate || null,
        endDate: endDate || null,
        timestamp: new Date(),
        createdAt: new Date(),
      };

      // Use upsert to update if exists or insert if new
      // Update based on accountId, type, and date
      return collection.updateOne(
        { 
          type: 'daily',
          accountId: String(accountId),
          date: String(date)
        },
        { 
          $set: document 
        },
        { 
          upsert: true 
        }
      );
    });

    const results = await Promise.all(savePromises);
    const validResults = results.filter(r => r !== null);
    const inserted = validResults.filter(r => r.upsertedCount > 0).length;
    const modified = validResults.filter(r => r.modifiedCount > 0).length;

    console.log(`saveDailyData: Saved ${inserted + modified} entries (${inserted} inserted, ${modified} modified) out of ${flattenedData.length} total`);

    return {
      success: true,
      saved: inserted + modified,
      inserted,
      modified,
      total: flattenedData.length
    };
  } catch (error) {
    console.error('Error saving daily data to MongoDB:', error);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
      errorDetails: error.toString()
    };
  }
}

/**
 * Get latest account data from MongoDB
 * @param {string} accountId - Account ID (optional)
 * @returns {Promise<Object|null>} Latest account data or null
 */
export async function getLatestAccountData(accountId = '11808068') {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    // Convert accountId to both number and string to handle both formats
    const accountIdNum = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
    const accountIdStr = String(accountId);
    
    // Try to find account with either number or string accountId
    const account = await collection.findOne(
      { 
        type: 'account',
        $or: [
          { accountId: accountIdNum },
          { accountId: accountIdStr },
          { accountId: accountId }
        ]
      },
      { 
        sort: { timestamp: -1 } 
      }
    );

    if (account) {
      console.log('Found account in MongoDB:', { accountId: account.accountId, type: typeof account.accountId });
      return account.data;
    }
    
    // If not found, try to find any account document
    const anyAccount = await collection.findOne(
      { type: 'account' },
      { sort: { timestamp: -1 } }
    );
    
    if (anyAccount) {
      console.log('Found account with different accountId:', anyAccount.accountId);
      return anyAccount.data;
    }

    return null;
  } catch (error) {
    console.error('Error getting account data from MongoDB:', error);
    return null;
  }
}

/**
 * Get daily data from MongoDB
 * @param {string} accountId - Account ID
 * @param {string} startDate - Start date (YYYY-MM-DD, optional)
 * @param {string} endDate - End date (YYYY-MM-DD, optional)
 * @returns {Promise<Array>} Array of daily data entries
 */
export async function getDailyDataFromDB(accountId = '11808068', startDate = null, endDate = null) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    // Convert accountId to both number and string to handle both formats
    const accountIdNum = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
    const accountIdStr = String(accountId);
    
    const query = {
      type: 'daily',
      $or: [
        { accountId: accountIdNum },
        { accountId: accountIdStr },
        { accountId: accountId }
      ]
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = String(startDate);
      }
      if (endDate) {
        query.date.$lte = String(endDate);
      }
    }

    const dailyEntries = await collection
      .find(query)
      .sort({ date: -1 })
      .toArray();

    console.log(`Found ${dailyEntries.length} daily entries in MongoDB for accountId: ${accountId}`);

    // Extract the data field from each entry
    return dailyEntries.map(entry => entry.data);
  } catch (error) {
    console.error('Error getting daily data from MongoDB:', error);
    return [];
  }
}

/**
 * Get all dashboard data for an account
 * @param {string} accountId - Account ID
 * @returns {Promise<Object>} Object with account and daily data
 */
export async function getDashboardData(accountId = '11808068') {
  try {
    const [account, dailyData] = await Promise.all([
      getLatestAccountData(accountId),
      getDailyDataFromDB(accountId)
    ]);

    return {
      account,
      dailyData,
      success: true
    };
  } catch (error) {
    console.error('Error getting dashboard data from MongoDB:', error);
    return {
      account: null,
      dailyData: [],
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete old daily data entries (cleanup function)
 * @param {string} accountId - Account ID
 * @param {number} daysToKeep - Number of days to keep (default: 365)
 * @returns {Promise<Object>} Result of the cleanup
 */
export async function cleanupOldDailyData(accountId = '11808068', daysToKeep = 365) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];

    const result = await collection.deleteMany({
      type: 'daily',
      accountId: accountId,
      date: { $lt: cutoffDateString }
    });

    return {
      success: true,
      deleted: result.deletedCount
    };
  } catch (error) {
    console.error('Error cleaning up old daily data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

