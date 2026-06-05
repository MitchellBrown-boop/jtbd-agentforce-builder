// Simple test endpoint to verify Vercel API routing works
export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Simple API endpoint working',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}