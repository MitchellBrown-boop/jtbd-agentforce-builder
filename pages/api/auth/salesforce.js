// Salesforce OAuth initiation endpoint (simplified without PKCE for now)
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
    // Generate state for CSRF protection
    const state = generateState();

    // Store state in session/cookie for callback verification
    res.setHeader('Set-Cookie', `sf_oauth_state=${state}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=600`);

    // Salesforce OAuth authorization URL (standard authorization code flow)
    const authUrl = new URL(`${SALESFORCE_INSTANCE_URL}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', SALESFORCE_CALLBACK_URL);
    authUrl.searchParams.set('scope', 'api refresh_token web openid profile email');
    authUrl.searchParams.set('state', state);

    res.redirect(302, authUrl.toString());
  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.status(500).json({ error: 'OAuth initiation failed' });
  }
}

function generateState() {
  // Generate a random state for CSRF protection (simple hex string)
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}