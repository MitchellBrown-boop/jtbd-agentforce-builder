// Server-side Salesforce client using stored credentials
// Uses OAuth Client Credentials flow for server-to-server authentication

let cachedToken = null;
let tokenExpiry = null;

async function createSalesforceClient() {
  const token = await getServerAccessToken();

  return {
    query: async (soql) => {
      const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/query?q=${encodeURIComponent(soql)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`SOQL query failed: ${error}`);
      }

      return response.json();
    },

    create: async (sobjectType, data) => {
      const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/sobjects/${sobjectType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Create ${sobjectType} failed: ${error}`);
      }

      return response.json();
    },

    update: async (sobjectType, data) => {
      const { Id, ...updateData } = data;
      const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/sobjects/${sobjectType}/${Id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Update ${sobjectType} failed: ${error}`);
      }

      // PATCH returns 204 No Content on success
      return response.status === 204 ? { success: true } : response.json();
    },

    delete: async (sobjectType, id) => {
      const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/sobjects/${sobjectType}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Delete ${sobjectType} failed: ${error}`);
      }

      return { success: true };
    }
  };
}

async function getServerAccessToken() {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Get new token using OAuth 2.0 Client Credentials flow
  // This uses the Connected App consumer key and secret
  const tokenResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET
    })
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    console.error('Server token request failed:', error);

    // Fallback: try using username/password flow if client credentials doesn't work
    return await getServerAccessTokenUserPassword();
  }

  const tokenData = await tokenResponse.json();

  // Cache the token
  cachedToken = tokenData.access_token;
  // Set expiry to 90% of actual expiry to refresh before it expires
  tokenExpiry = Date.now() + (tokenData.expires_in * 1000 * 0.9);

  console.log('Server access token obtained successfully');
  return cachedToken;
}

async function getServerAccessTokenUserPassword() {
  // Fallback: Use username/password OAuth flow for server authentication
  // This requires SALESFORCE_USERNAME and SALESFORCE_PASSWORD + SECURITY_TOKEN

  const tokenResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      username: process.env.SALESFORCE_USERNAME,
      password: `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN || ''}`
    })
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Server authentication failed: ${error}`);
  }

  const tokenData = await tokenResponse.json();

  // Cache the token
  cachedToken = tokenData.access_token;
  tokenExpiry = Date.now() + (3600 * 1000); // 1 hour default for username/password flow

  console.log('Server access token obtained via username/password flow');
  return cachedToken;
}

module.exports = { createSalesforceClient };