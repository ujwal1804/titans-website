# Simple Google Sheets Setup (5 minutes)

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Titans Trading Leads"
3. In row 1, add these headers:
   - **A1**: Name
   - **B1**: Email
   - **C1**: Phone
   - **D1**: Screenshot URL
   - **E1**: Timestamp

## Step 2: Add Apps Script

1. Click **Extensions** → **Apps Script**
2. Delete default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Handle wrapped format (with action)
    const leadData = data.action === 'addLead' ? data.data : data;
    
    const { name, email, phone, screenshotUrl, timestamp } = leadData;
    
    // Add row
    sheet.appendRow([
      name,
      email,
      phone,
      screenshotUrl || '',
      timestamp || new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Lead saved' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾)

## Step 3: Deploy

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → Choose **Web app**
3. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)

## Step 4: Add to `.env.local`

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Step 5: Restart Server

```bash
npm run dev
```

## Test It

1. Fill out the form on your website
2. Submit
3. Check your Google Sheet - new row should appear!

## Debugging

If data isn't appearing, check Apps Script logs:
1. In Apps Script editor, click **Executions** (left sidebar)
2. Look for recent executions and any errors
3. Check if the request is even reaching the script

## Common Issues

**"Permission denied"**: Redeploy and make sure "Who has access" is set to "Anyone"

**CORS error**: The script handles CORS automatically for POST requests

**No data**: Check browser console and server logs for the actual error message

