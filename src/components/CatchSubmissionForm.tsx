import { useState, useEffect, useRef } from 'react'

interface CatchSubmissionFormProps {
  onSubmit: (formData: any) => void
  onCancel: () => void
  userLocation?: { latitude: number; longitude: number } | null
}

const CatchSubmissionForm = ({ onSubmit, onCancel, userLocation }: CatchSubmissionFormProps) => {
  const [formData, setFormData] = useState({
    species: '',
    quantity: '1',
    location_name: '',
    spot_name: '',
    latitude: userLocation?.latitude || '',
    longitude: userLocation?.longitude || '',
    time_caught: new Date().toTimeString().slice(0, 5),
    conditions: '',
    bait_used: '',
    notes: '',
    angler_name: '',
    angler_contact: ''
  })
  const [useCurrentLocation, setUseCurrentLocation] = useState(!!userLocation)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [speciesSearchTerm, setSpeciesSearchTerm] = useState('')
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const species = [
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
  const saLocations = [
    'Kosi Bay & Sodwana Bay',
    'St Lucia, Cape Vidal & Mapelane',
    'Richards Bay',
    'Mtunzini',
    'Tugela Mouth',
    'Zinkwazi Beach',
    'Blythedale Beach',
    'Salt Rock',
    'Ballito',
    'Tongaat Beach & La Mercy',
    'Umdloti',
    'Umhlanga Rocks',
    'Durban',
    'Amanzimtoti',
    'Kingsburgh',
    'Sunlight Beach & Ilfracombe',
    'Umkomaas',
    'Clansthal',
    'Scottburgh',
    'Park Rynie',
    'Pennington',
    'Bazley',
    'Mtwalume',
    'Hibberdene',
    'Pumula',
    'Banana Beach',
    'Umtentweni',
    'Port Shepstone',
    'Uvongo',
    'Margate',
    'Ramsgate',
    'Southbroom',
    'Palm Beach',
    'Glenmore Beach',
    'Port Edward',
    'Wild Coast Sun Area',
    'Mkambati Nature Reserve',
    'Port St Johns',
    'Brazen Head',
    'Umtata Mouth',
    'Coffee Bay & Hole in the Wall',
    'Mbashe River',
    'Qora Mouth',
    'Mazeppa',
    'Nxaxo Mouth',
    'Trennery\'s & Seagulls',
    'Kei Mouth & Morgans Bay',
    'Haga-Haga',
    'Cefane Mouth',
    'Cintsa',
    'Gonubie',
    'East London',
    'Kidds Beach',
    'Christmas Rock',
    'Kaysers Beach',
    'Hamburg',
    'Begha',
    'Fish River mouth',
    'Kleinemonde',
    'Port Alfred',
    'Kasouga',
    'Kariega',
    'Kenton-on-Sea',
    'Bushmans River Mouth',
    'Boknes',
    'Cannon Rocks',
    'Sundays River',
    'Swartkops River',
    'Port Elizabeth',
    'Sea View',
    'Van Stadens River',
    'Gamtoos River',
    'Kabeljous Beach',
    'Jeffreys Bay',
    'Paradise Beach',
    'St Francis',
    'Cape St Francis',
    'Oyster Bay',
    'Tsitsikamma',
    'Nature\'s Valley',
    'Keurboomstrand',
    'Plettenberg Bay',
    'Knoetzie',
    'Knysna',
    'Brenton-on-Sea',
    'Buffels Bay',
    'Sedgefield',
    'Wilderness',
    'Victoria Bay',
    'Herolds Bay',
    'Groot Brak River',
    'Tergniet',
    'Reebok',
    'Klein Brak River',
    'Hartenbos',
    'Mossel Bay',
    'Boggoms Bay',
    'Vleesbaai',
    'Gourits River Mouth',
    'Stilbaai',
    'Jongensfontein',
    'Witsand',
    'Arniston',
    'Waenhuiskrans',
    'Struisbaai',
    'Pearly Beach',
    'Gansbaai',
    'Hermanus',
    'Onrus & Hawston',
    'Bettys Bay',
    'Pringle Bay',
    'Rooi Els',
    'Gordons Bay',
    'Strand',
    'Strandfontein & Muizenberg',
    'Fish Hoek',
    'Simonstad',
    'Kommetjie',
    'Hout Bay',
    'Camps Bay',
    'Cape Town',
    'Bloubergstrand',
    'Yzerfontein',
    'Langebaan',
    'Saldanha',
    'Paternoster',
    'Elandsbaai',
    'Hondeklipbaai',
    'Kleinsee',
    'Port Nolloth'
  ]

  // Filter species based on search term
  const filteredSpecies = species.filter(speciesName =>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpeciesSelect = (selectedSpecies: string) => {
    setFormData(prev => ({ ...prev, species: selectedSpecies }))
    setSpeciesSearchTerm(selectedSpecies)
    setShowSpeciesDropdown(false)
  }

  const handleSpeciesSearchChange = (value: string) => {
    setSpeciesSearchTerm(value)
    setShowSpeciesDropdown(true)
    if (value === '') {
      setFormData(prev => ({ ...prev, species: '' }))
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }))
        setUseCurrentLocation(true)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please check your browser permissions.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-6">
      <h3 className="text-xl font-bold text-white mb-4">🎣 Submit Your Catch Report</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Species */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-white text-sm font-semibold mb-2">
              Species Caught *
            </label>
            <div className="relative">
              <input
                type="text"
                value={speciesSearchTerm}
                onChange={(e) => handleSpeciesSearchChange(e.target.value)}
                onFocus={() => setShowSpeciesDropdown(true)}
                placeholder="Type to search species..."
                required
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              {formData.species && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, species: '' }))
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
                      onClick={() => handleSpeciesSelect(speciesName)}
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

          {/* Quantity */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Number Caught *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              required
              min="1"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nearest Town */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Nearest Town *
            </label>
            <select
              value={formData.location_name}
              onChange={(e) => handleInputChange('location_name', e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select nearest town...</option>
              {saLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Spot Name */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Spot Name
            </label>
            <input
              type="text"
              value={formData.spot_name}
              onChange={(e) => handleInputChange('spot_name', e.target.value)}
              placeholder="e.g., Grotto Beach, Die Plaat"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Time Caught
            </label>
            <input
              type="time"
              value={formData.time_caught}
              onChange={(e) => handleInputChange('time_caught', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Geolocation */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Exact Location
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                {isGettingLocation ? 'Getting...' : '📍 Get GPS'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseCurrentLocation(false)
                  setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conditions */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Weather Conditions
            </label>
            <input
              type="text"
              value={formData.conditions}
              onChange={(e) => handleInputChange('conditions', e.target.value)}
              placeholder="e.g., Calm seas, clear water"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Bait */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Bait Used
            </label>
            <input
              type="text"
              value={formData.bait_used}
              onChange={(e) => handleInputChange('bait_used', e.target.value)}
              placeholder="e.g., Prawns, Live bait"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Share any tips, details about the catch, or fishing conditions..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Angler Name */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.angler_name}
              onChange={(e) => handleInputChange('angler_name', e.target.value)}
              required
              placeholder="How should we credit you?"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Contact (Optional)
            </label>
            <input
              type="text"
              value={formData.angler_contact}
              onChange={(e) => handleInputChange('angler_contact', e.target.value)}
              placeholder="WhatsApp, email, or social media"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* GPS Info */}
        {useCurrentLocation && formData.latitude && formData.longitude && (
          <div className="bg-blue-900/30 rounded border border-blue-500/30 p-3">
            <p className="text-blue-100 text-sm">
              📍 GPS Location captured: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
            </p>
            {formData.spot_name && (
              <p className="text-blue-200 text-sm mt-1">
                🏖️ Spot: {formData.spot_name}
              </p>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            🎣 Submit Catch Report
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CatchSubmissionForm
