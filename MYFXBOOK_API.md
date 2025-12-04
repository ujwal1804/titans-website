# MyFxBook API Integration

This document explains how to use the MyFxBook API integration in the Titans Trading website.

## Overview

The MyFxBook API integration allows you to authenticate with MyFxBook and retrieve session tokens for accessing trading data and statistics.

## API Endpoint

### Login Endpoint

**URL:** `/api/myfxbook/login`

**Methods:**
- `GET` - Uses default credentials from environment variables
- `POST` - Accepts custom email and password in request body

### Request Examples

#### GET Request (Uses Default Credentials)
```javascript
// Simple GET request - uses default credentials
const response = await fetch('/api/myfxbook/login');
const data = await response.json();
```

#### POST Request (Custom Credentials)
```javascript
// POST request with custom credentials
const response = await fetch('/api/myfxbook/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'your-password',
  }),
});
const data = await response.json();
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "error": false,
  "message": "",
  "session": "DSL07vu4QxHWErTIAFrH40"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": true,
  "message": "Login failed"
}
```

## Usage in React Components

### Using the Custom Hook

The easiest way to use the MyFxBook API is through the `useMyFxBook` hook:

```jsx
import { useMyFxBook } from "@/hooks/useMyFxBook";

function MyComponent() {
  const { session, loading, error, login, logout, isAuthenticated } = useMyFxBook();

  const handleLogin = async () => {
    // Login with default credentials
    await login();
    
    // Or login with custom credentials
    await login('user@example.com', 'password');
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Session: {session}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      )}
    </div>
  );
}
```

### Using the Service Directly

You can also use the service functions directly:

```jsx
import { loginToMyFxBook, getStoredSession, clearSession } from "@/lib/myfxbook";

async function handleLogin() {
  const result = await loginToMyFxBook();
  
  if (result.success) {
    console.log("Session:", result.session);
  }
}

// Get stored session
const session = getStoredSession();

// Clear session
clearSession();
```

## Environment Variables

**Required:** You must create a `.env.local` file in the root directory with your MyFxBook credentials.

### Setup Instructions

1. Create a `.env.local` file in the root directory of your project
2. Add the following environment variables:

```env
# MyFxBook API Configuration
MYFXBOOK_API_URL=https://www.myfxbook.com/api
MYFXBOOK_EMAIL=ujwal.raina.ur@gmail.com
MYFXBOOK_PASSWORD="!000crORE$tu"
```

**Important:** Wrap the password in quotes if it contains special characters like `$` or `!`. The `$` sign is used for variable expansion in shell environments, so it needs to be quoted.

### Environment Variables

- `MYFXBOOK_API_URL` (optional) - Base URL for MyFxBook API. Defaults to `https://www.myfxbook.com/api` if not set.
- `MYFXBOOK_EMAIL` (required) - Your MyFxBook account email
- `MYFXBOOK_PASSWORD` (required) - Your MyFxBook account password

**Important:** 
- The `.env.local` file is already in `.gitignore` and will not be committed to version control
- Never commit your actual credentials to the repository
- The API will return an error if credentials are not configured when using GET requests

## Example Component

A complete example component is available at:
`src/app/components/MyFxBookLogin.jsx`

You can import and use it in your pages:

```jsx
import MyFxBookLogin from "@/app/components/MyFxBookLogin";

export default function Page() {
  return (
    <div>
      <MyFxBookLogin />
    </div>
  );
}
```

## API Features

1. **Automatic Session Storage**: Session tokens are automatically stored in localStorage
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Type Safety**: Full TypeScript support (if using TypeScript)
4. **React Hooks**: Custom hook for easy integration in React components
5. **Flexible Authentication**: Support for both default and custom credentials

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit credentials to version control**
2. **Use environment variables for production**
3. **Session tokens are stored in localStorage** - consider using httpOnly cookies for production
4. **Always use HTTPS in production**
5. **Implement proper session expiration handling**

## Error Handling

The API handles various error scenarios:

- Network errors
- Invalid credentials
- API rate limiting
- Missing parameters

All errors are returned in a consistent format:

```json
{
  "success": false,
  "error": true,
  "message": "Error description",
  "details": "Additional error details (in development)"
}
```

## Get Accounts Endpoint

After successful login, you can retrieve your trading accounts using the session token.

### API Endpoint

**URL:** `/api/myfxbook/get-accounts`

**Methods:**
- `GET` - Pass session as query parameter
- `POST` - Pass session in request body

### Request Examples

#### GET Request
```javascript
const session = "your-session-token";
const response = await fetch(`/api/myfxbook/get-accounts?session=${session}`);
const data = await response.json();
```

