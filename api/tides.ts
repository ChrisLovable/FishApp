import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.VITE_WORLDTIDES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'WorldTides API key not configured' });
    }

    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${lat}&lon=${lon}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('WorldTides API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return res.status(response.status).json({ 
        error: `WorldTides API error: ${response.status} - ${errorData.error || 'Unknown error'}`,
        details: errorData
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
};
