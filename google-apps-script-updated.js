function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('❌ No postData received');
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: 'No data received' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Log raw data
    Logger.log('📥 Raw data received: ' + e.postData.contents);
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    Logger.log('📊 Parsed data: ' + JSON.stringify(data));
    
    const leadData = data.action === 'addLead' ? data.data : data;
    Logger.log('🎯 Lead data: ' + JSON.stringify(leadData));
    
    // Extract and clean the data
    const name = leadData.name || '';
    const email = leadData.email || '';
    const phone = leadData.phone || '';
    const screenshotUrl = leadData.screenshotUrl || '';
    
    Logger.log('📝 Extracted fields:');
    Logger.log('  Name: ' + name);
    Logger.log('  Email: ' + email);
    Logger.log('  Phone: ' + phone);
    Logger.log('  Screenshot URL: ' + screenshotUrl);
    Logger.log('  Screenshot URL length: ' + screenshotUrl.length);
    
    // Format timestamp properly
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, 'GMT', 'dd/MM/yyyy HH:mm:ss');
    
    // Prepare row data
    const rowData = [name, email, phone, screenshotUrl, formattedDate];
    Logger.log('💾 Adding row with ' + rowData.length + ' columns');
    Logger.log('Row data: ' + JSON.stringify(rowData));
    
    // Add row to sheet: Name | Email | Phone | Screenshot URL | Timestamp
    sheet.appendRow(rowData);
    
    Logger.log('✅ Row added successfully!');
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved successfully' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    'This endpoint only accepts POST requests'
  );
}

// Initialize sheet with headers (run this once)
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Clear existing content
  sheet.clear();
  
  // Add headers
  const headers = ['Name', 'Email', 'Phone', 'Screenshot URL', 'Timestamp'];
  sheet.appendRow(headers);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Name
  sheet.setColumnWidth(2, 200); // Email
  sheet.setColumnWidth(3, 150); // Phone
  sheet.setColumnWidth(4, 400); // Screenshot URL (wider for full URL)
  sheet.setColumnWidth(5, 150); // Timestamp
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Sheet setup complete!');
}

// Test function with Cloudinary URL
function testAddData() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'addLead',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          screenshotUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/titans-trading-payment-screenshots/sample123.jpg',
          timestamp: new Date().toISOString()
        }
      })
    }
  };
  
  Logger.log('🧪 Running test...');
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
  Logger.log('✅ Check your sheet for the test row!');
}

