# Quick Fix: Production MongoDB Issue

## Problem
Dashboard shows "No data found in MongoDB" in production but **works perfectly on localhost**.

**Important:** Since localhost works, your MongoDB setup is correct. This is a production-specific issue.

## Most Common Causes (Production-Specific)

### 0. MongoDB Atlas Network Access for Vercel IPs

**Even though localhost works, Vercel uses different IPs!**

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → Check current IPs
3. If you only have your local IP, add:
   - `0.0.0.0/0` (Allow from anywhere) - **Recommended for serverless**
   - OR add Vercel's IP ranges (more complex)
4. Wait 1-2 minutes for changes to propagate

**Why this matters:**
- Localhost uses your local IP (already whitelisted)
- Vercel functions use different IPs each time
- Without `0.0.0.0/0`, Vercel connections will fail with SSL errors

**Test:** After adding, try syncing in production again.

### 1. MONGODB_URI Not Set in Vercel Production Environment

**Since localhost works, your `.env.local` is correct. But Vercel needs it too!**

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Check if `MONGODB_URI` exists
4. If not, add: `MONGODB_URI` = `mongodb+srv://ujwal:%21000crORE%24tu@cluster0.fbf6bcy.mongodb.net/?appName=Cluster0`
5. **Critical:** Make sure it's set for **Production** environment (not just Development/Preview)
6. Redeploy your app after adding

**Verify:**
- Visit: `https://your-domain.com/api/debug/production`
- Check: `hasMongoUri: true`

### 2. Data Exists But Production Can't Connect

**Since localhost works, data is in MongoDB. The issue is production can't connect.**

**Check:**
Visit: `https://your-domain.com/api/debug/production`

Look for:
- `hasMongoUri: true` ✅ (Environment variable set)
- `connectionTest: false` ❌ (Can't connect - likely Network Access issue)
- `collections.myfxbook_accounts.count: 0` (Can't read - connection issue)

**Fix:**
1. **First:** Add `0.0.0.0/0` to MongoDB Atlas Network Access (see #0 above)
2. **Then:** Visit `https://your-domain.com/api/mongodb/sync-now` to test connection
3. **Finally:** Check dashboard - should work now

**Note:** If localhost can read data but production can't, it's 99% a Network Access issue.

### 3. Different Database in Production

**Check:**
- Localhost might be using a different database
- Production might be using default database

**Fix:**
- Ensure MongoDB URI includes database name OR
- Ensure collections exist in the default database

## Step-by-Step Debugging

### Step 1: Check Environment Variables
```
Visit: https://your-domain.com/api/debug/production
```

Check:
- `hasMongoUri: true` ✅
- `connectionTest: true` ✅

If `hasMongoUri: false` → Add MONGODB_URI in Vercel

### Step 2: Check Collections
```
Visit: https://your-domain.com/api/debug/production
```

Look at `collections`:
- `myfxbook_accounts.count` should be > 0
- `myfxbook_daily_data.count` should be > 0

If counts are 0 → Data needs to be synced

### Step 3: Sync Data
```
Visit: https://your-domain.com/api/mongodb/sync-now
```

This will:
- Fetch data from MyFxBook API
- Save to MongoDB
- Return status

Wait for success message, then refresh dashboard.

### Step 4: Verify Data
```
Visit: https://your-domain.com/api/debug/production
```

Check `dataCheck`:
- `accountFound: true` ✅
- `dailyDataCount: > 0` ✅

## Quick Checklist

- [ ] MONGODB_URI set in Vercel (Production environment)
- [ ] App redeployed after adding environment variable
- [ ] MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- [ ] Data synced via `/api/mongodb/sync-now`
- [ ] Collections have data (check via debug endpoint)
- [ ] Dashboard refreshed

## Still Not Working?

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Functions
   - Look for errors in `/api/db/dashboard` function
   - Check for MongoDB connection errors

2. **Check MongoDB Atlas:**
   - Verify connection string is correct
   - Check network access settings
   - Verify database name matches

3. **Test Connection:**
   - Use MongoDB Compass to connect with same URI
   - Verify collections exist
   - Check if data is there

## Expected Behavior After Fix

1. Visit dashboard → Shows loading spinner
2. Data loads from MongoDB → Dashboard displays data
3. No errors → Everything works smoothly

