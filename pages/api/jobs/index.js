// JTBD Jobs API endpoint
import { createSalesforceClientFromCookies } from '../../../lib/salesforce/client';

export default async function handler(req, res) {
  try {
    const client = createSalesforceClientFromCookies(req.cookies);

    switch (req.method) {
      case 'GET':
        const jobs = await client.getJobs();
        return res.status(200).json(jobs);

      case 'POST':
        const newJob = await client.createJob(req.body);
        return res.status(201).json(newJob);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Jobs API error:', error);

    if (error.message.includes('authentication required')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}