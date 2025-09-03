import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'

interface StoreItem {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  location: string
  contactName: string
  contactPhone: string
  contactEmail: string
  imageUrls: string[]
  timestamp: number
  userId: string
  isSold: boolean
}

interface SecondHandStoreModalProps {
  isOpen: boolean
  onClose: () => void
}

const SecondHandStoreModal = ({ isOpen, onClose }: SecondHandStoreModalProps) => {
  const [items, setItems] = useState<StoreItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [galleryViewer, setGalleryViewer] = useState<{isOpen: boolean, images: string[], currentIndex: number}>({
    isOpen: false,
    images: [],
    currentIndex: 0
  })
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  })

  // Function to format time ago
  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-ZA', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const categories = [
    'Rods & Reels',
    'Tackle & Lures',
    'Boats & Kayaks',
    'Electronics',
    'Clothing & Gear',
    'Accessories',
    'Other'
  ]

  const conditions = [
    'Brand New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Used'
  ]

  // Load items from Supabase
  const loadItems = async () => {
    if (!supabase) {
      console.error('❌ Supabase not available')
      setItems([])
      return
    }

    try {
      console.log('📊 Loading items from Supabase...')
      const { data: supabaseItems, error } = await supabase
        .from('second_hand_store')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error loading items from Supabase:', error)
        setItems([])
        return
      }

      if (supabaseItems && supabaseItems.length > 0) {
        console.log('✅ Loaded', supabaseItems.length, 'items from Supabase')
        // Convert Supabase data to the expected format
        const convertedItems = supabaseItems.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          condition: item.condition,
          location: item.location,
          contactName: item.contact_name,
          contactPhone: item.contact_phone || '',
          contactEmail: item.contact_email || '',
          imageUrls: item.image_urls || [],
          timestamp: new Date(item.created_at).getTime(),
          userId: item.user_id,
          isSold: item.is_sold
        }))
        setItems(convertedItems)
    } else {
        console.log('📭 No items found in Supabase')
        setItems([])
      }
    } catch (error) {
      console.error('💥 Error in loadItems:', error)
      setItems([])
    }
  }

  // Load items on component mount
  useEffect(() => {
    loadItems()
  }, [])

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('secondHandItems', JSON.stringify(items))
  }, [items])

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
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (selectedImages.length + imageFiles.length > 6) {
      alert('Maximum 6 images allowed')
      return
    }
    
    setSelectedImages(prev => [...prev, ...imageFiles])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (selectedImages.length === 0) {
      alert('Please select at least one image')
      return
    }

    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill in all required fields')
      return
    }

    setIsUploading(true)

    try {
      const imageUrls: string[] = []
      
      // Convert all images to base64
      for (const image of selectedImages) {
        const reader = new FileReader()
        await new Promise((resolve) => {
          reader.onload = (e) => {
            imageUrls.push(e.target?.result as string)
            resolve(null)
          }
          reader.readAsDataURL(image)
        })
      }
      
      const newItem: StoreItem = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        imageUrls: imageUrls,
        timestamp: Date.now(),
        userId: currentUser,
        isSold: false
      }

      setItems(prev => [newItem, ...prev])
      
      // Try to save to Supabase if available
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (supabase && supabaseUrl && supabaseAnonKey) {
          const { error } = await supabase
            .from('second_hand_store')
            .insert([{
              title: newItem.title,
              description: newItem.description,
              price: newItem.price,
              category: newItem.category,
              condition: newItem.condition,
              location: newItem.location,
              contact_name: newItem.contactName,
              contact_phone: newItem.contactPhone,
              contact_email: newItem.contactEmail,
              image_urls: newItem.imageUrls,
              user_id: newItem.userId,
              is_sold: newItem.isSold,
              created_at: new Date(newItem.timestamp).toISOString()
            }])
          
          if (error) {
            console.error('Error saving to Supabase:', error)
          } else {
            console.log('✅ Item saved to Supabase')
          }
        }
      } catch (error) {
        console.error('Error saving to Supabase:', error)
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
      })
      setSelectedImages([])
      setShowUploadForm(false)
      
      // Reset file input
      const fileInput = document.getElementById('store-image-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('Error uploading item:', error)
      alert('Error uploading item. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteItem = (id: string, userId: string) => {
    if (userId !== currentUser) {
      alert('You can only delete your own items')
      return
    }
    
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const toggleSoldStatus = (id: string, userId: string) => {
    if (userId !== currentUser) {
      alert('You can only mark your own items as sold')
      return
    }
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isSold: !item.isSold } : item
    ))
  }

  const openGallery = (images: string[], startIndex: number = 0) => {
    setGalleryViewer({
      isOpen: true,
      images,
      currentIndex: startIndex
    })
  }

  const closeGallery = () => {
    setGalleryViewer({
      isOpen: false,
      images: [],
      currentIndex: 0
    })
  }

  const nextImage = () => {
    setGalleryViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }

  const prevImage = () => {
    setGalleryViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }))
  }

  const filteredItems = items
    .filter(item => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-3 flex flex-col overflow-y-auto" style={{height: '680px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">🛒 Second-Hand Store</h2>
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
              {/* Header with Upload Button */}
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Fishing Gear Marketplace</h3>
                  <p className="text-gray-400 text-xs">Buy and sell fishing equipment</p>
                </div>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  {showUploadForm ? 'Cancel' : 'Sell Item'}
                </button>
              </div>

              {/* Search and Filter */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Form */}
              {showUploadForm && (
                <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Sell Your Item</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Images Upload */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Item Photos * (Max 6)
                      </label>
                      <input
                        id="store-image-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                      {selectedImages.length > 0 && (
                        <div className="mt-2">
                          <div className="text-green-300 text-xs mb-2">
                            Selected: {selectedImages.length} image(s)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Item Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Price (R) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Condition
                        </label>
                        <select
                          value={formData.condition}
                          onChange={(e) => handleInputChange('condition', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        >
                          <option value="">Select condition</option>
                          {conditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                          placeholder="e.g., Cape Town, Durban"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm resize-none"
                        placeholder="Describe your item, its features, why you're selling it..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        {isUploading ? 'Uploading...' : 'List Item for Sale'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Items Display */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Available Items ({filteredItems.length})
                </h3>
                
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">No items found</div>
                    <div className="text-gray-500 text-sm">Try adjusting your search or be the first to list an item!</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div key={item.id} className={`bg-gray-700/50 rounded-lg border border-gray-600 p-3 ${item.isSold ? 'opacity-60' : ''}`}>
                        <div className="flex gap-3">
                          {/* Images */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={item.imageUrls?.[0] || '/images/placeholder-reel.jpg'}
                                alt={item.title}
                                className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openGallery(item.imageUrls || [], 0)}
                              />
                              {(item.imageUrls?.length || 0) > 1 && (
                                <div 
                                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded cursor-pointer hover:bg-black/90"
                                  onClick={() => openGallery(item.imageUrls || [], 0)}
                                >
                                  +{(item.imageUrls?.length || 1) - 1}
                                </div>
                              )}
                              {item.isSold && (
                                <div className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center rounded-lg font-bold text-sm">
                                  SOLD
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                                <p className="text-green-400 font-bold text-sm">R{item.price.toFixed(2)}</p>
                                <p className="text-gray-400 text-xs">{getTimeAgo(item.timestamp)}</p>
                              </div>
                              <div className="flex gap-2">
                                {item.userId === currentUser && (
                                  <>
                                    <button
                                      onClick={() => toggleSoldStatus(item.id, item.userId)}
                                      className={`text-xs px-2 py-1 rounded ${
                                        item.isSold 
                                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                      }`}
                                    >
                                      {item.isSold ? 'Mark Available' : 'Mark Sold'}
                                    </button>
                                    <button
                                      onClick={() => deleteItem(item.id, item.userId)}
                                      className="text-red-400 hover:text-red-300 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-gray-400">Category:</span>
                                <span className="text-white ml-1">{item.category}</span>
                              </div>
                              {item.condition && (
                                <div>
                                  <span className="text-gray-400">Condition:</span>
                                  <span className="text-white ml-1">{item.condition}</span>
                                </div>
                              )}
                              {item.location && (
                                <div>
                                  <span className="text-gray-400">Location:</span>
                                  <span className="text-white ml-1">{item.location}</span>
                                </div>
                              )}
                              {item.contactName && (
                                <div>
                                  <span className="text-gray-400">Contact:</span>
                                  <span className="text-white ml-1">{item.contactName}</span>
                                </div>
                              )}
                            </div>
                            
                            {item.description && (
                              <div className="mb-2">
                                <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
                              </div>
                            )}
                            
                            {/* Contact Info */}
                            <div className="flex gap-2 text-xs">
                              {item.contactPhone && (
                                <span className="text-blue-300">📞 {item.contactPhone}</span>
                              )}
                              {item.contactEmail && (
                                <span className="text-blue-300">✉️ {item.contactEmail}</span>
                              )}
                            </div>
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

      {/* Gallery Viewer */}
      {galleryViewer.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>

            {/* Previous button */}
            {galleryViewer.images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 text-3xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              >
                ‹
              </button>
            )}

            {/* Image */}
            <img
              src={galleryViewer.images[galleryViewer.currentIndex]}
              alt={`Gallery image ${galleryViewer.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next button */}
            {galleryViewer.images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 text-3xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              >
                ›
              </button>
            )}

            {/* Image counter */}
            {galleryViewer.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {galleryViewer.currentIndex + 1} / {galleryViewer.images.length}
              </div>
            )}

            {/* Thumbnail strip */}
            {galleryViewer.images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {galleryViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${
                      index === galleryViewer.currentIndex ? 'border-white' : 'border-transparent'
                    }`}
                    onClick={() => setGalleryViewer(prev => ({ ...prev, currentIndex: index }))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SecondHandStoreModal
