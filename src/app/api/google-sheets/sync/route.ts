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

    // Log the data that would be synced (for testing)
    console.log(`Syncing to sheet "${sheet_name}" in spreadsheet ${spreadsheet_id}:`);
    console.log(`Rows: ${data.length}, Columns: ${data[0]?.length || 0}`);

    // Simulate successful sync
    const response = {
      success: true,
      message: `Successfully synced ${data.length} rows to "${sheet_name}"`,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to sync data:', error);
    return NextResponse.json(
      { error: 'Failed to sync data to spreadsheet' },
      { status: 500 }
    );
  }
}