function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: 'No data received' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the incoming data
    const data = JSON.  parse(e.postData.contents);
    const leadData = data.action === 'addLead' ? data.data : data;
    
    // Extract and clean the data
    const name = leadData.name || '';
    const email = leadData.email || '';
    const phone = leadData.phone || '';
    const screenshotUrl = leadData.screenshotUrl || '';
    
    // Format timestamp properly
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, 'GMT', 'dd/MM/yyyy HH:mm:ss');
    
    // Add row to sheet: Name | Email | Phone | Screenshot URL | Timestamp
    sheet.appendRow([name, email, phone, screenshotUrl, formattedDate]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved successfully' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
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
  sheet.setColumnWidth(4, 300); // Screenshot URL
  sheet.setColumnWidth(5, 150); // Timestamp
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  Logger.log('Sheet setup complete!');
}

// Test function
function testAddData() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'addLead',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          screenshotUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          timestamp: new Date().toISOString()
        }
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}
