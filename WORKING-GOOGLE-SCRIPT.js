// COPY THIS ENTIRE FILE INTO GOOGLE APPS SCRIPT

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check postData
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: 'No data' });
    }
    
    // Parse data
    const rawData = e.postData.contents;
    const parsed = JSON.parse(rawData);
    
    // Get the actual data (handle both formats)
    const data = parsed.data || parsed;
    
    // Get values
    const name = data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const url = data.screenshotUrl || '';
    const time = Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss');
    
    // Add to sheet
    sheet.appendRow([name, email, phone, url, time]);
    
    return jsonResponse({ success: true, message: 'Saved' });
    
  } catch (error) {
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

// RUN THIS FIRST - Sets up your sheet
function SETUP_SHEET_NOW() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Clear everything
  sheet.clear();
  
  // Add headers in Row 1
  sheet.getRange('A1').setValue('Name');
  sheet.getRange('B1').setValue('Email');
  sheet.getRange('C1').setValue('Phone');
  sheet.getRange('D1').setValue('Screenshot URL');
  sheet.getRange('E1').setValue('Timestamp');
  
  // Make headers bold and blue
  sheet.getRange('A1:E1').setFontWeight('bold');
  sheet.getRange('A1:E1').setBackground('#4285f4');
  sheet.getRange('A1:E1').setFontColor('white');
  
  // Set column widths
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 500);
  sheet.setColumnWidth(5, 180);
  
  SpreadsheetApp.getUi().alert('✅ Sheet is ready! Now deploy the script.');
}

// RUN THIS SECOND - Tests if it works
function TEST_ADD_ROW() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  sheet.appendRow([
    'Test Name',
    'test@email.com',
    '+1234567890',
    'https://res.cloudinary.com/demo/sample.jpg',
    Utilities.formatDate(new Date(), 'GMT', 'dd/MM/yyyy HH:mm:ss')
  ]);
  
  SpreadsheetApp.getUi().alert('✅ Test row added! Check your sheet.');
}

// RUN THIS THIRD - Tests the full API
function TEST_FULL_API() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'addLead',
        data: {
          name: 'API Test',
          email: 'apitest@email.com',
          phone: '+9876543210',
          screenshotUrl: 'https://res.cloudinary.com/test/image.jpg'
        }
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
  SpreadsheetApp.getUi().alert('✅ API test complete! Check logs and sheet.');
}

