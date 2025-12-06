// ULTIMATE WORKING VERSION - COPY THIS INTO GOOGLE APPS SCRIPT

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get the raw data
    const rawData = e.postData.contents;
    Logger.log('📥 Received: ' + rawData);
    
    // Parse JSON
    const json = JSON.parse(rawData);
    Logger.log('📊 Parsed JSON: ' + JSON.stringify(json));
    
    // Extract data - handle both formats
    let name, email, phone, screenshotUrl;
    
    if (json.action === 'addLead' && json.data) {
      // New format with action wrapper
      name = json.data.name || '';
      email = json.data.email || '';
      phone = json.data.phone || '';
      screenshotUrl = json.data.screenshotUrl || '';
      Logger.log('✅ Using wrapped format (action: addLead)');
    } else {
      // Direct format
      name = json.name || '';
      email = json.email || '';
      phone = json.phone || '';
      screenshotUrl = json.screenshotUrl || '';
      Logger.log('✅ Using direct format');
    }
    
    // Log what we extracted
    Logger.log('📝 Extracted:');
    Logger.log('  Name: ' + name);
    Logger.log('  Email: ' + email);
    Logger.log('  Phone: ' + phone);
    Logger.log('  Screenshot URL: ' + screenshotUrl);
    Logger.log('  URL length: ' + screenshotUrl.length);
    
    // Format timestamp
    const timestamp = Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss');
    
    // Build the row - EXACTLY 5 columns: Name, Email, Phone, Screenshot URL, Timestamp
    const row = [
      name,           // Column A (index 0)
      email,          // Column B (index 1)
      phone,          // Column C (index 2)
      screenshotUrl,  // Column D (index 3) - THIS IS THE URL!
      timestamp       // Column E (index 4)
    ];
    
    Logger.log('💾 Row to add: ' + JSON.stringify(row));
    Logger.log('   Column D (index 3): "' + row[3] + '"');
    
    // Add the row
    sheet.appendRow(row);
    
    // Verify it was added correctly
    const lastRow = sheet.getLastRow();
    Logger.log('✅ Added to row: ' + lastRow);
    
    // Read back what was actually saved
    const savedRow = sheet.getRange(lastRow, 1, 1, 5).getValues()[0];
    Logger.log('🔍 Verification - Row ' + lastRow + ' contents:');
    Logger.log('   A (Name): "' + savedRow[0] + '"');
    Logger.log('   B (Email): "' + savedRow[1] + '"');
    Logger.log('   C (Phone): "' + savedRow[2] + '"');
    Logger.log('   D (Screenshot URL): "' + savedRow[3] + '"');
    Logger.log('   E (Timestamp): "' + savedRow[4] + '"');
    
    // Double check column D specifically
    const columnD = sheet.getRange(lastRow, 4).getValue();
    Logger.log('🔍 Column D directly: "' + columnD + '"');
    
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: true, 
        message: 'Saved successfully',
        url: screenshotUrl,
        row: lastRow
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Use POST method only')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Setup headers - RUN THIS FIRST
function SETUP_HEADERS() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Clear sheet
  sheet.clear();
  
  // Set headers in row 1
  const headers = ['Name', 'Email', 'Phone', 'Screenshot URL', 'Timestamp'];
  sheet.getRange(1, 1, 1, 5).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Set column widths
  sheet.setColumnWidth(1, 150);  // Name
  sheet.setColumnWidth(2, 200);  // Email
  sheet.setColumnWidth(3, 150);  // Phone
  sheet.setColumnWidth(4, 600);  // Screenshot URL - VERY WIDE!
  sheet.setColumnWidth(5, 180);   // Timestamp
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  SpreadsheetApp.getUi().alert('✅ Headers set! Column D is 600px wide.');
}

// Test function - adds a row with URL
function TEST_URL_SAVE() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const testUrl = 'https://res.cloudinary.com/dfdxba7yz/image/upload/v1765024918/titans-trading-payment-screenshots/test123.png';
  
  const row = [
    'Test Name',
    'test@test.com',
    '+1234567890',
    testUrl,
    Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss')
  ];
  
  Logger.log('🧪 Testing direct appendRow with URL:');
  Logger.log('Row: ' + JSON.stringify(row));
  
  sheet.appendRow(row);
  
  const lastRow = sheet.getLastRow();
  const saved = sheet.getRange(lastRow, 1, 1, 5).getValues()[0];
  Logger.log('✅ Saved row ' + lastRow);
  Logger.log('Column D: "' + saved[3] + '"');
  
  SpreadsheetApp.getUi().alert('✅ Test complete! Check row ' + lastRow + ', column D.');
}

