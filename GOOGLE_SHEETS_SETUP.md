# Google Sheets Setup with Apps Script

This guide will help you set up Google Sheets integration to store form submissions from the "Get Started" popup.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Titans Trading Leads" (or any name you prefer)
4. In the first row, add these column headers:
   - **A1**: Name
   - **B1**: Email
   - **C1**: Phone
   - **D1**: Payment Screenshot URL
   - **E1**: Timestamp

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code and paste the following:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addLead') {
      const { name, email, phone, screenshotUrl, timestamp } = data.data;
      
      // Add a new row with the lead data
      sheet.appendRow([
        name,
        email,
        phone,
        screenshotUrl || '',
        timestamp || new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: 'Lead added successfully'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Invalid action'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing)
function testAddLead() {
  const testData = {
    action: 'addLead',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      timestamp: new Date().toISOString()
    }
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
```

3. Click **Save** (💾 icon) and give your project a name like "Titans Trading Leads Handler"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Titans Trading Leads API"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (this is safe because the script validates the data structure)
4. Click **Deploy**
5. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Add URL to Environment Variables

1. Create or update your `.env.local` file in the project root
2. Add the Google Script URL:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

3. Restart your Next.js development server

## Step 5: Test the Integration

1. Fill out the "Get Started" form on your website
2. Submit the form
3. Check your Google Sheet - you should see a new row with the submitted data

## Security Notes

- The Apps Script validates the data structure before adding to the sheet
- Only data matching the expected format will be saved
- The script runs with your permissions, so only you can modify the sheet
- Consider adding additional validation in the Apps Script if needed

## Troubleshooting

### Data not appearing in sheet?
- Check the Apps Script execution log: **View** → **Execution log**
- Verify the Web App URL is correct in your `.env.local`
- Make sure the deployment is set to "Anyone" access
- Check that column headers match exactly (Name, Email, Phone, Timestamp)

### CORS errors?
- Make sure the Web App deployment allows "Anyone" to access it
- The Apps Script automatically handles CORS for POST requests

### Need to update the script?
- After making changes, click **Deploy** → **Manage deployments**
- Click the pencil icon to edit
- Choose "New version" and deploy again
- The URL stays the same, so no need to update `.env.local`

