# JTBD MCP Server

Express server that provides MCP-compatible Google Workspace endpoints for the JTBD Builder application.

## Features

- Create Google Spreadsheets
- Create Google Drive folders 
- Search Drive files
- Modify spreadsheet values
- Compatible with existing MCP client calls

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google service account JSON (production)
- `PORT`: Server port (default: 3001)

## Endpoints

- `POST /mcp/call` - Main MCP endpoint
- `GET /health` - Health check

## Deployment

Designed to deploy on Railway, Render, or similar cloud platforms.