import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Auth
async function getGoogleAuth() {
  try {
    let auth;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Production: Use service account JSON from environment variable
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
    } else {
      // Development: Use application default credentials (gcloud auth)
      auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
    }

    const authClient = await auth.getClient();
    return authClient;
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    throw new Error('Google authentication failed');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { spreadsheet_id, sheet_name, data } = await request.json();

    // Validate inputs
    if (!spreadsheet_id || !sheet_name || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`Syncing to sheet "${sheet_name}" in spreadsheet ${spreadsheet_id}:`);
    console.log(`Rows: ${data.length}, Columns: ${data[0]?.length || 0}`);

    // Initialize Google Sheets API
    const authClient = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Calculate the range based on data dimensions
    const numRows = data.length;
    const numCols = data[0]?.length || 0;
    const endCol = String.fromCharCode(65 + numCols - 1); // A=65, so A+numCols-1
    const range = `${sheet_name}!A1:${endCol}${numRows}`;

    // Clear existing data first (optional - removes old data)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheet_id,
      range: `${sheet_name}!A:Z` // Clear wide range
    });

    // Write new data
    const updateResult = await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet_id,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: data
      }
    });

    const result = {
      success: true,
      message: `Successfully synced ${data.length} rows to "${sheet_name}"`,
      timestamp: new Date().toISOString(),
      range: range,
      updatedRows: updateResult.data.updatedRows,
      updatedColumns: updateResult.data.updatedColumns,
      updatedCells: updateResult.data.updatedCells
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to sync data:', error);

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
        error: 'Failed to sync data to spreadsheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}