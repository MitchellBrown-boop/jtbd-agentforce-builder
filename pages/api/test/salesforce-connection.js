const { createSalesforceClient } = require('../../../lib/salesforce/server-client');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Salesforce server connection...');

    // Test server authentication
    const client = await createSalesforceClient();

    // Try a simple query to verify connection
    const result = await client.query('SELECT COUNT() FROM JTBD_Job__c');

    console.log('Salesforce connection successful:', result);

    return res.status(200).json({
      success: true,
      message: 'Salesforce connection working',
      totalJobs: result.totalSize,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Salesforce connection failed:', error);

    return res.status(500).json({
      success: false,
      error: 'Salesforce connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}