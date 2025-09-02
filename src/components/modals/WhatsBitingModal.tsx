import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import CatchSubmissionForm from '../CatchSubmissionForm'

interface CatchReport {
  id: number
  species: string
  quantity: number
  location_name: string
  latitude?: number
  longitude?: number
  date_caught: string
  time_caught?: string
  conditions?: string
  bait_used?: string
  notes?: string
  angler_name: string
  verified: boolean
  distance_km?: number
}

interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

interface WhatsBitingModalProps {
  isOpen: boolean
  onClose: () => void
}

const WhatsBitingModal = ({ isOpen, onClose }: WhatsBitingModalProps) => {
  const [reports, setReports] = useState<CatchReport[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [radius, setRadius] = useState<number>(50) // km
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')

  // South African fishing locations with coordinates
  const saLocations = [
    { name: 'Hermanus', lat: -34.4187, lon: 19.2345 },
    { name: 'Knysna', lat: -34.0351, lon: 23.0465 },
    { name: 'Cape Point', lat: -34.3569, lon: 18.4940 },
    { name: 'Mossel Bay', lat: -34.1833, lon: 22.1333 },
    { name: 'St Francis Bay', lat: -34.1667, lon: 24.8333 },
    { name: 'Port Elizabeth', lat: -33.9608, lon: 25.6022 },
    { name: 'Durban', lat: -29.8587, lon: 31.0218 },
    { name: 'East London', lat: -33.0292, lon: 27.8546 },
    { name: 'Jeffreys Bay', lat: -34.0500, lon: 24.9167 },
    { name: 'Plettenberg Bay', lat: -34.0500, lon: 23.3667 }
  ]

  const species = [
    'all',
    "Albacore / Longfin tuna",
    "Atlantic bonito",
    "Baardman",
    "Banded catshark",
    "Banded galjoen",
    "Barred needlefish",
    "Barred rubberlip",
    "Bartailed flathead",
    "Bigeye kingfish",
    "Bigeye stumpnose",
    "Bigeye thresher",
    "Bigeye tuna",
    "Bigspot rockcod",
    "Biscuit skate",
    "Black marlin",
    "Black musselcracker",
    "Black rubberlip / Harry hotlips",
    "Blackback blaasop",
    "Blackfin reef shark",
    "Blacksaddle goatfish ",
    "Blackspot shark",
    "Blackspotted rubberlip ",
    "Blacktail",
    "Blacktip kingfish",
    "Blacktip shark (Female)",
    "Blacktip shark (Male)",
    "Blacspotted electric ray",
    "Blood snapper",
    "Blotcheye soldier",
    "Bludger",
    "Blue chub",
    "Blue emperor",
    "Blue hottentot",
    "Blue kingfish",
    "Blue shark (Female)",
    "Blue shark (Male)",
    "Blue stingray (Female)",
    "Blue stingray (Male)",
    "Bluebarred parrotfish",
    "Bluefin kingfish",
    "Bluefin tuna",
    "Blueskin",
    "Bluespotted ribbontail ",
    "Bluetail mullet",
    "Bluntnose guitarfish",
    "Bohar / Twinspot snapper",
    "Bonefish",
    "Brassy chub",
    "Brassy kingfish",
    "Bridle triggerfish",
    "Brindle bass",
    "Bronze bream",
    "Brown shyshark",
    "Bull / Zambezi shark (Female)",
    "Bull / Zambezi shark (Male)",
    "Bull ray / Duckbill",
    "Bumpnose kingfish",
    "Cape gurnard",
    "Cape knifejaw",
    "Cape moony",
    "Cape stumpnose",
    "Carpenter / Silverfish",
    "Catface rockcod",
    "Cavebass",
    "Clown triggerfish",
    "Cock grunter",
    "Common / Dusky kob",
    "Concertina fish",
    "Copper / Bronze shark (Female)",
    "Copper / Bronze shark (Male)",
    "Cutlass fish",
    "Cutthroat emperor",
    "Dageraad",
    "Dane",
    "Dark shyshark",
    "Diamond / Butterfly ray",
    "Dorado / Dolphin fish",
    "Double-spotted queenfish",
    "Dusky / Ridgeback Grey shark",
    "Dusky rubberlip",
    "Eagle ray",
    "Eastern little tuna / Kawakawa",
    "Eel catfish",
    "Elephant fish / St Joseph",
    "Elf / Shad",
    "Englishman",
    "Evileye blaasop",
    "Flathead mullet",
    "Fransmadam",
    "Galjoen",
    "Geelbek",
    "Giant guitarfish / Giant sandshark",
    "Giant kingfish",
    "Giant yellowtail",
    "Golden kingfish",
    "Goldsaddle hogfish",
    "Great barracuda",
    "Great hammerheadshark",
    "Great white shark",
    "Greater yellowtail / Amberjack",
    "Green jobfish",
    "Grey chub",
    "Grey grunter",
    "Greyspot guitarfish",
    "Halfmoon rockcod",
    "Hardnosed smooth-houndshark",
    "Honeycomb stingray",
    "Hottentot",
    "Humpback snapper",
    "Indian goatfish",
    "Indian mackerel",
    "Indian mirrorfish",
    "Janbruin / John Brown",
    "Java shark",
    "Javelin grunter",
    "Karanteen / Strepie",
    "King mackerel / Couta",
    "King soldierbream",
    "Klipvis",
    "Ladder wrasse",
    "Largespot pompano",
    "Largetooth flounder",
    "Leervis / Garrick",
    "Lemon shark",
    "Lemonfish",
    "Leopard catshark",
    "Lesser guitarfish / Sandshark",
    "Longfin kingfish",
    "Longfin yellowtail",
    "Mackerel",
    "Malabar kingfish",
    "Malabar rockcod",
    "Marbled electric ray",
    "Marbled hawkfish",
    "Milkfish",
    "Milkshark (Female)",
    "Milkshark (Male)",
    "Minstrel rubberlip",
    "Natal fingerfin",
    "Natal knifejaw",
    "Natal moony",
    "Natal stumpnose",
    "Natal wrasse",
    "Old Woman",
    "Oxeye tarpon",
    "Panga",
    "Patchy triggerfish",
    "Piggy",
    "Porcupinefish",
    "Potato bass",
    "Prodigal Son / Cobia",
    "Puffadder shyshark",
    "Queen mackerel",
    "Rainbow Runner",
    "Red steenbras",
    "Red stumpnose / Miss Lucy",
    "Red tjor-tjor",
    "Redlip rubberlip",
    "Remora",
    "River / Mangrove snapper",
    "River bream / Perch",
    "Roman",
    "Round ribbontail ray",
    "Russell's snapper",
    "Saddle grunter",
    "Sailfish",
    "Sand steenbras",
    "Sandbar shark (Female)",
    "Sandbar shark (Male)",
    "Santer",
    "Scalloped hammerheadshark (Female)",
    "Scalloped hammerheadshark (Male)",
    "Scotsman",
    "Sevengill cowshark",
    "Seventy-four",
    "Shallow-water sole",
    "Sharpnose brown stingray",
    "Shortfin mako shark",
    "Shorttail stingray / Black stingray",
    "Silverstripe blaasop",
    "Skipjack tuna / Oceanic Bonito",
    "Slimy",
    "Slinger",
    "Small kob",
    "Smooth blaasop",
    "Smooth hammerheadshark (Female)",
    "Smooth hammerheadshark (Male)",
    "Smooth houndshark (Female)",
    "Smooth houndshark (Male)",
    "Snapper kob",
    "Snoek",
    "Snubnose pompano",
    "Soupfin shark / Tope",
    "Southern mullet",
    "Southern pompano",
    "Spadefish",
    "Spearnose skate",
    "Speckled snapper",
    "Spineblotch scorpionfish",
    "Spinner shark (Female)",
    "Spinner shark (Male)",
    "Spiny dogfish",
    "Spotted eagle ray",
    "Spotted grunter",
    "Spotted gullyshark",
    "Spotted ragged-tooth shark (Female)",
    "Spotted ragged-tooth shark (Male)",
    "Springer",
    "Squaretail kob",
    "Star blaasop",
    "Steentjie",
    "Stone bream",
    "Streakyspot rockcod",
    "Striped bonito",
    "Striped catshark",
    "Striped grunter",
    "Striped marlin",
    "Striped mullet",
    "Striped threadfin",
    "Surge wrasse",
    "Talang queenfish",
    "Thintail thresher",
    "Thornback skate",
    "Thornfish",
    "Thorntail stingray",
    "Threadfin mirrorfish",
    "Tiger catshark",
    "Tiger shark (Female)",
    "Tiger shark (Male)",
    "Tille kingfish",
    "Torpedo scad",
    "Tripletail",
    "Twobar bream",
    "Twotone fingerfin",
    "Wahoo",
    "Westcoast steenbras",
    "White kingfish",
    "White musselcracker",
    "White seacatfish / Sea barbel",
    "White steenbras",
    "White stumpnose",
    "Whitebarred rubberlip",
    "White-edged rockcod / Captain Fine",
    "Whitespotted blaasop",
    "Whitespotted rabbitfish",
    "Wolfherring",
    "Yellowbelly rockcod",
    "Yellowfin emperor",
    "Yellowfin tuna",
    "Yellowspotted kingfish",
    "Yellowtail rockcod",
    "Zebra"
  ]

  useEffect(() => {
    if (isOpen) {
      requestLocationPermission()
      loadReports()
    }
  }, [isOpen])

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
      setLocationPermission('granted')
    } catch (error) {
      console.log('Location access denied or failed:', error)
      setLocationPermission('denied')
    }
  }

  const loadReports = async () => {
    setIsLoading(true)
    
    try {
      if (supabase) {
        let query = supabase
          .from('catch_reports')
          .select('*')
          .order('date_caught', { ascending: false })
          .limit(50)

        // If we have user location, get nearby reports
        if (userLocation) {
          const { data, error } = await supabase.rpc('get_nearby_reports', {
            user_lat: userLocation.latitude,
            user_lon: userLocation.longitude,
            radius_km: radius
          })
          
          if (error) {
            console.error('Error loading nearby reports:', error)
            // Fallback to regular query
            const { data: fallbackData } = await query
            setReports(fallbackData || [])
          } else {
            setReports(data || [])
          }
        } else {
          // No location, just get recent reports
          const { data, error } = await query
          if (error) {
            console.error('Error loading reports:', error)
            setReports([])
          } else {
            setReports(data || [])
          }
        }
      } else {
        console.log('Supabase not available, using sample data')
        // Fallback sample data
        setReports([
          {
            id: 1,
            species: 'Bronze bream',
            quantity: 3,
            location_name: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date().toISOString(),
            time_caught: '06:30',
            conditions: 'Calm seas, clear water',
            bait_used: 'Prawns',
            notes: 'Caught 3 fish in 2 hours. Good size around 40cm.',
            angler_name: 'Mike',
            verified: true,
            distance_km: 5.2
          }
        ])
      }
    } catch (error) {
      console.error('Error loading reports:', error)
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const locationMatch = selectedLocation === 'all' || report.location_name === selectedLocation
    const speciesMatch = selectedSpecies === 'all' || report.species === selectedSpecies
    return locationMatch && speciesMatch
  })

  const submitCatchReport = async (formData: any) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('catch_reports')
          .insert([{
            species: formData.species,
            quantity: parseInt(formData.quantity),
            location_name: formData.location_name,
            latitude: formData.latitude,
            longitude: formData.longitude,
            time_caught: formData.time_caught,
            conditions: formData.conditions,
            bait_used: formData.bait_used,
            notes: formData.notes,
            angler_name: formData.angler_name,
            angler_contact: formData.angler_contact
          }])
          .select()

        if (error) {
          console.error('Error submitting catch report:', error)
          alert('Failed to submit catch report. Please try again.')
        } else {
          console.log('Catch report submitted successfully:', data)
          alert('🎣 Catch report submitted successfully!')
          setShowSubmitForm(false)
          loadReports() // Reload reports
        }
      } else {
        alert('Database not available. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting catch report:', error)
      alert('Failed to submit catch report. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay pt-2 pb-2">
      <div className="relative w-full max-w-2xl mx-2 h-full">
        <div className="modal-content rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">🎣 What's Biting Where?</h2>
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
              {/* Location Status */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">📍 Location & Filters</h3>
                  {locationPermission === 'granted' && userLocation && (
                    <span className="text-green-400 text-sm">✓ GPS Active</span>
                  )}
                </div>
                
                {locationPermission === 'granted' && userLocation ? (
                  <div className="mb-4 p-3 bg-green-900/30 rounded border border-green-500/30">
                    <p className="text-green-100 text-sm">
                      📍 Showing catches within {radius}km of your location
                    </p>
                    <div className="mt-2">
                      <label className="block text-white text-sm font-semibold mb-1">
                        Search Radius: {radius}km
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : locationPermission === 'denied' ? (
                  <div className="mb-4 p-3 bg-yellow-900/30 rounded border border-yellow-500/30">
                    <p className="text-yellow-100 text-sm">
                      ⚠️ Location access denied. Showing all recent catches.
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                    <p className="text-blue-100 text-sm">
                      🔄 Requesting location access for nearby catches...
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Locations</option>
                      {saLocations.map(location => (
                        <option key={location.name} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Species
                    </label>
                    <select
                      value={selectedSpecies}
                      onChange={(e) => setSelectedSpecies(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      {species.map(species => (
                        <option key={species} value={species}>
                          {species === 'all' ? 'All Species' : species}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Reports */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Recent Catch Reports ({filteredReports.length})
                </h3>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-white">Loading reports...</span>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No reports found for the selected filters.</p>
                    <p className="text-sm mt-2">Try adjusting your filters or check back later!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-gray-800/50 rounded-lg border border-gray-600 p-4 hover:bg-gray-700/50 transition-colors"
                      >
                                                 <div className="flex items-start justify-between mb-3">
                           <div>
                             <h4 className="text-lg font-bold text-orange-400">{report.species}</h4>
                             <p className="text-gray-300 text-sm">{report.location_name}</p>
                             {report.quantity > 1 && (
                               <p className="text-blue-300 text-sm">Caught {report.quantity} fish</p>
                             )}
                           </div>
                           <div className="text-right">
                             <p className="text-white font-semibold">{formatDate(report.date_caught)}</p>
                             {report.time_caught && (
                               <p className="text-gray-400 text-sm">{report.time_caught}</p>
                             )}
                             {report.distance_km && (
                               <p className="text-green-300 text-sm">📍 {report.distance_km.toFixed(1)}km away</p>
                             )}
                             {report.verified && (
                               <span className="inline-block mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                                 ✓ Verified
                               </span>
                             )}
                           </div>
                         </div>
                        
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                           <div>
                             <span className="text-gray-400">Conditions:</span>
                             <span className="text-white ml-2">{report.conditions || 'Not specified'}</span>
                           </div>
                           <div>
                             <span className="text-gray-400">Bait:</span>
                             <span className="text-white ml-2">{report.bait_used || 'Not specified'}</span>
                           </div>
                         </div>
                        
                        {report.notes && (
                          <div className="mt-3 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                            <p className="text-blue-100 text-sm">{report.notes}</p>
                          </div>
                        )}
                        
                                                 <div className="mt-3 flex items-center justify-between">
                           <span className="text-gray-400 text-sm">Reported by: {report.angler_name}</span>
                           <button className="text-blue-400 hover:text-blue-300 text-sm">
                             View Details →
                           </button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Form or Button */}
              {showSubmitForm ? (
                <CatchSubmissionForm
                  onSubmit={submitCatchReport}
                  onCancel={() => setShowSubmitForm(false)}
                  userLocation={userLocation}
                />
              ) : (
                <div className="text-center">
                  <button 
                    onClick={() => setShowSubmitForm(true)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    📝 Submit Your Catch Report
                  </button>
                </div>
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

export default WhatsBitingModal
