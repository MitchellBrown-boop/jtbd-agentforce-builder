// Salesforce OAuth initiation endpoint
export default async function handler(req, res) {
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

  try {
    // Generate PKCE challenge (for enhanced security)
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

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
  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.status(500).json({ error: 'OAuth initiation failed' });
  }
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

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
  }
  // For environments without crypto.subtle, use base64URL of the verifier
  return base64URLEncode(new TextEncoder().encode(verifier));
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