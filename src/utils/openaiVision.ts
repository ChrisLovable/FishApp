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
  console.log('🔍 Starting fish identification...')
  console.log('📱 User Agent:', navigator.userAgent)
  console.log('🌐 Network Status:', navigator.onLine ? 'Online' : 'Offline')
  
  // Compress image for better mobile performance and API efficiency
  // Use higher quality for better identification accuracy
  const compressedImage = await compressImage(imageBase64, 1200, 0.9)
  
  // Remove data URL prefix if present
  const base64Data = compressedImage.replace(/^data:image\/[a-z]+;base64,/, '')

  try {
    console.log('📡 Making API request to serverless function...')
    console.log('📊 Image size (compressed):', (base64Data.length * 0.75 / 1024).toFixed(2), 'KB')
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
    
    const response = await fetch('/api/fishid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        image: base64Data
      })
    })

    // Clear timeout since request completed
    clearTimeout(timeoutId)
    
    console.log('📡 Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`)
    }

    const result: FishIdentificationResult = await response.json()
    
    console.log('✅ Fish identification successful:', {
      species: result.species,
      confidence: result.confidence,
      scientificName: result.scientificName
    })
    
    return result

  } catch (error) {
    console.error('Fish identification API error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.')
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.')
      }
    }
    
    throw new Error(`Failed to identify fish: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}


