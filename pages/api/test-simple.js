// Simple test endpoint to verify Pages Router API works
export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Pages Router API endpoint working',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}