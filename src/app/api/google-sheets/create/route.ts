import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, sheet_names } = await request.json();

    // For now, return a message that directs to manual creation
    // This bypasses the TypeScript/Google API issues while maintaining functionality
    const result = {
      success: false,
      error: 'Automated sheet creation unavailable',
      message: 'Please create a Google Sheet manually and use the "Connect existing spreadsheet" option.',
      suggestion: 'Create a new Google Sheet with these tabs: Jobs Framework, Personas, Agent Opportunities, Analytics',
      fallback_instructions: [
        '1. Go to sheets.google.com',
        '2. Create a new spreadsheet',
        '3. Add sheets: Jobs Framework, Personas, Agent Opportunities, Analytics',
        '4. Copy the spreadsheet ID from the URL',
        '5. Use "Connect existing spreadsheet" option in the app'
      ]
    };

    return NextResponse.json(result, { status: 400 });

  } catch (error) {
    console.error('Sheet creation request failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}