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

    console.log(`Syncing ${data.length} rows to "${sheet_name}" in spreadsheet ${spreadsheet_id}`);

    // Get access token using service account
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Failed to obtain Google API access token');
    }

    // Calculate range for the data
    const numRows = data.length;
    const numCols = data[0]?.length || 0;
    const endCol = numCols > 0 ? String.fromCharCode(64 + numCols) : 'A'; // A=65, B=66, etc.
    const range = `${sheet_name}!A1:${endCol}${numRows}`;

    console.log(`Clearing existing data in ${sheet_name}`);

    // Clear existing data first
    const clearResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${sheet_name}!A:Z:clear`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!clearResponse.ok) {
      const clearError = await clearResponse.text();
      console.error('Failed to clear sheet:', clearError);
      throw new Error(`Failed to clear sheet: ${clearResponse.status}`);
    }

    console.log(`Writing ${numRows} rows to range ${range}`);

    // Write new data
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: data
        })
      }
    );

    if (!updateResponse.ok) {
      const updateError = await updateResponse.text();
      console.error('Failed to update sheet:', updateError);
      throw new Error(`Failed to update sheet: ${updateResponse.status} - ${updateError}`);
    }

    const result = await updateResponse.json();
    console.log('Sync successful:', result);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${data.length} rows to "${sheet_name}"`,
      timestamp: new Date().toISOString(),
      range: range,
      updatedRows: result.updatedRows,
      updatedCells: result.updatedCells,
      spreadsheet_url: `https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit`
    });

  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync data to Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.log('No service account key found, sync will be simulated');
      return null;
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Create JWT token
    const jwt = await createJWT(credentials);

    // Exchange JWT for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token exchange failed:', error);
      return null;
    }

    const tokenData = await response.json();
    return tokenData.access_token;

  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

async function createJWT(credentials: any): Promise<string> {
  // JWT Header
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  // JWT Payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600 // 1 hour
  };

  // Base64 encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature base
  const signatureBase = `${encodedHeader}.${encodedPayload}`;

  // Import private key and sign
  const privateKey = await importPrivateKey(credentials.private_key);
  const signature = await signData(signatureBase, privateKey);
  const encodedSignature = base64UrlEncode(signature);

  return `${signatureBase}.${encodedSignature}`;
}

function base64UrlEncode(data: string | ArrayBuffer): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes) as any));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function importPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
  // Remove header/footer and whitespace
  const pemContent = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  // Convert to ArrayBuffer
  const binaryString = atob(pemContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );
}

async function signData(data: string, privateKey: CryptoKey): Promise<ArrayBuffer> {
  const encodedData = new TextEncoder().encode(data);
  return crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encodedData
  );
}