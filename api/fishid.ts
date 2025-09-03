import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `You are an expert marine biologist specializing in South African fish species identification. Analyze this fish photo with extreme precision.

CRITICAL: Focus ONLY on South African marine fish species. This is for a South African fishing app.

Please respond with a JSON object in this exact format:
{
  "species": "Common English name",
  "confidence": 85,
  "scientificName": "Scientific name",
  "commonNames": ["Alternative name 1", "Alternative name 2"],
  "alternativeSpecies": [
    {"name": "Alternative species 1", "confidence": 12},
    {"name": "Alternative species 2", "confidence": 3}
  ],
  "characteristics": [
    "Distinctive feature 1",
    "Distinctive feature 2",
    "Distinctive feature 3"
  ]
}

PRIORITY South African fish species to consider:
- Breams: Bronze bream, Red roman, White steenbras, Black musselcracker, White musselcracker
- Kob: Common kob, Dusky kob, Silver kob
- Sharks: Bronze whaler, Ragged-tooth shark, Spotted ragged-tooth shark, Copper shark, Smooth-hound shark
- Rays: Eagle ray, Blue stingray, Black stingray, Diamond ray
- Game fish: Yellowfin tuna, Marlin, Sailfish, Kingfish
- Reef fish: Butterfly fish, Angelfish, Wrasse
- Other: Galjoen, Garrick, Shad, Blacktail, Cape stumpnose

IDENTIFICATION CRITERIA (be very specific):
- Body shape and proportions
- Coloration and patterns (exact colors and markings)
- Fin characteristics (dorsal, pectoral, caudal fin shapes)
- Scale patterns and texture
- Head shape and mouth position
- Eye characteristics
- Any distinctive markings, spots, or stripes

CONFIDENCE GUIDELINES:
- 90-100%: Absolutely certain, all key features match perfectly
- 80-89%: Very confident, most features match
- 70-79%: Confident, good match but some uncertainty
- 60-69%: Somewhat confident, reasonable match
- 50-59%: Uncertain, possible match
- Below 50%: Low confidence, likely incorrect

If the image is unclear, doesn't show a fish, or shows a non-South African species, set confidence to 0 and species to "Unable to identify".

Be extremely careful with shark identification - many species look similar but have key differences.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.05
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`,
        details: errorData
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No response from OpenAI API' });
    }

    // Try to parse the JSON response
    try {
      // Clean the content - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const result = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (!result.species || typeof result.confidence !== 'number') {
        return res.status(500).json({ error: 'Invalid response format from OpenAI' });
      }

      const finalResult = {
        species: result.species,
        confidence: Math.round(result.confidence),
        alternativeSpecies: result.alternativeSpecies || [],
        characteristics: result.characteristics || [],
        scientificName: result.scientificName,
        commonNames: result.commonNames
      };
      
      res.status(200).json(finalResult);
    } catch (parseError) {
      // If JSON parsing fails, return a basic result
      res.status(200).json({
        species: 'Unable to identify',
        confidence: 0,
        alternativeSpecies: [],
        characteristics: ['Response format error - please try again']
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
};
