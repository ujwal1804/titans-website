# Trading Dashboard Guide

## Overview

The Titans Trading website now includes a comprehensive trading dashboard that displays real-time data from MyFxBook API. The dashboard shows account performance, daily trading data, and analytics.

## New Pages & Components

### 1. Dashboard Page (`/dashboard`)

**Location:** `src/app/dashboard/page.js`

A full-featured trading dashboard that:
- Automatically logs in to MyFxBook
- Displays account overview with key metrics
- Shows performance metrics and statistics
- Visualizes daily trading data with charts
- Provides detailed trading statistics

**Features:**
- Auto-login on page load
- Real-time data fetching
- Responsive design for all screen sizes
- Loading and error states
- Automatic data refresh

### 2. Account Overview Component

**Location:** `src/app/components/AccountOverview.jsx`

Displays key account metrics in a card grid:
- Account Balance
- Total Profit
- Total Gain (%)
- Max Drawdown (%)

**Features:**
- Color-coded metrics (green for positive, red for negative)
- Icon indicators
- Responsive grid layout
- Hover effects

### 3. Performance Metrics Component

**Location:** `src/app/components/PerformanceMetrics.jsx`

Shows detailed performance analytics:
- Monthly Gain
- Daily Gain
- Absolute Gain
- Profit Factor
- Average Daily Profit
- Best/Worst Trading Days

**Features:**
- Calculated metrics from daily data
- Trend indicators
- Summary statistics

### 4. Trading Stats Component

**Location:** `src/app/components/TradingStats.jsx`

Displays trading statistics:
- Total Pips
- Deposits
- Withdrawals
- Account Type (Live/Demo)
- Trading Server
- Last Update Date

### 5. Daily Data Chart Component

**Location:** `src/app/components/DailyDataChart.jsx`

Visualizes daily trading performance:
- Account Balance Trend (SVG chart)
- Daily Profit/Loss Bar Chart
- Recent Daily Data Table
- Summary Statistics

**Features:**
- Custom SVG charts (no external dependencies)
- Interactive hover tooltips
- Responsive design
- Data table with last 10 days

### 6. Updated LiveResults Component

**Location:** `src/app/components/LiveResults.jsx`

Now fetches and displays real account data:
- Total Profit (from account)
- Total Gain (from account)
- Last Update Date (from account)

**Features:**
- Auto-loads data when authenticated
- Falls back to default values if data unavailable
- Real-time updates

### 7. Updated BacktestResults Component

**Location:** `src/app/components/BacktestResults.jsx`

Now displays real performance metrics:
- Total Gain from account
- Max Drawdown from account
- Profit amount

**Features:**
- Dynamic content based on real data
- Falls back to defaults if needed

## API Integration

All components use the MyFxBook API through:

1. **Login Endpoint** (`/api/myfxbook/login`)
   - Automatically called when needed
   - Uses credentials from `.env.local`

2. **Get Accounts Endpoint** (`/api/myfxbook/get-accounts`)
   - Returns only account ID 11808068 (Titansfx2.0)
   - Auto-login if session not provided

3. **Get Daily Data Endpoint** (`/api/myfxbook/get-data-daily`)
   - Returns past 4 months of daily data
   - Auto-login if session not provided
   - Default account ID: 11808068

## Usage

### Accessing the Dashboard

1. Navigate to `/dashboard` in your browser
2. The page will automatically:
   - Login to MyFxBook
   - Fetch account data
   - Load daily trading data
   - Display all metrics and charts

### Using Components in Other Pages

```jsx
import AccountOverview from "@/app/components/AccountOverview";
import { useMyFxBook } from "@/hooks/useMyFxBook";

function MyPage() {
  const { getAccounts } = useMyFxBook();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getAccounts();
      if (result.success && result.account) {
        setAccount(result.account);
      }
    };
    loadData();
  }, []);

  return account && <AccountOverview account={account} />;
}
```

## Data Flow

1. **Page Load** → Auto-login to MyFxBook
2. **Get Account** → Fetch account 11808068 data
3. **Get Daily Data** → Fetch past 4 months of daily data
4. **Display** → Show all metrics and charts

## Responsive Design

All components are fully responsive:
- **Mobile**: Single column layouts, compact cards
- **Tablet**: 2-column grids
- **Desktop**: Multi-column layouts, full charts

## Error Handling

- Loading states for all data fetches
- Error messages if API calls fail
- Fallback to default values if data unavailable
- Retry mechanisms for failed requests

## Styling

All components use:
- Tailwind CSS for styling
- Consistent color scheme (cyan/green for positive, red for negative)
- Dark theme matching the website
- Smooth animations and transitions

## Future Enhancements

Potential additions:
- Real-time data updates (WebSocket)
- Export data functionality
- Date range selector for daily data
- Additional chart types
- Performance comparison tools
- Trade history details



