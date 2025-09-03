import { useState, useEffect } from 'react'

interface TideData {
  time: string
  height: number
  type: 'high' | 'low'
}

interface MoonPhase {
  phase: string
  illumination: number
  date: string
  moonrise?: string
  moonset?: string
  sunrise?: string
  sunset?: string
}

interface WeatherData {
  temp_c: number
  condition: string
  wind_kph: number
  wind_dir: string
  humidity: number
  feelslike_c: number
  uv: number
  icon: string
}

interface LocationData {
  name: string
  coordinates: { lat: number; lng: number }
  region: string
}

interface TideAndMoonModalProps {
  isOpen: boolean
  onClose: () => void
}

const TideAndMoonModal = ({ isOpen, onClose }: TideAndMoonModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [tideData, setTideData] = useState<TideData[]>([])
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  // South African coastal locations (alphabetically sorted) - 36 towns covering full coastline
  const coastalLocations: LocationData[] = [
    { name: 'Alexander Bay', coordinates: { lat: -28.5833, lng: 16.4833 }, region: 'Northern Cape' },
    { name: 'Arniston', coordinates: { lat: -34.6690, lng: 20.2470 }, region: 'Western Cape' },
    { name: 'Ballito', coordinates: { lat: -29.5392, lng: 31.2136 }, region: 'KwaZulu-Natal' },
    { name: 'Bettys Bay', coordinates: { lat: -34.3667, lng: 18.9167 }, region: 'Western Cape' },
    { name: 'Bloubergstrand', coordinates: { lat: -33.8000, lng: 18.4667 }, region: 'Western Cape' },
    { name: 'Cape Town', coordinates: { lat: -33.9249, lng: 18.4241 }, region: 'Western Cape' },
    { name: 'Coffee Bay', coordinates: { lat: -31.9833, lng: 29.1333 }, region: 'Eastern Cape' },
    { name: 'Durban', coordinates: { lat: -29.8587, lng: 31.0218 }, region: 'KwaZulu-Natal' },
    { name: 'East London', coordinates: { lat: -33.0153, lng: 27.9116 }, region: 'Eastern Cape' },
    { name: 'Fish Hoek', coordinates: { lat: -34.1333, lng: 18.4333 }, region: 'Western Cape' },
    { name: 'Gansbaai', coordinates: { lat: -34.5804, lng: 19.3516 }, region: 'Western Cape' },
    { name: 'Gordon\'s Bay', coordinates: { lat: -34.1667, lng: 18.8667 }, region: 'Western Cape' },
    { name: 'Hermanus', coordinates: { lat: -34.4187, lng: 19.2345 }, region: 'Western Cape' },
    { name: 'Jeffreys Bay', coordinates: { lat: -34.0489, lng: 24.9111 }, region: 'Eastern Cape' },
    { name: 'Kenton-on-Sea', coordinates: { lat: -33.6890, lng: 26.6830 }, region: 'Eastern Cape' },
    { name: 'Knysna', coordinates: { lat: -34.0361, lng: 23.0471 }, region: 'Western Cape' },
    { name: 'Kommetjie', coordinates: { lat: -34.1333, lng: 18.3167 }, region: 'Western Cape' },
    { name: 'Langebaan', coordinates: { lat: -33.0975, lng: 18.0265 }, region: 'Western Cape' },
    { name: 'Margate', coordinates: { lat: -30.8647, lng: 30.3733 }, region: 'KwaZulu-Natal' },
    { name: 'Melkbosstrand', coordinates: { lat: -33.7167, lng: 18.4333 }, region: 'Western Cape' },
    { name: 'Mossel Bay', coordinates: { lat: -34.1817, lng: 22.1460 }, region: 'Western Cape' },
    { name: 'Muizenberg', coordinates: { lat: -34.1167, lng: 18.4667 }, region: 'Western Cape' },
    { name: 'Noordhoek', coordinates: { lat: -34.1167, lng: 18.3500 }, region: 'Western Cape' },
    { name: 'Plettenberg Bay', coordinates: { lat: -34.0527, lng: 23.3716 }, region: 'Western Cape' },
    { name: 'Port Alfred', coordinates: { lat: -33.5906, lng: 26.8910 }, region: 'Eastern Cape' },
    { name: 'Port Elizabeth', coordinates: { lat: -33.9608, lng: 25.6022 }, region: 'Eastern Cape' },
    { name: 'Port Shepstone', coordinates: { lat: -30.7411, lng: 30.4553 }, region: 'KwaZulu-Natal' },
    { name: 'Port St Johns', coordinates: { lat: -31.6394, lng: 29.5450 }, region: 'Eastern Cape' },
    { name: 'Richards Bay', coordinates: { lat: -28.7830, lng: 32.0378 }, region: 'KwaZulu-Natal' },
    { name: 'Saldanha Bay', coordinates: { lat: -33.0117, lng: 17.9442 }, region: 'Western Cape' },
    { name: 'Scottburgh', coordinates: { lat: -30.2867, lng: 30.7533 }, region: 'KwaZulu-Natal' },
    { name: 'Simon\'s Town', coordinates: { lat: -34.1833, lng: 18.4333 }, region: 'Western Cape' },
    { name: 'St Lucia', coordinates: { lat: -28.3833, lng: 32.4167 }, region: 'KwaZulu-Natal' },
    { name: 'Stilbaai', coordinates: { lat: -34.3677, lng: 21.4189 }, region: 'Western Cape' },
    { name: 'Strand', coordinates: { lat: -34.1167, lng: 18.8333 }, region: 'Western Cape' },
    { name: 'Umhlanga', coordinates: { lat: -29.7277, lng: 31.0821 }, region: 'KwaZulu-Natal' },
    { name: 'Velddrif', coordinates: { lat: -32.7833, lng: 18.1667 }, region: 'Western Cape' },
    { name: 'Wilderness', coordinates: { lat: -33.9883, lng: 22.5808 }, region: 'Western Cape' },
  ]





  // Fetch tide data from WorldTides API
  const fetchTideData = async (location: LocationData, date: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // WorldTides API with your API key
      const API_KEY = import.meta.env.VITE_WORLDTIDES_API_KEY as string
      if (!API_KEY) {
        throw new Error('WorldTides API key not found. Please add VITE_WORLDTIDES_API_KEY to your .env file.')
      }
      const dateObj = new Date(date)
      const start = Math.floor(dateObj.getTime() / 1000)
      // const end = start + (24 * 60 * 60) // 24 hours later - unused
      
      const response = await fetch(
        `https://www.worldtides.info/api/v3?extremes&lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&start=${start}&length=86400&key=${API_KEY}`
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.extremes) {
          // Parse WorldTides API response
          const tides: TideData[] = data.extremes.map((extreme: any) => ({
            time: new Date(extreme.dt * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            height: parseFloat(extreme.height.toFixed(1)),
            type: extreme.type === 'High' ? 'high' as const : 'low' as const
          }))
          
          setTideData(tides)
        } else {
          throw new Error('No tide data available for this location')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch tide data')
      }
    } catch (err) {
      console.error('Error fetching tide data:', err)
      setError(`Unable to fetch tide data: ${err instanceof Error ? err.message : 'Network error'}`)
      
      // Generate sample tide data as fallback
      const mockTides: TideData[] = [
        { time: '06:15', height: 1.8, type: 'high' },
        { time: '12:30', height: 0.4, type: 'low' },
        { time: '18:45', height: 1.6, type: 'high' },
        { time: '00:20', height: 0.6, type: 'low' },
      ]
      setTideData(mockTides)
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather data from WeatherAPI
  const fetchWeatherData = async (location: LocationData) => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY as string
      if (!API_KEY) {
        throw new Error('WeatherAPI key not found. Please add VITE_WEATHERAPI_KEY to your .env file.')
      }
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location.coordinates.lat},${location.coordinates.lng}&aqi=no`
      )

      if (response.ok) {
        const data = await response.json()
        const current = data.current
        
        return {
          temp_c: current.temp_c,
          condition: current.condition.text,
          wind_kph: current.wind_kph,
          wind_dir: current.wind_dir,
          humidity: current.humidity,
          feelslike_c: current.feelslike_c,
          uv: current.uv,
          icon: current.condition.icon
        }
      } else {
        throw new Error('Failed to fetch weather data')
      }
    } catch (error) {
      console.error('WeatherAPI error:', error)
      return null
    }
  }

  // Fetch moon phase and weather data from WeatherAPI
  const fetchMoonPhaseFromAPI = async (location: LocationData, date: string) => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY as string
      if (!API_KEY) {
        throw new Error('WeatherAPI key not found. Please add VITE_WEATHERAPI_KEY to your .env file.')
      }
      const response = await fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${location.coordinates.lat},${location.coordinates.lng}&dt=${date}`
      )

      if (response.ok) {
        const data = await response.json()
        const astronomy = data.astronomy.astro
        
        return {
          phase: astronomy.moon_phase,
          illumination: parseInt(astronomy.moon_illumination) || 0,
          date: date,
          moonrise: astronomy.moonrise,
          moonset: astronomy.moonset,
          sunrise: astronomy.sunrise,
          sunset: astronomy.sunset
        }
      } else {
        throw new Error('Failed to fetch moon data from WeatherAPI')
      }
    } catch (error) {
      console.error('WeatherAPI error:', error)
      // Fallback to offline calculation
      return calculateMoonPhaseOffline(new Date(date))
    }
  }

  // Offline moon phase calculation (fallback)
  const calculateMoonPhaseOffline = (date: Date): MoonPhase => {
    // Simple moon phase calculation
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    // Julian day calculation
    let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + 
             Math.floor(275 * month / 9) + day + 1721013.5
    
    // Days since new moon reference
    const daysSinceNew = (jd - 2451549.5) % 29.53058867
    
    // Calculate phase
    const phase = daysSinceNew / 29.53058867
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2
    
    let phaseName = ''
    if (phase < 0.0625) phaseName = 'New Moon'
    else if (phase < 0.1875) phaseName = 'Waxing Crescent'
    else if (phase < 0.3125) phaseName = 'First Quarter'
    else if (phase < 0.4375) phaseName = 'Waxing Gibbous'
    else if (phase < 0.5625) phaseName = 'Full Moon'
    else if (phase < 0.6875) phaseName = 'Waning Gibbous'
    else if (phase < 0.8125) phaseName = 'Last Quarter'
    else phaseName = 'Waning Crescent'
    
    return {
      phase: phaseName,
      illumination: Math.round(illumination * 100),
      date: date.toISOString().split('T')[0]
    }
  }

  // Load data when location or date changes
  useEffect(() => {
    const loadData = async () => {
      if (selectedLocation) {
        fetchTideData(selectedLocation, selectedDate)
        
        // Fetch weather data
        try {
          const weather = await fetchWeatherData(selectedLocation)
          setWeatherData(weather)
        } catch (error) {
          console.log('Weather data not available')
          setWeatherData(null)
        }
        
        // Fetch moon phase data from WeatherAPI
        try {
          const moonData = await fetchMoonPhaseFromAPI(selectedLocation, selectedDate)
          console.log('Moon data received:', moonData)
          setMoonPhase(moonData)
        } catch (error) {
          console.log('Using offline moon calculation')
          // Fallback to offline calculation
          const date = new Date(selectedDate)
          setMoonPhase(calculateMoonPhaseOffline(date))
        }
      } else {
        // If no location selected, use offline calculation
        const date = new Date(selectedDate)
        setMoonPhase(calculateMoonPhaseOffline(date))
      }
    }
    
    loadData()
  }, [selectedLocation, selectedDate])

  // Get moon phase emoji
  const getMoonEmoji = (phase: string) => {
    if (!phase) return '🌙'
    
    // Handle WeatherAPI phase names and our offline calculation names
    const lowerPhase = phase.toLowerCase()
    if (lowerPhase.includes('new')) return '🌑'
    if (lowerPhase.includes('waxing crescent')) return '🌒'
    if (lowerPhase.includes('first quarter')) return '🌓'
    if (lowerPhase.includes('waxing gibbous')) return '🌔'
    if (lowerPhase.includes('full')) return '🌕'
    if (lowerPhase.includes('waning gibbous')) return '🌖'
    if (lowerPhase.includes('last quarter') || lowerPhase.includes('third quarter')) return '🌗'
    if (lowerPhase.includes('waning crescent')) return '🌘'
    
    return '🌙' // Default fallback
  }

  // Get weather emoji based on condition
  const getWeatherEmoji = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return '☀️'
    if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) return '☁️'
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️'
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return '⛈️'
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️'
    if (lowerCondition.includes('wind')) return '💨'
    return '🌤️'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl p-2 flex flex-col overflow-y-auto" style={{height: '680px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-white">🌊 Tide, Moon & Weather</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-2 pr-1">
            {!selectedLocation ? (
              /* Location Selection */
              <div>
                <h3 className="text-base font-semibold text-white mb-2">Select a Coastal Location</h3>
                
                {/* Location Grid - 3 columns */}
                <div className="grid grid-cols-3 gap-1">
                  {coastalLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLocation(location)}
                      className="p-1 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600 text-left transition-colors h-11 flex flex-col justify-center"
                    >
                      <div className="text-white font-semibold text-sm truncate">{location.name}</div>
                      <div className="text-blue-300 text-xs truncate">{location.region}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Tide, Moon and Weather Data */
              <>
                {/* Location and Date Header */}
                <div className="flex items-center justify-between bg-blue-900/30 rounded-lg border border-blue-500/50 p-2">
                  <div>
                    <h3 className="text-base font-semibold text-white">{selectedLocation.name}</h3>
                    <p className="text-blue-200 text-xs">{selectedLocation.region}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLocation(null)
                      setSearchTerm('')
                      setTideData([])
                      setError(null)
                      setWeatherData(null)
                    }}
                    className="text-blue-300 hover:text-white text-xs"
                  >
                    ← Change
                  </button>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-white text-xs font-semibold mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-2 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Tide Information */}
                  <div className="bg-cyan-900/30 rounded-lg border border-cyan-500/50 p-2">
                    <h4 className="text-xs font-bold text-white mb-1">Tides</h4>
                    
                    {loading && (
                      <div className="text-center py-1">
                        <div className="text-cyan-300 text-xs">Loading...</div>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-1 mb-1">
                        <div className="text-red-200 text-xs">{error}</div>
                      </div>
                    )}

                    {tideData.length > 0 && (
                      <div className="space-y-1">
                        {tideData.map((tide, index) => (
                          <div key={index} className="flex items-center justify-between p-1 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{tide.type === 'high' ? '⬆️' : '⬇️'}</span>
                              <div>
                                <div className="text-white font-semibold text-xs">{tide.time}</div>
                                <div className="text-cyan-300 text-xs capitalize">{tide.type}</div>
                              </div>
                            </div>
                            <div className="text-cyan-200 font-bold text-xs">{tide.height}m</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Moon Phase Information */}
                  <div className="bg-purple-900/30 rounded-lg border border-purple-500/50 p-2">
                    <h4 className="text-xs font-bold text-white mb-1">Moon</h4>
                    
                    {!moonPhase && (
                      <div className="text-center py-1">
                        <div className="text-purple-300 text-xs">Loading...</div>
                      </div>
                    )}
                    
                    {moonPhase && (
                      <div>
                        {/* Moon Phase Display */}
                        <div className="text-center mb-2">
                          <div className="text-2xl mb-1">{getMoonEmoji(moonPhase.phase)}</div>
                          <div className="text-xs font-semibold text-white mb-1">{moonPhase.phase}</div>
                          <div className="text-purple-200 text-xs mb-1">{moonPhase.illumination}%</div>
                          
                          {/* Moon Phase Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
                            <div 
                              className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${moonPhase.illumination}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Moon Times */}
                        {moonPhase.moonrise && (
                          <div className="text-center p-1 bg-purple-800/30 rounded">
                            <div className="text-sm mb-1">🌙↗️</div>
                            <div className="text-xs text-purple-300">Moonrise</div>
                            <div className="text-white font-semibold text-xs">{moonPhase.moonrise}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Weather Information */}
                <div className="bg-green-900/30 rounded-lg border border-green-500/50 p-2">
                  <h4 className="text-xs font-bold text-white mb-1">Current Weather</h4>
                  
                  {!weatherData && (
                    <div className="text-center py-1">
                      <div className="text-green-300 text-xs">Loading weather...</div>
                    </div>
                  )}
                  
                  {weatherData && (
                    <div>
                      {/* Current Weather */}
                      <div className="text-center mb-2">
                        <div className="text-3xl mb-1">{getWeatherEmoji(weatherData.condition)}</div>
                        <div className="text-lg font-bold text-white mb-1">{weatherData.temp_c}°C</div>
                        <div className="text-green-200 text-xs mb-1">Feels {weatherData.feelslike_c}°C</div>
                        <div className="text-green-300 text-xs">{weatherData.condition}</div>
                      </div>

                      {/* Sunrise and Sunset */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {moonPhase?.sunrise && (
                          <div className="flex justify-between items-center p-1 bg-yellow-800/30 rounded">
                            <span className="text-xs text-yellow-300">Sunrise</span>
                            <span className="text-white font-semibold text-xs">{moonPhase.sunrise}</span>
                          </div>
                        )}
                        {moonPhase?.sunset && (
                          <div className="flex justify-between items-center p-1 bg-orange-800/30 rounded">
                            <span className="text-xs text-orange-300">Sunset</span>
                            <span className="text-white font-semibold text-xs">{moonPhase.sunset}</span>
                          </div>
                        )}
                      </div>

                      {/* Weather Details */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center p-1 bg-green-800/30 rounded">
                          <span className="text-xs text-green-300">Wind</span>
                          <span className="text-white font-semibold text-xs">{weatherData.wind_kph} km/h</span>
                        </div>
                        <div className="flex justify-between items-center p-1 bg-green-800/30 rounded">
                          <span className="text-xs text-green-300">Humidity</span>
                          <span className="text-white font-semibold text-xs">{weatherData.humidity}%</span>
                        </div>
                        <div className="flex justify-between items-center p-1 bg-green-800/30 rounded">
                          <span className="text-xs text-green-300">UV Index</span>
                          <span className="text-white font-semibold text-xs">{weatherData.uv}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Return Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm h-12"
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

export default TideAndMoonModal
