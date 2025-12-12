# MongoDB Database Structure

This document describes the systematic MongoDB collection structure for storing all API data.

## Collection Structure

### 1. MyFxBook Collections

#### `myfxbook_accounts`
Stores account information from MyFxBook API.

**Document Structure:**
```javascript
{
  accountId: "11808068",           // String - Account ID
  data: {                          // Full account object from API
    id: 11808068,
    name: "Account Name",
    balance: 10000.00,
    profit: 500.00,
    gain: 5.0,
    // ... all other account fields
  },
  createdAt: Date,                  // First creation timestamp
  updatedAt: Date                  // Last update timestamp
}
```

**Indexes:**
- `accountId` (unique)

#### `myfxbook_daily_data`
Stores daily trading data entries.

**Document Structure:**
```javascript
{
  accountId: "11808068",           // String - Account ID
  date: "2025-01-15",              // String - Date in YYYY-MM-DD format
  data: {                          // Daily data entry from API
    date: "01/15/2025",
    balance: 10000.00,
    profit: 50.00,
    // ... all other daily data fields
  },
  startDate: "2025-08-01",        // Date range start
  endDate: "2025-01-15",           // Date range end
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `accountId` + `date` (compound, unique)

#### `myfxbook_gain`
Stores gain data for specific date ranges.

**Document Structure:**
```javascript
{
  accountId: "11808068",
  startDate: "2025-08-01",        // Date range start
  endDate: "2025-01-15",          // Date range end
  data: {
    value: 5.5                     // Gain value
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `accountId` + `startDate` + `endDate` (compound)

#### `myfxbook_daily_gain`
Stores daily gain data entries.

**Document Structure:**
```javascript
{
  accountId: "11808068",
  date: "2025-01-15",
  data: {                          // Daily gain entry
    date: "01/15/2025",
    value: 0.5,
    // ... other gain fields
  },
  startDate: "2025-08-01",
  endDate: "2025-01-15",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `accountId` + `date` (compound, unique)

### 2. Application Collections

#### `leads`
Stores form submissions/leads.

**Document Structure:**
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  message: "Optional message",
  createdAt: Date,
  updatedAt: Date
}
```

#### `payments`
Stores payment uploads/submissions.

**Document Structure:**
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  screenshotUrl: "https://cloudinary.com/...",
  timestamp: "2025-01-15T10:30:00Z",
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### MongoDB Fetch Endpoints (Use These Instead of Direct APIs)

#### Get Account Data
```
GET /api/db/myfxbook/account?id=11808068
```

#### Get Daily Data
```
GET /api/db/myfxbook/daily-data?id=11808068&start=2025-08-01&end=2025-01-15
```

#### Get Gain Data
```
GET /api/db/myfxbook/gain?id=11808068&start=2025-08-01&end=2025-01-15
```

#### Get Daily Gain Data
```
GET /api/db/myfxbook/daily-gain?id=11808068&start=2025-08-01&end=2025-01-15
```

#### Get Dashboard Data (All)
```
GET /api/db/dashboard?id=11808068
```

### Legacy Endpoints (Still Work, But Use DB Endpoints)

- `/api/mongodb/get-account` - Redirects to new structure
- `/api/mongodb/get-daily-data` - Redirects to new structure
- `/api/mongodb/get-dashboard-data` - Redirects to new structure

## Data Flow

1. **Cron Job** (`/api/cron/sync-data`)
   - Runs daily at midnight UTC
   - Fetches data from all MyFxBook APIs
   - Saves to MongoDB collections
   - Updates existing records

2. **API Routes** (MyFxBook endpoints)
   - Still fetch from external APIs
   - Automatically save to MongoDB when data is retrieved
   - Return API response to client

3. **Dashboard/Components**
   - Use MongoDB fetch endpoints (`/api/db/*`)
   - Read from MongoDB (faster, no API rate limits)
   - No authentication needed

## Benefits

1. **Performance**: MongoDB queries are faster than external API calls
2. **Reliability**: Data available even if external APIs are down
3. **Rate Limiting**: No external API rate limits
4. **Historical Data**: All data is preserved with timestamps
5. **Systematic**: Organized collections make data easy to query
6. **Scalable**: Can add more collections as needed

## Migration Notes

- Old `dashboard_data` collection is still supported for backward compatibility
- New collections use more specific names (`myfxbook_accounts`, etc.)
- All data is automatically synced daily via cron job
- Manual sync available via `/api/mongodb/sync-now`

