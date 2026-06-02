import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { spreadsheet_id } = await request.json();

    // Validate spreadsheet ID format
    if (!spreadsheet_id || typeof spreadsheet_id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid spreadsheet ID' },
        { status: 400 }
      );
    }

    // Simulate MCP get_spreadsheet_info response
    const response = {
      success: true,
      data: {
        title: "JTBD Framework - Shared",
        spreadsheet_id: spreadsheet_id,
        locale: "en_US",
        sheets: [
          { name: "Jobs Framework", id: "0" },
          { name: "Personas", id: "1" },
          { name: "Agent Opportunities", id: "2" },
          { name: "Analytics", id: "3" }
        ]
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to get spreadsheet info:', error);
    return NextResponse.json(
      { error: 'Failed to get spreadsheet info' },
      { status: 500 }
    );
  }
}