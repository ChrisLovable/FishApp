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
  
  console.log('🔍 Starting fish identification...')
  console.log('🔑 API Key available:', !!apiKey)
  console.log('📱 User Agent:', navigator.userAgent)
  console.log('🌐 Network Status:', navigator.onLine ? 'Online' : 'Offline')
  
  if (!apiKey) {
    console.error('❌ OpenAI API key not found')
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.')
  }

  // Compress image for better mobile performance and API efficiency
  // Use higher quality for better identification accuracy
  const compressedImage = await compressImage(imageBase64, 1200, 0.9)
  
  // Remove data URL prefix if present
  const base64Data = compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')

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

Be extremely careful with shark identification - many species look similar but have key differences.`

  try {
    console.log('📡 Making API request to OpenAI...')
    console.log('📊 Image size (compressed):', (base64Data.length * 0.75 / 1024).toFixed(2), 'KB')
    console.log('🔑 API Key first 10 chars:', apiKey.substring(0, 10) + '...')
    console.log('🔑 API Key last 10 chars:', '...' + apiKey.substring(apiKey.length - 10))
    console.log('📝 Request body size:', JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt.substring(0, 100) + '...'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Data.substring(0, 50)}...`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.05
    }).length, 'bytes')
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
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
        max_tokens: 1500,
        temperature: 0.05
      })
    })

    // Clear timeout since request completed
    clearTimeout(timeoutId)
    
    console.log('📡 Response status:', response.status, response.statusText)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      const errorMessage = errorData.error?.message || 'Unknown error'
      console.error('❌ FULL ERROR DATA:', errorData)
      console.error('❌ OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorMessage: errorMessage,
        errorType: errorData.error?.type,
        errorCode: errorData.error?.code,
        fullError: errorData
      })
      throw new Error(`OpenAI API error: ${response.status} - ${errorMessage}`)
    }

    const data: OpenAIResponse = await response.json()
    const content = data.choices[0]?.message?.content

    console.log('📡 OpenAI API response received')
    console.log('📝 Response content length:', content?.length || 0)

    if (!content) {
      console.error('❌ No content in OpenAI response')
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

      const finalResult = {
        species: result.species,
        confidence: Math.round(result.confidence),
        alternativeSpecies: result.alternativeSpecies || [],
        characteristics: result.characteristics || [],
        scientificName: result.scientificName,
        commonNames: result.commonNames
      }
      
      console.log('✅ Fish identification successful:', {
        species: finalResult.species,
        confidence: finalResult.confidence,
        scientificName: finalResult.scientificName
      })
      
      return finalResult
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
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.')
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.')
      } else if (error.message.includes('API key')) {
        throw new Error('API key error. Please check your configuration.')
      }
    }
    
    throw new Error(`Failed to identify fish: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}


