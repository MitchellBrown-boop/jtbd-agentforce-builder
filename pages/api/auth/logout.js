// Logout endpoint - clears Salesforce authentication cookies
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear all Salesforce authentication cookies
  const clearCookies = [
    'sf_access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    'sf_refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    'sf_instance_url=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    'sf_user_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
  ];

  res.setHeader('Set-Cookie', clearCookies);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}