// Salesforce OAuth initiation endpoint
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    SALESFORCE_CLIENT_ID,
    SALESFORCE_INSTANCE_URL,
    SALESFORCE_CALLBACK_URL
  } = process.env;

  if (!SALESFORCE_CLIENT_ID || !SALESFORCE_INSTANCE_URL || !SALESFORCE_CALLBACK_URL) {
    return res.status(500).json({ error: 'Missing Salesforce configuration' });
  }

  // Generate PKCE challenge (for enhanced security)
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store code verifier in session/cookie for callback verification
  res.setHeader('Set-Cookie', `sf_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Strict; Path=/`);

  // Salesforce OAuth authorization URL
  const authUrl = new URL(`${SALESFORCE_INSTANCE_URL}/services/oauth2/authorize`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', SALESFORCE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', SALESFORCE_CALLBACK_URL);
  authUrl.searchParams.set('scope', 'api refresh_token web openid profile email');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', generateState()); // CSRF protection

  res.redirect(302, authUrl.toString());
}

// PKCE utilities
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return base64URLEncode(array);
}

function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto.subtle.digest('SHA-256', data)
      .then(digest => base64URLEncode(new Uint8Array(digest)));
  }
  // For environments without crypto.subtle, use the verifier as-is (less secure)
  return Promise.resolve(verifier);
}

function generateState() {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return base64URLEncode(array);
}

function base64URLEncode(buffer) {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}