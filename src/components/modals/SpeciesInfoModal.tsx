import { useState, useEffect } from 'react'
import { getFishImageUrl, getDistributionMapUrl, supabase } from '../../config/supabase'
import { testSupabaseTables, addSampleSpeciesData } from '../../utils/testSupabaseConnection'

interface FishingInfo {
  bait: string
  hookSize: string
  location: string
}

interface Regulations {
  sizeLimit?: string
  bagLimit?: string
  closedSeason?: string
}

interface SpeciesData {
  'English name': string
  'Afrikaans name'?: string
  'Scientific name'?: string
  'Description'?: string
  'Distribution'?: string
  'Habitat'?: string
  'Diet'?: string
  'Size'?: string
  'Image'?: string
  'Distribution Map'?: string
  ' Slope ': number
  ' Intercept ': number
  // Enhanced fishing information
  fishingInfo?: FishingInfo[]
  regulations?: Regulations
  detailedDescription?: string
}

interface SpeciesInfoModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSpecies?: string // Species name to display info for
}

const SpeciesInfoModal = ({ isOpen, onClose, selectedSpecies }: SpeciesInfoModalProps) => {
  const [speciesData, setSpeciesData] = useState<SpeciesData[]>([])
  const [currentSpecies, setCurrentSpecies] = useState<SpeciesData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [length, setLength] = useState('')
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isLengthListening, setIsLengthListening] = useState(false)

  // Load species data on component mount
  useEffect(() => {
    loadSpeciesData()
  }, [])

  // Set initial species if provided
  useEffect(() => {
    if (selectedSpecies && speciesData.length > 0) {
      const species = speciesData.find(s => s['English name'] === selectedSpecies)
      if (species) {
        setCurrentSpecies(species)
        setSearchTerm(selectedSpecies)
      }
    }
  }, [selectedSpecies, speciesData])

  // Clear selected species when search term changes (user is typing new search)
  useEffect(() => {
    if (currentSpecies && searchTerm !== currentSpecies['English name']) {
      setCurrentSpecies(null)
    }
  }, [searchTerm, currentSpecies])

  const loadSpeciesData = async () => {
    try {
      // Try to load from Supabase first
      if (supabase) {
        console.log('🔄 Loading species data from Supabase...')
        const { data: supabaseData, error } = await supabase
          .from('reference_table')
          .select('*')
          .order('english_name')
        
        if (error) {
          console.error('❌ Supabase error:', error)
          // Fallback to local JSON
          await loadLocalSpeciesData()
        } else if (supabaseData && supabaseData.length > 0) {
          console.log(`✅ Loaded ${supabaseData.length} species from Supabase`)
          
          // Convert Supabase data to the expected format
          const convertedData = supabaseData.map((row: any) => ({
            'English name': row.english_name || '',
            'Afrikaans name': row.afrikaans_name || '',
            'Scientific name': row.scientific_name || '',
            'Image': row.photo_name || '',
            'Distribution Map': row.distribution_map || '',
            ' Slope ': row.slope || 0,
            ' Intercept ': row.intercept || 0,
            'Description': row.notes || '',
            'Distribution': row.distribution || '',
            regulations: {
              sizeLimit: row.size_limit || '',
              bagLimit: row.bag_limit || '',
              closedSeason: row.closed_season || ''
            },
            detailedDescription: row.notes || ''
          }))
          
          setSpeciesData(convertedData)
          return
        } else {
          console.log('⚠️ No data found in Supabase, falling back to local data')
          await loadLocalSpeciesData()
        }
      } else {
        console.log('⚠️ Supabase not available, loading local data')
        await loadLocalSpeciesData()
      }
    } catch (error) {
      console.error('❌ Error loading species data:', error)
      await loadLocalSpeciesData()
    }
  }

  const loadLocalSpeciesData = async () => {
    try {
      const response = await fetch('/speciesData.json')
      if (response.ok) {
        const data = await response.json()
        // Enhance the data with sample fishing information for demonstration
        const enhancedData = data.map((species: SpeciesData) => {
          // Add sample fishing info for Bronze bream as an example
          if (species['English name'] === 'Bronze bream') {
            return {
              ...species,
              'Afrikaans name': 'Bronze bream',
              'Scientific name': 'Pachymetopon blochii',
              'Image': 'bronze-bream.jpg',
              'Distribution Map': 'bream-distribution.jpg',
              fishingInfo: [
                { bait: 'Live bait', hookSize: '4/0', location: 'Deep-water rocks' },
                { bait: 'Crabs', hookSize: '3/0', location: 'Deep-water beach' },
                { bait: 'Black mussel', hookSize: '2/0', location: 'Offshore' },
                { bait: 'Blood & other worms', hookSize: '1/0', location: 'River & Estuary' },
                { bait: 'Dropshot & soft plastics', hookSize: '1/0', location: 'River-mouth' },
                { bait: 'Fish fillets', hookSize: '2/0', location: 'Rock-gullies' },
                { bait: 'Plugs', hookSize: '3/0', location: 'Shallow-water beach' },
                { bait: 'Prawns', hookSize: '4/0', location: 'Shallow-water rocks' },
                { bait: 'Red Bait', hookSize: '5/0', location: 'Deep-water rocks' },
                { bait: 'Sardines/Pilchard', hookSize: '6/0', location: 'Deep-water beach' },
                { bait: 'Sea lice', hookSize: '7/0', location: 'Offshore' },
                { bait: 'Spoons', hookSize: '8/0', location: 'River & Estuary' },
                { bait: 'Chokka & Octopus', hookSize: '9/0', location: 'River-mouth' },
                { bait: 'Venus ear / Abalone', hookSize: '10/0', location: 'Rock-gullies' },
                { bait: 'White / Sand mussel', hookSize: 'Larger than 10/0', location: 'Shallow-water beach' }
              ],
              regulations: {
                sizeLimit: '30 cm',
                bagLimit: '2',
                closedSeason: 'Open all year'
              },
              detailedDescription: 'Maximum length is about 65cm and can grow to up to 5kg, but most specimens caught are less than 3kg. Old specimens develop a marked blue patch between the eyes. Found near rocks in shallow coastal waters. Most common between Transkei and Port Elizabeth. Feed in white water but are sensitive to changes in water condition such as turbidity and temperature. Bronze bream can be difficult to catch as they can remove bait from a hook very quickly. They are sensitive feeders and light tackle, and small hooks are best when targeting them. Mostly targeted with prawns but will also take soft fish bait such as sardine. Flesh is quite tasty, although very fatty. Occurs from Kosi Bay to Mossel Bay.'
            }
          }
          // Add images for all species that have uploaded images
          const imageMap: { [key: string]: string } = {
            'Common / Dusky kob': 'common-kob.jpg',
            'Black musselcracker': 'black-musselcracker.jpg',
            'Shorttail stingray / Black stingray': 'black-stingray.jpg',
            'Blacktail': 'blacktail.jpg',
            'Blue stingray (Female)': 'blue-stingray.jpg',
            'Blue stingray (Male)': 'blue-stingray.jpg',
            'Cape stumpnose': 'cape-stumpnose.jpg',
            'Diamond / Butterfly ray': 'diamon-ray.jpg',
            'Bull ray / Duckbill': 'duckbill.jpg',
            'Galjoen': 'galjoen.jpg',
            'Leervis / Garrick': 'garrick.jpg',
            'Giant kingfish': 'giant-kingfish.jpg',
            'Greyspot guitarfish': 'lesser-guitarfish.jpg',
            'Roman': 'roman.jpg',
            'Sevengill cowshark': 'sevengill-cowshark.jpg',
            'Elf / Shad': 'shad.jpg',
            'Spotted grunter': 'spotted-grunter.jpg',
            'Spotted gullyshark': 'spotted-gullyshark.jpg',
            'Spotted ragged-tooth shark (Female)': 'spotted-raggedtoothshark.jpg',
            'Spotted ragged-tooth shark (Male)': 'spotted-raggedtoothshark.jpg',
            'White musselcracker': 'white-musselcracker.jpg',
            'White steenbras': 'white-steenbras.jpg',
            'Zebra': 'zebra.jpg'
          }
          
          const imageFilename = imageMap[species['English name']]
          if (imageFilename) {
            return {
              ...species,
              'Image': imageFilename
            }
          }
          return species
        })
        setSpeciesData(enhancedData)
      } else {
        console.warn('Species data file not found')
        setSpeciesData([])
      }
    } catch (error) {
      console.error('Error loading local species data:', error)
      setSpeciesData([])
    }
  }

  // Filter species based on search term
  const filteredSpecies = speciesData.filter(fish =>
    fish['English name'].toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Speech recognition for species search
  const startSpeciesListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchTerm(transcript)
      }

      recognition.start()
    }
  }

  // Speech recognition for length input
  const startLengthListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => setIsLengthListening(true)
      recognition.onend = () => setIsLengthListening(false)
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const numbers = transcript.match(/\d+\.?\d*/g)
        if (numbers && numbers.length > 0) {
          setLength(numbers[0])
        }
      }

      recognition.start()
    }
  }

  // Calculate weight using the same formula as Length-to-Weight modal
  const calculateWeight = () => {
    if (currentSpecies && length) {
      const lengthNum = parseFloat(length)
      if (!isNaN(lengthNum) && lengthNum > 0) {
        try {
          const slope = currentSpecies[' Slope ']
          const intercept = currentSpecies[' Intercept ']
          const weight = Math.exp(slope + Math.log(lengthNum) * intercept)
          
          if (isFinite(weight) && weight > 0) {
            setCalculatedWeight(weight)
          } else {
            setCalculatedWeight(null)
          }
        } catch (error) {
          console.error('Calculation error:', error)
          setCalculatedWeight(null)
        }
      }
    }
  }

  const resetCalculation = () => {
    setLength('')
    setCalculatedWeight(null)
  }

  const handleTestSupabase = async () => {
    console.log('Testing Supabase connection...')
    const isConnected = await testSupabaseTables()
    
    if (isConnected) {
      alert('✅ Supabase connection successful! All tables and storage buckets are ready.')
    } else {
      alert('❌ Supabase connection failed. Check console for details.')
    }
  }

  const handleAddSampleData = async () => {
    console.log('Adding sample species data...')
    const success = await addSampleSpeciesData()
    
    if (success) {
      alert('✅ Sample species data added successfully!')
      // Reload species data
      loadSpeciesData()
    } else {
      alert('❌ Failed to add sample data. Check console for details.')
    }
  }

  const handleCheckStorageFiles = async () => {
    if (!supabase) {
      alert('❌ Supabase client not available')
      return
    }

    try {
      console.log('🔍 Checking storage files...')
      
      // List files in fish-images bucket
      const { data: fishFiles, error: fishError } = await supabase.storage
        .from('fish-images')
        .list('')
      
      if (fishError) {
        console.log('❌ Error listing fish-images:', fishError)
        alert(`❌ Error listing fish-images: ${fishError.message}`)
      } else {
        console.log('✅ Fish images found:', fishFiles)
        alert(`✅ Found ${fishFiles?.length || 0} fish images: ${fishFiles?.map(f => f.name).join(', ') || 'none'}`)
      }
      
      // List files in distribution-maps bucket
      const { data: mapFiles, error: mapError } = await supabase.storage
        .from('distribution-maps')
        .list('')
      
      if (mapError) {
        console.log('❌ Error listing distribution-maps:', mapError)
        alert(`❌ Error listing distribution-maps: ${mapError.message}`)
      } else {
        console.log('✅ Distribution maps found:', mapFiles)
        const mapNames = mapFiles?.map(f => f.name).join(', ') || 'none'
        alert(`✅ Found ${mapFiles?.length || 0} distribution maps: ${mapNames}`)
        
        // Also show the exact URLs being generated
        if (mapFiles && mapFiles.length > 0) {
          console.log('🔗 Distribution map URLs:')
          mapFiles.forEach(file => {
            const url = getDistributionMapUrl(file.name)
            console.log(`${file.name}: ${url}`)
          })
        }
      }
      
    } catch (error) {
      console.error('Error checking storage files:', error)
      alert(`❌ Error checking storage files: ${error}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay pt-2 pb-2">
      <div className="relative w-full max-w-2xl mx-2 h-full">
        <div className="modal-content rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">🐠 Species Information</h2>
            <div className="flex items-center gap-2">
                          <div className="flex gap-2">
              <button
                onClick={handleTestSupabase}
                className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-blue-900/30 rounded"
                title="Test Supabase Connection"
              >
                Test DB
              </button>
              <button
                onClick={handleAddSampleData}
                className="text-green-400 hover:text-green-300 text-xs px-2 py-1 bg-green-900/30 rounded"
                title="Add Sample Species Data"
              >
                Add Data
              </button>
              <button
                onClick={handleCheckStorageFiles}
                className="text-purple-400 hover:text-purple-300 text-xs px-2 py-1 bg-purple-900/30 rounded"
                title="Check Storage Files"
              >
                Check Files
              </button>
            </div>
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

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-6 pr-1">
            {!currentSpecies && (
              /* Species Search */
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Search for a Fish Species
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type or speak fish name..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none pr-12"
                  />
                  <button
                    onClick={startSpeciesListening}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                      isListening ? 'text-red-500 bg-red-900/30 animate-pulse' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Voice search"
                  >
                    🎤
                  </button>
                </div>

                {/* Species dropdown */}
                {searchTerm && filteredSpecies.length > 0 && !currentSpecies && (
                  <div className="mt-2 bg-gray-700 rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
                    {filteredSpecies.slice(0, 10).map((fish, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentSpecies(fish)
                          setSearchTerm(fish['English name'])
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {fish['English name']}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentSpecies && (
              <>
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setCurrentSpecies(null)
                      setSearchTerm('')
                      resetCalculation()
                    }}
                    className="text-blue-300 hover:text-white text-sm flex items-center"
                  >
                    ← Search Another
                  </button>
                </div>

                {/* Species Title */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-400 mb-2">{currentSpecies['English name']}</h2>
                  {currentSpecies['Afrikaans name'] && (
                    <p className="text-gray-300 text-sm">{currentSpecies['Afrikaans name']}</p>
                  )}
                  {currentSpecies['Scientific name'] && (
                    <p className="text-gray-400 text-sm italic">{currentSpecies['Scientific name']}</p>
                  )}
                </div>

                {/* Images Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Fish Image */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Fish Image</h3>
                                         {currentSpecies['Image'] ? (
                       <div className="flex justify-center">
                         <img
                           src={getFishImageUrl(currentSpecies['Image'])}
                           alt={currentSpecies['English name']}
                           className="w-full max-h-48 rounded-lg object-cover"
                           onError={(e) => {
                             (e.target as HTMLImageElement).style.display = 'none'
                           }}
                         />
                       </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
                        <span className="text-gray-400 text-sm">No image available</span>
                      </div>
                    )}
                  </div>

                  {/* Distribution Map */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Distribution Map</h3>
                                         {currentSpecies['Distribution Map'] ? (
                       <div className="flex justify-center">
                         <img
                           src={getDistributionMapUrl(currentSpecies['Distribution Map'])}
                           alt={`${currentSpecies['English name']} distribution`}
                           className="w-full max-h-48 rounded-lg object-cover"
                           onError={(e) => {
                             (e.target as HTMLImageElement).style.display = 'none'
                           }}
                         />
                       </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
                        <span className="text-gray-400 text-sm">No distribution map available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fishing Information Table */}
                {currentSpecies.fishingInfo && currentSpecies.fishingInfo.length > 0 && (
                  <div className="bg-blue-900/30 rounded-lg border border-blue-500/50 p-4 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Fishing Information</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-800/50">
                            <th className="text-left py-2 px-3 text-blue-200 font-semibold">Bait</th>
                            <th className="text-left py-2 px-3 text-blue-200 font-semibold">Hook Size</th>
                            <th className="text-left py-2 px-3 text-blue-200 font-semibold">Where to Catch</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSpecies.fishingInfo.map((info, index) => (
                            <tr key={index} className={`${index % 3 === 0 ? 'bg-red-900/20' : index % 3 === 1 ? 'bg-green-900/20' : 'bg-yellow-900/20'}`}>
                              <td className="py-2 px-3 text-white">{info.bait}</td>
                              <td className="py-2 px-3 text-white">{info.hookSize}</td>
                              <td className="py-2 px-3 text-white">{info.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Regulations */}
                {currentSpecies.regulations && (
                  <div className="bg-yellow-900/30 rounded-lg border border-yellow-500/50 p-4 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Regulations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      {currentSpecies.regulations.sizeLimit && (
                        <div className="text-center">
                          <div className="text-yellow-200 font-semibold">Size Limit</div>
                          <div className="text-white text-lg font-bold">{currentSpecies.regulations.sizeLimit}</div>
                        </div>
                      )}
                      {currentSpecies.regulations.bagLimit && (
                        <div className="text-center">
                          <div className="text-yellow-200 font-semibold">Bag Limit</div>
                          <div className="text-white text-lg font-bold">{currentSpecies.regulations.bagLimit}</div>
                        </div>
                      )}
                      {currentSpecies.regulations.closedSeason && (
                        <div className="text-center">
                          <div className="text-yellow-200 font-semibold">Closed Season</div>
                          <div className="text-white text-lg font-bold">{currentSpecies.regulations.closedSeason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Detailed Description */}
                {(currentSpecies.detailedDescription || currentSpecies['Description']) && (
                  <div className="bg-green-900/30 rounded-lg border border-green-500/50 p-4 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Species Information</h3>
                    <div className="text-green-100 text-sm leading-relaxed">
                      {currentSpecies.detailedDescription || currentSpecies['Description']}
                    </div>
                  </div>
                )}

                {/* Length-to-Weight Calculator */}
                <div className="bg-purple-900/30 rounded-lg border border-purple-500/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">📏 Length-to-Weight Calculator</h3>
                  
                  <div className="space-y-4">
                    {/* Length Input */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Fish Length (cm)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="Enter length in centimeters..."
                          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none pr-12"
                          step="0.1"
                          min="0"
                        />
                        <button
                          onClick={startLengthListening}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                            isLengthListening ? 'text-red-500 bg-red-900/30 animate-pulse' : 'text-gray-400 hover:text-white'
                          }`}
                          title="Voice input"
                        >
                          🎤
                        </button>
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={calculateWeight}
                        disabled={!length}
                        className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                      >
                        Calculate Weight
                      </button>
                      <button
                        onClick={resetCalculation}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Result */}
                    {calculatedWeight !== null && (
                      <div className="p-4 bg-purple-800/30 rounded-lg border border-purple-400/50">
                        <h4 className="text-white font-semibold mb-2">Calculated Weight:</h4>
                        <p className="text-purple-200 text-2xl font-bold">
                          {calculatedWeight.toFixed(3)} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

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

export default SpeciesInfoModal