#### POST Request
```javascript
const response = await fetch('/api/myfxbook/get-accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session: 'your-session-token',
  }),
});
const data = await response.json();
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "error": false,
  "message": "",
  "accounts": [
    {
      "id": 12345,
      "name": "Holy Grail",
      "description": "Super duper MA+CCI trading system.",
      "accountId": 1013230,
      "gain": 8.92,
      "absGain": 8.92,
      "daily": "0.04",
      "monthly": "1.25",
      "balance": 10892.45,
      "profit": 892.45,
      "drawdown": 53.53,
      "currency": "USD",
      "demo": true,
      "server": {
        "name": "Alpari UK"
      }
    }
  ]
}
```

### Using the Hook

```jsx
import { useMyFxBook } from "@/hooks/useMyFxBook";

function MyComponent() {
  const { session, getAccounts, loading } = useMyFxBook();

  const handleGetAccounts = async () => {
    const result = await getAccounts();
    
    if (result.success) {
      console.log("Accounts:", result.accounts);
    }
  };

  return (
    <button onClick={handleGetAccounts} disabled={loading}>
      Get Accounts
    </button>
  );
}
```

### Using the Service Directly

```jsx
import { getMyFxBookAccounts } from "@/lib/myfxbook";

async function handleGetAccounts() {
  // Uses stored session automatically
  const result = await getMyFxBookAccounts();
  
  // Or pass a custom session
  const result2 = await getMyFxBookAccounts("custom-session-token");
  
  if (result.success) {
    console.log("Accounts:", result.accounts);
  }
}
```

### Example Component

A complete example component is available at:
`src/app/components/MyFxBookAccounts.jsx`

## Get Daily Data Endpoint

Retrieve daily trading data for a specific account. By default, it returns data for the past 4 months.

### API Endpoint

**URL:** `/api/myfxbook/get-data-daily`

**Methods:**
- `GET` - Pass session and account ID as query parameters
- `POST` - Pass session and account ID in request body

### Request Examples

#### GET Request (Default: Past 4 months)
```javascript
const session = "your-session-token";
const accountId = "11808068";
const response = await fetch(`/api/myfxbook/get-data-daily?session=${session}&id=${accountId}`);
const data = await response.json();
```

#### GET Request (Custom Date Range)
```javascript
const session = "your-session-token";
const accountId = "11808068";
const startDate = "2024-01-01";
const endDate = "2024-12-31";
const response = await fetch(`/api/myfxbook/get-data-daily?session=${session}&id=${accountId}&start=${startDate}&end=${endDate}`);
const data = await response.json();
```

#### POST Request
```javascript
const response = await fetch('/api/myfxbook/get-data-daily', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    session: 'your-session-token',
    id: '11808068',
    start: '2024-01-01', // Optional, defaults to 4 months ago
    end: '2024-12-31',   // Optional, defaults to today
  }),
});
const data = await response.json();
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "error": false,
  "message": "",
  "dataDaily": [
    [
      {
        "date": "02/01/2010",
        "balance": 25083.56,
        "pips": 83.30,
        "lots": 0.41,
        "floatingPL": -500.00,
        "profit": 84.7400,
        "growthEquity": -4.15,
        "floatingPips": 1.00
      }
    ]
  ],
  "accountId": "11808068",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### Parameters

- `session` (required) - Session token from login
- `id` (optional) - Account ID (defaults to `11808068`)
- `start` (optional) - Start date in YYYY-MM-DD format (defaults to 4 months ago)
- `end` (optional) - End date in YYYY-MM-DD format (defaults to current date)

### Using the Hook

```jsx
import { useMyFxBook } from "@/hooks/useMyFxBook";

function MyComponent() {
  const { session, getDailyData, loading } = useMyFxBook();

  const handleGetDailyData = async () => {
    // Get past 4 months data (default)
    const result = await getDailyData("11808068");
    
    // Or with custom date range
    const result2 = await getDailyData("11808068", "2024-01-01", "2024-12-31");
    
    if (result.success) {
      console.log("Daily Data:", result.dataDaily);
    }
  };

  return <button onClick={handleGetDailyData}>Get Daily Data</button>;
}
```

### Using the Service Directly

```jsx
import { getMyFxBookDailyData } from "@/lib/myfxbook";

async function handleGetDailyData() {
  // Get past 4 months data (default account ID: 11808068)
  const result = await getMyFxBookDailyData();
  
  // Or with custom parameters
  const result2 = await getMyFxBookDailyData(
    "session-token",
    "11808068",
    "2024-01-01",
    "2024-12-31"
  );
  
  if (result.success) {
    console.log("Daily Data:", result.dataDaily);
  }
}
```

### Example Component

A complete example component is available at:
`src/app/components/MyFxBookDailyData.jsx`

```jsx
import MyFxBookDailyData from "@/app/components/MyFxBookDailyData";

<MyFxBookDailyData accountId="11808068" />
```

## Next Steps

After successful login, you can use the session token to make additional MyFxBook API calls. Refer to the [MyFxBook API Documentation](https://www.myfxbook.com/api) for available endpoints.

## Support

For issues or questions, please refer to the main project documentation or contact the development team.

