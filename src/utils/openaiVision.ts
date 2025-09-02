// OpenAI Vision API integration for fish identification

interface FishIdentificationResult {
  species: string
  confidence: number
  alternativeSpecies: Array<{
    name: string
    confidence: number
  }>
  characteristics: string[]
  scientificName?: string
  commonNames?: string[]
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Helper function to compress image for mobile optimization
const compressImage = (base64: string, maxWidth: number = 1024, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    img.src = base64
  })
}

export const identifyFishWithOpenAI = async (imageBase64: string): Promise<FishIdentificationResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.')
  }

  // Compress image for better mobile performance and API efficiency
  const compressedImage = await compressImage(imageBase64, 1024, 0.8)
  
  // Remove data URL prefix if present
  const base64Data = compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')

  const prompt = `You are an expert marine biologist specializing in South African fish species. Analyze this fish photo and identify the species.

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

Focus on these South African fish species categories:
- Breams (Bronze bream, Red roman, etc.)
- Kob (Common kob, Dusky kob, etc.)
- Sharks (Bronze whaler, Ragged-tooth, etc.)
- Rays (Eagle ray, Blue stingray, etc.)
- Game fish (Yellowfin tuna, Marlin, etc.)
- Reef fish (Butterfly fish, Angelfish, etc.)

Be specific about:
- Body shape and size
- Coloration and patterns
- Fin characteristics
- Scale patterns
- Any distinctive markings

If the image is unclear or doesn't show a fish, set confidence to 0 and species to "Unable to identify".`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
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
                  url: `data:image/jpeg;base64,${base64Data}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data: OpenAIResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI API')
    }

    // Try to parse the JSON response
    try {
      // Clean the content - remove markdown code blocks if present
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      const result = JSON.parse(cleanContent)
      
      // Validate the response structure
      if (!result.species || typeof result.confidence !== 'number') {
        throw new Error('Invalid response format from OpenAI')
      }

      return {
        species: result.species,
        confidence: Math.round(result.confidence),
        alternativeSpecies: result.alternativeSpecies || [],
        characteristics: result.characteristics || [],
        scientificName: result.scientificName,
        commonNames: result.commonNames
      }
    } catch (parseError) {
      // If JSON parsing fails, try to extract information from text
      console.warn('Failed to parse JSON response, attempting text extraction:', parseError)
      console.log('Raw content:', content)
      
      // Fallback: return a basic result
      return {
        species: 'Unable to identify',
        confidence: 0,
        alternativeSpecies: [],
        characteristics: ['Response format error - please try again']
      }
    }

  } catch (error) {
    console.error('OpenAI Vision API error:', error)
    throw new Error(`Failed to identify fish: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper function to test API connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string
    if (!apiKey) {
      console.error('OpenAI API key not found')
      return false
    }

    // Test with a simple text request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10
      })
    })

    return response.ok
  } catch (error) {
    console.error('OpenAI connection test failed:', error)
    return false
  }
}
