# Quick Fix: Production MongoDB Issue

## Problem
Dashboard shows "No data found in MongoDB" in production but works on localhost.

## Most Common Causes

### 1. MONGODB_URI Not Set in Vercel (90% of cases)

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add: `MONGODB_URI` = `mongodb+srv://ujwal:%21000crORE%24tu@cluster0.fbf6bcy.mongodb.net/?appName=Cluster0`
4. Make sure it's set for **Production** environment
5. Redeploy your app

### 2. Data Doesn't Exist in Production MongoDB

**Check:**
Visit: `https://your-domain.com/api/debug/production`

Look for:
- `connectionTest: true` ✅
- `collections.myfxbook_accounts.count: 0` ❌ (This means no data)

**Fix:**
1. Visit: `https://your-domain.com/api/mongodb/sync-now`
2. This will fetch data from MyFxBook API and save to MongoDB
3. Wait 5-10 seconds
4. Refresh dashboard

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

