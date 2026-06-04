import { NextRequest, NextResponse } from 'next/server';

// MCP Server Configuration
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001';

async function mcpCall(method: string, params: any) {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params }),
      timeout: 5000 // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error(`Invalid MCP response format`);
    }

    return result.content[0].text;
  } catch (error) {
    // If MCP is not available (e.g., in Vercel), fall back to mock
    console.warn(`MCP not available, using fallback: ${error}`);
    throw new Error('MCP_NOT_AVAILABLE');
  }
}

async function findOrCreateFolder(folderName: string, parentId: string = 'root'): Promise<string> {
  try {
    // First, search for existing folder
    const searchQuery = `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

    const searchResult = await mcpCall('mcp__google-workspace__search_drive_files', {
      query: searchQuery,
      file_type: 'folder',
      page_size: 1
    });

    const lines = searchResult.split('\n');

    // Look for folder ID in the response
    for (const line of lines) {
      if (line.includes('ID: ') && line.includes(folderName)) {
        const idMatch = line.match(/ID: ([a-zA-Z0-9_-]+)/);
        if (idMatch) {
          return idMatch[1];
        }
      }
    }
  } catch (error) {
    console.log(`Folder ${folderName} not found, will create it`);
  }

  // Folder doesn't exist, create it
  const createResult = await mcpCall('mcp__google-workspace__create_drive_folder', {
    folder_name: folderName,
    parent_folder_id: parentId
  });

  const idMatch = createResult.match(/ID: ([a-zA-Z0-9_-]+)/);

  if (!idMatch) {
    throw new Error(`Failed to get ID for created folder: ${folderName}`);
  }

  return idMatch[1];
}

export async function POST(request: NextRequest) {
  try {
    const { title, sheet_names } = await request.json();
    const isProduction = process.env.NODE_ENV === 'production' && !process.env.MCP_SERVER_URL;

    if (isProduction) {
      // Production fallback when MCP is not available
      return NextResponse.json({
        error: 'Google Sheets integration requires local MCP server',
        message: 'This feature works in local development. For production use, please run locally or configure MCP_SERVER_URL environment variable.',
        suggestion: 'Try running `npm run dev` locally to test this feature.'
      }, { status: 503 });
    }

    try {
      // Create folder structure: FY27/Algolia/JTBD
      console.log('Creating folder structure...');

      const fy27FolderId = await findOrCreateFolder('FY27');
      const algoliaFolderId = await findOrCreateFolder('Algolia', fy27FolderId);
      const jtbdFolderId = await findOrCreateFolder('JTBD', algoliaFolderId);

      console.log(`Folder structure created: FY27(${fy27FolderId})/Algolia(${algoliaFolderId})/JTBD(${jtbdFolderId})`);

      // Create the spreadsheet using MCP
      const spreadsheetData = await mcpCall('mcp__google-workspace__create_spreadsheet', {
        title: title || `JTBD Framework - ${new Date().toLocaleDateString()}`,
        sheet_names: sheet_names || ['Jobs Framework', 'Personas', 'Agent Opportunities', 'Analytics']
      });

      // Parse ID and URL from MCP response
      const idMatch = spreadsheetData.match(/ID: ([a-zA-Z0-9-_]+)/);
      const urlMatch = spreadsheetData.match(/URL: (https:\/\/docs\.google\.com\/spreadsheets\/[^\s]+)/);

      if (!idMatch || !urlMatch) {
        throw new Error('Failed to parse spreadsheet response from MCP');
      }

      const spreadsheetId = idMatch[1];
      const spreadsheetUrl = urlMatch[1];

      const result = {
        success: true,
        data: `Successfully created spreadsheet: ${title}
ID: ${spreadsheetId}
URL: ${spreadsheetUrl}
Folder: FY27/Algolia/JTBD
Created sheets: ${sheet_names?.join(', ') || 'Jobs Framework, Personas, Agent Opportunities, Analytics'}

📋 Next Steps:
1. Click "Open Sheet" to view your new spreadsheet
2. Share it with your collaborator using Editor access
3. Share the JTBD app URL for real-time collaboration
4. Start building your framework together!`
      };

      return NextResponse.json(result);

    } catch (mcpError) {
      if ((mcpError as Error).message === 'MCP_NOT_AVAILABLE') {
        return NextResponse.json({
          error: 'MCP server not accessible',
          message: 'Google Sheets integration requires MCP server connection. Please run locally or configure MCP_SERVER_URL.',
          suggestion: 'Run `npm run dev` locally to test this feature with your MCP server.'
        }, { status: 503 });
      }
      throw mcpError;
    }

  } catch (error) {
    console.error('Failed to create spreadsheet:', error);
    return NextResponse.json(
      {
        error: 'Failed to create spreadsheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}