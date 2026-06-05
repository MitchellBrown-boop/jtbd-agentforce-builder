// JTBD Personas API endpoint
import { createSalesforceClientFromCookies } from '../../../lib/salesforce/client';

export default async function handler(req, res) {
  try {
    const client = createSalesforceClientFromCookies(req.cookies);

    switch (req.method) {
      case 'GET':
        const personas = await client.getPersonas();
        return res.status(200).json(personas);

      case 'POST':
        const newPersona = await client.createPersona(req.body);
        return res.status(201).json(newPersona);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Personas API error:', error);

    if (error.message.includes('authentication required')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}