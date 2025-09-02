import { useState, useEffect } from 'react'

interface CatchData {
  id: string
  anglerName: string
  species: string
  date: string
  location: string
  bait: string
  length?: number
  weight?: number
  weather?: string
  tide?: string
  moonPhase?: string
  notes: string
  imageUrl: string
  timestamp: number
  userId: string
}

interface PublicGalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

const PublicGalleryModal = ({ isOpen, onClose }: PublicGalleryModalProps) => {
  const [catches, setCatches] = useState<CatchData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [formData, setFormData] = useState({
    anglerName: '',
    species: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    bait: '',
    length: '',
    weight: '',
    weather: '',
    tide: '',
    moonPhase: '',
    notes: ''
  })

  // Load catches from localStorage on component mount
  useEffect(() => {
    const savedCatches = localStorage.getItem('publicCatches')
    if (savedCatches) {
      try {
        setCatches(JSON.parse(savedCatches))
      } catch (error) {
        console.error('Error loading public catches:', error)
      }
    }
  }, [])

  // Save catches to localStorage whenever catches change
  useEffect(() => {
    localStorage.setItem('publicCatches', JSON.stringify(catches))
  }, [catches])

  // Set current user (in a real app, this would come from authentication)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(savedUser)
    } else {
      // Generate a random user ID for demo purposes
      const randomUser = 'User_' + Math.random().toString(36).substr(2, 9)
      setCurrentUser(randomUser)
      localStorage.setItem('currentUser', randomUser)
    }
  }, [])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!selectedImage) {
      alert('Please select an image')
      return
    }

    setIsUploading(true)

    try {
      // Convert image to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        
        const newCatch: CatchData = {
          id: Date.now().toString(),
          anglerName: formData.anglerName,
          species: formData.species,
          date: formData.date,
          location: formData.location,
          bait: formData.bait,
          length: formData.length ? parseFloat(formData.length) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          weather: formData.weather || undefined,
          tide: formData.tide || undefined,
          moonPhase: formData.moonPhase || undefined,
          notes: formData.notes,
          imageUrl: imageUrl,
          timestamp: Date.now(),
          userId: currentUser // Add user ID to track ownership
        }

        setCatches(prev => [newCatch, ...prev])
        
        // Reset form
        setFormData({
          anglerName: '',
          species: '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          bait: '',
          length: '',
          weight: '',
          weather: '',
          tide: '',
          moonPhase: '',
          notes: ''
        })
        setSelectedImage(null)
        setShowUploadForm(false)
        
        // Reset file input
        const fileInput = document.getElementById('image-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
      
      reader.readAsDataURL(selectedImage)
    } catch (error) {
      console.error('Error uploading catch:', error)
      alert('Error uploading catch. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteCatch = (id: string, userId: string) => {
    if (userId !== currentUser) {
      alert('You can only delete your own catches')
      return
    }
    
    if (confirm('Are you sure you want to delete this catch?')) {
      setCatches(prev => prev.filter(catchItem => catchItem.id !== id))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay pt-2 pb-2">
      <div className="relative w-full max-w-md mx-2 h-full">
        <div className="modal-content rounded-2xl p-3 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Public Gallery</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-3 pr-1">
              {/* Upload Form */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <h3 className="text-lg font-semibold text-white mb-3">Share Your Catch</h3>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Catch Photo *
                    </label>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      required
                    />
                    {selectedImage && (
                      <div className="mt-2 text-green-300 text-xs">
                        Selected: {selectedImage.name}
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Angler Name *
                      </label>
                      <input
                        type="text"
                        value={formData.anglerName}
                        onChange={(e) => handleInputChange('anglerName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Species *
                      </label>
                      <input
                        type="text"
                        value={formData.species}
                        onChange={(e) => handleInputChange('species', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Bait Used *
                      </label>
                      <input
                        type="text"
                        value={formData.bait}
                        onChange={(e) => handleInputChange('bait', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Weather Conditions
                      </label>
                      <input
                        type="text"
                        value={formData.weather}
                        onChange={(e) => handleInputChange('weather', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="e.g., Sunny, Windy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Tide State
                      </label>
                      <select
                        value={formData.tide}
                        onChange={(e) => handleInputChange('tide', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">Select tide state</option>
                        <option value="High Tide">High Tide</option>
                        <option value="Low Tide">Low Tide</option>
                        <option value="Rising">Rising</option>
                        <option value="Falling">Falling</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Moon Phase
                      </label>
                      <select
                        value={formData.moonPhase}
                        onChange={(e) => handleInputChange('moonPhase', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">Select moon phase</option>
                        <option value="New Moon">New Moon</option>
                        <option value="Waxing Crescent">Waxing Crescent</option>
                        <option value="First Quarter">First Quarter</option>
                        <option value="Waxing Gibbous">Waxing Gibbous</option>
                        <option value="Full Moon">Full Moon</option>
                        <option value="Waning Gibbous">Waning Gibbous</option>
                        <option value="Last Quarter">Last Quarter</option>
                        <option value="Waning Crescent">Waning Crescent</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Notes & Story
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm resize-none"
                      placeholder="Share your fishing story, techniques used, or any interesting details about your catch..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      {isUploading ? 'Uploading...' : 'Share Catch'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Display */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Catches</h3>
                
                {catches.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">No catches shared yet</div>
                    <div className="text-gray-500 text-sm">Be the first to share your catch!</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {catches.map((catchItem) => (
                      <div key={catchItem.id} className="bg-gray-700/50 rounded-lg border border-gray-600 p-3">
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={catchItem.imageUrl}
                              alt={`Catch by ${catchItem.anglerName}`}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold text-sm">{catchItem.species}</h4>
                                <p className="text-blue-300 text-xs">by {catchItem.anglerName}</p>
                              </div>
                              <button
                                onClick={() => deleteCatch(catchItem.id, catchItem.userId)}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-400">Date:</span>
                                <span className="text-white ml-1">{new Date(catchItem.date).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Location:</span>
                                <span className="text-white ml-1">{catchItem.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Bait:</span>
                                <span className="text-white ml-1">{catchItem.bait}</span>
                              </div>
                              {catchItem.length && (
                                <div>
                                  <span className="text-gray-400">Length:</span>
                                  <span className="text-white ml-1">{catchItem.length}cm</span>
                                </div>
                              )}
                              {catchItem.weight && (
                                <div>
                                  <span className="text-gray-400">Weight:</span>
                                  <span className="text-white ml-1">{catchItem.weight}kg</span>
                                </div>
                              )}
                              {catchItem.weather && (
                                <div>
                                  <span className="text-gray-400">Weather:</span>
                                  <span className="text-white ml-1">{catchItem.weather}</span>
                                </div>
                              )}
                              {catchItem.tide && (
                                <div>
                                  <span className="text-gray-400">Tide:</span>
                                  <span className="text-white ml-1">{catchItem.tide}</span>
                                </div>
                              )}
                              {catchItem.moonPhase && (
                                <div>
                                  <span className="text-gray-400">Moon:</span>
                                  <span className="text-white ml-1">{catchItem.moonPhase}</span>
                                </div>
                              )}
                            </div>
                            
                            {catchItem.notes && (
                              <div className="mt-2">
                                <p className="text-gray-300 text-xs leading-relaxed">{catchItem.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicGalleryModal
