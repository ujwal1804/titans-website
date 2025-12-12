# MongoDB Implementation Guide

## Overview

All API data is now systematically stored in MongoDB collections and fetched from the database instead of calling external APIs directly.

## Collection Structure

### MyFxBook Collections

1. **`myfxbook_accounts`** - Account information
   - One document per account
   - Updated on each sync

2. **`myfxbook_daily_data`** - Daily trading data
   - One document per day per account
   - Historical data preserved

3. **`myfxbook_gain`** - Gain data for date ranges
   - One document per date range query

4. **`myfxbook_daily_gain`** - Daily gain data
   - One document per day per account

### Application Collections

5. **`leads`** - Form submissions
6. **`payments`** - Payment uploads with screenshots

## API Endpoints

### MongoDB Fetch Endpoints (Use These)

All data should be fetched from these endpoints:

- **Account Data:** `/api/db/myfxbook/account?id=11808068`
- **Daily Data:** `/api/db/myfxbook/daily-data?id=11808068&start=2025-08-01&end=2025-01-15`
- **Gain Data:** `/api/db/myfxbook/gain?id=11808068&start=2025-08-01&end=2025-01-15`
- **Daily Gain:** `/api/db/myfxbook/daily-gain?id=11808068&start=2025-08-01&end=2025-01-15`
- **Dashboard (All):** `/api/db/dashboard?id=11808068`

### Legacy Endpoints (Still Work)

- `/api/mongodb/get-account` → Uses new collections
- `/api/mongodb/get-daily-data` → Uses new collections
- `/api/mongodb/get-dashboard-data` → Uses new collections

## Data Flow

1. **API Routes** (MyFxBook endpoints)
   - Fetch from external APIs when called
   - Automatically save to MongoDB
   - Return API response

2. **Dashboard/Components**
   - Use MongoDB endpoints (`/api/db/*`)
   - Read from MongoDB (fast, reliable)
   - No external API calls needed
   - Data loads automatically from database

## Benefits

✅ **Performance** - MongoDB queries are faster  
✅ **Reliability** - Data available even if APIs are down  
✅ **No Rate Limits** - No external API rate limiting  
✅ **Historical Data** - All data preserved with timestamps  
✅ **Systematic** - Organized collections for easy querying  
✅ **Scalable** - Easy to add more collections

## Usage in Components

### Using the MongoDB Hook

```jsx
import { useMongoDB } from "@/hooks/useMongoDB";

function MyComponent() {
  const { getDashboardData, loading, error } = useMongoDB();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getDashboardData("11808068");
      if (result.success) {
        setData(result);
      }
    };
    loadData();
  }, []);

  return <div>{/* Display data */}</div>;
}
```

## Manual Sync (For Testing)

To manually sync data (useful for testing or immediate updates):

```
GET /api/mongodb/sync-now
```

This will:
- Fetch fresh data from all MyFxBook APIs
- Save to MongoDB
- Return detailed status report

**Note:** The dashboard automatically reads from MongoDB. Data is saved to MongoDB whenever the MyFxBook API endpoints are called.

