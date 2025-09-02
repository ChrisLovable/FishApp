import { useState, useEffect } from 'react'
import { getFishImageUrl, getDistributionMapUrl, supabase } from '../../config/supabase'

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
          
          // Load local data to get slope/intercept values
          const localData = await loadLocalSpeciesDataForSlopeIntercept()
          console.log('🔍 Local data loaded:', localData.length, 'species')
          const localSpeciesMap = new Map()
          localData.forEach((species: any) => {
            localSpeciesMap.set(species['English name'], species)
          })
          console.log('🔍 Local species map size:', localSpeciesMap.size)
          
          // Convert Supabase data to the expected format
          const convertedData = supabaseData.map((row: any) => {
            const localSpecies = localSpeciesMap.get(row.english_name)
            return {
              'English name': row.english_name || '',
              'Afrikaans name': row.afrikaans_name || '',
              'Scientific name': row.scientific_name || '',
              'Image': row.photo_name || '',
              'Distribution Map': row.distribution_map || '',
              ' Slope ': localSpecies?.[' Slope '] || (row.slope ? parseFloat(row.slope) : null),
              ' Intercept ': localSpecies?.[' Intercept '] || (row.intercept ? parseFloat(row.intercept) : null),
              'Description': row.notes || '',
              'Distribution': row.distribution || '',
              regulations: {
                sizeLimit: row.size_limit || '',
                bagLimit: row.bag_limit || '',
                closedSeason: row.closed_season || ''
              },
              detailedDescription: row.notes || ''
            }
          })
          
          // Remove duplicates based on English name
          const uniqueData = convertedData.filter((species, index, self) => 
            index === self.findIndex(s => s['English name'] === species['English name'])
          )
          
          console.log(`✅ Removed ${convertedData.length - uniqueData.length} duplicate species`)
          console.log('🔍 Checking for Bigeye kingfish duplicates:')
          const bigeyeEntries = uniqueData.filter(s => s['English name'] === 'Bigeye kingfish')
          console.log('Bigeye kingfish entries:', bigeyeEntries.length, bigeyeEntries)
          setSpeciesData(uniqueData)
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

  const loadLocalSpeciesDataForSlopeIntercept = async () => {
    try {
      const response = await fetch('/speciesData.json')
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.warn('Species data file not found')
        return []
      }
    } catch (error) {
      console.error('Error loading local species data:', error)
      return []
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
        
        // Remove duplicates based on English name
        const uniqueData = enhancedData.filter((species, index, self) => 
          index === self.findIndex(s => s['English name'] === species['English name'])
        )
        
        console.log(`✅ Removed ${enhancedData.length - uniqueData.length} duplicate species from local data`)
        setSpeciesData(uniqueData)
      } else {
        console.warn('Species data file not found')
        setSpeciesData([])
      }
    } catch (error) {
      console.error('Error loading local species data:', error)
      setSpeciesData([])
    }
  }

  // Filter species based on search term and remove any remaining duplicates
  const filteredSpecies = speciesData
    .filter(fish =>
      fish['English name'].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((fish, index, self) => 
      index === self.findIndex(f => f['English name'] === fish['English name'])
    )

  // Debug: Check for duplicates in filtered results
  if (searchTerm.toLowerCase().includes('bigeye')) {
    console.log('🔍 Filtered species for "bigeye":', filteredSpecies.filter(f => f['English name'].toLowerCase().includes('bigeye')))
  }



  // Calculate weight using the same formula as Length-to-Weight modal
  const calculateWeight = () => {
    console.log('🎣 === WEIGHT CALCULATION DEBUG ===')
    console.log('📏 Length input:', length)
    console.log('🐟 Current species:', currentSpecies?.['English name'])
    console.log('🐟 Full species data:', currentSpecies)
    
    if (!currentSpecies) {
      console.log('❌ No current species selected')
      return
    }
    
    if (!length || length.trim() === '') {
      console.log('❌ No length provided')
      return
    }
    
    const lengthNum = parseFloat(length)
    console.log('📐 Parsed length:', lengthNum)
    
    if (isNaN(lengthNum) || lengthNum <= 0) {
      console.log('❌ Invalid length:', lengthNum)
      return
    }
    
    const slope = currentSpecies[' Slope ']
    const intercept = currentSpecies[' Intercept ']
    console.log('📊 Raw slope:', slope, 'Raw intercept:', intercept)
    console.log('📊 Slope type:', typeof slope, 'Intercept type:', typeof intercept)
    
    if (slope === undefined || intercept === undefined) {
      console.log('❌ Missing slope or intercept data')
      console.log('🔍 Available keys:', Object.keys(currentSpecies))
      return
    }
    
    if (typeof slope !== 'number' || typeof intercept !== 'number') {
      console.log('❌ Slope or intercept not numbers:', { slope, intercept })
      return
    }
    
    if (isNaN(slope) || isNaN(intercept)) {
      console.log('❌ Slope or intercept are NaN:', { slope, intercept })
      return
    }
    
    try {
      // Use the same formula as Length-to-Weight modal: EXP(Slope + LN(Length) × Intercept)
      console.log('🧮 Calculating: Math.exp(' + slope + ' + Math.log(' + lengthNum + ') * ' + intercept + ')')
      const logLength = Math.log(lengthNum)
      console.log('🧮 Math.log(' + lengthNum + ') =', logLength)
      const exponent = slope + logLength * intercept
      console.log('🧮 Exponent =', exponent)
      const weight = Math.exp(exponent)
      console.log('⚖️ Final weight =', weight)
      
      if (isFinite(weight) && weight > 0) {
        setCalculatedWeight(weight)
        console.log('✅ Weight calculation successful!')
      } else {
        console.log('❌ Invalid weight result:', weight)
        setCalculatedWeight(null)
      }
    } catch (error) {
      console.error('❌ Calculation error:', error)
      setCalculatedWeight(null)
    }
  }

  const resetCalculation = () => {
    setLength('')
    setCalculatedWeight(null)
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
             <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '700px'}}>
         <div className="modal-content rounded-2xl p-6 flex flex-col" style={{height: '700px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">🐠 Species Information</h2>
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
                    placeholder="Type fish name..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />

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
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {/* Fish Image */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Fish Image</h3>
                    <div className="flex justify-center">
                      <img
                        src={getFishImageUrl(currentSpecies['Image'] || '', currentSpecies['English name'])}
                        alt={currentSpecies['English name']}
                        className="w-full max-h-48 rounded-lg object-cover"
                        onError={(e) => {
                          // Fallback to roman.jpg if the specific image fails
                          (e.target as HTMLImageElement).src = '/images/fish/roman.jpg'
                        }}
                      />
                    </div>
                  </div>

                  {/* Distribution Map */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Distribution Map</h3>
                    <div className="flex justify-center">
                      <img
                        src={getDistributionMapUrl('')}
                        alt={`${currentSpecies['English name']} distribution`}
                        className="w-full max-h-48 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
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
                          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                          step="0.1"
                          min="0"
                        />

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
