import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import CatchSubmissionForm from '../CatchSubmissionForm'

interface CatchReport {
  id: number
  species: string
  quantity: number
  location_name: string
  spot_name?: string
  nearest_town?: string
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
    { name: 'Kosi Bay & Sodwana Bay', lat: -26.9000, lon: 32.8833 },
    { name: 'St Lucia, Cape Vidal & Mapelane', lat: -28.3833, lon: 32.4167 },
    { name: 'Richards Bay', lat: -28.7833, lon: 32.1000 },
    { name: 'Mtunzini', lat: -28.9500, lon: 31.7500 },
    { name: 'Tugela Mouth', lat: -29.2167, lon: 31.4833 },
    { name: 'Zinkwazi Beach', lat: -29.2833, lon: 31.4500 },
    { name: 'Blythedale Beach', lat: -29.3500, lon: 31.4000 },
    { name: 'Salt Rock', lat: -29.5000, lon: 31.2333 },
    { name: 'Ballito', lat: -29.5333, lon: 31.2167 },
    { name: 'Tongaat Beach & La Mercy', lat: -29.5833, lon: 31.1333 },
    { name: 'Umdloti', lat: -29.6500, lon: 31.1000 },
    { name: 'Umhlanga Rocks', lat: -29.7167, lon: 31.0833 },
    { name: 'Durban', lat: -29.8587, lon: 31.0218 },
    { name: 'Amanzimtoti', lat: -30.0500, lon: 30.8833 },
    { name: 'Kingsburgh', lat: -30.0833, lon: 30.8500 },
    { name: 'Sunlight Beach & Ilfracombe', lat: -30.1167, lon: 30.8167 },
    { name: 'Umkomaas', lat: -30.2000, lon: 30.8000 },
    { name: 'Clansthal', lat: -30.2500, lon: 30.7667 },
    { name: 'Scottburgh', lat: -30.2833, lon: 30.7500 },
    { name: 'Park Rynie', lat: -30.3167, lon: 30.7167 },
    { name: 'Pennington', lat: -30.3500, lon: 30.6833 },
    { name: 'Bazley', lat: -30.3833, lon: 30.6500 },
    { name: 'Mtwalume', lat: -30.4167, lon: 30.6167 },
    { name: 'Hibberdene', lat: -30.4500, lon: 30.5833 },
    { name: 'Pumula', lat: -30.4833, lon: 30.5500 },
    { name: 'Banana Beach', lat: -30.5167, lon: 30.5167 },
    { name: 'Umtentweni', lat: -30.5500, lon: 30.4833 },
    { name: 'Port Shepstone', lat: -30.5833, lon: 30.4500 },
    { name: 'Uvongo', lat: -30.6167, lon: 30.4167 },
    { name: 'Margate', lat: -30.6500, lon: 30.3833 },
    { name: 'Ramsgate', lat: -30.6833, lon: 30.3500 },
    { name: 'Southbroom', lat: -30.7167, lon: 30.3167 },
    { name: 'Palm Beach', lat: -30.7500, lon: 30.2833 },
    { name: 'Glenmore Beach', lat: -30.7833, lon: 30.2500 },
    { name: 'Port Edward', lat: -30.8167, lon: 30.2167 },
    { name: 'Wild Coast Sun Area', lat: -30.8500, lon: 30.1833 },
    { name: 'Mkambati Nature Reserve', lat: -30.8833, lon: 30.1500 },
    { name: 'Port St Johns', lat: -31.6167, lon: 29.5333 },
    { name: 'Brazen Head', lat: -31.6500, lon: 29.5000 },
    { name: 'Umtata Mouth', lat: -31.6833, lon: 29.4667 },
    { name: 'Coffee Bay & Hole in the Wall', lat: -31.7167, lon: 29.4333 },
    { name: 'Mbashe River', lat: -31.7500, lon: 29.4000 },
    { name: 'Qora Mouth', lat: -31.7833, lon: 29.3667 },
    { name: 'Mazeppa', lat: -31.8167, lon: 29.3333 },
    { name: 'Nxaxo Mouth', lat: -31.8500, lon: 29.3000 },
    { name: 'Trennery\'s & Seagulls', lat: -31.8833, lon: 29.2667 },
    { name: 'Kei Mouth & Morgans Bay', lat: -32.6833, lon: 28.3833 },
    { name: 'Haga-Haga', lat: -32.7167, lon: 28.3500 },
    { name: 'Cefane Mouth', lat: -32.7500, lon: 28.3167 },
    { name: 'Cintsa', lat: -32.7833, lon: 28.2833 },
    { name: 'Gonubie', lat: -32.8167, lon: 28.2500 },
    { name: 'East London', lat: -33.0292, lon: 27.8546 },
    { name: 'Kidds Beach', lat: -33.0667, lon: 27.8167 },
    { name: 'Christmas Rock', lat: -33.1000, lon: 27.7833 },
    { name: 'Kaysers Beach', lat: -33.1333, lon: 27.7500 },
    { name: 'Hamburg', lat: -33.1667, lon: 27.7167 },
    { name: 'Begha', lat: -33.2000, lon: 27.6833 },
    { name: 'Fish River mouth', lat: -33.2333, lon: 27.6500 },
    { name: 'Kleinemonde', lat: -33.2667, lon: 27.6167 },
    { name: 'Port Alfred', lat: -33.3000, lon: 27.5833 },
    { name: 'Kasouga', lat: -33.3333, lon: 27.5500 },
    { name: 'Kariega', lat: -33.3667, lon: 27.5167 },
    { name: 'Kenton-on-Sea', lat: -33.4000, lon: 27.4833 },
    { name: 'Bushmans River Mouth', lat: -33.4333, lon: 27.4500 },
    { name: 'Boknes', lat: -33.4667, lon: 27.4167 },
    { name: 'Cannon Rocks', lat: -33.5000, lon: 27.3833 },
    { name: 'Sundays River', lat: -33.5333, lon: 27.3500 },
    { name: 'Swartkops River', lat: -33.5667, lon: 27.3167 },
    { name: 'Port Elizabeth', lat: -33.9608, lon: 25.6022 },
    { name: 'Sea View', lat: -33.9833, lon: 25.5667 },
    { name: 'Van Stadens River', lat: -34.0167, lon: 25.5333 },
    { name: 'Gamtoos River', lat: -34.0500, lon: 25.5000 },
    { name: 'Kabeljous Beach', lat: -34.0833, lon: 25.4667 },
    { name: 'Jeffreys Bay', lat: -34.0500, lon: 24.9167 },
    { name: 'Paradise Beach', lat: -34.0833, lon: 24.8833 },
    { name: 'St Francis', lat: -34.1167, lon: 24.8500 },
    { name: 'Cape St Francis', lat: -34.1500, lon: 24.8167 },
    { name: 'Oyster Bay', lat: -34.1833, lon: 24.7833 },
    { name: 'Tsitsikamma', lat: -34.2167, lon: 24.7500 },
    { name: 'Nature\'s Valley', lat: -34.2500, lon: 24.7167 },
    { name: 'Keurboomstrand', lat: -34.2833, lon: 24.6833 },
    { name: 'Plettenberg Bay', lat: -34.0500, lon: 23.3667 },
    { name: 'Knoetzie', lat: -34.0833, lon: 23.3333 },
    { name: 'Knysna', lat: -34.0351, lon: 23.0465 },
    { name: 'Brenton-on-Sea', lat: -34.0667, lon: 23.0167 },
    { name: 'Buffels Bay', lat: -34.1000, lon: 22.9833 },
    { name: 'Sedgefield', lat: -34.1333, lon: 22.9500 },
    { name: 'Wilderness', lat: -34.1667, lon: 22.9167 },
    { name: 'Victoria Bay', lat: -34.2000, lon: 22.8833 },
    { name: 'Herolds Bay', lat: -34.2333, lon: 22.8500 },
    { name: 'Groot Brak River', lat: -34.2667, lon: 22.8167 },
    { name: 'Tergniet', lat: -34.3000, lon: 22.7833 },
    { name: 'Reebok', lat: -34.3333, lon: 22.7500 },
    { name: 'Klein Brak River', lat: -34.3667, lon: 22.7167 },
    { name: 'Hartenbos', lat: -34.4000, lon: 22.6833 },
    { name: 'Mossel Bay', lat: -34.1833, lon: 22.1333 },
    { name: 'Boggoms Bay', lat: -34.2167, lon: 22.1000 },
    { name: 'Vleesbaai', lat: -34.2500, lon: 22.0667 },
    { name: 'Gourits River Mouth', lat: -34.2833, lon: 22.0333 },
    { name: 'Stilbaai', lat: -34.3167, lon: 22.0000 },
    { name: 'Jongensfontein', lat: -34.3500, lon: 21.9667 },
    { name: 'Witsand', lat: -34.3833, lon: 21.9333 },
    { name: 'Arniston', lat: -34.4167, lon: 21.9000 },
    { name: 'Waenhuiskrans', lat: -34.4500, lon: 21.8667 },
    { name: 'Struisbaai', lat: -34.4833, lon: 21.8333 },
    { name: 'Pearly Beach', lat: -34.5167, lon: 21.8000 },
    { name: 'Gansbaai', lat: -34.5500, lon: 21.7667 },
    { name: 'Hermanus', lat: -34.4187, lon: 19.2345 },
    { name: 'Onrus & Hawston', lat: -34.4500, lon: 19.2000 },
    { name: 'Bettys Bay', lat: -34.4833, lon: 19.1667 },
    { name: 'Pringle Bay', lat: -34.5167, lon: 19.1333 },
    { name: 'Rooi Els', lat: -34.5500, lon: 19.1000 },
    { name: 'Gordons Bay', lat: -34.5833, lon: 19.0667 },
    { name: 'Strand', lat: -34.6167, lon: 19.0333 },
    { name: 'Strandfontein & Muizenberg', lat: -34.6500, lon: 19.0000 },
    { name: 'Fish Hoek', lat: -34.6833, lon: 18.9667 },
    { name: 'Simonstad', lat: -34.7167, lon: 18.9333 },
    { name: 'Kommetjie', lat: -34.7500, lon: 18.9000 },
    { name: 'Hout Bay', lat: -34.7833, lon: 18.8667 },
    { name: 'Camps Bay', lat: -34.8167, lon: 18.8333 },
    { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
    { name: 'Bloubergstrand', lat: -33.8000, lon: 18.4500 },
    { name: 'Yzerfontein', lat: -33.3500, lon: 18.1500 },
    { name: 'Langebaan', lat: -33.1000, lon: 18.0333 },
    { name: 'Saldanha', lat: -33.0167, lon: 17.9500 },
    { name: 'Paternoster', lat: -32.8167, lon: 17.8833 },
    { name: 'Elandsbaai', lat: -32.3167, lon: 18.3167 },
    { name: 'Hondeklipbaai', lat: -30.3167, lon: 17.2833 },
    { name: 'Kleinsee', lat: -29.6667, lon: 17.0833 },
    { name: 'Port Nolloth', lat: -29.2500, lon: 16.8667 }
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
    console.log('🎣 Loading reports in WhatsBitingModal...')
    
    try {
      // FORCE DUMMY DATA FOR NOW - NO SUPABASE
      console.log('🚫 Using dummy data (Supabase disabled)')
      console.log('📊 Loading 20 dummy catch reports...')
      // Dummy data for testing (20 rows)
        const dummyReports: CatchReport[] = [
          {
            id: 1,
            species: 'Common / Dusky kob',
            quantity: 3,
            location_name: 'Cape Town Harbour',
            nearest_town: 'Cape Town',
            latitude: -33.9249,
            longitude: 18.4241,
            date_caught: new Date(Date.now() - 86400000).toISOString(),
            time_caught: '06:30',
            conditions: 'Sunny, light wind',
            bait_used: 'Live mullet',
            notes: 'Great fishing this morning, caught 3 kob between 6-8am',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 2.1
          },
          {
            id: 2,
            species: 'Bronze bream',
            quantity: 5,
            location_name: 'Durban Beachfront',
            nearest_town: 'Durban',
            latitude: -29.8587,
            longitude: 31.0218,
            date_caught: new Date(Date.now() - 172800000).toISOString(),
            time_caught: '14:30',
            conditions: 'Overcast',
            bait_used: 'Prawns',
            notes: 'Good session with the family, multiple bream caught',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 3,
            species: 'Black musselcracker',
            quantity: 1,
            location_name: 'Port Elizabeth',
            nearest_town: 'Port Elizabeth',
            latitude: -33.9608,
            longitude: 25.6022,
            date_caught: new Date(Date.now() - 259200000).toISOString(),
            time_caught: '18:45',
            conditions: 'Windy',
            bait_used: 'Red crab',
            notes: 'Tough fight but worth it, strong fish',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 1.5
          },
          {
            id: 4,
            species: 'Galjoen',
            quantity: 2,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 345600000).toISOString(),
            time_caught: '07:15',
            conditions: 'Clear',
            bait_used: 'White mussel',
            notes: 'Beautiful fish, released after photo',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 5,
            species: 'Roman',
            quantity: 1,
            location_name: 'Knysna Lagoon',
            nearest_town: 'Knysna',
            latitude: -34.0361,
            longitude: 23.0471,
            date_caught: new Date(Date.now() - 432000000).toISOString(),
            time_caught: '15:20',
            conditions: 'Sunny',
            bait_used: 'Prawns',
            notes: 'Surprise catch on light tackle',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.5
          },
          {
            id: 6,
            species: 'Shad',
            quantity: 8,
            location_name: 'Mossel Bay',
            nearest_town: 'Mossel Bay',
            latitude: -34.1817,
            longitude: 22.1460,
            date_caught: new Date(Date.now() - 518400000).toISOString(),
            time_caught: '05:45',
            conditions: 'Calm',
            bait_used: 'Sardine',
            notes: 'Shad running strong, caught 8 in 2 hours',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 1.2
          },
          {
            id: 7,
            species: 'Spotted grunter',
            quantity: 4,
            location_name: 'Jeffreys Bay',
            nearest_town: 'Jeffreys Bay',
            latitude: -34.0489,
            longitude: 24.9111,
            date_caught: new Date(Date.now() - 604800000).toISOString(),
            time_caught: '17:30',
            conditions: 'Light wind',
            bait_used: 'Mud prawn',
            notes: 'Good grunter fishing, multiple fish landed',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.7
          },
          {
            id: 8,
            species: 'White steenbras',
            quantity: 2,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 691200000).toISOString(),
            time_caught: '08:00',
            conditions: 'Overcast',
            bait_used: 'Red crab',
            notes: 'Steenbras feeding well on the outgoing tide',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 2.3
          },
          {
            id: 9,
            species: 'Garrick',
            quantity: 1,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 777600000).toISOString(),
            time_caught: '16:15',
            conditions: 'Sunny',
            bait_used: 'Live mullet',
            notes: 'Garrick hunting in the shallows, exciting sight fishing',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.9
          },
          {
            id: 10,
            species: 'Cape stumpnose',
            quantity: 6,
            location_name: 'Saldanha Bay',
            nearest_town: 'Saldanha',
            latitude: -33.0117,
            longitude: 17.9442,
            date_caught: new Date(Date.now() - 864000000).toISOString(),
            time_caught: '09:30',
            conditions: 'Clear',
            bait_used: 'Prawns',
            notes: 'Stumpnose school feeding actively',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.8
          },
          {
            id: 11,
            species: 'Blacktail',
            quantity: 12,
            location_name: 'Langebaan',
            nearest_town: 'Langebaan',
            latitude: -33.0975,
            longitude: 18.0265,
            date_caught: new Date(Date.now() - 950400000).toISOString(),
            time_caught: '18:00',
            conditions: 'Calm',
            bait_used: 'White mussel',
            notes: 'Blacktail bite was on fire, caught 12 fish',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 12,
            species: 'Zebra',
            quantity: 3,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 1036800000).toISOString(),
            time_caught: '06:00',
            conditions: 'Windy',
            bait_used: 'Red crab',
            notes: 'Zebra feeding on the rocky ledges',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 1.1
          },
          {
            id: 13,
            species: 'Duckbill',
            quantity: 4,
            location_name: 'Stilbaai',
            nearest_town: 'Stilbaai',
            latitude: -34.3677,
            longitude: 21.4189,
            date_caught: new Date(Date.now() - 1123200000).toISOString(),
            time_caught: '14:45',
            conditions: 'Sunny',
            bait_used: 'Prawns',
            notes: 'Duckbill in the surf zone, good action',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.6
          },
          {
            id: 14,
            species: 'Bronze bream',
            quantity: 7,
            location_name: 'Wilderness',
            nearest_town: 'Wilderness',
            latitude: -33.9883,
            longitude: 22.5808,
            date_caught: new Date(Date.now() - 1209600000).toISOString(),
            time_caught: '10:15',
            conditions: 'Overcast',
            bait_used: 'Mud prawn',
            notes: 'Bream feeding well in the lagoon',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 15,
            species: 'King soldierbream',
            quantity: 2,
            location_name: 'Ballito',
            nearest_town: 'Ballito',
            latitude: -29.5392,
            longitude: 31.2136,
            date_caught: new Date(Date.now() - 1296000000).toISOString(),
            time_caught: '17:00',
            conditions: 'Light wind',
            bait_used: 'Sardine',
            notes: 'King soldierbream on the bite, good size fish',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.3
          },
          {
            id: 16,
            species: 'Giant kingfish',
            quantity: 1,
            location_name: 'Richards Bay',
            nearest_town: 'Richards Bay',
            latitude: -28.7830,
            longitude: 32.0378,
            date_caught: new Date(Date.now() - 1382400000).toISOString(),
            time_caught: '05:30',
            conditions: 'Calm',
            bait_used: 'Live mullet',
            notes: 'Giant kingfish hunting, caught one monster',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 2.7
          },
          {
            id: 17,
            species: 'Shad',
            quantity: 15,
            location_name: 'Umhlanga',
            nearest_town: 'Umhlanga',
            latitude: -29.7277,
            longitude: 31.0821,
            date_caught: new Date(Date.now() - 1468800000).toISOString(),
            time_caught: '13:45',
            conditions: 'Sunny',
            bait_used: 'Sardine',
            notes: 'Shad run in full swing, non-stop action',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.2
          },
          {
            id: 18,
            species: 'Spotted grunter',
            quantity: 5,
            location_name: 'Scottburgh',
            nearest_town: 'Scottburgh',
            latitude: -30.2867,
            longitude: 30.7533,
            date_caught: new Date(Date.now() - 1555200000).toISOString(),
            time_caught: '11:30',
            conditions: 'Clear',
            bait_used: 'Mud prawn',
            notes: 'Grunter feeding on the sandbanks',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 1.4
          },
          {
            id: 19,
            species: 'Bronze bream',
            quantity: 9,
            location_name: 'Margate',
            nearest_town: 'Margate',
            latitude: -30.8647,
            longitude: 30.3733,
            date_caught: new Date(Date.now() - 1641600000).toISOString(),
            time_caught: '16:30',
            conditions: 'Overcast',
            bait_used: 'Prawns',
            notes: 'Bream school active in the shallows',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.9
          },
          {
            id: 20,
            species: 'Common / Dusky kob',
            quantity: 3,
            location_name: 'Port Shepstone',
            nearest_town: 'Port Shepstone',
            latitude: -30.7411,
            longitude: 30.4553,
            date_caught: new Date(Date.now() - 1728000000).toISOString(),
            time_caught: '06:15',
            conditions: 'Light wind',
            bait_used: 'Live mullet',
            notes: 'Kob feeding well on the incoming tide',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.6
          },
          // Additional 80 dummy reports to expand coverage
          {
            id: 21,
            species: 'Bronze whaler shark',
            quantity: 1,
            location_name: 'Cape Point',
            nearest_town: 'Cape Town',
            latitude: -34.3571,
            longitude: 18.4900,
            date_caught: new Date(Date.now() - 1814400000).toISOString(),
            time_caught: '19:30',
            conditions: 'Sunset, calm',
            bait_used: 'Tuna head',
            notes: 'Big bronze whaler, fought for 45 minutes',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 45.2
          },
          {
            id: 22,
            species: 'Copper shark',
            quantity: 1,
            location_name: 'Durban Harbour',
            nearest_town: 'Durban',
            latitude: -29.8587,
            longitude: 31.0218,
            date_caught: new Date(Date.now() - 1900800000).toISOString(),
            time_caught: '05:00',
            conditions: 'Dawn, light wind',
            bait_used: 'Live shad',
            notes: 'Copper shark in the harbour, careful release',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.5
          },
          {
            id: 23,
            species: 'Spotted ragged-tooth shark',
            quantity: 1,
            location_name: 'Aliwal Shoal',
            nearest_town: 'Umkomaas',
            latitude: -30.2500,
            longitude: 30.8167,
            date_caught: new Date(Date.now() - 1987200000).toISOString(),
            time_caught: '11:00',
            conditions: 'Clear, moderate swell',
            bait_used: 'Tuna fillet',
            notes: 'Raggie on the shoal, beautiful shark',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 8.3
          },
          {
            id: 24,
            species: 'Smooth-hound shark',
            quantity: 3,
            location_name: 'Stilbaai',
            nearest_town: 'Stilbaai',
            latitude: -34.3677,
            longitude: 21.4189,
            date_caught: new Date(Date.now() - 2073600000).toISOString(),
            time_caught: '16:45',
            conditions: 'Overcast',
            bait_used: 'Sardine',
            notes: 'Smooth-hounds feeding in the bay',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 25,
            species: 'Eagle ray',
            quantity: 1,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 2160000000).toISOString(),
            time_caught: '14:20',
            conditions: 'Sunny, calm',
            bait_used: 'Prawns',
            notes: 'Eagle ray cruising the shallows',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 26,
            species: 'Blue stingray',
            quantity: 2,
            location_name: 'Knysna Lagoon',
            nearest_town: 'Knysna',
            latitude: -34.0361,
            longitude: 23.0471,
            date_caught: new Date(Date.now() - 2246400000).toISOString(),
            time_caught: '09:15',
            conditions: 'Clear, low tide',
            bait_used: 'White mussel',
            notes: 'Blue stingrays in the lagoon',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.2
          },
          {
            id: 27,
            species: 'Black stingray',
            quantity: 1,
            location_name: 'Mossel Bay',
            nearest_town: 'Mossel Bay',
            latitude: -34.1817,
            longitude: 22.1460,
            date_caught: new Date(Date.now() - 2332800000).toISOString(),
            time_caught: '17:30',
            conditions: 'Sunset, calm',
            bait_used: 'Red crab',
            notes: 'Black stingray in the bay',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 1.5
          },
          {
            id: 28,
            species: 'Yellowfin tuna',
            quantity: 2,
            location_name: 'Cape Canyon',
            nearest_town: 'Cape Town',
            latitude: -34.0000,
            longitude: 18.0000,
            date_caught: new Date(Date.now() - 2419200000).toISOString(),
            time_caught: '06:00',
            conditions: 'Clear, offshore',
            bait_used: 'Live bait',
            notes: 'Yellowfin tuna offshore, great fight',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 120.0
          },
          {
            id: 29,
            species: 'Sailfish',
            quantity: 1,
            location_name: 'Richards Bay',
            nearest_town: 'Richards Bay',
            latitude: -28.7806,
            longitude: 32.0381,
            date_caught: new Date(Date.now() - 2505600000).toISOString(),
            time_caught: '08:30',
            conditions: 'Clear, offshore',
            bait_used: 'Live bait',
            notes: 'Sailfish offshore, spectacular fight',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 85.0
          },
          {
            id: 30,
            species: 'Kingfish',
            quantity: 3,
            location_name: 'Port Elizabeth',
            nearest_town: 'Port Elizabeth',
            latitude: -33.9608,
            longitude: 25.6022,
            date_caught: new Date(Date.now() - 2592000000).toISOString(),
            time_caught: '15:45',
            conditions: 'Clear, moderate wind',
            bait_used: 'Live mullet',
            notes: 'Kingfish feeding well, caught 3',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 2.1
          },
          {
            id: 31,
            species: 'White musselcracker',
            quantity: 1,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 2678400000).toISOString(),
            time_caught: '12:00',
            conditions: 'Clear, low tide',
            bait_used: 'Red crab',
            notes: 'White musselcracker on the rocks',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 32,
            species: 'Black musselcracker',
            quantity: 2,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 2764800000).toISOString(),
            time_caught: '16:30',
            conditions: 'Clear, incoming tide',
            bait_used: 'Red crab',
            notes: 'Black musselcrackers feeding',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 1.2
          },
          {
            id: 33,
            species: 'Cape stumpnose',
            quantity: 8,
            location_name: 'Langebaan',
            nearest_town: 'Langebaan',
            latitude: -33.0975,
            longitude: 18.0265,
            date_caught: new Date(Date.now() - 2851200000).toISOString(),
            time_caught: '10:15',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Stumpnose school feeding',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.6
          },
          {
            id: 34,
            species: 'Spotted grunter',
            quantity: 5,
            location_name: 'Jeffreys Bay',
            nearest_town: 'Jeffreys Bay',
            latitude: -34.0489,
            longitude: 24.9111,
            date_caught: new Date(Date.now() - 2937600000).toISOString(),
            time_caught: '18:00',
            conditions: 'Sunset, light wind',
            bait_used: 'Mud prawn',
            notes: 'Grunter feeding in the surf',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 35,
            species: 'White steenbras',
            quantity: 3,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 3024000000).toISOString(),
            time_caught: '07:30',
            conditions: 'Dawn, calm',
            bait_used: 'Red crab',
            notes: 'Steenbras feeding well',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.8
          },
          {
            id: 36,
            species: 'Garrick',
            quantity: 2,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 3110400000).toISOString(),
            time_caught: '17:00',
            conditions: 'Clear, incoming tide',
            bait_used: 'Live mullet',
            notes: 'Garrick hunting in the shallows',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.7
          },
          {
            id: 37,
            species: 'Shad',
            quantity: 15,
            location_name: 'Durban Beachfront',
            nearest_town: 'Durban',
            latitude: -29.8587,
            longitude: 31.0218,
            date_caught: new Date(Date.now() - 3196800000).toISOString(),
            time_caught: '05:30',
            conditions: 'Dawn, calm',
            bait_used: 'Sardine',
            notes: 'Shad running strong, caught 15',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 38,
            species: 'Blacktail',
            quantity: 20,
            location_name: 'Cape Town Harbour',
            nearest_town: 'Cape Town',
            latitude: -33.9249,
            longitude: 18.4241,
            date_caught: new Date(Date.now() - 3283200000).toISOString(),
            time_caught: '19:00',
            conditions: 'Sunset, calm',
            bait_used: 'White mussel',
            notes: 'Blacktail bite was incredible',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.1
          },
          {
            id: 39,
            species: 'Zebra',
            quantity: 4,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 3369600000).toISOString(),
            time_caught: '06:45',
            conditions: 'Dawn, light wind',
            bait_used: 'Red crab',
            notes: 'Zebra feeding on the rocks',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.5
          },
          {
            id: 40,
            species: 'Duckbill',
            quantity: 6,
            location_name: 'Knysna Lagoon',
            nearest_town: 'Knysna',
            latitude: -34.0361,
            longitude: 23.0471,
            date_caught: new Date(Date.now() - 3456000000).toISOString(),
            time_caught: '15:30',
            conditions: 'Clear, low tide',
            bait_used: 'Prawns',
            notes: 'Duckbill in the lagoon',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 41,
            species: 'Galjoen',
            quantity: 3,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 3542400000).toISOString(),
            time_caught: '08:15',
            conditions: 'Clear, incoming tide',
            bait_used: 'White mussel',
            notes: 'Galjoen feeding well',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.9
          },
          {
            id: 42,
            species: 'Roman',
            quantity: 7,
            location_name: 'Mossel Bay',
            nearest_town: 'Mossel Bay',
            latitude: -34.1817,
            longitude: 22.1460,
            date_caught: new Date(Date.now() - 3628800000).toISOString(),
            time_caught: '16:00',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Roman feeding in the bay',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 1.1
          },
          {
            id: 43,
            species: 'Bronze bream',
            quantity: 12,
            location_name: 'Port Elizabeth',
            nearest_town: 'Port Elizabeth',
            latitude: -33.9608,
            longitude: 25.6022,
            date_caught: new Date(Date.now() - 3715200000).toISOString(),
            time_caught: '14:30',
            conditions: 'Clear, light wind',
            bait_used: 'Prawns',
            notes: 'Bream feeding well',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 44,
            species: 'Common / Dusky kob',
            quantity: 2,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 3801600000).toISOString(),
            time_caught: '18:30',
            conditions: 'Sunset, calm',
            bait_used: 'Live mullet',
            notes: 'Kob feeding on the outgoing tide',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 2.5
          },
          {
            id: 45,
            species: 'Spotted ragged-tooth shark',
            quantity: 1,
            location_name: 'Aliwal Shoal',
            nearest_town: 'Umkomaas',
            latitude: -30.2500,
            longitude: 30.8167,
            date_caught: new Date(Date.now() - 3888000000).toISOString(),
            time_caught: '10:00',
            conditions: 'Clear, moderate swell',
            bait_used: 'Tuna fillet',
            notes: 'Another raggie on the shoal',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 8.3
          },
          {
            id: 46,
            species: 'Eagle ray',
            quantity: 2,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 3974400000).toISOString(),
            time_caught: '13:15',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Eagle rays cruising',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 47,
            species: 'Yellowfin tuna',
            quantity: 1,
            location_name: 'Cape Canyon',
            nearest_town: 'Cape Town',
            latitude: -34.0000,
            longitude: 18.0000,
            date_caught: new Date(Date.now() - 4060800000).toISOString(),
            time_caught: '07:30',
            conditions: 'Clear, offshore',
            bait_used: 'Live bait',
            notes: 'Big yellowfin offshore',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 120.0
          },
          {
            id: 48,
            species: 'Kingfish',
            quantity: 4,
            location_name: 'Richards Bay',
            nearest_town: 'Richards Bay',
            latitude: -28.7806,
            longitude: 32.0381,
            date_caught: new Date(Date.now() - 4147200000).toISOString(),
            time_caught: '16:45',
            conditions: 'Clear, moderate wind',
            bait_used: 'Live mullet',
            notes: 'Kingfish feeding well',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 3.2
          },
          {
            id: 49,
            species: 'White musselcracker',
            quantity: 1,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 4233600000).toISOString(),
            time_caught: '11:30',
            conditions: 'Clear, low tide',
            bait_used: 'Red crab',
            notes: 'White musselcracker on the rocks',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.7
          },
          {
            id: 50,
            species: 'Black musselcracker',
            quantity: 3,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 4320000000).toISOString(),
            time_caught: '17:00',
            conditions: 'Clear, incoming tide',
            bait_used: 'Red crab',
            notes: 'Black musselcrackers feeding',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.0
          },
          {
            id: 51,
            species: 'Cape stumpnose',
            quantity: 10,
            location_name: 'Langebaan',
            nearest_town: 'Langebaan',
            latitude: -33.0975,
            longitude: 18.0265,
            date_caught: new Date(Date.now() - 4406400000).toISOString(),
            time_caught: '09:45',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Stumpnose school feeding',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.5
          },
          {
            id: 52,
            species: 'Spotted grunter',
            quantity: 6,
            location_name: 'Jeffreys Bay',
            nearest_town: 'Jeffreys Bay',
            latitude: -34.0489,
            longitude: 24.9111,
            date_caught: new Date(Date.now() - 4492800000).toISOString(),
            time_caught: '19:15',
            conditions: 'Sunset, light wind',
            bait_used: 'Mud prawn',
            notes: 'Grunter feeding in the surf',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 53,
            species: 'White steenbras',
            quantity: 2,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 4579200000).toISOString(),
            time_caught: '08:00',
            conditions: 'Dawn, calm',
            bait_used: 'Red crab',
            notes: 'Steenbras feeding well',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 2.1
          },
          {
            id: 54,
            species: 'Garrick',
            quantity: 1,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 4665600000).toISOString(),
            time_caught: '18:30',
            conditions: 'Clear, incoming tide',
            bait_used: 'Live mullet',
            notes: 'Garrick hunting in the shallows',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.6
          },
          {
            id: 55,
            species: 'Shad',
            quantity: 18,
            location_name: 'Durban Beachfront',
            nearest_town: 'Durban',
            latitude: -29.8587,
            longitude: 31.0218,
            date_caught: new Date(Date.now() - 4752000000).toISOString(),
            time_caught: '06:00',
            conditions: 'Dawn, calm',
            bait_used: 'Sardine',
            notes: 'Shad running strong, caught 18',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.2
          },
          {
            id: 56,
            species: 'Blacktail',
            quantity: 25,
            location_name: 'Cape Town Harbour',
            nearest_town: 'Cape Town',
            latitude: -33.9249,
            longitude: 18.4241,
            date_caught: new Date(Date.now() - 4838400000).toISOString(),
            time_caught: '20:00',
            conditions: 'Sunset, calm',
            bait_used: 'White mussel',
            notes: 'Blacktail bite was incredible',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.1
          },
          {
            id: 57,
            species: 'Zebra',
            quantity: 5,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 4924800000).toISOString(),
            time_caught: '07:00',
            conditions: 'Dawn, light wind',
            bait_used: 'Red crab',
            notes: 'Zebra feeding on the rocks',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 58,
            species: 'Duckbill',
            quantity: 8,
            location_name: 'Knysna Lagoon',
            nearest_town: 'Knysna',
            latitude: -34.0361,
            longitude: 23.0471,
            date_caught: new Date(Date.now() - 5011200000).toISOString(),
            time_caught: '14:45',
            conditions: 'Clear, low tide',
            bait_used: 'Prawns',
            notes: 'Duckbill in the lagoon',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 59,
            species: 'Galjoen',
            quantity: 4,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 5097600000).toISOString(),
            time_caught: '09:00',
            conditions: 'Clear, incoming tide',
            bait_used: 'White mussel',
            notes: 'Galjoen feeding well',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 60,
            species: 'Roman',
            quantity: 9,
            location_name: 'Mossel Bay',
            nearest_town: 'Mossel Bay',
            latitude: -34.1817,
            longitude: 22.1460,
            date_caught: new Date(Date.now() - 5184000000).toISOString(),
            time_caught: '15:30',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Roman feeding in the bay',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 1.0
          },
          {
            id: 61,
            species: 'Bronze bream',
            quantity: 15,
            location_name: 'Port Elizabeth',
            nearest_town: 'Port Elizabeth',
            latitude: -33.9608,
            longitude: 25.6022,
            date_caught: new Date(Date.now() - 5270400000).toISOString(),
            time_caught: '13:00',
            conditions: 'Clear, light wind',
            bait_used: 'Prawns',
            notes: 'Bream feeding well',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.9
          },
          {
            id: 62,
            species: 'Common / Dusky kob',
            quantity: 3,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 5356800000).toISOString(),
            time_caught: '19:00',
            conditions: 'Sunset, calm',
            bait_used: 'Live mullet',
            notes: 'Kob feeding on the outgoing tide',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 2.8
          },
          {
            id: 63,
            species: 'Spotted ragged-tooth shark',
            quantity: 1,
            location_name: 'Aliwal Shoal',
            nearest_town: 'Umkomaas',
            latitude: -30.2500,
            longitude: 30.8167,
            date_caught: new Date(Date.now() - 5443200000).toISOString(),
            time_caught: '11:30',
            conditions: 'Clear, moderate swell',
            bait_used: 'Tuna fillet',
            notes: 'Another raggie on the shoal',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 8.3
          },
          {
            id: 64,
            species: 'Eagle ray',
            quantity: 3,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 5529600000).toISOString(),
            time_caught: '12:45',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Eagle rays cruising',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.5
          },
          {
            id: 65,
            species: 'Yellowfin tuna',
            quantity: 2,
            location_name: 'Cape Canyon',
            nearest_town: 'Cape Town',
            latitude: -34.0000,
            longitude: 18.0000,
            date_caught: new Date(Date.now() - 5616000000).toISOString(),
            time_caught: '08:00',
            conditions: 'Clear, offshore',
            bait_used: 'Live bait',
            notes: 'Yellowfin tuna offshore',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 120.0
          },
          {
            id: 66,
            species: 'Kingfish',
            quantity: 5,
            location_name: 'Richards Bay',
            nearest_town: 'Richards Bay',
            latitude: -28.7806,
            longitude: 32.0381,
            date_caught: new Date(Date.now() - 5702400000).toISOString(),
            time_caught: '17:15',
            conditions: 'Clear, moderate wind',
            bait_used: 'Live mullet',
            notes: 'Kingfish feeding well',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 2.8
          },
          {
            id: 67,
            species: 'White musselcracker',
            quantity: 2,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 5788800000).toISOString(),
            time_caught: '10:30',
            conditions: 'Clear, low tide',
            bait_used: 'Red crab',
            notes: 'White musselcracker on the rocks',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.6
          },
          {
            id: 68,
            species: 'Black musselcracker',
            quantity: 4,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 5875200000).toISOString(),
            time_caught: '16:30',
            conditions: 'Clear, incoming tide',
            bait_used: 'Red crab',
            notes: 'Black musselcrackers feeding',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 1.1
          },
          {
            id: 69,
            species: 'Cape stumpnose',
            quantity: 12,
            location_name: 'Langebaan',
            nearest_town: 'Langebaan',
            latitude: -33.0975,
            longitude: 18.0265,
            date_caught: new Date(Date.now() - 5961600000).toISOString(),
            time_caught: '10:00',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Stumpnose school feeding',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.4
          },
          {
            id: 70,
            species: 'Spotted grunter',
            quantity: 7,
            location_name: 'Jeffreys Bay',
            nearest_town: 'Jeffreys Bay',
            latitude: -34.0489,
            longitude: 24.9111,
            date_caught: new Date(Date.now() - 6048000000).toISOString(),
            time_caught: '18:45',
            conditions: 'Sunset, light wind',
            bait_used: 'Mud prawn',
            notes: 'Grunter feeding in the surf',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.2
          },
          {
            id: 71,
            species: 'White steenbras',
            quantity: 1,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 6134400000).toISOString(),
            time_caught: '07:15',
            conditions: 'Dawn, calm',
            bait_used: 'Red crab',
            notes: 'Steenbras feeding well',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 2.3
          },
          {
            id: 72,
            species: 'Garrick',
            quantity: 2,
            location_name: 'Plettenberg Bay',
            nearest_town: 'Plettenberg Bay',
            latitude: -34.0527,
            longitude: 23.3716,
            date_caught: new Date(Date.now() - 6220800000).toISOString(),
            time_caught: '19:00',
            conditions: 'Clear, incoming tide',
            bait_used: 'Live mullet',
            notes: 'Garrick hunting in the shallows',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.8
          },
          {
            id: 73,
            species: 'Shad',
            quantity: 22,
            location_name: 'Durban Beachfront',
            nearest_town: 'Durban',
            latitude: -29.8587,
            longitude: 31.0218,
            date_caught: new Date(Date.now() - 6307200000).toISOString(),
            time_caught: '05:45',
            conditions: 'Dawn, calm',
            bait_used: 'Sardine',
            notes: 'Shad running strong, caught 22',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.1
          },
          {
            id: 74,
            species: 'Blacktail',
            quantity: 30,
            location_name: 'Cape Town Harbour',
            nearest_town: 'Cape Town',
            latitude: -33.9249,
            longitude: 18.4241,
            date_caught: new Date(Date.now() - 6393600000).toISOString(),
            time_caught: '20:30',
            conditions: 'Sunset, calm',
            bait_used: 'White mussel',
            notes: 'Blacktail bite was incredible',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.1
          },
          {
            id: 75,
            species: 'Zebra',
            quantity: 6,
            location_name: 'Hermanus',
            nearest_town: 'Hermanus',
            latitude: -34.4187,
            longitude: 19.2345,
            date_caught: new Date(Date.now() - 6480000000).toISOString(),
            time_caught: '06:30',
            conditions: 'Dawn, light wind',
            bait_used: 'Red crab',
            notes: 'Zebra feeding on the rocks',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 0.3
          },
          {
            id: 76,
            species: 'Duckbill',
            quantity: 10,
            location_name: 'Knysna Lagoon',
            nearest_town: 'Knysna',
            latitude: -34.0361,
            longitude: 23.0471,
            date_caught: new Date(Date.now() - 6566400000).toISOString(),
            time_caught: '13:15',
            conditions: 'Clear, low tide',
            bait_used: 'Prawns',
            notes: 'Duckbill in the lagoon',
            angler_name: 'Mike Johnson',
            verified: true,
            distance_km: 0.2
          },
          {
            id: 77,
            species: 'Galjoen',
            quantity: 5,
            location_name: 'Gansbaai',
            nearest_town: 'Gansbaai',
            latitude: -34.5804,
            longitude: 19.3516,
            date_caught: new Date(Date.now() - 6652800000).toISOString(),
            time_caught: '08:45',
            conditions: 'Clear, incoming tide',
            bait_used: 'White mussel',
            notes: 'Galjoen feeding well',
            angler_name: 'Sarah Wilson',
            verified: true,
            distance_km: 0.7
          },
          {
            id: 78,
            species: 'Roman',
            quantity: 11,
            location_name: 'Mossel Bay',
            nearest_town: 'Mossel Bay',
            latitude: -34.1817,
            longitude: 22.1460,
            date_caught: new Date(Date.now() - 6739200000).toISOString(),
            time_caught: '14:00',
            conditions: 'Clear, calm',
            bait_used: 'Prawns',
            notes: 'Roman feeding in the bay',
            angler_name: 'David Brown',
            verified: true,
            distance_km: 0.9
          },
          {
            id: 79,
            species: 'Bronze bream',
            quantity: 18,
            location_name: 'Port Elizabeth',
            nearest_town: 'Port Elizabeth',
            latitude: -33.9608,
            longitude: 25.6022,
            date_caught: new Date(Date.now() - 6825600000).toISOString(),
            time_caught: '12:30',
            conditions: 'Clear, light wind',
            bait_used: 'Prawns',
            notes: 'Bream feeding well',
            angler_name: 'Lisa Davis',
            verified: true,
            distance_km: 0.7
          },
          {
            id: 80,
            species: 'Common / Dusky kob',
            quantity: 4,
            location_name: 'East London',
            nearest_town: 'East London',
            latitude: -33.0153,
            longitude: 27.9116,
            date_caught: new Date(Date.now() - 6912000000).toISOString(),
            time_caught: '18:00',
            conditions: 'Sunset, calm',
            bait_used: 'Live mullet',
            notes: 'Kob feeding on the outgoing tide',
            angler_name: 'John Smith',
            verified: true,
            distance_km: 3.1
          }
        ]
        console.log('✅ Loaded dummy reports:', dummyReports.length, 'reports')
        setReports(dummyReports)
    } catch (error) {
      console.error('Error loading reports:', error)
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique towns from the reports for the dropdown
  const availableTowns = Array.from(new Set(reports.map(report => report.nearest_town).filter(Boolean))).sort()

  const filteredReports = reports.filter(report => {
    const locationMatch = selectedLocation === 'all' || report.nearest_town === selectedLocation
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
            spot_name: formData.spot_name,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '700px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col overflow-y-auto" style={{height: '700px'}}>
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
                      Nearest Town
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Towns</option>
                      {availableTowns.map(town => (
                        <option key={town} value={town}>
                          {town}
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
                             {report.spot_name && (
                               <p className="text-blue-300 text-sm">📍 {report.spot_name}</p>
                             )}
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
                        
                                                 <div className="mt-3">
                           <span className="text-gray-400 text-sm">Reported by: {report.angler_name}</span>
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

export default WhatsBitingModal
