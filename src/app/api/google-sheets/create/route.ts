import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Initialize Google Auth with explicit JWT
async function getGoogleAuth() {
  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Production: Use service account JSON from environment variable
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      const client = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
      return client;
    } else {
      // Development: Fallback - this will likely fail in production but allows build
      const auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
      return await auth.getClient();
    }
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    throw new Error('Google authentication failed');
  }
}

async function findOrCreateFolder(drive: any, folderName: string, parentId: string = 'root'): Promise<string> {
  try {
    // Search for existing folder
    const searchQuery = `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

    const searchResult = await drive.files.list({
      q: searchQuery,
      pageSize: 1,
      fields: 'files(id, name)'
    });

    if (searchResult.data.files && searchResult.data.files.length > 0) {
      return searchResult.data.files[0].id;
    }
  } catch (error) {
    console.log(`Folder ${folderName} not found, will create it`);
  }

  // Folder doesn't exist, create it
  const createResult = await drive.files.create({
    resource: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    },
    fields: 'id'
  });

  return createResult.data.id;
}

export async function POST(request: NextRequest) {
  try {
    const { title, sheet_names } = await request.json();

    // Initialize Google APIs
    const authClient = await getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth: authClient });
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Create folder structure: FY27/Algolia/JTBD
    console.log('Creating folder structure...');

    const fy27FolderId = await findOrCreateFolder(drive, 'FY27');
    const algoliaFolderId = await findOrCreateFolder(drive, 'Algolia', fy27FolderId);
    const jtbdFolderId = await findOrCreateFolder(drive, 'JTBD', algoliaFolderId);

    console.log(`Folder structure created: FY27(${fy27FolderId})/Algolia(${algoliaFolderId})/JTBD(${jtbdFolderId})`);

    // Create the spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: title || `JTBD Framework - ${new Date().toLocaleDateString()}`
        },
        sheets: (sheet_names || ['Jobs Framework', 'Personas', 'Agent Opportunities', 'Analytics']).map(name => ({
          properties: { title: name }
        }))
      }
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId!;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Move spreadsheet to JTBD folder
    await drive.files.update({
      fileId: spreadsheetId,
      addParents: jtbdFolderId,
      removeParents: 'root',
      fields: 'id, parents'
    });

    const result = {
      success: true,
      data: `Successfully created spreadsheet: ${title}
ID: ${spreadsheetId}
URL: ${spreadsheetUrl}
Folder: FY27/Algolia/JTBD
Created sheets: ${(sheet_names || ['Jobs Framework', 'Personas', 'Agent Opportunities', 'Analytics']).join(', ')}

📋 Next Steps:
1. Click "Open Sheet" to view your new spreadsheet
2. Share it with your collaborator using Editor access
3. Share the JTBD app URL for real-time collaboration
4. Start building your framework together!`
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to create spreadsheet:', error);

    // Check for authentication errors
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json({
        error: 'Google authentication failed',
        message: 'Please configure GOOGLE_SERVICE_ACCOUNT_KEY environment variable with your service account JSON.',
        suggestion: 'Create a Google Cloud service account and add the JSON key to your environment variables.'
      }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: 'Failed to create spreadsheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}