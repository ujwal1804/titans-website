# Production Troubleshooting Guide

## Dashboard Not Showing Data in Production

If the dashboard works on localhost but not in production, check these common issues:

### 1. Environment Variables

**Most Common Issue**: MongoDB URI not set in production environment.

**Check in Vercel:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Verify `MONGODB_URI` is set correctly
4. Make sure it's set for **Production** environment (not just Development)

**Verify:**
- Visit: `https://your-domain.com/api/debug/production`
- Check if `hasMongoUri: true`
- Check if `connectionTest: true`

### 2. MongoDB Connection String

**Common Issues:**
- Password encoding: Special characters in password must be URL-encoded
- Network access: MongoDB Atlas IP whitelist must include Vercel IPs (or allow all: `0.0.0.0/0`)
- Database name: Check if database name in URI matches

**Test Connection:**
```bash
# Visit this endpoint in production
https://your-domain.com/api/debug/production
```

### 3. Database Name Mismatch

The code automatically detects database name from MongoDB URI. If your URI doesn't specify a database, it defaults to `titans_dashboard`.

**Fix:**
- Add database name to URI: `mongodb+srv://user:pass@cluster.mongodb.net/database_name`
- Or ensure collections exist in the default database

### 4. Collections Not Created

If collections don't exist, the cron job needs to run first to create them.

**Check Collections:**
Visit: `https://your-domain.com/api/debug/production`

Look for:
```json
{
  "collections": {
    "myfxbook_accounts": { "exists": true, "count": 1 },
    "myfxbook_daily_data": { "exists": true, "count": 150 }
  }
}
```

### 5. Data Not in Database

If data doesn't exist in MongoDB, you need to populate it first.

**Manual Sync (For Testing):**
- Visit: `https://your-domain.com/api/mongodb/sync-now`
- This will fetch data from MyFxBook API and save to MongoDB

**Note:** Data is automatically saved to MongoDB whenever MyFxBook API endpoints are called. The dashboard reads from MongoDB, so ensure data exists in the database.

### 6. Network/Firewall Issues

**MongoDB Atlas:**
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow all IPs (or specific Vercel IPs)
3. Wait 1-2 minutes for changes to propagate

### 7. API Route Issues

**Check API Routes:**
- `/api/db/dashboard` - Should return 200 (even if no data)
- `/api/debug/production` - Shows detailed diagnostics

**Common Errors:**
- 404: Route not found (check file structure)
- 500: Server error (check logs in Vercel)
- Timeout: MongoDB connection issue

### 8. Debug Endpoint

Use the production debug endpoint to diagnose issues:

```
GET https://your-domain.com/api/debug/production
```

**Response includes:**
- Environment variables status
- MongoDB connection test
- Collection counts
- Data availability
- Error messages

### 9. Vercel Logs

Check Vercel function logs:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on a function execution
3. Check logs for errors

**Look for:**
- `MONGODB_URI is not set`
- `MongoDB connection error`
- `No data found in MongoDB`

### 10. Quick Fix Checklist

- [ ] `MONGODB_URI` set in Vercel environment variables
- [ ] MongoDB Atlas network access allows Vercel IPs
- [ ] Database name correct in URI or collections in default DB
- [ ] Collections exist (check via debug endpoint)
- [ ] Data exists in collections (check via debug endpoint)
- [ ] API routes return 200 (not 404/500)

### 11. Testing Locally vs Production

**Localhost works but production doesn't:**
- Environment variables different
- MongoDB connection string different
- Database/collections different
- Network restrictions in production

**Solution:**
1. Use debug endpoint to compare localhost vs production
2. Check environment variables match
3. Verify MongoDB Atlas allows production IPs
4. Ensure data exists in production database

## Still Not Working?

1. **Check Debug Endpoint:**
   ```
   https://your-domain.com/api/debug/production
   ```

2. **Check Vercel Logs:**
   - Function logs show detailed errors
   - Look for MongoDB connection errors

3. **Verify Data Exists:**
   - Collections should have documents
   - Account ID should match: `11808068`

4. **Test Connection:**
   - Use MongoDB Compass to verify connection
   - Check if data exists in collections

5. **Manual Sync:**
   - Visit `/api/mongodb/sync-now` to force sync
   - Check if data gets saved

