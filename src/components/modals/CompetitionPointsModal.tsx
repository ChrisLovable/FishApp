import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../config/supabase'
import { safeLocalStorage } from '../../utils/safeStorage'

interface FishEntry {
  id: string
  species: string
  length: number
  calculatedWeight: number
  points: number
  isEdible: boolean
}

interface CompetitionPointsModalProps {
  isOpen: boolean
  onClose: () => void
}

const CompetitionPointsModal = ({ isOpen, onClose }: CompetitionPointsModalProps) => {
  const [fishEntries, setFishEntries] = useState<FishEntry[]>([])
  const [speciesData, setSpeciesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [totalFish, setTotalFish] = useState(0)

  // Species classification for edible vs non-edible
  const edibleSpecies = [
    "Bronze bream",
    "Common / Dusky kob", 
    "Galjoen",
    "Elf / Shad",
    "Spotted grunter",
    "Roman",
    "Black musselcracker",
    "White steenbras",
    "Leervis / Garrick",
    "Cape stumpnose",
    "Blacktail",
    "White musselcracker",
    "Geelbek",
    "Snoek",
    "King mackerel / Couta",
    "Yellowfin tuna",
    "Albacore / Longfin tuna",
    "Bigeye tuna",
    "Bluefin tuna",
    "Skipjack tuna / Oceanic Bonito",
    "Atlantic bonito",
    "Eastern little tuna / Kawakawa",
    "Striped bonito",
    "Mackerel",
    "Indian mackerel",
    "Queen mackerel",
    "Dorado / Dolphin fish",
    "Sailfish",
    "Black marlin",
    "Striped marlin",
    "Wahoo",
    "Great barracuda",
    "Springer",
    "Giant kingfish",
    "Blue kingfish",
    "Blacktip kingfish",
    "Bigeye kingfish",
    "Brassy kingfish",
    "Bumpnose kingfish",
    "Bluefin kingfish",
    "Golden kingfish",
    "Longfin kingfish",
    "Malabar kingfish",
    "White kingfish",
    "Tille kingfish",
    "Yellowspotted kingfish",
    "Greater yellowtail / Amberjack",
    "Giant yellowtail",
    "Longfin yellowtail",
    "Carpenter / Silverfish",
    "Panga",
    "Dageraad",
    "Dane",
    "Fransmadam",
    "Janbruin / John Brown",
    "Old Woman",
    "Scotsman",
    "Piggy",
    "Santer",
    "Seventy-four",
    "Slinger",
    "Slimy",
    "Hottentot",
    "Blue hottentot",
    "Karanteen / Strepie",
    "Red tjor-tjor",
    "Cock grunter",
    "Grey grunter",
    "Javelin grunter",
    "Saddle grunter",
    "Striped grunter",
    "Red steenbras",
    "Sand steenbras",
    "Westcoast steenbras",
    "Red stumpnose / Miss Lucy",
    "White stumpnose",
    "Bigeye stumpnose",
    "Natal stumpnose",
    "Brindle bass",
    "Potato bass",
    "Cavebass",
    "Bigspot rockcod",
    "Catface rockcod",
    "Halfmoon rockcod",
    "Malabar rockcod",
    "Streakyspot rockcod",
    "Yellowbelly rockcod",
    "Yellowtail rockcod",
    "White-edged rockcod / Captain Fine",
    "Blood snapper",
    "Bohar / Twinspot snapper",
    "Russell's snapper",
    "Speckled snapper",
    "River / Mangrove snapper",
    "Humpback snapper",
    "Green jobfish",
    "Cutthroat emperor",
    "Yellowfin emperor",
    "Blue emperor",
    "Blue chub",
    "Brassy chub",
    "Grey chub",
    "Goldsaddle hogfish",
    "Indian goatfish",
    "Blacksaddle goatfish ",
    "Natal fingerfin",
    "Twotone fingerfin",
    "Ladder wrasse",
    "Natal wrasse",
    "Surge wrasse",
    "Marbled hawkfish",
    "Indian mirrorfish",
    "Threadfin mirrorfish",
    "Striped threadfin",
    "Talang queenfish",
    "Double-spotted queenfish",
    "King soldierbream",
    "Blotcheye soldier",
    "Concertina fish",
    "Tripletail",
    "Twobar bream",
    "Stone bream",
    "River bream / Perch",
    "Steentjie",
    "Klipvis",
    "Cape moony",
    "Natal moony",
    "Cape knifejaw",
    "Natal knifejaw",
    "Flathead mullet",
    "Southern mullet",
    "Striped mullet",
    "Bluetail mullet",
    "Eel catfish",
    "White seacatfish / Sea barbel",
    "Elephant fish / St Joseph",
    "Milkfish",
    "Bonefish",
    "Oxeye tarpon",
    "Wolfherring",
    "Torpedo scad",
    "Remora",
    "Prodigal Son / Cobia",
    "Rainbow Runner",
    "Largespot pompano",
    "Snubnose pompano",
    "Southern pompano",
    "Spadefish",
    "Bridle triggerfish",
    "Clown triggerfish",
    "Patchy triggerfish",
    "Porcupinefish",
    "Whitespotted rabbitfish",
    "Blackback blaasop",
    "Evileye blaasop",
    "Silverstripe blaasop",
    "Smooth blaasop",
    "Star blaasop",
    "Whitespotted blaasop",
    "Barred rubberlip",
    "Black rubberlip / Harry hotlips",
    "Blackspotted rubberlip ",
    "Dusky rubberlip",
    "Lemonfish",
    "Minstrel rubberlip",
    "Redlip rubberlip",
    "Whitebarred rubberlip",
    "Englishman",
    "Bludger",
    "Baardman"
  ]



  const [speciesSearchTerm, setSpeciesSearchTerm] = useState('')
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false)
  const [newEntry, setNewEntry] = useState({ species: '', length: '' })
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter species based on search term - use loaded species data
  const filteredSpecies = speciesData
    .map(s => s.english_name)
    .filter(speciesName =>
      speciesName.toLowerCase().includes(speciesSearchTerm.toLowerCase())
    )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSpeciesDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadSpeciesData()
      loadFishEntriesFromStorage()
    }
  }, [isOpen])

  useEffect(() => {
    calculateTotals()
    saveFishEntriesToStorage()
  }, [fishEntries])

  // Monitor speciesData changes
  useEffect(() => {
    console.log('🔄 speciesData state changed:', speciesData.length, 'species')
    if (speciesData.length > 0) {
      console.log('✅ speciesData is now populated:', speciesData.slice(0, 3))
    }
  }, [speciesData])

  const loadSpeciesData = async () => {
    console.log('🔄 Starting to load species data...')
    setIsLoading(true)
    try {
      // First try Supabase
      if (supabase) {
        console.log('🌐 Attempting to load from Supabase...')
        const { data, error } = await supabase
          .from('reference_table')
          .select('english_name, slope, intercept')
          .order('english_name')
        
        if (error) {
          console.error('❌ Supabase error, falling back to local data:', error)
          await loadLocalSpeciesData()
        } else if (data && data.length > 0) {
          // Check if we have valid slope/intercept data
          const validData = data.filter(s => s.slope !== null && s.intercept !== null)
          console.log('📊 Supabase data check:', {
            total: data.length,
            valid: validData.length,
            invalid: data.length - validData.length
          })
          
          if (validData.length > 0) {
            console.log('✅ Loaded valid species data from Supabase:', validData.length, 'species')
            console.log('Sample data:', validData.slice(0, 3))
            console.log('🔍 All species names from Supabase:')
            console.log(validData.map(s => s.english_name))
            setSpeciesData(validData)
          } else {
            console.log('⚠️ Supabase data has no valid slope/intercept values, using local fallback...')
            await loadLocalSpeciesData()
          }
        } else {
          console.log('⚠️ No Supabase data, loading local data')
          await loadLocalSpeciesData()
        }
      } else {
        console.log('📱 Supabase not available, loading local data')
        await loadLocalSpeciesData()
      }
    } catch (error) {
      console.error('💥 Error loading species data:', error)
      await loadLocalSpeciesData()
    } finally {
      setIsLoading(false)
      console.log('🏁 Species data loading completed. Final count:', speciesData.length)
    }
  }

  const loadLocalSpeciesData = async () => {
    try {
      console.log('📁 Loading local species data from /speciesData.json...')
      const response = await fetch('/speciesData.json')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Loaded local species data:', data.length, 'species')
        console.log('Sample raw data:', data.slice(0, 2))
        // Convert the local data format to match Supabase format
        const convertedData = data.map((item: any) => ({
          english_name: item['English name'] || '',
          slope: item[' Slope '] || 0,
          intercept: item[' Intercept '] || 0
        }))
        console.log('✅ Converted data sample:', convertedData.slice(0, 2))
        console.log('🔍 All species names from local data:')
        console.log(convertedData.map(s => s.english_name))
        setSpeciesData(convertedData)
      } else {
        console.error('❌ Failed to load local species data, using fallback')
        loadFallbackSpeciesData()
      }
    } catch (error) {
      console.error('💥 Error loading local species data, using fallback:', error)
      loadFallbackSpeciesData()
    }
  }

  // Fallback species data for complete offline capability
  const loadFallbackSpeciesData = () => {
    console.log('🚨 Loading fallback species data for offline use')
    const fallbackData = [
      { english_name: 'Bronze bream', slope: -10.61913013, intercept: 3.046120882 },
      { english_name: 'Common / Dusky kob', slope: -11.64128017, intercept: 3.039433002 },
      { english_name: 'Galjoen', slope: -11.1244642697291, intercept: 3.13519652641689 },
      { english_name: 'Elf / Shad', slope: -11.15363979, intercept: 2.980024099 },
      { english_name: 'Spotted grunter', slope: -11.12304584, intercept: 2.970594241 },
      { english_name: 'Roman', slope: -10.97504044, intercept: 3.153796911 },
      { english_name: 'Black musselcracker', slope: -10.6225996, intercept: 3.03468895 },
      { english_name: 'White steenbras', slope: -11.13979326, intercept: 3.031065185 },
      { english_name: 'Leervis / Garrick', slope: -13.019409009714938, intercept: 3.391500000000001 },
      { english_name: 'Cape stumpnose', slope: -10.06836424, intercept: 2.9266004 },
      { english_name: 'Blacktail', slope: -11.25680542, intercept: 3.242000103 },
      { english_name: 'White musselcracker', slope: -10.84058952, intercept: 3.037132025 }
    ]
    console.log('✅ Fallback data loaded:', fallbackData.length, 'species')
    console.log('Sample fallback data:', fallbackData.slice(0, 2))
    setSpeciesData(fallbackData)
  }

  // Local storage functions for offline persistence
  const saveFishEntriesToStorage = () => {
    const success = safeLocalStorage.setItem('competitionPointsEntries', JSON.stringify(fishEntries))
    if (!success) {
      console.warn('⚠️ Failed to save competition points to localStorage - data will be lost on refresh')
    }
  }

  const loadFishEntriesFromStorage = () => {
    const stored = safeLocalStorage.getItem('competitionPointsEntries')
    if (stored) {
      try {
        const entries = JSON.parse(stored)
        setFishEntries(entries)
        console.log('Loaded fish entries from storage:', entries.length)
      } catch (error) {
        console.error('Error parsing fish entries from storage:', error)
      }
    }
  }

  const calculateWeight = (speciesName: string, length: number): number => {
    console.log('🔍 Calculating weight for:', speciesName, 'length:', length)
    console.log('📊 Available species data:', speciesData.length)
    console.log('📊 Actual speciesData array:', speciesData)
    
    // Try exact match first
    let species = speciesData.find(s => s.english_name === speciesName)
    console.log('🎯 Exact match result:', species)
    
    // If no exact match, try case-insensitive match
    if (!species) {
      species = speciesData.find(s => s.english_name.toLowerCase() === speciesName.toLowerCase())
      console.log('🔍 Case-insensitive match result:', species)
    }
    
    // If still no match, try partial match
    if (!species) {
      species = speciesData.find(s => s.english_name.toLowerCase().includes(speciesName.toLowerCase()))
      console.log('🔍 Partial match result:', species)
    }
    
    // Log all available species names for debugging
    if (!species) {
      console.log('❌ No match found. Available species names:')
      console.log('First 10 species:', speciesData.slice(0, 10).map(s => s.english_name))
      console.log('Searching for species containing "Albacore":', speciesData.filter(s => s.english_name.toLowerCase().includes('albacore')))
    }
    
    if (species && species.slope && species.intercept) {
      try {
        // Formula: Weight = EXP(Slope + LN(Length) × Intercept)
        const weight = Math.exp(species.slope + Math.log(length) * species.intercept)
        console.log('✅ Calculation successful:', {
          species: speciesName,
          matchedSpecies: species.english_name,
          length: length,
          slope: species.slope,
          intercept: species.intercept,
          lnLength: Math.log(length),
          slopePlusLnLengthTimesIntercept: species.slope + Math.log(length) * species.intercept,
          finalWeight: weight
        })
        return isFinite(weight) && weight > 0 ? weight : 0
      } catch (error) {
        console.error('💥 Weight calculation error:', error)
        return 0
      }
    }
    
    console.log('❌ No species data found for:', speciesName)
    return 0
  }

  const isEdibleSpecies = (speciesName: string): boolean => {
    // Try exact match first
    if (edibleSpecies.includes(speciesName)) {
      return true
    }
    
    // Try case-insensitive match
    if (edibleSpecies.some(s => s.toLowerCase() === speciesName.toLowerCase())) {
      return true
    }
    
    // Try partial match
    if (edibleSpecies.some(s => s.toLowerCase().includes(speciesName.toLowerCase()))) {
      return true
    }
    
    return false
  }

  const calculatePoints = (weight: number, isEdible: boolean): number => {
    return isEdible ? weight * 2 : weight * 1
  }

  const addFishEntry = () => {
    console.log('Adding fish entry:', newEntry)
    console.log('Current speciesData length:', speciesData.length)
    
    if (!newEntry.species || !newEntry.length) {
      console.log('Missing species or length')
      return
    }

    if (speciesData.length === 0) {
      console.log('No species data loaded yet, please wait...')
      alert('Species data is still loading. Please wait a moment and try again.')
      return
    }

    const length = parseFloat(newEntry.length)
    if (isNaN(length) || length <= 0) {
      console.log('Invalid length:', newEntry.length)
      return
    }

    console.log('Calculating for species:', newEntry.species, 'length:', length)
    
    // Find the species in the current data
    const species = speciesData.find(s => s.english_name === newEntry.species)
    console.log('Found species for calculation:', species)
    
    if (!species) {
      console.log('Species not found in current data')
      alert(`Species "${newEntry.species}" not found in database. Please check the species name.`)
      return
    }

    // Calculate weight directly using the found species data
    let calculatedWeight = 0
    try {
      if (species.slope && species.intercept) {
        calculatedWeight = Math.exp(species.slope + Math.log(length) * species.intercept)
        console.log('Weight calculation:', {
          species: newEntry.species,
          length: length,
          slope: species.slope,
          intercept: species.intercept,
          calculatedWeight: calculatedWeight
        })
      }
    } catch (error) {
      console.error('Weight calculation error:', error)
    }

    if (calculatedWeight === 0) {
      console.log('Weight calculation failed - invalid data')
      alert(`Could not calculate weight for "${newEntry.species}". Please check the data.`)
      return
    }

    const isEdible = isEdibleSpecies(newEntry.species)
    const points = calculatePoints(calculatedWeight, isEdible)

    console.log('Results:', { calculatedWeight, isEdible, points })

    const newFish: FishEntry = {
      id: Date.now().toString(),
      species: newEntry.species,
      length: length,
      calculatedWeight: calculatedWeight,
      points: points,
      isEdible: isEdible
    }

    console.log('Adding fish:', newFish)
    setFishEntries(prev => [...prev, newFish])
    setNewEntry({ species: '', length: '' })
    setSpeciesSearchTerm('')
  }

  const removeFishEntry = (id: string) => {
    setFishEntries(prev => prev.filter(fish => fish.id !== id))
  }

  const calculateTotals = () => {
    const total = fishEntries.reduce((sum, fish) => sum + fish.points, 0)
    const weight = fishEntries.reduce((sum, fish) => sum + fish.calculatedWeight, 0)
    const count = fishEntries.length

    setTotalPoints(total)
    setTotalWeight(weight)
    setTotalFish(count)
  }

  const clearAllEntries = () => {
    setFishEntries([])
    try {
      localStorage.removeItem('competitionPointsEntries')
    } catch (error) {
      console.error('Error clearing fish entries from storage:', error)
    }
  }

  const handleSpeciesSelect = (selectedSpecies: string) => {
    console.log('🎯 handleSpeciesSelect called with:', selectedSpecies)
    console.log('🎯 Current speciesData length:', speciesData.length)
    setNewEntry(prev => ({ ...prev, species: selectedSpecies }))
    setSpeciesSearchTerm(selectedSpecies)
    setShowSpeciesDropdown(false)
  }

  const handleSpeciesSearchChange = (value: string) => {
    setSpeciesSearchTerm(value)
    setShowSpeciesDropdown(true)
    if (value === '') {
      setNewEntry(prev => ({ ...prev, species: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col overflow-y-auto" style={{height: '680px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white text-center flex-1">🏆 Competition Points Calculator</h2>
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

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-6 pr-1">
              {/* Points Summary */}
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-500/50 p-6" style={{height: '250px'}}>
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-bold text-white mb-4">📊 Competition Summary</h3>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-yellow-200 font-semibold mb-2">Total Points</div>
                        <div className="text-white text-4xl font-bold">{totalPoints.toFixed(2)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-200 font-semibold mb-2">Total Fish</div>
                        <div className="text-white text-4xl font-bold">{totalFish}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-yellow-100">
                    🎯 Edible species = 2x points | Non-edible species = 1x points
                  </div>
                </div>
              </div>

                             {/* Add Fish Entry */}
               <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-6">
                                   <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">➕ Add Fish Entry</h3>
                    <div className="flex items-center gap-2">
                      {isLoading && (
                        <span className="text-blue-400 text-sm">Loading species data...</span>
                      )}
                      {speciesData.length > 0 && speciesData.length < 50 && (
                        <span className="text-yellow-400 text-sm">📱 Offline Mode</span>
                      )}
                      {speciesData.length >= 50 && (
                        <span className="text-green-400 text-sm">✅ {speciesData.length} species loaded</span>
                      )}
                    </div>
                  </div>
                <div className="grid grid-cols-1 gap-4">
                  {/* Species Selection */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Species *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={speciesSearchTerm}
                        onChange={(e) => handleSpeciesSearchChange(e.target.value)}
                        onFocus={() => setShowSpeciesDropdown(true)}
                        placeholder="Type to search species..."
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      {newEntry.species && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewEntry(prev => ({ ...prev, species: '' }))
                            setSpeciesSearchTerm('')
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                                         {/* Species Dropdown */}
                     {showSpeciesDropdown && (
                       <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
                         {filteredSpecies.length > 0 ? (
                           filteredSpecies.map(speciesName => (
                             <button
                               key={speciesName}
                               type="button"
                               onClick={() => {
                                 console.log('🎯 User selected species from dropdown:', speciesName)
                                 handleSpeciesSelect(speciesName)
                               }}
                               className="w-full text-left px-3 py-2 text-white hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                             >
                               {speciesName}
                             </button>
                           ))
                         ) : (
                           <div className="px-3 py-2 text-gray-400 text-sm">
                             No species found
                           </div>
                         )}
                       </div>
                     )}
                  </div>

                  {/* Length Input */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Length (cm) *
                    </label>
                    <input
                      type="number"
                      value={newEntry.length}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, length: e.target.value }))}
                      placeholder="Enter length..."
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      onClick={addFishEntry}
                      disabled={!newEntry.species || !newEntry.length || speciesData.length === 0}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                    >
                      {speciesData.length === 0 ? '⏳ Loading...' : '➕ Add Fish'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Fish Entries List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">🐟 Fish Entries ({fishEntries.length})</h3>
                  {fishEntries.length > 0 && (
                    <button
                      onClick={clearAllEntries}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      🗑️ Clear All
                    </button>
                  )}
                </div>

                {fishEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No fish entries yet.</p>
                    <p className="text-sm mt-2">Add fish above to start calculating your competition points!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fishEntries.map((fish, index) => (
                      <div
                        key={fish.id}
                        className="bg-gray-800/50 rounded-lg border border-gray-600 p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-orange-400 font-bold">#{index + 1}</span>
                              <h4 className="text-lg font-bold text-white">{fish.species}</h4>
                              {fish.isEdible ? (
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                  🍽️ Edible (2x)
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                                  🚫 Non-edible (1x)
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Length:</span>
                                <span className="text-white ml-2 font-semibold">{fish.length} cm</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Weight:</span>
                                <span className="text-white ml-2 font-semibold">{fish.calculatedWeight.toFixed(3)} kg</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Points:</span>
                                <span className="text-yellow-300 ml-2 font-bold">{fish.points.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Multiplier:</span>
                                <span className="text-white ml-2 font-semibold">{fish.isEdible ? '2x' : '1x'}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFishEntry(fish.id)}
                            className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Remove fish entry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Return Button */}
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Return to Main Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompetitionPointsModal
