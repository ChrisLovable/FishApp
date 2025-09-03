import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'

interface Species {
  'English name': string
  ' Slope ': number
  ' Intercept ': number
}

interface LengthToWeightModalProps {
  isOpen: boolean
  onClose: () => void
}

const LengthToWeightModal = ({ isOpen, onClose }: LengthToWeightModalProps) => {
  const [species, setSpecies] = useState<Species[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null)
  const [length, setLength] = useState('')
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null)


  // Load species data on component mount
  useEffect(() => {
    loadSpeciesData()
  }, [])

  // Clear selected species when search term changes (user is typing new search)
  useEffect(() => {
    if (selectedSpecies && searchTerm !== selectedSpecies['English name']) {
      setSelectedSpecies(null)
    }
  }, [searchTerm, selectedSpecies])

  const loadSpeciesData = async () => {
    try {
      // Try to load from Supabase first
      if (supabase) {
        console.log('🔄 Loading species data from Supabase for Length-to-Weight...')
        const { data: supabaseData, error } = await supabase
          .from('reference_table')
          .select('english_name, slope, intercept')
          .order('english_name')
        
        if (error) {
          console.error('❌ Supabase error:', error)
          // Fallback to local JSON
          await loadLocalSpeciesData()
        } else if (supabaseData && supabaseData.length > 0) {
          console.log(`✅ Loaded ${supabaseData.length} species from Supabase for Length-to-Weight`)
          
          // Check if Supabase data has valid slope/intercept values
          const validDataCount = supabaseData.filter(row => row.slope !== null && row.intercept !== null).length
          console.log(`📊 Valid slope/intercept data count: ${validDataCount} out of ${supabaseData.length}`)
          
          if (validDataCount < 10) {
            console.log('⚠️ Insufficient valid data in Supabase, falling back to local data')
            await loadLocalSpeciesData()
            return
          }
          
          // Convert Supabase data to the expected format
          const convertedData = supabaseData.map((row: any) => ({
            'English name': row.english_name || '',
            ' Slope ': row.slope !== null ? row.slope : 0,
            ' Intercept ': row.intercept !== null ? row.intercept : 0
          }))
          
          // Remove duplicates based on English name
          const uniqueData = convertedData.filter((species, index, self) => 
            index === self.findIndex(s => s['English name'] === species['English name'])
          )
          
          console.log(`✅ Removed ${convertedData.length - uniqueData.length} duplicate species from Length-to-Weight`)
          
          // Final check for any remaining duplicates
          const finalNames = uniqueData.map(s => s['English name'])
          const finalDuplicates = finalNames.filter((name, index) => finalNames.indexOf(name) !== index)
          if (finalDuplicates.length > 0) {
            console.log('🚨 STILL HAVE DUPLICATES AFTER CLEANUP:', finalDuplicates)
          } else {
            console.log('✅ No duplicates remaining after cleanup')
          }
          
          setSpecies(uniqueData)
          console.log('✅ Species data set successfully. First few species:', uniqueData.slice(0, 3))
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
        
        // Remove duplicates based on English name
        const uniqueData = data.filter((species, index, self) => 
          index === self.findIndex(s => s['English name'] === species['English name'])
        )
        
        console.log(`✅ Removed ${data.length - uniqueData.length} duplicate species from local Length-to-Weight data`)
        
        // Final check for any remaining duplicates
        const finalNames = uniqueData.map(s => s['English name'])
        const finalDuplicates = finalNames.filter((name, index) => finalNames.indexOf(name) !== index)
        if (finalDuplicates.length > 0) {
          console.log('🚨 STILL HAVE DUPLICATES AFTER LOCAL CLEANUP:', finalDuplicates)
        } else {
          console.log('✅ No duplicates remaining after local cleanup')
        }
        
        setSpecies(uniqueData)
        console.log('✅ Local species data loaded successfully. Count:', uniqueData.length, 'First few species:', uniqueData.slice(0, 3))
      } else {
        console.warn('Species data file not found')
        // Fallback placeholder data
        setSpecies([
          { 'English name': 'Largemouth Bass', ' Slope ': 3.2, ' Intercept ': -4.5 },
          { 'English name': 'Rainbow Trout', ' Slope ': 3.1, ' Intercept ': -4.7 },
        ])
      }
    } catch (error) {
      console.error('Error loading local species data:', error)
      // Fallback data
      setSpecies([
        { 'English name': 'Largemouth Bass', ' Slope ': 3.2, ' Intercept ': -4.5 },
        { 'English name': 'Rainbow Trout', ' Slope ': 3.1, ' Intercept ': -4.7 },
      ])
    }
  }

  // Filter species based on search term (wildcard search) and remove duplicates
  const filteredSpecies = species
    .filter(fish =>
      fish['English name'].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((fish, index, self) =>
      index === self.findIndex(f => f['English name'] === fish['English name'])
    )

  // Debug: Check for duplicates when searching for "bigeye"
  if (searchTerm.toLowerCase().includes('bigeye')) {
    console.log('🔍 Length-to-Weight: Searching for "bigeye"')
    console.log('🔍 Total species loaded:', species.length)
    console.log('🔍 Filtered species count:', filteredSpecies.length)
    const bigeyeEntries = filteredSpecies.filter(f => f['English name'].toLowerCase().includes('bigeye'))
    console.log('🔍 Bigeye entries found:', bigeyeEntries.length, bigeyeEntries.map(f => f['English name']))
    
    // Check for exact duplicates
    const allNames = species.map(s => s['English name'])
    const duplicateNames = allNames.filter((name, index) => allNames.indexOf(name) !== index)
    if (duplicateNames.length > 0) {
      console.log('🚨 EXACT DUPLICATES FOUND:', duplicateNames)
    } else {
      console.log('✅ No exact duplicates found in species data')
    }
  }



  // Calculate weight using Excel formula: Weight = EXP(Slope + LN(Length) × Intercept)  
  // This matches: =EXP(K + LN(J) × L) where J=Length, K=Slope, L=Intercept
  // Result is in kilograms
  const calculateWeight = () => {
    console.log('🧮 Starting weight calculation...')
    console.log('📊 Selected species:', selectedSpecies)
    console.log('📏 Length input:', length)
    console.log('📋 Available species count:', species.length)
    
    if (selectedSpecies && length) {
      const lengthNum = parseFloat(length)
      console.log('📏 Parsed length:', lengthNum)
      
      if (!isNaN(lengthNum) && lengthNum > 0) {
        try {
          // Excel formula: EXP(K + LN(J) × L) where J=Length, K=Slope, L=Intercept
          // This translates to: EXP(Slope + LN(Length) × Intercept)
          const slope = selectedSpecies[' Slope ']        // K = Slope column
          const intercept = selectedSpecies[' Intercept '] // L = Intercept column
          
          console.log('📊 Calculation values:', {
            species: selectedSpecies['English name'],
            slope: slope,
            intercept: intercept,
            length: lengthNum,
            lnLength: Math.log(lengthNum),
            slopePlusLnLengthTimesIntercept: slope + Math.log(lengthNum) * intercept
          })
          
          const weight = Math.exp(slope + Math.log(lengthNum) * intercept)
          console.log('⚖️ Calculated weight:', weight)
          
          // Check for valid result (IFERROR equivalent)
          if (isFinite(weight) && weight > 0) {
            setCalculatedWeight(weight)
            console.log('✅ Weight calculation successful:', weight, 'kg')
          } else {
            console.error('❌ Invalid calculation result:', weight)
            setCalculatedWeight(null)
          }
        } catch (error) {
          console.error('❌ Calculation error:', error)
          setCalculatedWeight(null)
        }
      } else {
        console.error('❌ Invalid length input:', lengthNum)
        setCalculatedWeight(null)
      }
    } else {
      console.error('❌ Missing species or length:', { selectedSpecies, length })
      setCalculatedWeight(null)
    }
  }

  const resetCalculation = () => {
    setSearchTerm('')
    setSelectedSpecies(null)
    setLength('')
    setCalculatedWeight(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="relative w-full mx-2" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col overflow-y-auto" style={{height: '680px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📏 Length-to-Weight</h2>
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

          <div className="flex-1 space-y-6">
            {/* Species Search */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Select Fish Species
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
              {searchTerm && filteredSpecies.length > 0 && (
                <div className="mt-2 bg-gray-700 rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
                  {filteredSpecies.slice(0, 10).map((fish, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        console.log('🎯 Species selected from dropdown:', fish)
                        setSelectedSpecies(fish)
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
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  step="0.1"
                  min="0"
                />

              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateWeight}
              disabled={!selectedSpecies || !length}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              Calculate Weight
            </button>



            {/* Result */}
            {calculatedWeight !== null && (
              <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/50">
                <h3 className="text-white font-semibold mb-2">Calculated Weight:</h3>
                <p className="text-green-200 text-2xl font-bold">
                  {calculatedWeight.toFixed(3)} kg
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetCalculation}
                className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LengthToWeightModal
