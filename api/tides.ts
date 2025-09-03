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
    const { lat, lon, start, length = '86400' } = req.query;

    // Comprehensive parameter validation
    console.log('Received parameters:', { lat, lon, start, length });

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Validate coordinate ranges
    const latNum = parseFloat(lat.toString());
    const lonNum = parseFloat(lon.toString());
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ error: 'Invalid coordinates - must be numbers' });
    }
    
    if (latNum < -90 || latNum > 90) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    }
    
    if (lonNum < -180 || lonNum > 180) {
      return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
    }

    // Validate start parameter
    let startNum: number | undefined;
    if (start) {
      startNum = parseInt(start.toString());
      if (isNaN(startNum) || startNum < 0) {
        return res.status(400).json({ error: 'Start parameter must be a positive integer' });
      }
    }

    // Validate length parameter
    const lengthNum = parseInt(length.toString());
    if (isNaN(lengthNum) || lengthNum <= 0) {
      return res.status(400).json({ error: 'Length parameter must be a positive integer' });
    }

    const apiKey = process.env.VITE_WORLDTIDES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'WorldTides API key not configured' });
    }

    // Check API key format (should be 32-36 characters, may include dashes)
    console.log('API Key Debug:', {
      exists: !!apiKey,
      length: apiKey.length,
      expectedRange: '32-36 characters',
      firstChars: apiKey.substring(0, 4) + '...',
      lastChars: '...' + apiKey.substring(apiKey.length - 4),
      hasDashes: apiKey.includes('-'),
      isValidLength: apiKey.length >= 32 && apiKey.length <= 36
    });
    
    if (apiKey.length < 32 || apiKey.length > 36) {
      console.error('API key length is incorrect:', apiKey.length);
      return res.status(500).json({ 
        error: `WorldTides API key format is invalid. Expected 32-36 characters, got ${apiKey.length}. Please check your VITE_WORLDTIDES_API_KEY environment variable.` 
      });
    }

    // Build URL with all required parameters
    const params = new URLSearchParams({
      heights: 'true',
      extremes: 'true',
      lat: latNum.toString(),
      lon: lonNum.toString(),
      key: apiKey
    });

    if (startNum !== undefined) {
      params.append('start', startNum.toString());
    }
    if (lengthNum) {
      params.append('length', lengthNum.toString());
    }

    const url = `https://www.worldtides.info/api/v3?${params.toString()}`;

    console.log('WorldTides API Request:', {
      url: url.replace(apiKey, '***HIDDEN***'),
      params: Object.fromEntries(params.entries()),
      coordinates: { lat: latNum, lon: lonNum },
      start: startNum,
      length: lengthNum
    });

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('WorldTides API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestUrl: url.replace(apiKey, '***HIDDEN***'),
        requestParams: Object.fromEntries(params.entries())
      });
      return res.status(response.status).json({ 
        error: `WorldTides API error: ${response.status} - ${errorData.error || 'Unknown error'}`,
        details: errorData,
        requestParams: {
          lat: latNum,
          lon: lonNum,
          start: startNum,
          length: lengthNum
        }
      });
    }

    const data = await response.json();
    console.log('WorldTides API Success:', {
      status: response.status,
      dataKeys: Object.keys(data),
      extremesCount: data.extremes?.length || 0,
      heightsCount: data.heights?.length || 0
    });
    
    res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
};
