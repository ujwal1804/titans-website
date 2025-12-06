# Final Setup Instructions - Google Sheets Integration

## Step 1: Setup Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Titans Trading Leads"**

## Step 2: Add Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete all default code
3. Copy and paste the code from `google-apps-script.js` file
4. Click **Save** (💾 icon)
5. Name the project: **"Titans Trading Leads API"**

## Step 3: Initialize Sheet Headers

1. In Apps Script editor, select `setupSheet` from the function dropdown at the top
2. Click **Run** (▶️ play button)
3. **Authorize the script** when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Your Project Name]"
   - Click "Allow"
4. Check your Google Sheet - it should now have formatted headers:
   - Name | Email | Phone | Screenshot URL | Timestamp

## Step 4: Test the Script

1. Select `testAddData` from the function dropdown
2. Click **Run** (▶️)
3. Check your Google Sheet - you should see a test row with sample data
4. If the test row appears, the script is working! ✅

## Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description**: Production v1
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ⚠️ IMPORTANT!
5. Click **Deploy**
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 6: Add to Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add this line:
   ```env
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual script ID from the URL

## Step 7: Restart Your Server

```bash
npm run dev
```

## Step 8: Test the Integration

1. Open your website
2. Click "Get Started"
3. Fill out the form:
   - Name
   - Email
   - Phone
   - Upload a payment screenshot
4. Click "Continue to Registration"
5. Check your Google Sheet - a new row should appear with:
   - ✅ Name
   - ✅ Email
   - ✅ Phone
   - ✅ Cloudinary URL for the screenshot
   - ✅ Formatted timestamp (DD/MM/YYYY HH:MM:SS)

## Expected Result

Your Google Sheet will look like this:

| Name | Email | Phone | Screenshot URL | Timestamp |
|------|-------|-------|----------------|-----------|
| John Doe | john@example.com | +1234567890 | https://res.cloudinary.com/... | 06/12/2025 16:30:45 |

## Troubleshooting

### Data not appearing?

1. **Check Apps Script Executions**:
   - In Apps Script, click **Executions** (left sidebar)
   - Look for recent executions
   - Check for any error messages

2. **Check browser console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any error messages when submitting

3. **Verify deployment**:
   - Make sure "Who has access" is set to **Anyone**
   - If not, redeploy with correct settings

4. **Check environment variable**:
   - Make sure `GOOGLE_SCRIPT_URL` in `.env.local` is correct
   - Make sure you restarted the dev server after adding it

### CORS errors?

- Redeploy the script with "Who has access: Anyone"
- The script automatically handles CORS

### Permission errors?

- Make sure you authorized the script in Step 3
- Try running `setupSheet` again and authorizing

## Data Format

The script saves data in this format:
- **Name**: Plain text
- **Email**: Plain text
- **Phone**: Plain text with country code
- **Screenshot URL**: Full Cloudinary URL (clickable link)
- **Timestamp**: DD/MM/YYYY HH:MM:SS format

You can click on the Screenshot URL in Google Sheets to view the uploaded payment screenshot!

