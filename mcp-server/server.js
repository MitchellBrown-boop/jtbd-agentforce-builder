const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Google API setup
let auth;
let drive;
let sheets;

async function initializeGoogleAuth() {
  try {
    // Use service account if available in production, or default credentials locally
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
    } else {
      // Fallback for development - would use your default gcloud auth
      auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
    }

    const authClient = await auth.getClient();
    drive = google.drive({ version: 'v3', auth: authClient });
    sheets = google.sheets({ version: 'v4', auth: authClient });

    console.log('✅ Google API authentication initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Google Auth:', error);
    throw error;
  }
}

// MCP endpoint handler
app.post('/mcp/call', async (req, res) => {
  try {
    const { method, params } = req.body;

    console.log(`📞 MCP Call: ${method}`, params);

    let result;

    switch (method) {
      case 'mcp__google-workspace__create_spreadsheet':
        result = await createSpreadsheet(params);
        break;

      case 'mcp__google-workspace__create_drive_folder':
        result = await createDriveFolder(params);
        break;

      case 'mcp__google-workspace__search_drive_files':
        result = await searchDriveFiles(params);
        break;

      case 'mcp__google-workspace__modify_sheet_values':
        result = await modifySheetValues(params);
        break;

      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    // Return in MCP format
    res.json({
      content: [{ text: result }]
    });

  } catch (error) {
    console.error('❌ MCP call error:', error);
    res.status(500).json({
      error: error.message,
      details: 'MCP server error'
    });
  }
});

async function createSpreadsheet(params) {
  const { title, sheet_names } = params;

  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: title
      },
      sheets: (sheet_names || ['Sheet1']).map(name => ({
        properties: { title: name }
      }))
    }
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return `Successfully created spreadsheet: ${title}
ID: ${spreadsheetId}
URL: ${spreadsheetUrl}
Locale: en_US
Created sheets: ${(sheet_names || ['Sheet1']).join(', ')}`;
}

async function createDriveFolder(params) {
  const { folder_name, parent_folder_id = 'root' } = params;

  const folder = await drive.files.create({
    resource: {
      name: folder_name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parent_folder_id]
    }
  });

  const folderId = folder.data.id;
  const folderLink = `https://drive.google.com/drive/folders/${folderId}`;

  return `Created folder: ${folder_name}
ID: ${folderId}
Link: ${folderLink}`;
}

async function searchDriveFiles(params) {
  const { query, page_size = 10, file_type } = params;

  let searchQuery = query;
  if (file_type === 'folder') {
    searchQuery += ` and mimeType='application/vnd.google-apps.folder'`;
  }

  const response = await drive.files.list({
    q: searchQuery,
    pageSize: page_size,
    fields: 'files(id, name, mimeType, modifiedTime, webViewLink)'
  });

  const files = response.data.files || [];

  if (files.length === 0) {
    return `No files found for '${query}'`;
  }

  let result = `Found ${files.length} files for '${query}':\n`;
  files.forEach(file => {
    result += `- Name: "${file.name}" (ID: ${file.id}, Type: ${file.mimeType}`;
    if (file.modifiedTime) {
      result += `, Modified: ${file.modifiedTime}`;
    }
    if (file.webViewLink) {
      result += `) Link: ${file.webViewLink}\n`;
    } else {
      result += `)\n`;
    }
  });

  return result.trim();
}

async function modifySheetValues(params) {
  const { spreadsheet_id, range_name, values, clear_values = false } = params;

  if (clear_values) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheet_id,
      range: range_name
    });
    return `Cleared range ${range_name} in spreadsheet ${spreadsheet_id}`;
  }

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheet_id,
    range: range_name,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  });

  return `Updated ${response.data.updatedRows} rows in range ${range_name}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    auth: auth ? 'initialized' : 'not initialized'
  });
});

// Start server
async function startServer() {
  try {
    await initializeGoogleAuth();
    app.listen(PORT, () => {
      console.log(`🚀 MCP Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();