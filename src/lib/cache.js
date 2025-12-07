import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Ensure cache directory exists
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Get cache file path for a given key
 */
function getCacheFilePath(key) {
  ensureCacheDir();
  const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
  return path.join(CACHE_DIR, `${safeKey}.json`);
}

/**
 * Check if cache is valid (not expired)
 */
function isCacheValid(cacheData) {
  if (!cacheData || !cacheData.timestamp) {
    return false;
  }
  const now = Date.now();
  const cacheAge = now - cacheData.timestamp;
  return cacheAge < CACHE_DURATION;
}

/**
 * Get cached data
 */
export function getCache(key) {
  try {
    const cachePath = getCacheFilePath(key);
    if (!fs.existsSync(cachePath)) {
      return null;
    }
    
    const cacheContent = fs.readFileSync(cachePath, 'utf-8');
    const cacheData = JSON.parse(cacheContent);
    
    if (isCacheValid(cacheData)) {
      return cacheData.data;
    } else {
      // Cache expired, delete the file
      fs.unlinkSync(cachePath);
      return null;
    }
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Set cache data
 */
export function setCache(key, data) {
  try {
    ensureCacheDir();
    const cachePath = getCacheFilePath(key);
    const cacheData = {
      timestamp: Date.now(),
      data: data,
    };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing cache:', error);
    return false;
  }
}

/**
 * Clear cache for a specific key
 */
export function clearCache(key) {
  try {
    const cachePath = getCacheFilePath(key);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(CACHE_DIR, file));
        }
      });
    }
    return true;
  } catch (error) {
    console.error('Error clearing all cache:', error);
    return false;
  }
}

/**
 * Get cache age in days
 */
export function getCacheAge(key) {
  try {
    const cachePath = getCacheFilePath(key);
    if (!fs.existsSync(cachePath)) {
      return null;
    }
    
    const cacheContent = fs.readFileSync(cachePath, 'utf-8');
    const cacheData = JSON.parse(cacheContent);
    const now = Date.now();
    const cacheAge = now - cacheData.timestamp;
    return Math.floor(cacheAge / (24 * 60 * 60 * 1000)); // Return age in days
  } catch (error) {
    return null;
  }
}

