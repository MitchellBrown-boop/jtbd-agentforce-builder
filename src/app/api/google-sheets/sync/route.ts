import { NextRequest, NextResponse } from 'next/server';

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

    console.log('=== GOOGLE SHEETS SYNC REQUEST ===');
    console.log(`Sheet: "${sheet_name}" in spreadsheet ${spreadsheet_id}`);
    console.log(`Data dimensions: ${data.length} rows × ${data[0]?.length || 0} columns`);
    console.log('Data to sync:');

    // Log data in readable format
    data.forEach((row: any[], index: number) => {
      console.log(`Row ${index + 1}:`, row);
    });

    console.log('=== END SYNC DATA ===');

    // For now, return success with detailed logging
    // This gives Algolia team clear visibility into what would sync
    const result = {
      success: true,
      message: `Sync logged for ${data.length} rows to "${sheet_name}"`,
      timestamp: new Date().toISOString(),
      data_preview: data.slice(0, 3), // Show first 3 rows in response
      spreadsheet_url: `https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit`,
      note: 'Data logged to console. For manual verification, copy the logged data to your Google Sheet.'
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to process sync request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process sync request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}