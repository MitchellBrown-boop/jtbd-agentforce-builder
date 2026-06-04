import { NextRequest, NextResponse } from 'next/server';

// MCP Server Configuration
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001';

async function mcpCall(method: string, params: any) {
  const response = await fetch(`${MCP_SERVER_URL}/mcp/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, params })
  });

  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.content || !result.content[0] || !result.content[0].text) {
    throw new Error(`Invalid MCP response format`);
  }

  return result.content[0].text;
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

    // Calculate the range based on data dimensions
    const numRows = data.length;
    const numCols = data[0]?.length || 0;
    const endCol = String.fromCharCode(65 + numCols - 1); // A=65, so A+numCols-1
    const range = `${sheet_name}!A1:${endCol}${numRows}`;

    // Clear existing data first (optional - removes old data)
    await mcpCall('mcp__google-workspace__modify_sheet_values', {
      spreadsheet_id: spreadsheet_id,
      range_name: `${sheet_name}!A:Z`, // Clear wide range
      clear_values: true
    });

    // Write new data using MCP
    const mcpResult = await mcpCall('mcp__google-workspace__modify_sheet_values', {
      spreadsheet_id: spreadsheet_id,
      range_name: range,
      values: data,
      value_input_option: 'USER_ENTERED'
    });

    const result = {
      success: true,
      message: `Successfully synced ${data.length} rows to "${sheet_name}"`,
      timestamp: new Date().toISOString(),
      range: range,
      mcpResponse: mcpResult
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to sync data:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync data to spreadsheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}