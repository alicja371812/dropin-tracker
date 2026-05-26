// api/track.js — Vercel serverless function
// Proxies DHL API calls server-side to avoid CORS issues

export default async function handler(req, res) {
  // Allow requests from any origin (CORS headers)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { trackingNumber } = req.query;

  if (!trackingNumber) {
    return res.status(400).json({ error: 'trackingNumber is required' });
  }

  try {
    const response = await fetch(
      `https://api-eu.dhl.com/track/shipments?trackingNumber=${encodeURIComponent(trackingNumber)}`,
      {
        headers: {
          'DHL-API-Key': 'demo-key'
        }
      }
    );

    const data = await response.json();

    // Forward DHL's status code and data back to the client
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Failed to reach DHL API', details: error.message });
  }
}
