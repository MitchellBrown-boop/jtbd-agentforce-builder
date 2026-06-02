import { NextRequest, NextResponse } from 'next/server';

// This endpoint would integrate with your MCP server
// For now, it returns a realistic mock that you can test with

export async function POST(request: NextRequest) {
  try {
    const { title, sheet_names } = await request.json();

    // Generate a realistic Google Sheets ID format
    const mockId = `1${Array.from({length: 44}, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
      .charAt(Math.floor(Math.random() * 64))
    ).join('')}`;

    const mockUrl = `https://docs.google.com/spreadsheets/d/${mockId}/edit`;

    // Simulate MCP create_spreadsheet response format
    const response = {
      success: true,
      data: `Successfully created spreadsheet: ${title}
ID: ${mockId}
URL: ${mockUrl}
Locale: en_US
Created sheets: ${sheet_names?.join(', ') || 'Sheet1'}

📋 Next Steps:
1. Click "Open Sheet" to view your new spreadsheet
2. Share it with Jordan Brown: jordan.brown@algolia.com
3. Give Jordan Editor access for real-time collaboration
4. Send Jordan this app URL to start building together!`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to create spreadsheet:', error);
    return NextResponse.json(
      { error: 'Failed to create spreadsheet' },
      { status: 500 }
    );
  }
}