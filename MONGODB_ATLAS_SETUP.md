# MongoDB Atlas Setup Checklist

## What You Need to Configure on MongoDB Atlas Side

### 1. Network Access (IP Whitelist) ⚠️ **MOST IMPORTANT**

**This is likely the main issue!**

1. Go to MongoDB Atlas Dashboard
2. Click on **Network Access** (left sidebar)
3. Click **Add IP Address**
4. For Vercel/production, you have two options:

   **Option A: Allow All IPs (Easiest for development)**
   - Click **Allow Access from Anywhere**
   - Or manually add: `0.0.0.0/0`
   - Click **Confirm**
   
   **Option B: Add Vercel IPs (More secure)**
   - Vercel uses dynamic IPs, so this is harder
   - Better to use `0.0.0.0/0` for serverless functions

5. **Wait 1-2 minutes** for changes to propagate

**Why this matters:**
- If your IP isn't whitelisted, MongoDB will reject the connection
- This can cause SSL errors or connection timeouts
- Vercel functions use different IPs each time, so `0.0.0.0/0` is recommended

---

### 2. Database User Permissions

1. Go to **Database Access** (left sidebar)
2. Check your database user (the one in your connection string: `ujwal`)
3. Ensure user has:
   - **Atlas Admin** role (for full access)
   - OR **Read and write to any database** role
4. If user doesn't exist or has wrong permissions:
   - Click **Add New Database User**
   - Username: `ujwal` (or create new)
   - Password: Set a secure password
   - Database User Privileges: **Atlas Admin**
   - Click **Add User**

**Note:** Make sure the password in your connection string matches!

---

### 3. Connection String Format

Your connection string should be:
```
mongodb+srv://ujwal:PASSWORD@cluster0.fbf6bcy.mongodb.net/?appName=Cluster0
```

**Important:**
- Replace `PASSWORD` with your actual password
- **URL-encode special characters** in password:
  - `!` → `%21`
  - `$` → `%24`
  - `@` → `%40`
  - `#` → `%23`
  - etc.

**Your current password:** `!000crORE$tu`
**URL-encoded:** `%21000crORE%24tu`

So your connection string should be:
```
mongodb+srv://ujwal:%21000crORE%24tu@cluster0.fbf6bcy.mongodb.net/?appName=Cluster0
```

---

### 4. Database Name

**Option A: Specify database in connection string**
```
mongodb+srv://ujwal:%21000crORE%24tu@cluster0.fbf6bcy.mongodb.net/titans_dashboard?appName=Cluster0
```
This creates/uses the `titans_dashboard` database.

**Option B: Use default database**
If no database in URI, MongoDB uses the default database. Make sure collections are created there.

**Current setup:** Your URI doesn't specify a database, so it uses the default. The code will create collections in the default database.

---

### 5. SSL/TLS Settings

MongoDB Atlas **requires** SSL/TLS connections. The code is already configured for this.

**No action needed** - the connection options in the code handle this:
- `tls: true`
- `tlsAllowInvalidCertificates: false`

---

### 6. Cluster Settings

1. Go to **Clusters** (left sidebar)
2. Check your cluster status:
   - Should be **Running** (green)
   - If paused, click **Resume**
3. Check cluster tier:
   - Free tier (M0) works fine for development
   - Production might need paid tier for better performance

---

### 7. Collections (Auto-Created)

**Good news:** Collections are created automatically when you first save data!

You don't need to manually create:
- `myfxbook_accounts`
- `myfxbook_daily_data`
- `myfxbook_gain`
- `myfxbook_daily_gain`
- `leads`
- `payments`

They'll be created when the code first saves data to them.

---

## Quick Checklist

Before deploying to production, verify:

- [ ] **Network Access:** `0.0.0.0/0` is whitelisted (or Vercel IPs)
- [ ] **Database User:** Exists with proper permissions
- [ ] **Password:** Correct and URL-encoded in connection string
- [ ] **Connection String:** Format is correct
- [ ] **Cluster:** Is running (not paused)
- [ ] **Environment Variable:** `MONGODB_URI` set in Vercel

---

## Testing Connection

After configuring, test the connection:

1. **From MongoDB Atlas:**
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy the connection string
   - Verify it matches your environment variable

2. **From your app:**
   - Visit: `https://your-domain.com/api/debug/production`
   - Check: `connectionTest: true`
   - Check: `hasMongoUri: true`

3. **From MongoDB Compass (Desktop App):**
   - Download MongoDB Compass
   - Connect using your connection string
   - Verify you can see databases and collections

---

## Common Issues

### Issue: "IP not whitelisted"
**Fix:** Add `0.0.0.0/0` to Network Access

### Issue: "Authentication failed"
**Fix:** 
- Check username/password in connection string
- Verify user exists in Database Access
- Check password URL encoding

### Issue: "SSL/TLS errors"
**Fix:**
- Usually means IP not whitelisted
- Or connection string format is wrong
- Check Network Access settings

### Issue: "Connection timeout"
**Fix:**
- Check cluster is running (not paused)
- Verify Network Access allows your IP
- Check connection string format

---

## Step-by-Step Setup

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Login with your account

2. **Check Network Access**
   - Left sidebar → Network Access
   - If empty or doesn't have `0.0.0.0/0`, add it
   - Wait 1-2 minutes

3. **Check Database User**
   - Left sidebar → Database Access
   - Verify user `ujwal` exists
   - If not, create it with Atlas Admin role

4. **Get Connection String**
   - Left sidebar → Clusters
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy connection string
   - Replace `<password>` with URL-encoded password

5. **Set in Vercel**
   - Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Add: `MONGODB_URI` = your connection string
   - Environment: **Production**
   - Save and redeploy

6. **Test**
   - Visit: `https://your-domain.com/api/debug/production`
   - Should show `connectionTest: true`

---

## Still Having Issues?

1. **Check MongoDB Atlas Status:**
   - Go to https://status.mongodb.com
   - Verify no outages

2. **Check Vercel Logs:**
   - Vercel Dashboard → Functions
   - Look for MongoDB connection errors
   - Check error messages

3. **Test Locally:**
   - If it works locally but not in production
   - Compare environment variables
   - Check if local MongoDB URI is different

4. **Contact Support:**
   - MongoDB Atlas support (if cluster issues)
   - Vercel support (if deployment issues)

