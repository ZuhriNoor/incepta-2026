/**
 * INCEPTA 2026 - Fasttyping Leaderboard Google Apps Script
 * 
 * Sheet ID: 1Lexb4w5geSwr5u4zlLARtm6mBZwHc5Kipqz8fOKfvEM
 * 
 * REQUIRED COLUMNS (Row 1 headers):
 * | A         | B    | C          | D   | E        | F     |
 * | Timestamp | Name | Department | WPM | Accuracy | Score |
 * 
 * Position is calculated automatically based on score (WPM × Accuracy/100)
 */

// Sheet ID - Your Google Sheet
const SHEET_ID = '1Lexb4w5geSwr5u4zlLARtm6mBZwHc5Kipqz8fOKfvEM';

// Admin key for authentication
const ADMIN_KEY = 'incepta2026admin';

/**
 * Get the sheet by ID
 */
function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
}

/**
 * Handle GET requests - Fetch all leaderboard entries with calculated positions
 */
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to objects
    const entries = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1]) { // Check if name exists
        const wpm = parseInt(row[3]) || 0;
        const accuracy = parseFloat(row[4]) || 0;
        const score = wpm * (accuracy / 100);
        
        entries.push({
          id: i, // Row index as ID
          timestamp: row[0],
          name: row[1],
          department: row[2],
          wpm: wpm,
          accuracy: accuracy,
          score: Math.round(score * 100) / 100 // Round to 2 decimal places
        });
      }
    }
    
    // Sort by score (highest first) to determine positions
    entries.sort((a, b) => b.score - a.score);
    
    // Assign positions based on sorted order
    entries.forEach((entry, index) => {
      entry.position = index + 1;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: entries,
        count: entries.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests - Add, Update, or Delete entries
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { action, adminKey, data } = payload;
    
    // Verify admin key
    if (adminKey !== ADMIN_KEY) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Invalid admin key'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = getSheet();
    
    switch (action) {
      case 'add':
        return addEntry(sheet, data);
      case 'update':
        return updateEntry(sheet, data);
      case 'delete':
        return deleteEntry(sheet, data);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Invalid action'
          }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Add a new entry to the leaderboard
 */
function addEntry(sheet, data) {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Calculate score
  const wpm = parseInt(data.wpm) || 0;
  const accuracy = parseFloat(data.accuracy) || 0;
  const score = Math.round((wpm * (accuracy / 100)) * 100) / 100;
  
  sheet.appendRow([
    timestamp,
    data.name,
    data.department,
    wpm,
    accuracy,
    score
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Entry added successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Update an existing entry
 */
function updateEntry(sheet, data) {
  const rowIndex = data.id;
  
  if (rowIndex < 1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid entry ID'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Calculate score
  const wpm = parseInt(data.wpm) || 0;
  const accuracy = parseFloat(data.accuracy) || 0;
  const score = Math.round((wpm * (accuracy / 100)) * 100) / 100;
  
  // Update the row (rowIndex is from data array, add 1 for header)
  sheet.getRange(rowIndex + 1, 1, 1, 6).setValues([[
    timestamp,
    data.name,
    data.department,
    wpm,
    accuracy,
    score
  ]]);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Entry updated successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Delete an entry from the leaderboard
 */
function deleteEntry(sheet, data) {
  const rowIndex = data.id;
  
  if (rowIndex < 1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid entry ID'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Delete the row (rowIndex + 1 because sheet rows are 1-indexed and we have header)
  sheet.deleteRow(rowIndex + 1);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Entry deleted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - Run this to verify script is working
 */
function testScript() {
  Logger.log('Fasttyping Leaderboard Script');
  Logger.log('Sheet ID: ' + SHEET_ID);
  Logger.log('Admin Key: ' + ADMIN_KEY);
  
  try {
    const sheet = getSheet();
    Logger.log('Sheet Name: ' + sheet.getName());
    Logger.log('Data Range: ' + sheet.getDataRange().getA1Notation());
    Logger.log('✅ Script is working correctly!');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}
