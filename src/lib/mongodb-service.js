import { getCollection } from './mongodb';

/**
 * MongoDB Service - Systematic data storage and retrieval
 * 
 * Collection Structure:
 * - myfxbook_accounts: Account information
 * - myfxbook_daily_data: Daily trading data
 * - myfxbook_gain: Gain data
 * - myfxbook_daily_gain: Daily gain data
 * - leads: Form submissions
 * - payments: Payment uploads
 */

// Collection names
const COLLECTIONS = {
  MYFXBOOK_ACCOUNTS: 'myfxbook_accounts',
  MYFXBOOK_DAILY_DATA: 'myfxbook_daily_data',
  MYFXBOOK_GAIN: 'myfxbook_gain',
  MYFXBOOK_DAILY_GAIN: 'myfxbook_daily_gain',
  LEADS: 'leads',
  PAYMENTS: 'payments',
};

/**
 * ============================================
 * MYFXBOOK ACCOUNTS
 * ============================================
 */

export async function saveMyFxBookAccount(accountData) {
  try {
    if (!accountData) {
      return { success: false, error: 'Account data is required' };
    }

    const accountId = String(accountData.id || accountData.accountId);
    if (!accountId) {
      return { success: false, error: 'Account ID is required' };
    }

    const collection = await getCollection(COLLECTIONS.MYFXBOOK_ACCOUNTS);
    
    const document = {
      accountId: accountId,
      data: accountData,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const result = await collection.updateOne(
      { accountId: accountId },
      { 
        $set: document,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return {
      success: true,
      inserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0,
    };
  } catch (error) {
    console.error('Error saving MyFxBook account:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyFxBookAccount(accountId = '11808068') {
  try {
    const collection = await getCollection(COLLECTIONS.MYFXBOOK_ACCOUNTS);
    const accountIdStr = String(accountId);
    const accountIdNum = parseInt(accountIdStr, 10);
    
    // Check collection count first
    const totalCount = await collection.countDocuments();
    console.log(`MongoDB Collection "${COLLECTIONS.MYFXBOOK_ACCOUNTS}": ${totalCount} total document(s)`);
    
    if (totalCount === 0) {
      console.warn(`Collection "${COLLECTIONS.MYFXBOOK_ACCOUNTS}" is empty. Data may need to be synced.`);
    }
    
    console.log('Searching for account in MongoDB:', { accountId, accountIdStr, accountIdNum, totalCount });
    
    // Try multiple query formats
    let account = await collection.findOne(
      { accountId: accountIdStr },
      { sort: { updatedAt: -1 } }
    );
    
    // If not found, try with number
    if (!account) {
      account = await collection.findOne(
        { accountId: accountIdNum },
        { sort: { updatedAt: -1 } }
      );
    }
    
    // If still not found, try with $in query
    if (!account) {
      account = await collection.findOne(
        { accountId: { $in: [accountIdStr, accountIdNum] } },
        { sort: { updatedAt: -1 } }
      );
    }
    
    // If still not found, try to find any account
    if (!account && totalCount > 0) {
      console.log('Account not found with specific ID, searching for any account...');
      account = await collection.findOne(
        {},
        { sort: { updatedAt: -1 } }
      );
      if (account) {
        console.log(`Found account with different ID: ${account.accountId}`);
      }
    }

    // If still not found, check old dashboard_data collection (migration support)
    if (!account) {
      console.log('Checking old dashboard_data collection for migration...');
      try {
        const oldCollection = await getCollection('dashboard_data');
        const oldAccount = await oldCollection.findOne(
          { 
            type: 'account',
            $or: [
              { accountId: accountIdStr },
              { accountId: accountIdNum }
            ]
          },
          { sort: { timestamp: -1 } }
        );
        
        if (oldAccount && oldAccount.data) {
          console.log('Found account in old collection, migrating...');
          // Migrate to new collection
          await saveMyFxBookAccount(oldAccount.data);
          return oldAccount.data;
        }
      } catch (migrationError) {
        console.error('Error checking old collection:', migrationError);
      }
    }

    if (account) {
      console.log('Found account in MongoDB:', { 
        storedAccountId: account.accountId, 
        storedAccountIdType: typeof account.accountId,
        hasData: !!account.data 
      });
      return account.data;
    }

    console.warn(`No account found in MongoDB. Collection has ${totalCount} document(s) but none match accountId ${accountId}`);
    return null;
  } catch (error) {
    console.error('Error getting MyFxBook account:', error);
    console.error('Error stack:', error.stack);
    return null;
  }
}

/**
 * ============================================
 * MYFXBOOK DAILY DATA
 * ============================================
 */

export async function saveMyFxBookDailyData(dailyData, accountId, startDate, endDate) {
  try {
    if (!Array.isArray(dailyData) || dailyData.length === 0) {
      return { success: true, saved: 0, message: 'No data to save' };
    }

    const collection = await getCollection(COLLECTIONS.MYFXBOOK_DAILY_DATA);
    const accountIdStr = String(accountId);
    const flattenedData = dailyData.flat();

    const savePromises = flattenedData.map(async (entry) => {
      if (!entry) return null;

      const date = entry.date || entry.openTime || entry.closeTime || entry.time;
      if (!date) return null;

      const document = {
        accountId: accountIdStr,
        date: String(date),
        data: entry,
        startDate: startDate || null,
        endDate: endDate || null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      return collection.updateOne(
        { 
          accountId: accountIdStr,
          date: String(date)
        },
        { 
          $set: document,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    });

    const results = await Promise.all(savePromises);
    const validResults = results.filter(r => r !== null);
    const inserted = validResults.filter(r => r.upsertedCount > 0).length;
    const modified = validResults.filter(r => r.modifiedCount > 0).length;

    return {
      success: true,
      saved: inserted + modified,
      inserted,
      modified,
      total: flattenedData.length
    };
  } catch (error) {
    console.error('Error saving MyFxBook daily data:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyFxBookDailyData(accountId = '11808068', startDate = null, endDate = null) {
  try {
    const collection = await getCollection(COLLECTIONS.MYFXBOOK_DAILY_DATA);
    const accountIdStr = String(accountId);
    const accountIdNum = parseInt(accountIdStr, 10);
    
    // Check collection count first
    const totalCount = await collection.countDocuments();
    console.log(`MongoDB Collection "${COLLECTIONS.MYFXBOOK_DAILY_DATA}": ${totalCount} total document(s)`);
    
    if (totalCount === 0) {
      console.warn(`Collection "${COLLECTIONS.MYFXBOOK_DAILY_DATA}" is empty. Data may need to be synced.`);
    }
    
    console.log('Searching for daily data in MongoDB:', { accountId, accountIdStr, accountIdNum, startDate, endDate, totalCount });
    
    // Try multiple query formats
    let query = {
      $or: [
        { accountId: accountIdStr },
        { accountId: accountIdNum }
      ]
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = String(startDate);
      if (endDate) query.date.$lte = String(endDate);
    }

    let entries = await collection
      .find(query)
      .sort({ date: -1 })
      .toArray();

    // If no entries found, check old dashboard_data collection (migration support)
    if (entries.length === 0) {
      console.log('Checking old dashboard_data collection for migration...');
      try {
        const oldCollection = await getCollection('dashboard_data');
        const oldQuery = {
          type: 'daily',
          $or: [
            { accountId: accountIdStr },
            { accountId: accountIdNum }
          ]
        };
        
        if (startDate || endDate) {
          oldQuery.date = {};
          if (startDate) oldQuery.date.$gte = String(startDate);
          if (endDate) oldQuery.date.$lte = String(endDate);
        }
        
        const oldEntries = await oldCollection
          .find(oldQuery)
          .sort({ date: -1 })
          .toArray();
        
        if (oldEntries.length > 0) {
          console.log(`Found ${oldEntries.length} entries in old collection, migrating...`);
          // Migrate to new collection
          const dailyDataToMigrate = oldEntries.map(e => e.data);
          await saveMyFxBookDailyData(dailyDataToMigrate, accountId, startDate, endDate);
          // Re-fetch from new collection
          entries = await collection
            .find(query)
            .sort({ date: -1 })
            .toArray();
        }
      } catch (migrationError) {
        console.error('Error checking old collection:', migrationError);
      }
    }
    
    // If still no entries, try to find any daily data
    if (entries.length === 0) {
      console.log('No daily entries found with specific accountId, searching for any daily entries...');
      query = {};
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = String(startDate);
        if (endDate) query.date.$lte = String(endDate);
      }
      entries = await collection
        .find(query)
        .sort({ date: -1 })
        .toArray();
    }

    console.log(`Found ${entries.length} daily entries in MongoDB (out of ${totalCount} total)`);

    if (entries.length === 0 && totalCount > 0) {
      console.warn(`No daily entries found for accountId ${accountId}, but collection has ${totalCount} total document(s)`);
    }

    return entries.map(entry => entry.data);
  } catch (error) {
    console.error('Error getting MyFxBook daily data:', error);
    console.error('Error stack:', error.stack);
    return [];
  }
}

/**
 * ============================================
 * MYFXBOOK GAIN
 * ============================================
 */

export async function saveMyFxBookGain(gainData, accountId, startDate, endDate) {
  try {
    const collection = await getCollection(COLLECTIONS.MYFXBOOK_GAIN);
    const accountIdStr = String(accountId);
    
    const document = {
      accountId: accountIdStr,
      startDate: startDate || null,
      endDate: endDate || null,
      data: gainData,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const result = await collection.updateOne(
      { 
        accountId: accountIdStr,
        startDate: startDate || null,
        endDate: endDate || null
      },
      { 
        $set: document,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return {
      success: true,
      inserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0,
    };
  } catch (error) {
    console.error('Error saving MyFxBook gain:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyFxBookGain(accountId = '11808068', startDate = null, endDate = null) {
  try {
    const collection = await getCollection(COLLECTIONS.MYFXBOOK_GAIN);
    const accountIdStr = String(accountId);
    
    const query = {
      accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] }
    };

    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;

    const gain = await collection.findOne(query, { sort: { updatedAt: -1 } });
    return gain ? gain.data : null;
  } catch (error) {
    console.error('Error getting MyFxBook gain:', error);
    return null;
  }
}

/**
 * ============================================
 * MYFXBOOK DAILY GAIN
 * ============================================
 */

export async function saveMyFxBookDailyGain(dailyGainData, accountId, startDate, endDate) {
  try {
    if (!Array.isArray(dailyGainData) || dailyGainData.length === 0) {
      return { success: true, saved: 0, message: 'No data to save' };
    }

    const collection = await getCollection(COLLECTIONS.MYFXBOOK_DAILY_GAIN);
    const accountIdStr = String(accountId);

    const savePromises = dailyGainData.map(async (entry) => {
      if (!entry) return null;

      const date = entry.date || entry.time;
      if (!date) return null;

      const document = {
        accountId: accountIdStr,
        date: String(date),
        data: entry,
        startDate: startDate || null,
        endDate: endDate || null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      return collection.updateOne(
        { 
          accountId: accountIdStr,
          date: String(date)
        },
        { 
          $set: document,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    });

    const results = await Promise.all(savePromises);
    const validResults = results.filter(r => r !== null);
    const inserted = validResults.filter(r => r.upsertedCount > 0).length;
    const modified = validResults.filter(r => r.modifiedCount > 0).length;

    return {
      success: true,
      saved: inserted + modified,
      inserted,
      modified,
      total: dailyGainData.length
    };
  } catch (error) {
    console.error('Error saving MyFxBook daily gain:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyFxBookDailyGain(accountId = '11808068', startDate = null, endDate = null) {
  try {
    const collection = await getCollection(COLLECTIONS.MYFXBOOK_DAILY_GAIN);
    const accountIdStr = String(accountId);
    
    const query = {
      accountId: { $in: [accountIdStr, parseInt(accountIdStr, 10)] }
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = String(startDate);
      if (endDate) query.date.$lte = String(endDate);
    }

    const entries = await collection
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return entries.map(entry => entry.data);
  } catch (error) {
    console.error('Error getting MyFxBook daily gain:', error);
    return [];
  }
}

/**
 * ============================================
 * LEADS
 * ============================================
 */

export async function saveLead(leadData) {
  try {
    if (!leadData) {
      return { success: false, error: 'Lead data is required' };
    }

    const collection = await getCollection(COLLECTIONS.LEADS);
    
    const document = {
      ...leadData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(document);

    return {
      success: true,
      id: result.insertedId,
    };
  } catch (error) {
    console.error('Error saving lead:', error);
    return { success: false, error: error.message };
  }
}

export async function getLeads(filters = {}) {
  try {
    const collection = await getCollection(COLLECTIONS.LEADS);
    const leads = await collection
      .find(filters)
      .sort({ createdAt: -1 })
      .toArray();
    return leads;
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
}

/**
 * ============================================
 * PAYMENTS
 * ============================================
 */

export async function savePayment(paymentData) {
  try {
    if (!paymentData) {
      return { success: false, error: 'Payment data is required' };
    }

    const collection = await getCollection(COLLECTIONS.PAYMENTS);
    
    const document = {
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(document);

    return {
      success: true,
      id: result.insertedId,
    };
  } catch (error) {
    console.error('Error saving payment:', error);
    return { success: false, error: error.message };
  }
}

export async function getPayments(filters = {}) {
  try {
    const collection = await getCollection(COLLECTIONS.PAYMENTS);
    const payments = await collection
      .find(filters)
      .sort({ createdAt: -1 })
      .toArray();
    return payments;
  } catch (error) {
    console.error('Error getting payments:', error);
    return [];
  }
}

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

export async function getDashboardData(accountId = '11808068') {
  try {
    const [account, dailyData] = await Promise.all([
      getMyFxBookAccount(accountId),
      getMyFxBookDailyData(accountId)
    ]);

    return {
      success: true,
      account,
      dailyData,
    };
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    return {
      success: false,
      error: error.message,
      account: null,
      dailyData: [],
    };
  }
}

export { COLLECTIONS };

