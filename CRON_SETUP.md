# Cron Job Setup Guide

This guide explains how to set up the daily cron job to sync data from MyFxBook API to MongoDB.

## Overview

The cron job endpoint (`/api/cron/sync-data`) fetches fresh data from the MyFxBook API and saves it to MongoDB once per day. The dashboard then reads data from MongoDB instead of calling the API directly.

## Setup Options

### Option 1: Vercel Cron (Recommended for Vercel deployments)

If you're deploying to Vercel, the cron job is already configured in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/sync-data",
    "schedule": "0 0 * * *"
  }]
}
```

This runs the cron job every day at midnight UTC.

**To enable:**
1. Deploy your project to Vercel
2. The cron job will automatically be set up
3. You can view and manage cron jobs in the Vercel dashboard under your project settings

### Option 2: External Cron Service

If you're not using Vercel, you can use an external cron service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Cronitor](https://cronitor.io)

**Setup steps:**
1. Sign up for a cron service
2. Create a new cron job
3. Set the URL to: `https://your-domain.com/api/cron/sync-data`
4. Set the schedule to: `0 0 * * *` (daily at midnight UTC)
5. Set the HTTP method to: `GET`

**Optional: Add Authentication**

To secure your cron endpoint, add a `CRON_SECRET` environment variable:

1. Add to `.env.local`:
   ```env
   CRON_SECRET=your-secret-key-here
   ```

2. Configure your cron service to send the secret in the Authorization header:
   ```
   Authorization: Bearer your-secret-key-here
   ```

### Option 3: Manual Trigger (Testing)

You can manually trigger the sync by visiting:
```
http://localhost:3000/api/cron/sync-data
```

Or using curl:
```bash
curl http://localhost:3000/api/cron/sync-data
```

## Cron Schedule Format

The schedule `0 0 * * *` means:
- `0` - minute (0)
- `0` - hour (0 = midnight)
- `*` - day of month (every day)
- `*` - month (every month)
- `*` - day of week (every day)

**Other useful schedules:**
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Every Monday at midnight
- `0 9 * * *` - Every day at 9 AM UTC

## What the Cron Job Does

1. **Logs in to MyFxBook** - Gets a fresh session
2. **Fetches Account Data** - Gets the latest account information
3. **Fetches Daily Data** - Gets daily trading data from August 1, 2025 to today
4. **Saves to MongoDB** - Stores all data in the `dashboard_data` collection
5. **Verifies Data** - Confirms data was saved successfully

## Monitoring

The cron job returns a JSON response with:
- `success` - Whether the sync was successful
- `accountSaved` - Whether account data was saved
- `dailyDataSaved` - Whether daily data was saved
- `messages` - Array of status messages
- `errors` - Array of any errors that occurred
- `mongodbStats` - Count of documents in MongoDB

## Troubleshooting

### Cron Job Not Running

1. **Check Vercel Dashboard** - If using Vercel, check the cron jobs section
2. **Check External Service** - Verify the cron service is configured correctly
3. **Check Logs** - Look at your deployment logs for errors
4. **Test Manually** - Try calling the endpoint manually to see if it works

### Data Not Updating

1. **Check MongoDB Connection** - Verify `MONGODB_URI` is set correctly
2. **Check MyFxBook Credentials** - Verify `MYFXBOOK_EMAIL` and `MYFXBOOK_PASSWORD` are set
3. **Check Cron Logs** - Look for errors in the cron job response
4. **Verify Data in MongoDB** - Check if data exists in your MongoDB collection

### Authentication Errors

If you see "Invalid session" errors:
- The cron job has retry logic built in
- It will automatically get a fresh session and retry
- Check the response messages for retry attempts

## Environment Variables Required

Make sure these are set in your `.env.local` (development) or Vercel environment variables (production):

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# MyFxBook API
MYFXBOOK_EMAIL=your-email@example.com
MYFXBOOK_PASSWORD=your-password
MYFXBOOK_API_URL=https://www.myfxbook.com/api

# Optional: Cron Security
CRON_SECRET=your-secret-key-here
```

## Testing

To test the cron job manually:

1. **Local Testing:**
   ```bash
   curl http://localhost:3000/api/cron/sync-data
   ```

2. **Production Testing:**
   ```bash
   curl https://your-domain.com/api/cron/sync-data
   ```

3. **Check Response:**
   The response should show `"success": true` if everything worked.

## Next Steps

After setting up the cron job:

1. **Wait for First Run** - The cron job will run at the scheduled time
2. **Check Dashboard** - Visit `/dashboard` to see data from MongoDB
3. **Monitor** - Check cron logs regularly to ensure it's running successfully

