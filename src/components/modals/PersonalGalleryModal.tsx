import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../config/supabase'

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
  user_email: string
  photo_url?: string // URL to Supabase storage
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
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
    const email = localStorage.getItem('userEmail')
    if (email) {
      setUserEmail(email)
      loadCatches(email)
    }
    loadSpeciesData()
  }, [])

  // Load catches from Supabase
  const loadCatches = async (email: string) => {
    if (!supabase || !email) {
      console.error('❌ Supabase not available or no user email')
      setCatches([])
      return
    }

    try {
      setIsLoading(true)
      console.log('📊 Loading personal catches from Supabase for:', email)
      
      const { data: supabaseCatches, error } = await supabase
        .from('personal_gallery')
        .select('*')
        .eq('user_email', email)
        .order('date', { ascending: false })

      if (error) {
        console.error('❌ Error loading catches from Supabase:', error)
        setCatches([])
        return
      }

      if (supabaseCatches && supabaseCatches.length > 0) {
        console.log('✅ Loaded', supabaseCatches.length, 'personal catches from Supabase')
        // Convert Supabase format to component format
        const convertedCatches = supabaseCatches.map(catchItem => ({
          id: catchItem.id,
          species: catchItem.species,
          date: catchItem.date,
          place: catchItem.place,
          length: catchItem.length?.toString() || '',
          weight: catchItem.weight?.toString() || '',
          bait: catchItem.bait || '',
          conditions: catchItem.conditions || '',
          photo: catchItem.photo_url || '',
          timestamp: new Date(catchItem.created_at).getTime(),
          user_email: catchItem.user_email,
          photo_url: catchItem.photo_url
        }))
        setCatches(convertedCatches)
      } else {
        console.log('📭 No personal catches found in Supabase')
        setCatches([])
      }
    } catch (error) {
      console.error('💥 Error in loadCatches:', error)
      setCatches([])
    } finally {
      setIsLoading(false)
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
  const addCatch = async () => {
    if (!formData.species || !formData.date || !formData.place) {
      alert('Please fill in at least Species, Date, and Place')
      return
    }

    if (!supabase || !userEmail) {
      alert('Database not configured or user not logged in')
      return
    }

    setIsUploading(true)

    try {
      let photoUrl = null

      // Upload photo to Supabase storage if provided
      if (formData.photo) {
        const fileExt = 'jpg' // Default extension for base64 images
        const fileName = `${userEmail}_${Date.now()}.${fileExt}`
        const filePath = `${userEmail}/${fileName}`

        // Convert base64 to blob
        const response = await fetch(formData.photo)
        const blob = await response.blob()

        const { error: uploadError } = await supabase.storage
          .from('personal-gallery')
          .upload(filePath, blob)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          alert('Error uploading image: ' + uploadError.message)
          return
        }

        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('personal-gallery')
          .getPublicUrl(filePath)
        
        photoUrl = urlData.publicUrl
      }

      // Save catch data to database
      const { data: insertedCatch, error: insertError } = await supabase
        .from('personal_gallery')
        .insert({
          user_email: userEmail,
          species: formData.species,
          date: formData.date,
          place: formData.place,
          length: formData.length ? parseFloat(formData.length) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          bait: formData.bait || null,
          conditions: formData.conditions || null,
          photo_url: photoUrl,
          notes: null // Add notes field if needed
        })
        .select()

      if (insertError) {
        console.error('Error saving catch data:', insertError)
        alert('Error saving catch data: ' + insertError.message)
        return
      }

      // Reload catches to show the new entry
      await loadCatches(userEmail)

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

      alert('Catch saved successfully!')
      
    } catch (error) {
      console.error('Error saving catch:', error)
      alert('Error saving catch. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Delete catch entry
  const deleteCatch = async (id: string) => {
    if (!supabase || !userEmail) {
      alert('Database not configured or user not logged in')
      return
    }

    if (confirm('Are you sure you want to delete this catch?')) {
      try {
        // Find the catch to get the photo URL for deletion
        const catchToDelete = catches.find(c => c.id === id)
        
        // Delete from database
        const { error: deleteError } = await supabase
          .from('personal_gallery')
          .delete()
          .eq('id', id)
          .eq('user_email', userEmail)

        if (deleteError) {
          console.error('Error deleting catch:', deleteError)
          alert('Error deleting catch: ' + deleteError.message)
          return
        }

        // Delete photo from storage if it exists
        if (catchToDelete?.photo_url) {
          try {
            const imagePath = catchToDelete.photo_url.split('/').slice(-2).join('/')
            await supabase.storage
              .from('personal-gallery')
              .remove([imagePath])
          } catch (storageError) {
            console.warn('Error deleting image from storage:', storageError)
            // Don't fail the whole operation if image deletion fails
          }
        }

        // Reload catches
        await loadCatches(userEmail)
        alert('Catch deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting catch:', error)
        alert('Error deleting catch. Please try again.')
      }
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
              <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col" style={{height: '680px'}}>
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
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-blue-400 text-lg mb-2">Loading catches...</div>
                    <div className="text-gray-500 text-sm">Please wait</div>
                  </div>
                ) : catches.length === 0 ? (
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
                  <div className="grid grid-cols-1 gap-6">
                    {catches.map((catch_entry) => (
                      <div key={catch_entry.id} className="bg-gray-800/50 rounded-lg border border-gray-600 overflow-hidden">
                        {/* Photo */}
                        <div className="bg-gray-700 flex items-center justify-center" style={{minHeight: '200px'}}>
                          {(catch_entry.photo || catch_entry.photo_url) ? (
                            <img
                              src={catch_entry.photo_url || catch_entry.photo}
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
                  <div className="grid grid-cols-1 gap-4">
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
                  <div className="grid grid-cols-1 gap-4">
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
                      disabled={isUploading}
                      className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {isUploading ? 'Saving...' : 'Save Catch'}
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
