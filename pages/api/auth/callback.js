// Salesforce OAuth callback handler
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, error_description } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description);
    return res.redirect(`/?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code received' });
  }

  try {
    const {
      SALESFORCE_CLIENT_ID,
      SALESFORCE_CLIENT_SECRET,
      SALESFORCE_INSTANCE_URL,
      SALESFORCE_CALLBACK_URL
    } = process.env;

    // Extract code verifier from cookie
    const codeVerifier = req.cookies.sf_code_verifier;
    if (!codeVerifier) {
      return res.status(400).json({ error: 'Code verifier not found' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(`${SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        redirect_uri: SALESFORCE_CALLBACK_URL,
        code_verifier: codeVerifier
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return res.status(400).json({ error: 'Token exchange failed' });
    }

    const tokenData = await tokenResponse.json();

    // Store tokens securely (in production, use encrypted sessions/database)
    const tokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      instance_url: tokenData.instance_url,
      id: tokenData.id,
      issued_at: tokenData.issued_at,
      expires_at: Date.now() + (3600 * 1000) // 1 hour default
    };

    // Set secure HTTP-only cookies for tokens
    const cookieOptions = 'HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400'; // 24 hours

    res.setHeader('Set-Cookie', [
      `sf_access_token=${tokens.access_token}; ${cookieOptions}`,
      `sf_refresh_token=${tokens.refresh_token}; ${cookieOptions}`,
      `sf_instance_url=${tokens.instance_url}; ${cookieOptions}`,
      `sf_user_id=${extractUserIdFromId(tokens.id)}; ${cookieOptions}`,
      'sf_code_verifier=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' // Clear code verifier
    ]);

    // Redirect to main app with success indicator
    res.redirect('/?auth=success');

  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

function extractUserIdFromId(idUrl) {
  // Extract user ID from Salesforce identity URL
  // Format: https://login.salesforce.com/id/00D.../005...
  const matches = idUrl.match(/\/([a-zA-Z0-9]{15,18})$/);
  return matches ? matches[1] : null;
}