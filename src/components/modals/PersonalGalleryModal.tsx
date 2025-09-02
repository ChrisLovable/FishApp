import { useState, useEffect, useRef } from 'react'

interface CatchEntry {
  id: string
  species: string
  date: string
  place: string
  length: string
  weight: string
  bait: string
  conditions: string
  photo?: string // Base64 encoded image
  timestamp: number
}

interface Species {
  'English name': string
  ' Slope ': number
  ' Intercept ': number
}

interface PersonalGalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

const PersonalGalleryModal = ({ isOpen, onClose }: PersonalGalleryModalProps) => {
  const [catches, setCatches] = useState<CatchEntry[]>([])
  const [species, setSpecies] = useState<Species[]>([])
  const [view, setView] = useState<'catches' | 'add'>('catches')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state for new catch entry
  const [formData, setFormData] = useState({
    species: '',
    date: new Date().toISOString().split('T')[0],
    place: '',
    length: '',
    weight: '',
    bait: '',
    conditions: '',
    photo: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadCatches()
    loadSpeciesData()
  }, [])

  // Load catches from localStorage
  const loadCatches = () => {
    try {
      const savedCatches = localStorage.getItem('fishapp-catches')
      if (savedCatches) {
        setCatches(JSON.parse(savedCatches))
      }
    } catch (error) {
      console.error('Error loading catches:', error)
    }
  }

  // Save catches to localStorage
  const saveCatches = (newCatches: CatchEntry[]) => {
    try {
      localStorage.setItem('fishapp-catches', JSON.stringify(newCatches))
      setCatches(newCatches)
    } catch (error) {
      console.error('Error saving catches:', error)
    }
  }

  // Load species data
  const loadSpeciesData = async () => {
    try {
      const response = await fetch('/speciesData.json')
      if (response.ok) {
        const data = await response.json()
        setSpecies(data)
      } else {
        console.warn('Species data file not found')
        setSpecies([])
      }
    } catch (error) {
      console.error('Error loading species data:', error)
      setSpecies([])
    }
  }

  // Filter species based on search term
  const filteredSpecies = species.filter(fish =>
    fish['English name'].toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type - support all common mobile gallery formats
      const supportedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
        'image/heic', 'image/heif', 'image/tiff', 'image/bmp'
      ]
      
      if (!supportedTypes.includes(file.type.toLowerCase())) {
        alert('Please select a valid image file (JPEG, PNG, WebP, HEIC, etc.)')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData(prev => ({ ...prev, photo: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }



  // Add new catch entry
  const addCatch = () => {
    if (!formData.species || !formData.date || !formData.place) {
      alert('Please fill in at least Species, Date, and Place')
      return
    }

    const newCatch: CatchEntry = {
      id: Date.now().toString(),
      ...formData,
      timestamp: Date.now()
    }

    const updatedCatches = [newCatch, ...catches]
    saveCatches(updatedCatches)

    // Reset form
    setFormData({
      species: '',
      date: new Date().toISOString().split('T')[0],
      place: '',
      length: '',
      weight: '',
      bait: '',
      conditions: '',
      photo: ''
    })
    setSearchTerm('')
    setView('catches')
  }

  // Delete catch entry
  const deleteCatch = (id: string) => {
    if (confirm('Are you sure you want to delete this catch?')) {
      const updatedCatches = catches.filter(c => c.id !== id)
      saveCatches(updatedCatches)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 modal-overlay">
      <div className="w-full h-full flex items-center justify-center p-4">
<<<<<<< HEAD
             <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '700px'}}>
       <div className="modal-content rounded-2xl p-6 flex flex-col" style={{height: '700px'}}>
=======
        <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '800px'}}>
          <div className="modal-content rounded-2xl p-6 flex flex-col" style={{height: '800px'}}>
>>>>>>> aec493b3d4f4401a4fa8d20723737dd5b8ef8d41
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">📱 Personal Catches</h2>
              <div className="flex items-center gap-4">
                {view === 'catches' && (
                  <button
                    onClick={() => setView('add')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    + Add Catch
                  </button>
                )}
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
            {view === 'catches' ? (
              /* Gallery View */
              <div>
                {catches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎣</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No catches yet!</h3>
                    <p className="text-gray-400 mb-6">Start building your fishing gallery by adding your first catch.</p>
                    <button
                      onClick={() => setView('add')}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Add Your First Catch
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catches.map((catch_entry) => (
                      <div key={catch_entry.id} className="bg-gray-800/50 rounded-lg border border-gray-600 overflow-hidden">
                        {/* Photo */}
                        <div className="bg-gray-700 flex items-center justify-center" style={{minHeight: '200px'}}>
                          {catch_entry.photo ? (
                            <img
                              src={catch_entry.photo}
                              alt={`${catch_entry.species} catch`}
                              className="w-full h-auto max-h-64 object-contain rounded-t-lg"
                            />
                          ) : (
                            <div className="text-gray-400 text-4xl">📷</div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{catch_entry.species}</h3>
                            <button
                              onClick={() => deleteCatch(catch_entry.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                              title="Delete catch"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-300">
                            <div><span className="text-blue-300">📅</span> {formatDate(catch_entry.date)}</div>
                            <div><span className="text-green-300">📍</span> {catch_entry.place}</div>
                            {catch_entry.length && (
                              <div><span className="text-yellow-300">📏</span> {catch_entry.length} cm</div>
                            )}
                            {catch_entry.weight && (
                              <div><span className="text-purple-300">⚖️</span> {catch_entry.weight} kg</div>
                            )}
                            {catch_entry.bait && (
                              <div><span className="text-orange-300">🎣</span> {catch_entry.bait}</div>
                            )}
                            {catch_entry.conditions && (
                              <div className="text-xs text-gray-400 mt-2">{catch_entry.conditions}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Add Catch View */
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Add New Catch</h3>
                  <button
                    onClick={() => setView('catches')}
                    className="text-blue-300 hover:text-white"
                  >
                    ← Back to Catches
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                      {formData.photo ? (
                        <div className="relative">
                          <img
                            src={formData.photo}
                            alt="Selected catch"
                            className="w-full h-auto max-h-64 object-contain rounded-lg"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl text-gray-400 mb-2">📷</div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            Upload Photo
                          </button>
                                                     <p className="text-sm text-gray-400 mt-2">Select from gallery</p>
                        </div>
                      )}
                                             <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/tiff,image/bmp"
                         onChange={handlePhotoUpload}
                         className="hidden"
                       />
                    </div>
                  </div>

                  {/* Species Selection */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Species *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm || formData.species}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setFormData(prev => ({ ...prev, species: '' }))
                          setShowSpeciesDropdown(true)
                        }}
                        placeholder="Type fish species name..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      
                      {/* Species dropdown */}
                      {showSpeciesDropdown && searchTerm && filteredSpecies.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
                          {filteredSpecies.slice(0, 10).map((fish, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, species: fish['English name'] }))
                                setSearchTerm('')
                                setShowSpeciesDropdown(false)
                              }}
                              className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {fish['English name']}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date and Place */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Place *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.place}
                          onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                          placeholder="Fishing location..."
                          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />

                      </div>
                    </div>
                  </div>

                  {/* Length and Weight */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                        placeholder="Length in cm..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="Weight in kg..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                        step="0.001"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Bait */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Bait Used
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.bait}
                        onChange={(e) => setFormData(prev => ({ ...prev, bait: e.target.value }))}
                        placeholder="What bait did you use..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />

                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Conditions
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.conditions}
                        onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                        placeholder="Weather, water conditions, time of day..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                        rows={3}
                      />

                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={addCatch}
                      className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Save Catch
                    </button>
                    <button
                      onClick={() => setView('catches')}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalGalleryModal
