// Agent Opportunities API endpoint
import { createSalesforceClientFromCookies } from '../../../lib/salesforce/client';

export default async function handler(req, res) {
  try {
    const client = createSalesforceClientFromCookies(req.cookies);

    switch (req.method) {
      case 'GET':
        const opportunities = await client.getAgentOpportunities();
        return res.status(200).json(opportunities);

      case 'POST':
        const newOpportunity = await client.createAgentOpportunity(req.body);
        return res.status(201).json(newOpportunity);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Opportunities API error:', error);

    if (error.message.includes('authentication required')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}