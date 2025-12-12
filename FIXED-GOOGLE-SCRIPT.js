// FINAL WORKING VERSION - COPY THIS INTO GOOGLE APPS SCRIPT

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Log incoming request
    Logger.log('=== NEW REQUEST ===');
    
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('ERROR: No postData');
      return jsonResponse({ success: false, message: 'No data' });
    }
    
    // Parse data
    const rawData = e.postData.contents;
    Logger.log('Raw data: ' + rawData);
    
    const parsed = JSON.parse(rawData);
    Logger.log('Parsed: ' + JSON.stringify(parsed));
    
    // Get the actual data (handle both formats)
    const leadData = parsed.action === 'addLead' ? parsed.data : parsed;
    Logger.log('Lead data: ' + JSON.stringify(leadData));
    
    // Extract values one by one
    const name = String(leadData.name || '');
    const email = String(leadData.email || '');
    const phone = String(leadData.phone || '');
    const screenshotUrl = String(leadData.screenshotUrl || '');
    const time = Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss');
    
    // Log extracted values
    Logger.log('=== EXTRACTED VALUES ===');
    Logger.log('Name: "' + name + '"');
    Logger.log('Email: "' + email + '"');
    Logger.log('Phone: "' + phone + '"');
    Logger.log('Screenshot URL: "' + screenshotUrl + '"');
    Logger.log('Screenshot URL length: ' + screenshotUrl.length);
    Logger.log('Timestamp: "' + time + '"');
    
    // Create row array
    const rowData = [name, email, phone, screenshotUrl, time];
    Logger.log('Row data: ' + JSON.stringify(rowData));
    Logger.log('Row has ' + rowData.length + ' values');
    
    // Add to sheet
    Logger.log('Adding row to sheet...');
    sheet.appendRow(rowData);
    Logger.log('✅ Row added successfully');
    
    // Verify it was added
    const lastRow = sheet.getLastRow();
    const addedData = sheet.getRange(lastRow, 1, 1, 5).getValues()[0];
    Logger.log('Verified row ' + lastRow + ': ' + JSON.stringify(addedData));
    Logger.log('Column D value: "' + addedData[3] + '"');
    
    return jsonResponse({ success: true, message: 'Saved' });
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return jsonResponse({ success: false, message: error.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({ message: 'Use POST only' });
}

// Setup sheet with headers
function SETUP_SHEET_NOW() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Clear everything
  sheet.clear();
  
  // Add headers
  sheet.getRange('A1').setValue('Name');
  sheet.getRange('B1').setValue('Email');
  sheet.getRange('C1').setValue('Phone');
  sheet.getRange('D1').setValue('Screenshot URL');
  sheet.getRange('E1').setValue('Timestamp');
  
  // Format headers
  sheet.getRange('A1:E1').setFontWeight('bold');
  sheet.getRange('A1:E1').setBackground('#4285f4');
  sheet.getRange('A1:E1').setFontColor('white');
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Name
  sheet.setColumnWidth(2, 200); // Email
  sheet.setColumnWidth(3, 150); // Phone
  sheet.setColumnWidth(4, 500); // Screenshot URL - WIDE!
  sheet.setColumnWidth(5, 180); // Timestamp
  
  SpreadsheetApp.getUi().alert('✅ Sheet ready!');
}

// Test with a real Cloudinary URL
function TEST_WITH_URL() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const testUrl = 'https://res.cloudinary.com/dfdxba7yz/image/upload/v1765024918/titans-trading-payment-screenshots/test.png';
  
  Logger.log('Testing with URL: ' + testUrl);
  Logger.log('URL length: ' + testUrl.length);
  
  const row = [
    'Test User',
    'test@email.com',
    '+1234567890',
    testUrl,
    Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss')
  ];
  
  Logger.log('Adding row: ' + JSON.stringify(row));
  sheet.appendRow(row);
  
  // Verify
  const lastRow = sheet.getLastRow();
  const addedData = sheet.getRange(lastRow, 1, 1, 5).getValues()[0];
  Logger.log('Added row ' + lastRow + ': ' + JSON.stringify(addedData));
  Logger.log('Column D (URL): ' + addedData[3]);
  
  SpreadsheetApp.getUi().alert('✅ Test complete! Check logs and sheet.');
}

// Test the full API flow
function TEST_FULL_API() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'addLead',
        data: {
          name: 'API Test',
          email: 'apitest@email.com',
          phone: '+9876543210',
          screenshotUrl: 'https://res.cloudinary.com/dfdxba7yz/image/upload/v1765024918/titans-trading-payment-screenshots/grg7wmn8mhmoej3ioq5g.png'
        }
      })
    }
  };
  
  Logger.log('Running API test...');
  const result = doPost(mockEvent);
  Logger.log('Result: ' + result.getContent());
  
  SpreadsheetApp.getUi().alert('✅ API test done! Check logs and sheet.');
}



