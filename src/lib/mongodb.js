import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Connection timeout options
  serverSelectionTimeoutMS: 10000, // Timeout after 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Connection timeout
  
  // SSL/TLS options for MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  
  // Retry options
  retryWrites: true,
  retryReads: true,
  
  // Connection pool options
  maxPoolSize: 10,
  minPoolSize: 1,
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
 * @param {string} dbName - Database name (optional)
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function getDatabase(dbName) {
  const client = await clientPromise;
  
  // If dbName is provided, use it
  if (dbName) {
    return client.db(dbName);
  }
  
  // Otherwise, try to get database name from URI
  try {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      const url = new URL(uri);
      const dbFromUri = url.pathname.substring(1); // Remove leading /
      if (dbFromUri && dbFromUri !== '') {
        return client.db(dbFromUri);
      }
    }
  } catch (error) {
    console.warn('Could not parse database name from URI, using default');
  }
  
  // Default fallback
  return client.db('titans_dashboard');
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
    
    // Try to get database name from URI first
    let dbName = 'titans_dashboard';
    try {
      const uri = process.env.MONGODB_URI;
      if (uri) {
        const url = new URL(uri);
        const dbFromUri = url.pathname.substring(1);
        if (dbFromUri && dbFromUri !== '') {
          dbName = dbFromUri;
        }
      }
    } catch (error) {
      console.warn('Could not parse database name from URI');
    }
    
    // Test connection with ping
    await client.db(dbName).admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + "..." : "NOT SET"
    });
    return false;
  }
}

