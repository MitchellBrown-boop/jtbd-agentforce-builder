// Authentication status check endpoint
import { isAuthenticated, createSalesforceClientFromCookies } from '../../../lib/salesforce/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if tokens exist in cookies
    const authenticated = isAuthenticated(req.cookies);

    if (!authenticated) {
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }

    // Try to get user info to verify tokens are valid
    const client = createSalesforceClientFromCookies(req.cookies);
    const userInfo = await client.getUserInfo();

    return res.status(200).json({
      authenticated: true,
      user: userInfo.records?.[0] || null,
      instanceUrl: req.cookies.sf_instance_url
    });

  } catch (error) {
    console.error('Auth status check error:', error);

    // If authentication fails, clear cookies and return unauthenticated
    const clearCookies = [
      'sf_access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      'sf_refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      'sf_instance_url=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      'sf_user_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    ];

    res.setHeader('Set-Cookie', clearCookies);

    return res.status(200).json({
      authenticated: false,
      user: null,
      error: 'Token validation failed'
    });
  }
}