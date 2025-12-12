import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Add connection options for better error handling
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
      // Add error handler
      global._mongoClientPromise.catch(err => {
        console.error('MongoDB connection error during initialization:', err);
      });
    } catch (error) {
      console.error('Error creating MongoDB client:', error);
      throw error;
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    clientPromise.catch(err => {
      console.error('MongoDB connection error during initialization:', err);
    });
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get MongoDB database instance
 * @param {string} dbName - Database name (optional, defaults to 'titans_dashboard')
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function getDatabase(dbName = 'titans_dashboard') {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Get MongoDB collection
 * @param {string} collectionName - Collection name
 * @param {string} dbName - Database name (optional)
 * @returns {Promise<Collection>} MongoDB collection instance
 */
export async function getCollection(collectionName, dbName) {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}

/**
 * Test MongoDB connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function testConnection() {
  try {
    const client = await clientPromise;
    // Test with a specific database
    await client.db('titans_dashboard').admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    return false;
  }
}

