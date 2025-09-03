import { useState, useRef } from 'react'
import { identifyFishWithOpenAI } from '../../utils/openaiVision'

interface IdentifyFishModalProps {
  isOpen: boolean
  onClose: () => void
}

const IdentifyFishModal = ({ isOpen, onClose }: IdentifyFishModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [identificationResult, setIdentificationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAlternatives, setShowAlternatives] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const debugData = `File: ${file.name}, Type: ${file.type}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, UA: ${navigator.userAgent.substring(0, 50)}...`
      setDebugInfo(debugData)
      
      console.log('File selected on mobile:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        userAgent: navigator.userAgent
      })
      
      // Check file type - support all common mobile gallery formats
      const supportedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
        'image/heic', 'image/heif', 'image/tiff', 'image/bmp'
      ]
      
      if (!supportedTypes.includes(file.type.toLowerCase())) {
        setError('Please select a valid image file (JPEG, PNG, WebP, HEIC, etc.)')
        return
      }

      setError(null)
      setIdentificationResult(null)
      
      // Convert to base64 for display and processing
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        
        // Log image info for debugging
        console.log('Image processed successfully:', {
          name: file.name,
          type: file.type,
          size: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2),
          base64Length: result.length
        })
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        setError('Failed to process the selected image. Please try again.')
      }
      reader.readAsDataURL(file)
    }
  }



  const handleIdentify = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Check API key availability
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      console.log('🔑 API Key check:', {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        startsWith: apiKey?.substring(0, 3) || 'N/A'
      })
      
      // Also show on screen for mobile debugging
      setError(`Debug: API Key exists: ${!!apiKey}, Length: ${apiKey?.length || 0}`)
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please check your environment configuration.')
      }

      // Call OpenAI Vision API
      const result = await identifyFishWithOpenAI(selectedImage)
      setIdentificationResult(result)
      setError(null) // Clear debug message on success
      
    } catch (err) {
      console.error('Fish identification error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify fish. Please try again.'
      setError(`Error: ${errorMessage}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetIdentification = () => {
    setSelectedImage(null)
    setIdentificationResult(null)
    setError(null)
    setShowAlternatives(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 modal-overlay">
      <div className="w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col" style={{height: '680px'}}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-white">🔍 Identify Fish</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="modal-scrollable">
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="bg-blue-900/30 rounded-lg border border-blue-500/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Upload Fish Photo</h3>
                
                {!selectedImage ? (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 mb-4">
                      <div className="text-5xl mb-3">📸</div>
                                             <p className="text-blue-200 mb-3 text-sm">Select photo from gallery</p>
                       <p className="text-gray-400 text-xs mb-4">Supports JPEG, PNG, WebP, HEIC formats</p>
                                                                                            <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        />
                    </div>
                    <p className="text-sm text-gray-400">
                      Upload a clear photo of the fish for best identification results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                                         <div className="relative">
                       <img
                         src={selectedImage}
                         alt="Selected fish"
                         className="w-full max-h-80 object-contain rounded-lg bg-gray-800"
                         style={{ maxWidth: '100%', height: 'auto' }}
                       />
                       <button
                         onClick={resetIdentification}
                         className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                         aria-label="Remove image"
                       >
                         ✕
                       </button>
                     </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleIdentify}
                        disabled={isAnalyzing}
                        className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Identify Fish'}
                      </button>
                      <button
                        onClick={resetIdentification}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        New Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

                             {/* Debug Info Display */}
               {debugInfo && (
                 <div className="bg-blue-900/30 rounded-lg border border-blue-500/50 p-4">
                   <p className="text-blue-200 text-xs">Debug: {debugInfo}</p>
                 </div>
               )}

               {/* Error Display */}
               {error && (
                 <div className="bg-red-900/30 rounded-lg border border-red-500/50 p-4">
                   <p className="text-red-200">{error}</p>
                 </div>
               )}

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="bg-yellow-900/30 rounded-lg border border-yellow-500/50 p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4 animate-spin">🔍</div>
                    <h3 className="text-lg font-bold text-white mb-2">Analyzing Fish Photo</h3>
                    <p className="text-yellow-200">Comparing against our database of 252+ species...</p>
                    <div className="mt-4 bg-yellow-800/30 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Identification Results */}
              {identificationResult && (
                <div className="space-y-4">
                                     {/* Primary Result */}
                   <div className="bg-green-900/30 rounded-lg border border-green-500/50 p-6">
                     <h3 className="text-lg font-bold text-white mb-4">Identification Result</h3>
                     <div className="text-center">
                       <h4 className="text-2xl font-bold text-green-200 mb-2">
                         {identificationResult.species}
                       </h4>
                       
                       {identificationResult.scientificName && (
                         <div className="text-green-300 text-sm italic mb-2">
                           {identificationResult.scientificName}
                         </div>
                       )}
                       
                       {identificationResult.commonNames && identificationResult.commonNames.length > 0 && (
                         <div className="text-green-300 text-sm mb-2">
                           Also known as: {identificationResult.commonNames.join(', ')}
                         </div>
                       )}
                       
                       <div className="text-green-300 text-lg mb-4">
                         Confidence: {identificationResult.confidence}%
                       </div>
                       
                       <div className="bg-green-800/30 rounded-lg p-4">
                         <h5 className="text-green-200 font-semibold mb-2">Identified Characteristics:</h5>
                         <ul className="text-green-100 text-sm space-y-1">
                           {identificationResult.characteristics.map((char: string, index: number) => (
                             <li key={index}>• {char}</li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   </div>

                  {/* Alternative Species */}
                  {identificationResult.alternativeSpecies && identificationResult.alternativeSpecies.length > 0 && showAlternatives && (
                    <div className="bg-blue-900/30 rounded-lg border border-blue-500/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Alternative Possibilities</h3>
                        <button
                          onClick={() => setShowAlternatives(false)}
                          className="text-blue-300 hover:text-blue-200 text-sm px-2 py-1 bg-blue-800/30 rounded transition-colors"
                        >
                          Hide
                        </button>
                      </div>
                      <div className="space-y-2">
                        {identificationResult.alternativeSpecies.map((alt: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-blue-800/20 rounded-lg p-3">
                            <span className="text-blue-200">{alt.name}</span>
                            <span className="text-blue-300 text-sm">{alt.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={resetIdentification}
                      className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Identify Another
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                <h3 className="text-white font-semibold mb-2">Tips for Better Identification:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Take photos in good lighting</li>
                  <li>• Include the full fish in the frame</li>
                  <li>• Show distinctive features like fins and markings</li>
                  <li>• Avoid blurry or dark photos</li>
                  <li>• Multiple angles can improve accuracy</li>
                </ul>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdentifyFishModal
