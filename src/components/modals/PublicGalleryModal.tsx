import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'

interface CatchData {
  id: number
  angler_name: string
  species: string
  date_caught: string
  location: string
  bait_used: string
  length_cm?: number
  weight_kg?: number
  weather_conditions?: string
  tide_state?: string
  moon_phase?: string
  notes: string
  image_url: string
  user_id: string
  created_at: string
}

interface PublicGalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

const PublicGalleryModal = ({ isOpen, onClose }: PublicGalleryModalProps) => {
  const [catches, setCatches] = useState<CatchData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [formData, setFormData] = useState({
    anglerName: '',
    species: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    bait: '',
    length: '',
    weight: '',
    weather: '',
    tide: '',
    moonPhase: '',
    notes: ''
  })

  // Load catches from Supabase on component mount
  useEffect(() => {
    if (isOpen) {
      loadCatches()
    }
  }, [isOpen])

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

  // Load catches from Supabase
  const loadCatches = async () => {
    // FORCE DUMMY DATA FOR NOW - NO SUPABASE
    console.log('🚫 Using dummy data for Public Gallery (Supabase disabled)')
    console.log('📊 Loading 5 dummy catch records...')
    // Use dummy data when Supabase is not configured
      const dummyCatches: CatchData[] = [
        {
          id: 1,
          angler_name: 'Mike Johnson',
          species: 'Common / Dusky kob',
          date_caught: '2024-01-15',
          location: 'Cape Town Harbour',
          bait_used: 'Live mullet',
          length_cm: 85,
          weight_kg: 12.5,
          weather_conditions: 'Sunny, light wind',
          tide_state: 'High Tide',
          moon_phase: 'Waxing Gibbous',
          notes: 'Caught this beauty early morning on live bait. Fought hard for about 15 minutes. Great eating fish!',
          image_url: '/images/fish/common-kob.jpg',
          user_id: 'dummy_user_1',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          angler_name: 'Sarah Wilson',
          species: 'Bronze bream',
          date_caught: '2024-01-14',
          location: 'Durban Beachfront',
          bait_used: 'Prawns',
          length_cm: 45,
          weight_kg: 2.8,
          weather_conditions: 'Overcast',
          tide_state: 'Rising',
          moon_phase: 'First Quarter',
          notes: 'Great session with the family. Kids were so excited to see this fish!',
          image_url: '/images/fish/bronze-bream.jpg',
          user_id: 'dummy_user_2',
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 3,
          angler_name: 'David Brown',
          species: 'Black musselcracker',
          date_caught: '2024-01-13',
          location: 'Port Elizabeth',
          bait_used: 'Red crab',
          length_cm: 65,
          weight_kg: 8.2,
          weather_conditions: 'Windy',
          tide_state: 'Low Tide',
          moon_phase: 'Waxing Crescent',
          notes: 'Tough fight from this strong fish. Used 30lb braid and it still took some time to land.',
          image_url: '/images/fish/black-musselcracker.jpg',
          user_id: 'dummy_user_3',
          created_at: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: 4,
          angler_name: 'Lisa Davis',
          species: 'Galjoen',
          date_caught: '2024-01-12',
          location: 'Hermanus',
          bait_used: 'White mussel',
          length_cm: 38,
          weight_kg: 1.5,
          weather_conditions: 'Clear',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Beautiful fish with amazing colors. Released after taking a quick photo.',
          image_url: '/images/fish/galjoen.jpg',
          user_id: 'dummy_user_4',
          created_at: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: 5,
          angler_name: 'John Smith',
          species: 'Roman',
          date_caught: '2024-01-11',
          location: 'Knysna Lagoon',
          bait_used: 'Prawns',
          length_cm: 42,
          weight_kg: 2.1,
          weather_conditions: 'Sunny',
          tide_state: 'High Tide',
          moon_phase: 'Waning Crescent',
          notes: 'Caught this on light tackle while fishing for smaller species. Great surprise!',
          image_url: '/images/fish/roman.jpg',
          user_id: 'dummy_user_5',
          created_at: new Date(Date.now() - 432000000).toISOString()
        },
        // Additional 50 dummy catches to expand coverage
        {
          id: 6,
          angler_name: 'Mike Johnson',
          species: 'Shad',
          date_caught: '2024-01-10',
          location: 'Mossel Bay',
          bait_used: 'Sardine',
          length_cm: 35,
          weight_kg: 1.2,
          weather_conditions: 'Calm',
          tide_state: 'Rising',
          moon_phase: 'Full Moon',
          notes: 'Shad running strong, caught 8 in 2 hours. Great fun on light tackle.',
          image_url: '/images/fish/shad.jpg',
          user_id: 'dummy_user_6',
          created_at: new Date(Date.now() - 518400000).toISOString()
        },
        {
          id: 7,
          angler_name: 'Sarah Wilson',
          species: 'Spotted grunter',
          date_caught: '2024-01-09',
          location: 'Jeffreys Bay',
          bait_used: 'Mud prawn',
          length_cm: 48,
          weight_kg: 3.5,
          weather_conditions: 'Light wind',
          tide_state: 'Falling',
          moon_phase: 'Last Quarter',
          notes: 'Good grunter fishing, multiple fish landed. Used 15lb line.',
          image_url: '/images/fish/spotted-grunter.jpg',
          user_id: 'dummy_user_7',
          created_at: new Date(Date.now() - 604800000).toISOString()
        },
        {
          id: 8,
          angler_name: 'David Brown',
          species: 'White steenbras',
          date_caught: '2024-01-08',
          location: 'East London',
          bait_used: 'Red crab',
          length_cm: 72,
          weight_kg: 12.8,
          weather_conditions: 'Overcast',
          tide_state: 'Low Tide',
          moon_phase: 'Waning Gibbous',
          notes: 'Steenbras feeding well on the outgoing tide. Strong fish!',
          image_url: '/images/fish/white-steenbras.jpg',
          user_id: 'dummy_user_8',
          created_at: new Date(Date.now() - 691200000).toISOString()
        },
        {
          id: 9,
          angler_name: 'Lisa Davis',
          species: 'Garrick',
          date_caught: '2024-01-07',
          location: 'Plettenberg Bay',
          bait_used: 'Live mullet',
          length_cm: 85,
          weight_kg: 18.5,
          weather_conditions: 'Sunny',
          tide_state: 'Rising',
          moon_phase: 'First Quarter',
          notes: 'Garrick hunting in the shallows, exciting sight fishing.',
          image_url: '/images/fish/garrick.jpg',
          user_id: 'dummy_user_9',
          created_at: new Date(Date.now() - 777600000).toISOString()
        },
        {
          id: 10,
          angler_name: 'John Smith',
          species: 'Cape stumpnose',
          date_caught: '2024-01-06',
          location: 'Saldanha Bay',
          bait_used: 'Prawns',
          length_cm: 38,
          weight_kg: 1.8,
          weather_conditions: 'Clear',
          tide_state: 'High Tide',
          moon_phase: 'New Moon',
          notes: 'Stumpnose school feeding actively. Caught 6 in one session.',
          image_url: '/images/fish/cape-stumpnose.jpg',
          user_id: 'dummy_user_10',
          created_at: new Date(Date.now() - 864000000).toISOString()
        },
        {
          id: 11,
          angler_name: 'Mike Johnson',
          species: 'Blacktail',
          date_caught: '2024-01-05',
          location: 'Langebaan',
          bait_used: 'White mussel',
          length_cm: 32,
          weight_kg: 0.9,
          weather_conditions: 'Calm',
          tide_state: 'Falling',
          moon_phase: 'Waning Crescent',
          notes: 'Blacktail bite was on fire, caught 12 fish. Great for the kids.',
          image_url: '/images/fish/blacktail.jpg',
          user_id: 'dummy_user_11',
          created_at: new Date(Date.now() - 950400000).toISOString()
        },
        {
          id: 12,
          angler_name: 'Sarah Wilson',
          species: 'Zebra',
          date_caught: '2024-01-04',
          location: 'Gansbaai',
          bait_used: 'Red crab',
          length_cm: 45,
          weight_kg: 2.3,
          weather_conditions: 'Windy',
          tide_state: 'Rising',
          moon_phase: 'Full Moon',
          notes: 'Zebra feeding on the rocky ledges. Beautiful fish.',
          image_url: '/images/fish/zebra.jpg',
          user_id: 'dummy_user_12',
          created_at: new Date(Date.now() - 1036800000).toISOString()
        },
        {
          id: 13,
          angler_name: 'David Brown',
          species: 'Duckbill',
          date_caught: '2024-01-03',
          location: 'Stilbaai',
          bait_used: 'Prawns',
          length_cm: 52,
          weight_kg: 3.1,
          weather_conditions: 'Sunny',
          tide_state: 'High Tide',
          moon_phase: 'Last Quarter',
          notes: 'Duckbill in the surf zone, good action. Used 20lb braid.',
          image_url: '/images/fish/duckbill.jpg',
          user_id: 'dummy_user_13',
          created_at: new Date(Date.now() - 1123200000).toISOString()
        },
        {
          id: 14,
          angler_name: 'Lisa Davis',
          species: 'Bronze bream',
          date_caught: '2024-01-02',
          location: 'Wilderness',
          bait_used: 'Mud prawn',
          length_cm: 41,
          weight_kg: 2.7,
          weather_conditions: 'Overcast',
          tide_state: 'Falling',
          moon_phase: 'Waning Gibbous',
          notes: 'Bream feeding well in the lagoon. Caught 7 fish.',
          image_url: '/images/fish/bronze-bream.jpg',
          user_id: 'dummy_user_14',
          created_at: new Date(Date.now() - 1209600000).toISOString()
        },
        {
          id: 15,
          angler_name: 'John Smith',
          species: 'King soldierbream',
          date_caught: '2024-01-01',
          location: 'Ballito',
          bait_used: 'Sardine',
          length_cm: 58,
          weight_kg: 4.2,
          weather_conditions: 'Light wind',
          tide_state: 'Rising',
          moon_phase: 'First Quarter',
          notes: 'King soldierbream on the bite, good size fish.',
          image_url: '/images/fish/king-soldierbream.jpg',
          user_id: 'dummy_user_15',
          created_at: new Date(Date.now() - 1296000000).toISOString()
        },
        {
          id: 16,
          angler_name: 'Mike Johnson',
          species: 'Giant kingfish',
          date_caught: '2023-12-31',
          location: 'Richards Bay',
          bait_used: 'Live mullet',
          length_cm: 120,
          weight_kg: 45.8,
          weather_conditions: 'Calm',
          tide_state: 'High Tide',
          moon_phase: 'New Moon',
          notes: 'Giant kingfish hunting, caught one monster. Fought for 2 hours!',
          image_url: '/images/fish/giant-kingfish.jpg',
          user_id: 'dummy_user_16',
          created_at: new Date(Date.now() - 1382400000).toISOString()
        },
        {
          id: 17,
          angler_name: 'Sarah Wilson',
          species: 'Shad',
          date_caught: '2023-12-30',
          location: 'Umhlanga',
          bait_used: 'Sardine',
          length_cm: 38,
          weight_kg: 1.4,
          weather_conditions: 'Sunny',
          tide_state: 'Falling',
          moon_phase: 'Waning Crescent',
          notes: 'Shad run in full swing, non-stop action. Caught 15 fish.',
          image_url: '/images/fish/shad.jpg',
          user_id: 'dummy_user_17',
          created_at: new Date(Date.now() - 1468800000).toISOString()
        },
        {
          id: 18,
          angler_name: 'David Brown',
          species: 'Spotted grunter',
          date_caught: '2023-12-29',
          location: 'Scottburgh',
          bait_used: 'Mud prawn',
          length_cm: 51,
          weight_kg: 3.8,
          weather_conditions: 'Clear',
          tide_state: 'Rising',
          moon_phase: 'Full Moon',
          notes: 'Grunter feeding on the sandbanks. Used 12lb line.',
          image_url: '/images/fish/spotted-grunter.jpg',
          user_id: 'dummy_user_18',
          created_at: new Date(Date.now() - 1555200000).toISOString()
        },
        {
          id: 19,
          angler_name: 'Lisa Davis',
          species: 'Bronze bream',
          date_caught: '2023-12-28',
          location: 'Margate',
          bait_used: 'Prawns',
          length_cm: 44,
          weight_kg: 2.9,
          weather_conditions: 'Overcast',
          tide_state: 'Low Tide',
          moon_phase: 'Last Quarter',
          notes: 'Bream school active in the shallows. Great family fishing.',
          image_url: '/images/fish/bronze-bream.jpg',
          user_id: 'dummy_user_19',
          created_at: new Date(Date.now() - 1641600000).toISOString()
        },
        {
          id: 20,
          angler_name: 'John Smith',
          species: 'Common / Dusky kob',
          date_caught: '2023-12-27',
          location: 'Port Shepstone',
          bait_used: 'Live mullet',
          length_cm: 78,
          weight_kg: 15.3,
          weather_conditions: 'Light wind',
          tide_state: 'Rising',
          moon_phase: 'Waning Gibbous',
          notes: 'Kob feeding well on the incoming tide. Strong fish.',
          image_url: '/images/fish/kob.jpg',
          user_id: 'dummy_user_20',
          created_at: new Date(Date.now() - 1728000000).toISOString()
        },
        {
          id: 21,
          angler_name: 'Mike Johnson',
          species: 'Bronze whaler shark',
          date_caught: '2023-12-26',
          location: 'Cape Point',
          bait_used: 'Tuna head',
          length_cm: 280,
          weight_kg: 180.5,
          weather_conditions: 'Sunset, calm',
          tide_state: 'High Tide',
          moon_phase: 'First Quarter',
          notes: 'Big bronze whaler, fought for 45 minutes. Released safely.',
          image_url: '/images/fish/bronze-whaler.jpg',
          user_id: 'dummy_user_21',
          created_at: new Date(Date.now() - 1814400000).toISOString()
        },
        {
          id: 22,
          angler_name: 'Sarah Wilson',
          species: 'Copper shark',
          date_caught: '2023-12-25',
          location: 'Durban Harbour',
          bait_used: 'Live shad',
          length_cm: 220,
          weight_kg: 95.2,
          weather_conditions: 'Dawn, light wind',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Copper shark in the harbour, careful release.',
          image_url: '/images/fish/copper-shark.jpg',
          user_id: 'dummy_user_22',
          created_at: new Date(Date.now() - 1900800000).toISOString()
        },
        {
          id: 23,
          angler_name: 'David Brown',
          species: 'Spotted ragged-tooth shark',
          date_caught: '2023-12-24',
          location: 'Aliwal Shoal',
          bait_used: 'Tuna fillet',
          length_cm: 320,
          weight_kg: 220.8,
          weather_conditions: 'Clear, moderate swell',
          tide_state: 'Rising',
          moon_phase: 'Waning Crescent',
          notes: 'Raggie on the shoal, beautiful shark. Released.',
          image_url: '/images/fish/raggie.jpg',
          user_id: 'dummy_user_23',
          created_at: new Date(Date.now() - 1987200000).toISOString()
        },
        {
          id: 24,
          angler_name: 'Lisa Davis',
          species: 'Smooth-hound shark',
          date_caught: '2023-12-23',
          location: 'Stilbaai',
          bait_used: 'Sardine',
          length_cm: 95,
          weight_kg: 12.5,
          weather_conditions: 'Overcast',
          tide_state: 'Low Tide',
          moon_phase: 'Full Moon',
          notes: 'Smooth-hounds feeding in the bay. Caught 3.',
          image_url: '/images/fish/smooth-hound.jpg',
          user_id: 'dummy_user_24',
          created_at: new Date(Date.now() - 2073600000).toISOString()
        },
        {
          id: 25,
          angler_name: 'John Smith',
          species: 'Eagle ray',
          date_caught: '2023-12-22',
          location: 'Plettenberg Bay',
          bait_used: 'Prawns',
          length_cm: 180,
          weight_kg: 35.2,
          weather_conditions: 'Sunny, calm',
          tide_state: 'High Tide',
          moon_phase: 'Last Quarter',
          notes: 'Eagle ray cruising the shallows. Amazing sight.',
          image_url: '/images/fish/eagle-ray.jpg',
          user_id: 'dummy_user_25',
          created_at: new Date(Date.now() - 2160000000).toISOString()
        },
        {
          id: 26,
          angler_name: 'Mike Johnson',
          species: 'Blue stingray',
          date_caught: '2023-12-21',
          location: 'Knysna Lagoon',
          bait_used: 'White mussel',
          length_cm: 85,
          weight_kg: 8.7,
          weather_conditions: 'Clear, low tide',
          tide_state: 'Falling',
          moon_phase: 'Waning Gibbous',
          notes: 'Blue stingrays in the lagoon. Caught 2.',
          image_url: '/images/fish/blue-stingray.jpg',
          user_id: 'dummy_user_26',
          created_at: new Date(Date.now() - 2246400000).toISOString()
        },
        {
          id: 27,
          angler_name: 'Sarah Wilson',
          species: 'Black stingray',
          date_caught: '2023-12-20',
          location: 'Mossel Bay',
          bait_used: 'Red crab',
          length_cm: 120,
          weight_kg: 18.3,
          weather_conditions: 'Sunset, calm',
          tide_state: 'Rising',
          moon_phase: 'First Quarter',
          notes: 'Black stingray in the bay. Strong fish.',
          image_url: '/images/fish/black-stingray.jpg',
          user_id: 'dummy_user_27',
          created_at: new Date(Date.now() - 2332800000).toISOString()
        },
        {
          id: 28,
          angler_name: 'David Brown',
          species: 'Yellowfin tuna',
          date_caught: '2023-12-19',
          location: 'Cape Canyon',
          bait_used: 'Live bait',
          length_cm: 150,
          weight_kg: 85.6,
          weather_conditions: 'Clear, offshore',
          tide_state: 'High Tide',
          moon_phase: 'New Moon',
          notes: 'Yellowfin tuna offshore, great fight. 2 hour battle.',
          image_url: '/images/fish/yellowfin-tuna.jpg',
          user_id: 'dummy_user_28',
          created_at: new Date(Date.now() - 2419200000).toISOString()
        },
        {
          id: 29,
          angler_name: 'Lisa Davis',
          species: 'Sailfish',
          date_caught: '2023-12-18',
          location: 'Richards Bay',
          bait_used: 'Live bait',
          length_cm: 280,
          weight_kg: 95.8,
          weather_conditions: 'Clear, offshore',
          tide_state: 'Falling',
          moon_phase: 'Waning Crescent',
          notes: 'Sailfish offshore, spectacular fight. Released.',
          image_url: '/images/fish/sailfish.jpg',
          user_id: 'dummy_user_29',
          created_at: new Date(Date.now() - 2505600000).toISOString()
        },
        {
          id: 30,
          angler_name: 'John Smith',
          species: 'Kingfish',
          date_caught: '2023-12-17',
          location: 'Port Elizabeth',
          bait_used: 'Live mullet',
          length_cm: 95,
          weight_kg: 22.4,
          weather_conditions: 'Clear, moderate wind',
          tide_state: 'Rising',
          moon_phase: 'Full Moon',
          notes: 'Kingfish feeding well, caught 3. Great sport fishing.',
          image_url: '/images/fish/kingfish.jpg',
          user_id: 'dummy_user_30',
          created_at: new Date(Date.now() - 2592000000).toISOString()
        },
        {
          id: 31,
          angler_name: 'Mike Johnson',
          species: 'White musselcracker',
          date_caught: '2023-12-16',
          location: 'Hermanus',
          bait_used: 'Red crab',
          length_cm: 88,
          weight_kg: 25.6,
          weather_conditions: 'Clear, low tide',
          tide_state: 'Low Tide',
          moon_phase: 'Last Quarter',
          notes: 'White musselcracker on the rocks. Strong fish.',
          image_url: '/images/fish/white-musselcracker.jpg',
          user_id: 'dummy_user_31',
          created_at: new Date(Date.now() - 2678400000).toISOString()
        },
        {
          id: 32,
          angler_name: 'Sarah Wilson',
          species: 'Black musselcracker',
          date_caught: '2023-12-15',
          location: 'Gansbaai',
          bait_used: 'Red crab',
          length_cm: 92,
          weight_kg: 28.9,
          weather_conditions: 'Clear, incoming tide',
          tide_state: 'Rising',
          moon_phase: 'Waning Gibbous',
          notes: 'Black musselcrackers feeding. Caught 2.',
          image_url: '/images/fish/black-musselcracker.jpg',
          user_id: 'dummy_user_32',
          created_at: new Date(Date.now() - 2764800000).toISOString()
        },
        {
          id: 33,
          angler_name: 'David Brown',
          species: 'Cape stumpnose',
          date_caught: '2023-12-14',
          location: 'Langebaan',
          bait_used: 'Prawns',
          length_cm: 42,
          weight_kg: 2.1,
          weather_conditions: 'Clear, calm',
          tide_state: 'High Tide',
          moon_phase: 'First Quarter',
          notes: 'Stumpnose school feeding. Caught 8 fish.',
          image_url: '/images/fish/cape-stumpnose.jpg',
          user_id: 'dummy_user_33',
          created_at: new Date(Date.now() - 2851200000).toISOString()
        },
        {
          id: 34,
          angler_name: 'Lisa Davis',
          species: 'Spotted grunter',
          date_caught: '2023-12-13',
          location: 'Jeffreys Bay',
          bait_used: 'Mud prawn',
          length_cm: 55,
          weight_kg: 4.8,
          weather_conditions: 'Sunset, light wind',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Grunter feeding in the surf. Great action.',
          image_url: '/images/fish/spotted-grunter.jpg',
          user_id: 'dummy_user_34',
          created_at: new Date(Date.now() - 2937600000).toISOString()
        },
        {
          id: 35,
          angler_name: 'John Smith',
          species: 'White steenbras',
          date_caught: '2023-12-12',
          location: 'East London',
          bait_used: 'Red crab',
          length_cm: 78,
          weight_kg: 18.2,
          weather_conditions: 'Dawn, calm',
          tide_state: 'Rising',
          moon_phase: 'Waning Crescent',
          notes: 'Steenbras feeding well. Strong fish.',
          image_url: '/images/fish/white-steenbras.jpg',
          user_id: 'dummy_user_35',
          created_at: new Date(Date.now() - 3024000000).toISOString()
        },
        {
          id: 36,
          angler_name: 'Mike Johnson',
          species: 'Garrick',
          date_caught: '2023-12-11',
          location: 'Plettenberg Bay',
          bait_used: 'Live mullet',
          length_cm: 95,
          weight_kg: 25.8,
          weather_conditions: 'Clear, incoming tide',
          tide_state: 'High Tide',
          moon_phase: 'Full Moon',
          notes: 'Garrick hunting in the shallows. Exciting sight fishing.',
          image_url: '/images/fish/garrick.jpg',
          user_id: 'dummy_user_36',
          created_at: new Date(Date.now() - 3110400000).toISOString()
        },
        {
          id: 37,
          angler_name: 'Sarah Wilson',
          species: 'Shad',
          date_caught: '2023-12-10',
          location: 'Durban Beachfront',
          bait_used: 'Sardine',
          length_cm: 40,
          weight_kg: 1.6,
          weather_conditions: 'Dawn, calm',
          tide_state: 'Falling',
          moon_phase: 'Last Quarter',
          notes: 'Shad running strong, caught 15. Great fun.',
          image_url: '/images/fish/shad.jpg',
          user_id: 'dummy_user_37',
          created_at: new Date(Date.now() - 3196800000).toISOString()
        },
        {
          id: 38,
          angler_name: 'David Brown',
          species: 'Blacktail',
          date_caught: '2023-12-09',
          location: 'Cape Town Harbour',
          bait_used: 'White mussel',
          length_cm: 35,
          weight_kg: 1.1,
          weather_conditions: 'Sunset, calm',
          tide_state: 'Rising',
          moon_phase: 'Waning Gibbous',
          notes: 'Blacktail bite was incredible. Caught 20 fish.',
          image_url: '/images/fish/blacktail.jpg',
          user_id: 'dummy_user_38',
          created_at: new Date(Date.now() - 3283200000).toISOString()
        },
        {
          id: 39,
          angler_name: 'Lisa Davis',
          species: 'Zebra',
          date_caught: '2023-12-08',
          location: 'Hermanus',
          bait_used: 'Red crab',
          length_cm: 48,
          weight_kg: 2.8,
          weather_conditions: 'Dawn, light wind',
          tide_state: 'Low Tide',
          moon_phase: 'First Quarter',
          notes: 'Zebra feeding on the rocks. Beautiful fish.',
          image_url: '/images/fish/zebra.jpg',
          user_id: 'dummy_user_39',
          created_at: new Date(Date.now() - 3369600000).toISOString()
        },
        {
          id: 40,
          angler_name: 'John Smith',
          species: 'Duckbill',
          date_caught: '2023-12-07',
          location: 'Knysna Lagoon',
          bait_used: 'Prawns',
          length_cm: 58,
          weight_kg: 3.9,
          weather_conditions: 'Clear, low tide',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Duckbill in the lagoon. Caught 6 fish.',
          image_url: '/images/fish/duckbill.jpg',
          user_id: 'dummy_user_40',
          created_at: new Date(Date.now() - 3456000000).toISOString()
        },
        {
          id: 41,
          angler_name: 'Mike Johnson',
          species: 'Galjoen',
          date_caught: '2023-12-06',
          location: 'Gansbaai',
          bait_used: 'White mussel',
          length_cm: 42,
          weight_kg: 1.9,
          weather_conditions: 'Clear, incoming tide',
          tide_state: 'Rising',
          moon_phase: 'Waning Crescent',
          notes: 'Galjoen feeding well. Caught 4 fish.',
          image_url: '/images/fish/galjoen.jpg',
          user_id: 'dummy_user_41',
          created_at: new Date(Date.now() - 3542400000).toISOString()
        },
        {
          id: 42,
          angler_name: 'Sarah Wilson',
          species: 'Roman',
          date_caught: '2023-12-05',
          location: 'Mossel Bay',
          bait_used: 'Prawns',
          length_cm: 46,
          weight_kg: 2.4,
          weather_conditions: 'Clear, calm',
          tide_state: 'High Tide',
          moon_phase: 'Full Moon',
          notes: 'Roman feeding in the bay. Caught 7 fish.',
          image_url: '/images/fish/roman.jpg',
          user_id: 'dummy_user_42',
          created_at: new Date(Date.now() - 3628800000).toISOString()
        },
        {
          id: 43,
          angler_name: 'David Brown',
          species: 'Bronze bream',
          date_caught: '2023-12-04',
          location: 'Port Elizabeth',
          bait_used: 'Prawns',
          length_cm: 45,
          weight_kg: 2.6,
          weather_conditions: 'Clear, light wind',
          tide_state: 'Falling',
          moon_phase: 'Last Quarter',
          notes: 'Bream feeding well. Caught 10 fish.',
          image_url: '/images/fish/bronze-bream.jpg',
          user_id: 'dummy_user_43',
          created_at: new Date(Date.now() - 3715200000).toISOString()
        },
        {
          id: 44,
          angler_name: 'Lisa Davis',
          species: 'Common / Dusky kob',
          date_caught: '2023-12-03',
          location: 'East London',
          bait_used: 'Live mullet',
          length_cm: 82,
          weight_kg: 16.8,
          weather_conditions: 'Sunset, calm',
          tide_state: 'Rising',
          moon_phase: 'Waning Gibbous',
          notes: 'Kob feeding on the outgoing tide. Strong fish.',
          image_url: '/images/fish/kob.jpg',
          user_id: 'dummy_user_44',
          created_at: new Date(Date.now() - 3801600000).toISOString()
        },
        {
          id: 45,
          angler_name: 'John Smith',
          species: 'Spotted ragged-tooth shark',
          date_caught: '2023-12-02',
          location: 'Aliwal Shoal',
          bait_used: 'Tuna fillet',
          length_cm: 310,
          weight_kg: 210.5,
          weather_conditions: 'Clear, moderate swell',
          tide_state: 'High Tide',
          moon_phase: 'First Quarter',
          notes: 'Another raggie on the shoal. Released safely.',
          image_url: '/images/fish/raggie.jpg',
          user_id: 'dummy_user_45',
          created_at: new Date(Date.now() - 3888000000).toISOString()
        },
        {
          id: 46,
          angler_name: 'Mike Johnson',
          species: 'Eagle ray',
          date_caught: '2023-12-01',
          location: 'Plettenberg Bay',
          bait_used: 'Prawns',
          length_cm: 175,
          weight_kg: 32.8,
          weather_conditions: 'Clear, calm',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Eagle rays cruising. Caught 2.',
          image_url: '/images/fish/eagle-ray.jpg',
          user_id: 'dummy_user_46',
          created_at: new Date(Date.now() - 3974400000).toISOString()
        },
        {
          id: 47,
          angler_name: 'Sarah Wilson',
          species: 'Yellowfin tuna',
          date_caught: '2023-11-30',
          location: 'Cape Canyon',
          bait_used: 'Live bait',
          length_cm: 145,
          weight_kg: 82.3,
          weather_conditions: 'Clear, offshore',
          tide_state: 'Rising',
          moon_phase: 'Waning Crescent',
          notes: 'Big yellowfin offshore. 1.5 hour fight.',
          image_url: '/images/fish/yellowfin-tuna.jpg',
          user_id: 'dummy_user_47',
          created_at: new Date(Date.now() - 4060800000).toISOString()
        },
        {
          id: 48,
          angler_name: 'David Brown',
          species: 'Kingfish',
          date_caught: '2023-11-29',
          location: 'Richards Bay',
          bait_used: 'Live mullet',
          length_cm: 98,
          weight_kg: 24.6,
          weather_conditions: 'Clear, moderate wind',
          tide_state: 'High Tide',
          moon_phase: 'Full Moon',
          notes: 'Kingfish feeding well. Caught 4.',
          image_url: '/images/fish/kingfish.jpg',
          user_id: 'dummy_user_48',
          created_at: new Date(Date.now() - 4147200000).toISOString()
        },
        {
          id: 49,
          angler_name: 'Lisa Davis',
          species: 'White musselcracker',
          date_caught: '2023-11-28',
          location: 'Hermanus',
          bait_used: 'Red crab',
          length_cm: 85,
          weight_kg: 22.1,
          weather_conditions: 'Clear, low tide',
          tide_state: 'Low Tide',
          moon_phase: 'Last Quarter',
          notes: 'White musselcracker on the rocks. Strong fish.',
          image_url: '/images/fish/white-musselcracker.jpg',
          user_id: 'dummy_user_49',
          created_at: new Date(Date.now() - 4233600000).toISOString()
        },
        {
          id: 50,
          angler_name: 'John Smith',
          species: 'Black musselcracker',
          date_caught: '2023-11-27',
          location: 'Gansbaai',
          bait_used: 'Red crab',
          length_cm: 90,
          weight_kg: 26.8,
          weather_conditions: 'Clear, incoming tide',
          tide_state: 'Rising',
          moon_phase: 'Waning Gibbous',
          notes: 'Black musselcrackers feeding. Caught 2.',
          image_url: '/images/fish/black-musselcracker.jpg',
          user_id: 'dummy_user_50',
          created_at: new Date(Date.now() - 4320000000).toISOString()
        },
        {
          id: 51,
          angler_name: 'Mike Johnson',
          species: 'Cape stumpnose',
          date_caught: '2023-11-26',
          location: 'Langebaan',
          bait_used: 'Prawns',
          length_cm: 40,
          weight_kg: 1.9,
          weather_conditions: 'Clear, calm',
          tide_state: 'High Tide',
          moon_phase: 'First Quarter',
          notes: 'Stumpnose school feeding. Caught 9 fish.',
          image_url: '/images/fish/cape-stumpnose.jpg',
          user_id: 'dummy_user_51',
          created_at: new Date(Date.now() - 4406400000).toISOString()
        },
        {
          id: 52,
          angler_name: 'Sarah Wilson',
          species: 'Spotted grunter',
          date_caught: '2023-11-25',
          location: 'Jeffreys Bay',
          bait_used: 'Mud prawn',
          length_cm: 52,
          weight_kg: 4.1,
          weather_conditions: 'Sunset, light wind',
          tide_state: 'Falling',
          moon_phase: 'New Moon',
          notes: 'Grunter feeding in the surf. Great action.',
          image_url: '/images/fish/spotted-grunter.jpg',
          user_id: 'dummy_user_52',
          created_at: new Date(Date.now() - 4492800000).toISOString()
        },
        {
          id: 53,
          angler_name: 'David Brown',
          species: 'White steenbras',
          date_caught: '2023-11-24',
          location: 'East London',
          bait_used: 'Red crab',
          length_cm: 75,
          weight_kg: 16.5,
          weather_conditions: 'Dawn, calm',
          tide_state: 'Rising',
          moon_phase: 'Waning Crescent',
          notes: 'Steenbras feeding well. Strong fish.',
          image_url: '/images/fish/white-steenbras.jpg',
          user_id: 'dummy_user_53',
          created_at: new Date(Date.now() - 4579200000).toISOString()
        },
        {
          id: 54,
          angler_name: 'Lisa Davis',
          species: 'Garrick',
          date_caught: '2023-11-23',
          location: 'Plettenberg Bay',
          bait_used: 'Live mullet',
          length_cm: 88,
          weight_kg: 21.3,
          weather_conditions: 'Clear, incoming tide',
          tide_state: 'High Tide',
          moon_phase: 'Full Moon',
          notes: 'Garrick hunting in the shallows. Exciting sight fishing.',
          image_url: '/images/fish/garrick.jpg',
          user_id: 'dummy_user_54',
          created_at: new Date(Date.now() - 4665600000).toISOString()
        },
        {
          id: 55,
          angler_name: 'John Smith',
          species: 'Shad',
          date_caught: '2023-11-22',
          location: 'Durban Beachfront',
          bait_used: 'Sardine',
          length_cm: 37,
          weight_kg: 1.3,
          weather_conditions: 'Dawn, calm',
          tide_state: 'Falling',
          moon_phase: 'Last Quarter',
          notes: 'Shad running strong, caught 18. Great fun.',
          image_url: '/images/fish/shad.jpg',
          user_id: 'dummy_user_55',
          created_at: new Date(Date.now() - 4752000000).toISOString()
        }
              ]
        console.log('✅ Loaded dummy catches:', dummyCatches.length, 'catches')
        setCatches(dummyCatches)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!supabase) {
      alert('Database not configured. Please check your environment variables.')
      return
    }
    
    if (!selectedImage) {
      alert('Please select an image')
      return
    }

    setIsUploading(true)

    try {
      // Upload image to Supabase storage
      const fileExt = selectedImage.name.split('.').pop()
      const fileName = `${currentUser}_${Date.now()}.${fileExt}`
      const filePath = `${currentUser}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-gallery')
        .upload(filePath, selectedImage)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        alert('Error uploading image: ' + uploadError.message)
        return
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('public-gallery')
        .getPublicUrl(filePath)

      // Save catch data to database
      const { data: insertData, error: insertError } = await supabase
        .from('public_gallery')
        .insert({
          angler_name: formData.anglerName,
          species: formData.species,
          date_caught: formData.date,
          location: formData.location,
          bait_used: formData.bait,
          length_cm: formData.length ? parseFloat(formData.length) : null,
          weight_kg: formData.weight ? parseFloat(formData.weight) : null,
          weather_conditions: formData.weather || null,
          tide_state: formData.tide || null,
          moon_phase: formData.moonPhase || null,
          notes: formData.notes,
          image_url: urlData.publicUrl,
          user_id: currentUser
        })
        .select()

      if (insertError) {
        console.error('Error saving catch data:', insertError)
        alert('Error saving catch data: ' + insertError.message)
        return
      }

      // Reload catches to show the new entry
      await loadCatches()
      
      // Reset form
      setFormData({
        anglerName: '',
        species: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        bait: '',
        length: '',
        weight: '',
        weather: '',
        tide: '',
        moonPhase: '',
        notes: ''
      })
      setSelectedImage(null)
      setShowUploadForm(false)
      
      // Reset file input
      const fileInput = document.getElementById('image-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      alert('Catch shared successfully!')
      
    } catch (error) {
      console.error('Error uploading catch:', error)
      alert('Error uploading catch. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteCatch = async (id: number, userId: string) => {
    if (!supabase) {
      alert('Database not configured. Please check your environment variables.')
      return
    }

    if (userId !== currentUser) {
      alert('You can only delete your own catches')
      return
    }
    
    if (confirm('Are you sure you want to delete this catch?')) {
      try {
        // Find the catch to get the image URL for deletion
        const catchToDelete = catches.find(c => c.id === id)
        
        // Delete from database
        const { error: deleteError } = await supabase
          .from('public_gallery')
          .delete()
          .eq('id', id)
          .eq('user_id', currentUser)

        if (deleteError) {
          console.error('Error deleting catch:', deleteError)
          alert('Error deleting catch: ' + deleteError.message)
          return
        }

        // Delete image from storage if it exists
        if (catchToDelete?.image_url) {
          try {
            const imagePath = catchToDelete.image_url.split('/').slice(-2).join('/')
            await supabase.storage
              .from('public-gallery')
              .remove([imagePath])
          } catch (storageError) {
            console.warn('Error deleting image from storage:', storageError)
            // Don't fail the whole operation if image deletion fails
          }
        }

        // Reload catches
        await loadCatches()
        alert('Catch deleted successfully!')
        
      } catch (error) {
        console.error('Error deleting catch:', error)
        alert('Error deleting catch. Please try again.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '800px'}}>
        <div className="modal-content rounded-2xl p-3 flex flex-col overflow-y-auto" style={{height: '800px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">🌐 Public Gallery</h2>
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
              {/* Upload Form */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <h3 className="text-lg font-semibold text-white mb-3">Share Your Catch</h3>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Catch Photo *
                    </label>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      required
                    />
                    {selectedImage && (
                      <div className="mt-2 text-green-300 text-xs">
                        Selected: {selectedImage.name}
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Angler Name *
                      </label>
                      <input
                        type="text"
                        value={formData.anglerName}
                        onChange={(e) => handleInputChange('anglerName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Species *
                      </label>
                      <input
                        type="text"
                        value={formData.species}
                        onChange={(e) => handleInputChange('species', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Bait Used *
                      </label>
                      <input
                        type="text"
                        value={formData.bait}
                        onChange={(e) => handleInputChange('bait', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Weather Conditions
                      </label>
                      <input
                        type="text"
                        value={formData.weather}
                        onChange={(e) => handleInputChange('weather', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="e.g., Sunny, Windy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Tide State
                      </label>
                      <select
                        value={formData.tide}
                        onChange={(e) => handleInputChange('tide', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">Select tide state</option>
                        <option value="High Tide">High Tide</option>
                        <option value="Low Tide">Low Tide</option>
                        <option value="Rising">Rising</option>
                        <option value="Falling">Falling</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-semibold mb-1">
                        Moon Phase
                      </label>
                      <select
                        value={formData.moonPhase}
                        onChange={(e) => handleInputChange('moonPhase', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="">Select moon phase</option>
                        <option value="New Moon">New Moon</option>
                        <option value="Waxing Crescent">Waxing Crescent</option>
                        <option value="First Quarter">First Quarter</option>
                        <option value="Waxing Gibbous">Waxing Gibbous</option>
                        <option value="Full Moon">Full Moon</option>
                        <option value="Waning Gibbous">Waning Gibbous</option>
                        <option value="Last Quarter">Last Quarter</option>
                        <option value="Waning Crescent">Waning Crescent</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Notes & Story
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm resize-none"
                      placeholder="Share your fishing story, techniques used, or any interesting details about your catch..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      {isUploading ? 'Uploading...' : 'Share Catch'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Display */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-600 p-3">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Catches</h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-blue-400 text-lg mb-2">Loading catches...</div>
                    <div className="text-gray-500 text-sm">Please wait</div>
                  </div>
                ) : catches.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">No catches shared yet</div>
                    <div className="text-gray-500 text-sm">Be the first to share your catch!</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {catches.map((catchItem) => (
                      <div key={catchItem.id} className="bg-gray-700/50 rounded-lg border border-gray-600 p-3">
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={catchItem.image_url}
                              alt={`Catch by ${catchItem.angler_name}`}
                              className="w-24 h-auto max-h-24 object-contain rounded-lg"
                            />
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold text-sm">{catchItem.species}</h4>
                                <p className="text-blue-300 text-xs">by {catchItem.angler_name}</p>
                              </div>
                              {catchItem.user_id === currentUser && (
                                <button
                                  onClick={() => deleteCatch(catchItem.id, catchItem.user_id)}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-400">Date:</span>
                                <span className="text-white ml-1">{new Date(catchItem.date_caught).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Location:</span>
                                <span className="text-white ml-1">{catchItem.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Bait:</span>
                                <span className="text-white ml-1">{catchItem.bait_used}</span>
                              </div>
                              {catchItem.length_cm && (
                                <div>
                                  <span className="text-gray-400">Length:</span>
                                  <span className="text-white ml-1">{catchItem.length_cm}cm</span>
                                </div>
                              )}
                              {catchItem.weight_kg && (
                                <div>
                                  <span className="text-gray-400">Weight:</span>
                                  <span className="text-white ml-1">{catchItem.weight_kg}kg</span>
                                </div>
                              )}
                              {catchItem.weather_conditions && (
                                <div>
                                  <span className="text-gray-400">Weather:</span>
                                  <span className="text-white ml-1">{catchItem.weather_conditions}</span>
                                </div>
                              )}
                              {catchItem.tide_state && (
                                <div>
                                  <span className="text-gray-400">Tide:</span>
                                  <span className="text-white ml-1">{catchItem.tide_state}</span>
                                </div>
                              )}
                              {catchItem.moon_phase && (
                                <div>
                                  <span className="text-gray-400">Moon:</span>
                                  <span className="text-white ml-1">{catchItem.moon_phase}</span>
                                </div>
                              )}
                            </div>
                            
                            {catchItem.notes && (
                              <div className="mt-2">
                                <p className="text-gray-300 text-xs leading-relaxed">{catchItem.notes}</p>
                              </div>
                            )}
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
    </div>
  )
}

export default PublicGalleryModal
