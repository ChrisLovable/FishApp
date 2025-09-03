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

  // Load items from Supabase or localStorage
  const loadItems = async () => {
    // FORCE DUMMY DATA FOR NOW - NO SUPABASE
    console.log('🚫 Using dummy data for Second Hand Store (Supabase disabled)')
    loadDummyData()
  }

  const loadFromLocalStorage = () => {
    const savedItems = localStorage.getItem('secondHandItems')
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems)
        console.log('✅ Loaded items from localStorage:', parsedItems.length, 'items')
        setItems(parsedItems)
      } catch (error) {
        console.error('Error loading store items:', error)
        loadDummyData()
      }
    } else {
      console.log('🚫 No items in localStorage, loading dummy data')
      loadDummyData()
    }
  }

  const loadDummyData = () => {
    console.log('📊 Loading 125 dummy store items...')
    // Clear localStorage to force loading new dummy data
    localStorage.removeItem('secondHandItems')
    // Add dummy data if no items exist
      const dummyItems: StoreItem[] = [
        {
          id: '1',
          title: 'Shimano Stradic 3000 Spinning Reel',
          description: 'Excellent condition Shimano Stradic 3000 spinning reel. Used only a few times, comes with original box and papers. Perfect for light to medium fishing.',
          price: 850.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Cape Town',
          contactName: 'John Smith',
          contactPhone: '082 123 4567',
          contactEmail: 'john.smith@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 1800000, // 30 minutes ago
          userId: 'dummy_user_1',
          isSold: false
        },
        {
          id: '2',
          title: 'Penn Battle II 4000 Combo',
          description: 'Penn Battle II 4000 reel with 7ft medium action rod. Great for surf fishing and light offshore work. Some minor scratches on reel but functions perfectly.',
          price: 1200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Johnson',
          contactPhone: '083 987 6543',
          contactEmail: 'mike.j@email.com',
          imageUrls: ['/images/placeholder-combo.jpg'],
          timestamp: Date.now() - 3600000, // 1 hour ago
          userId: 'dummy_user_2',
          isSold: false
        },
        {
          id: '3',
          title: 'Assorted Soft Plastics Lures',
          description: 'Collection of 50+ soft plastic lures including paddle tails, jerkbaits, and worms. Various colors and sizes. Great for bass and saltwater fishing.',
          price: 150.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Port Elizabeth',
          contactName: 'Sarah Wilson',
          contactPhone: '084 555 1234',
          contactEmail: 'sarah.w@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 7200000, // 2 hours ago
          userId: 'dummy_user_3',
          isSold: false
        },
        {
          id: '4',
          title: 'Garmin Striker 4 Fish Finder',
          description: 'Garmin Striker 4 fish finder with GPS. Includes transducer and mounting hardware. Works perfectly, selling due to upgrade.',
          price: 2200.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'East London',
          contactName: 'David Brown',
          contactPhone: '082 444 7890',
          contactEmail: 'david.brown@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 86400000, // 1 day ago
          userId: 'dummy_user_4',
          isSold: false
        },
        {
          id: '5',
          title: 'Fishing Tackle Box with Tools',
          description: 'Large tackle box with multiple compartments, includes pliers, line cutter, hook remover, and various terminal tackle. Everything you need to get started.',
          price: 300.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Knysna',
          contactName: 'Lisa Davis',
          contactPhone: '083 222 3456',
          contactEmail: 'lisa.davis@email.com',
          imageUrls: ['/images/placeholder-tacklebox.jpg'],
          timestamp: Date.now() - 172800000, // 2 days ago
          userId: 'dummy_user_5',
          isSold: false
        },
        {
          id: '6',
          title: 'Daiwa Saltist 4000 Spinning Reel',
          description: 'Daiwa Saltist 4000 spinning reel in excellent condition. Perfect for saltwater fishing, comes with spare spool and original box.',
          price: 2500.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Hermanus',
          contactName: 'Peter van der Merwe',
          contactPhone: '082 111 2222',
          contactEmail: 'peter.vdm@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 1200000, // 20 minutes ago
          userId: 'dummy_user_6',
          isSold: false
        },
        {
          id: '7',
          title: 'Okuma Ceymar C-30 Spinning Reel',
          description: 'Lightweight Okuma Ceymar C-30 spinning reel. Great for freshwater fishing, very smooth drag system.',
          price: 450.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Stellenbosch',
          contactName: 'Anna Botha',
          contactPhone: '083 333 4444',
          contactEmail: 'anna.botha@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 1800000, // 30 minutes ago
          userId: 'dummy_user_7',
          isSold: false
        },
        {
          id: '8',
          title: 'Penn Fierce III 5000 Combo',
          description: 'Penn Fierce III 5000 spinning reel with 8ft heavy action rod. Perfect for surf fishing and light offshore work.',
          price: 1500.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Jeffreys Bay',
          contactName: 'Johan Pretorius',
          contactPhone: '084 555 6666',
          contactEmail: 'johan.p@email.com',
          imageUrls: ['/images/placeholder-combo.jpg'],
          timestamp: Date.now() - 2700000, // 45 minutes ago
          userId: 'dummy_user_8',
          isSold: false
        },
        {
          id: '9',
          title: 'Assorted Hard Lures Collection',
          description: 'Collection of 30+ hard lures including poppers, stickbaits, and diving lures. Various brands and colors for different species.',
          price: 800.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Carlos Mendez',
          contactPhone: '085 777 8888',
          contactEmail: 'carlos.m@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 3600000, // 1 hour ago
          userId: 'dummy_user_9',
          isSold: false
        },
        {
          id: '10',
          title: 'Fishing Net with Extendable Handle',
          description: 'Large fishing net with telescopic handle extending to 3 meters. Perfect for landing big fish from shore or boat.',
          price: 350.00,
          category: 'Accessories',
          condition: 'Excellent',
          location: 'Plettenberg Bay',
          contactName: 'Sandra van Rensburg',
          contactPhone: '086 999 0000',
          contactEmail: 'sandra.vr@email.com',
          imageUrls: ['/images/placeholder-net.jpg'],
          timestamp: Date.now() - 5400000, // 1.5 hours ago
          userId: 'dummy_user_10',
          isSold: false
        },
        {
          id: '11',
          title: 'Lowrance Hook2 4x Fish Finder',
          description: 'Lowrance Hook2 4x fish finder with GPS. Includes transducer and mounting hardware. Great for finding fish.',
          price: 1800.00,
          category: 'Electronics',
          condition: 'Good',
          location: 'Knysna',
          contactName: 'Mark Thompson',
          contactPhone: '087 111 3333',
          contactEmail: 'mark.t@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 7200000, // 2 hours ago
          userId: 'dummy_user_11',
          isSold: false
        },
        {
          id: '12',
          title: 'Fishing Rod Holders (Set of 4)',
          description: 'Set of 4 adjustable fishing rod holders. Perfect for boat fishing or shore fishing. Made from durable stainless steel.',
          price: 200.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'George',
          contactName: 'Lizzie de Kock',
          contactPhone: '088 222 4444',
          contactEmail: 'lizzie.dk@email.com',
          imageUrls: ['/images/placeholder-holders.jpg'],
          timestamp: Date.now() - 9000000, // 2.5 hours ago
          userId: 'dummy_user_12',
          isSold: false
        },
        {
          id: '13',
          title: 'Abu Garcia Ambassadeur 6500C',
          description: 'Classic Abu Garcia Ambassadeur 6500C baitcasting reel. Vintage model in excellent working condition.',
          price: 1200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Oudtshoorn',
          contactName: 'Frans du Plessis',
          contactPhone: '089 333 5555',
          contactEmail: 'frans.dp@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 10800000, // 3 hours ago
          userId: 'dummy_user_13',
          isSold: false
        },
        {
          id: '14',
          title: 'Fishing Tackle Bag',
          description: 'Large fishing tackle bag with multiple compartments and waterproof sections. Perfect for organizing all your gear.',
          price: 280.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Beaufort West',
          contactName: 'Maria Santos',
          contactPhone: '090 444 6666',
          contactEmail: 'maria.s@email.com',
          imageUrls: ['/images/placeholder-bag.jpg'],
          timestamp: Date.now() - 12600000, // 3.5 hours ago
          userId: 'dummy_user_14',
          isSold: false
        },
        {
          id: '15',
          title: 'Shimano TLD 25/40 Two Speed Reel',
          description: 'Shimano TLD 25/40 two-speed trolling reel. Perfect for big game fishing. Recently serviced and in excellent condition.',
          price: 3200.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Cape Agulhas',
          contactName: 'Hendrik van Wyk',
          contactPhone: '091 555 7777',
          contactEmail: 'hendrik.vw@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 14400000, // 4 hours ago
          userId: 'dummy_user_15',
          isSold: false
        },
        {
          id: '16',
          title: 'Fishing Line Spooler',
          description: 'Electric fishing line spooler. Makes spooling new line onto reels quick and easy. Includes various adapters.',
          price: 150.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Swellendam',
          contactName: 'Pieter Botha',
          contactPhone: '092 666 8888',
          contactEmail: 'pieter.b@email.com',
          imageUrls: ['/images/placeholder-spooler.jpg'],
          timestamp: Date.now() - 16200000, // 4.5 hours ago
          userId: 'dummy_user_16',
          isSold: false
        },
        {
          id: '17',
          title: 'Penn International 50VSW',
          description: 'Penn International 50VSW two-speed reel. Heavy duty reel for big game fishing. Recently overhauled.',
          price: 4500.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Gansbaai',
          contactName: 'Willem de Villiers',
          contactPhone: '093 777 9999',
          contactEmail: 'willem.dv@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 18000000, // 5 hours ago
          userId: 'dummy_user_17',
          isSold: false
        },
        {
          id: '18',
          title: 'Fishing Scale (Digital)',
          description: 'Digital fishing scale with built-in tape measure. Weighs up to 50kg and measures up to 2 meters. Waterproof design.',
          price: 120.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Worcester',
          contactName: 'Susan van der Berg',
          contactPhone: '094 888 0000',
          contactEmail: 'susan.vdb@email.com',
          imageUrls: ['/images/placeholder-scale.jpg'],
          timestamp: Date.now() - 19800000, // 5.5 hours ago
          userId: 'dummy_user_18',
          isSold: false
        },
        {
          id: '19',
          title: 'Fishing Kayak Paddle',
          description: 'Carbon fiber fishing kayak paddle. Lightweight and durable. Perfect for kayak fishing adventures.',
          price: 800.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Sedgefield',
          contactName: 'Andre Nel',
          contactPhone: '095 999 1111',
          contactEmail: 'andre.n@email.com',
          imageUrls: ['/images/placeholder-paddle.jpg'],
          timestamp: Date.now() - 21600000, // 6 hours ago
          userId: 'dummy_user_19',
          isSold: false
        },
        {
          id: '20',
          title: 'Fishing Cooler Box (50L)',
          description: 'Large 50L fishing cooler box with wheels and telescopic handle. Perfect for keeping your catch fresh.',
          price: 450.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Wilderness',
          contactName: 'Tanya Steyn',
          contactPhone: '096 000 2222',
          contactEmail: 'tanya.s@email.com',
          imageUrls: ['/images/placeholder-cooler.jpg'],
          timestamp: Date.now() - 23400000, // 6.5 hours ago
          userId: 'dummy_user_20',
          isSold: false
        },
        {
          id: '21',
          title: 'Fishing Rod Rack (Wall Mount)',
          description: 'Wall-mounted fishing rod rack that holds 8 rods. Made from solid wood with brass hardware.',
          price: 180.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Calitzdorp',
          contactName: 'Jaco van Zyl',
          contactPhone: '097 111 3333',
          contactEmail: 'jaco.vz@email.com',
          imageUrls: ['/images/placeholder-rack.jpg'],
          timestamp: Date.now() - 25200000, // 7 hours ago
          userId: 'dummy_user_21',
          isSold: false
        },
        {
          id: '22',
          title: 'Fishing Hook Sharpener',
          description: 'Professional fishing hook sharpener with multiple grits. Keeps your hooks razor sharp for better hookups.',
          price: 80.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Ladismith',
          contactName: 'Riaan van der Walt',
          contactPhone: '098 222 4444',
          contactEmail: 'riaan.vdw@email.com',
          imageUrls: ['/images/placeholder-sharpener.jpg'],
          timestamp: Date.now() - 27000000, // 7.5 hours ago
          userId: 'dummy_user_22',
          isSold: false
        },
        {
          id: '23',
          title: 'Fishing Line (Monofilament)',
          description: 'Spool of 20lb monofilament fishing line, 1000 yards. High quality line perfect for various fishing applications.',
          price: 60.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Barrydale',
          contactName: 'Elize Marais',
          contactPhone: '099 333 5555',
          contactEmail: 'elize.m@email.com',
          imageUrls: ['/images/placeholder-line.jpg'],
          timestamp: Date.now() - 28800000, // 8 hours ago
          userId: 'dummy_user_23',
          isSold: false
        },
        {
          id: '24',
          title: 'Fishing Pliers Set',
          description: 'Professional fishing pliers set with line cutter, hook remover, and split ring tool. Stainless steel construction.',
          price: 200.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Montagu',
          contactName: 'Dirk van der Merwe',
          contactPhone: '100 444 6666',
          contactEmail: 'dirk.vdm@email.com',
          imageUrls: ['/images/placeholder-pliers.jpg'],
          timestamp: Date.now() - 30600000, // 8.5 hours ago
          userId: 'dummy_user_24',
          isSold: false
        },
        {
          id: '25',
          title: 'Fishing Hat with UV Protection',
          description: 'Fishing hat with wide brim and UV protection. Perfect for long days on the water. Adjustable fit.',
          price: 120.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Robertson',
          contactName: 'Marietjie van Rensburg',
          contactPhone: '101 555 7777',
          contactEmail: 'marietjie.vr@email.com',
          imageUrls: ['/images/placeholder-hat.jpg'],
          timestamp: Date.now() - 32400000, // 9 hours ago
          userId: 'dummy_user_25',
          isSold: false
        },
        // Additional 50 items to cover all categories comprehensively
        {
          id: '26',
          title: 'Abu Garcia Revo SX Spinning Reel',
          description: 'Abu Garcia Revo SX 3000 spinning reel in excellent condition. Smooth drag and retrieve, perfect for medium fishing.',
          price: 1800.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Bloemfontein',
          contactName: 'Hendrik van Wyk',
          contactPhone: '102 111 2222',
          contactEmail: 'hendrik.vw@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 34200000, // 9.5 hours ago
          userId: 'dummy_user_26',
          isSold: false
        },
        {
          id: '27',
          title: 'Penn Slammer III 4500 Spinning Reel',
          description: 'Penn Slammer III 4500 spinning reel with sealed drag system. Perfect for saltwater fishing.',
          price: 3200.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Port Elizabeth',
          contactName: 'Andre du Plessis',
          contactPhone: '103 222 3333',
          contactEmail: 'andre.dp@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 36000000, // 10 hours ago
          userId: 'dummy_user_27',
          isSold: false
        },
        {
          id: '28',
          title: 'Shimano Teramar TMS-X80M Spinning Rod',
          description: 'Shimano Teramar 8ft medium action spinning rod. Great for surf fishing and light offshore work.',
          price: 1200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'East London',
          contactName: 'Pieter Botha',
          contactPhone: '104 333 4444',
          contactEmail: 'pieter.botha@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 37800000, // 10.5 hours ago
          userId: 'dummy_user_28',
          isSold: false
        },
        {
          id: '29',
          title: 'Daiwa BG 5000 Spinning Reel',
          description: 'Daiwa BG 5000 spinning reel with powerful drag system. Excellent for big game fishing.',
          price: 2800.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Durban',
          contactName: 'Sipho Mthembu',
          contactPhone: '105 444 5555',
          contactEmail: 'sipho.m@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 39600000, // 11 hours ago
          userId: 'dummy_user_29',
          isSold: false
        },
        {
          id: '30',
          title: 'Penn Fathom 25N Lever Drag Reel',
          description: 'Penn Fathom 25N lever drag conventional reel. Perfect for bottom fishing and trolling.',
          price: 4500.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Cape Town',
          contactName: 'Johan van der Merwe',
          contactPhone: '106 555 6666',
          contactEmail: 'johan.vdm@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 41400000, // 11.5 hours ago
          userId: 'dummy_user_30',
          isSold: false
        },
        {
          id: '31',
          title: 'Shimano TLD 25 Lever Drag Reel',
          description: 'Shimano TLD 25 lever drag conventional reel. Great for offshore fishing and big game.',
          price: 3800.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Hermanus',
          contactName: 'Willem de Klerk',
          contactPhone: '107 666 7777',
          contactEmail: 'willem.dk@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 43200000, // 12 hours ago
          userId: 'dummy_user_31',
          isSold: false
        },
        {
          id: '32',
          title: 'Penn Senator 4/0 Conventional Reel',
          description: 'Penn Senator 4/0 conventional reel with strong drag system. Perfect for bottom fishing.',
          price: 2200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Kobus van Rensburg',
          contactPhone: '108 777 8888',
          contactEmail: 'kobus.vr@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 45000000, // 12.5 hours ago
          userId: 'dummy_user_32',
          isSold: false
        },
        {
          id: '33',
          title: 'Daiwa Saltiga 4500 Spinning Reel',
          description: 'Daiwa Saltiga 4500 spinning reel with Magsealed technology. Premium saltwater reel.',
          price: 5500.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Jeffreys Bay',
          contactName: 'Charl du Toit',
          contactPhone: '109 888 9999',
          contactEmail: 'charl.dt@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 46800000, // 13 hours ago
          userId: 'dummy_user_33',
          isSold: false
        },
        {
          id: '34',
          title: 'Shimano Stella 4000 Spinning Reel',
          description: 'Shimano Stella 4000 spinning reel - the ultimate in spinning reel technology. Like new condition.',
          price: 8500.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Plettenberg Bay',
          contactName: 'Riaan Steyn',
          contactPhone: '110 999 0000',
          contactEmail: 'riaan.steyn@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 48600000, // 13.5 hours ago
          userId: 'dummy_user_34',
          isSold: false
        },
        {
          id: '35',
          title: 'Penn International 30T Lever Drag Reel',
          description: 'Penn International 30T lever drag conventional reel. Professional grade for big game fishing.',
          price: 12000.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Richards Bay',
          contactName: 'Danie van der Walt',
          contactPhone: '111 000 1111',
          contactEmail: 'danie.vdw@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 50400000, // 14 hours ago
          userId: 'dummy_user_35',
          isSold: false
        },
        {
          id: '36',
          title: 'Assorted Jigging Lures Set',
          description: 'Set of 20 jigging lures including butterfly jigs, slow pitch jigs, and knife jigs. Various weights and colors.',
          price: 1200.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Ballito',
          contactName: 'Thabo Mokoena',
          contactPhone: '112 111 2222',
          contactEmail: 'thabo.m@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 52200000, // 14.5 hours ago
          userId: 'dummy_user_36',
          isSold: false
        },
        {
          id: '37',
          title: 'Halco Roosta Popper Lures (Set of 5)',
          description: 'Set of 5 Halco Roosta popper lures in various colors. Perfect for surface fishing and game fish.',
          price: 450.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Umhlanga',
          contactName: 'Nomsa Dlamini',
          contactPhone: '113 222 3333',
          contactEmail: 'nomsa.d@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 54000000, // 15 hours ago
          userId: 'dummy_user_37',
          isSold: false
        },
        {
          id: '38',
          title: 'Rapala X-Rap Lures Collection',
          description: 'Collection of 15 Rapala X-Rap lures in various sizes and colors. Great for freshwater and saltwater.',
          price: 800.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Scottburgh',
          contactName: 'Lungile Nkosi',
          contactPhone: '114 333 4444',
          contactEmail: 'lungile.n@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 55800000, // 15.5 hours ago
          userId: 'dummy_user_38',
          isSold: false
        },
        {
          id: '39',
          title: 'Berkley Gulp! Soft Baits Collection',
          description: 'Large collection of Berkley Gulp! soft baits including worms, minnows, and shrimp. Various colors and sizes.',
          price: 350.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Margate',
          contactName: 'Zanele Mthembu',
          contactPhone: '115 444 5555',
          contactEmail: 'zanele.m@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 57600000, // 16 hours ago
          userId: 'dummy_user_39',
          isSold: false
        },
        {
          id: '40',
          title: 'Mustad Hooks Assorted Pack',
          description: 'Large pack of Mustad hooks in various sizes from 1/0 to 8/0. Perfect for different fishing applications.',
          price: 180.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Port Shepstone',
          contactName: 'Mandla Khumalo',
          contactPhone: '116 555 6666',
          contactEmail: 'mandla.k@email.com',
          imageUrls: ['/images/placeholder-hooks.jpg'],
          timestamp: Date.now() - 59400000, // 16.5 hours ago
          userId: 'dummy_user_40',
          isSold: false
        },
        {
          id: '41',
          title: 'Garmin ECHOMAP UHD 73sv Fish Finder',
          description: 'Garmin ECHOMAP UHD 73sv fish finder with GPS and CHIRP sonar. Includes transducer and mounting hardware.',
          price: 8500.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Cape Town',
          contactName: 'Anton van Zyl',
          contactPhone: '117 666 7777',
          contactEmail: 'anton.vz@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 61200000, // 17 hours ago
          userId: 'dummy_user_41',
          isSold: false
        },
        {
          id: '42',
          title: 'Lowrance HDS-7 Live Fish Finder',
          description: 'Lowrance HDS-7 Live fish finder with Active Imaging and GPS. Professional grade electronics.',
          price: 12000.00,
          category: 'Electronics',
          condition: 'Like New',
          location: 'Durban',
          contactName: 'Gareth Williams',
          contactPhone: '118 777 8888',
          contactEmail: 'gareth.w@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 63000000, // 17.5 hours ago
          userId: 'dummy_user_42',
          isSold: false
        },
        {
          id: '43',
          title: 'Raymarine Axiom 7 Fish Finder',
          description: 'Raymarine Axiom 7 fish finder with RealVision 3D and GPS. Includes transducer and mounting kit.',
          price: 9500.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Port Elizabeth',
          contactName: 'Stuart Mitchell',
          contactPhone: '119 888 9999',
          contactEmail: 'stuart.m@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 64800000, // 18 hours ago
          userId: 'dummy_user_43',
          isSold: false
        },
        {
          id: '44',
          title: 'Humminbird Helix 7 CHIRP Fish Finder',
          description: 'Humminbird Helix 7 CHIRP fish finder with GPS and down imaging. Great for finding fish structure.',
          price: 6500.00,
          category: 'Electronics',
          condition: 'Good',
          location: 'East London',
          contactName: 'Trevor Adams',
          contactPhone: '120 999 0000',
          contactEmail: 'trevor.a@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 66600000, // 18.5 hours ago
          userId: 'dummy_user_44',
          isSold: false
        },
        {
          id: '45',
          title: 'Furuno FCV-588 Fish Finder',
          description: 'Furuno FCV-588 fish finder with CHIRP sonar technology. Professional marine electronics.',
          price: 15000.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Hermanus',
          contactName: 'Bruce van der Merwe',
          contactPhone: '121 000 1111',
          contactEmail: 'bruce.vdm@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 68400000, // 19 hours ago
          userId: 'dummy_user_45',
          isSold: false
        },
        {
          id: '46',
          title: 'Fishing Cooler Box 50L',
          description: 'Large 50L fishing cooler box with drain plug and tie-down points. Perfect for keeping catch fresh.',
          price: 450.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Johan van der Berg',
          contactPhone: '122 111 2222',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-cooler.jpg'],
          timestamp: Date.now() - 70200000, // 19.5 hours ago
          userId: 'dummy_user_46',
          isSold: false
        },
        {
          id: '47',
          title: 'Fishing Chair with Rod Holders',
          description: 'Comfortable fishing chair with built-in rod holders and tackle storage. Perfect for long fishing sessions.',
          price: 650.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Jeffreys Bay',
          contactName: 'Marius Steyn',
          contactPhone: '123 222 3333',
          contactEmail: 'marius.steyn@email.com',
          imageUrls: ['/images/placeholder-chair.jpg'],
          timestamp: Date.now() - 72000000, // 20 hours ago
          userId: 'dummy_user_47',
          isSold: false
        },
        {
          id: '48',
          title: 'Fishing Scale Digital 50kg',
          description: 'Digital fishing scale with 50kg capacity and backlit display. Accurate weight measurements.',
          price: 280.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Plettenberg Bay',
          contactName: 'Willem de Villiers',
          contactPhone: '124 333 4444',
          contactEmail: 'willem.dv@email.com',
          imageUrls: ['/images/placeholder-scale.jpg'],
          timestamp: Date.now() - 73800000, // 20.5 hours ago
          userId: 'dummy_user_48',
          isSold: false
        },
        {
          id: '49',
          title: 'Fishing Pliers Set with Cutter',
          description: 'Professional fishing pliers set with line cutter and hook remover. Made from stainless steel.',
          price: 180.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Knysna',
          contactName: 'Andre van Rensburg',
          contactPhone: '125 444 5555',
          contactEmail: 'andre.vr@email.com',
          imageUrls: ['/images/placeholder-pliers.jpg'],
          timestamp: Date.now() - 75600000, // 21 hours ago
          userId: 'dummy_user_49',
          isSold: false
        },
        {
          id: '50',
          title: 'Fishing Line 300m Spool (Various Weights)',
          description: 'Collection of fishing line spools in various weights from 10lb to 50lb. Different brands and types.',
          price: 250.00,
          category: 'Accessories',
          condition: 'New',
          location: 'George',
          contactName: 'Pieter du Toit',
          contactPhone: '126 555 6666',
          contactEmail: 'pieter.dt@email.com',
          imageUrls: ['/images/placeholder-line.jpg'],
          timestamp: Date.now() - 77400000, // 21.5 hours ago
          userId: 'dummy_user_50',
          isSold: false
        },
        {
          id: '51',
          title: 'Fishing Gloves with Grip',
          description: 'Fishing gloves with enhanced grip and UV protection. Perfect for handling fish and equipment.',
          price: 120.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Wilderness',
          contactName: 'Sandra Botha',
          contactPhone: '127 666 7777',
          contactEmail: 'sandra.botha@email.com',
          imageUrls: ['/images/placeholder-gloves.jpg'],
          timestamp: Date.now() - 79200000, // 22 hours ago
          userId: 'dummy_user_51',
          isSold: false
        },
        {
          id: '52',
          title: 'Fishing Knife with Sheath',
          description: 'Sharp fishing knife with protective sheath. Perfect for cleaning fish and cutting line.',
          price: 150.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Stilbaai',
          contactName: 'Kobus van der Walt',
          contactPhone: '128 777 8888',
          contactEmail: 'kobus.vdw@email.com',
          imageUrls: ['/images/placeholder-knife.jpg'],
          timestamp: Date.now() - 81000000, // 22.5 hours ago
          userId: 'dummy_user_52',
          isSold: false
        },
        {
          id: '53',
          title: 'Fishing Bucket with Aerator',
          description: 'Fishing bucket with built-in aerator to keep live bait fresh. Includes battery pack.',
          price: 200.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Gansbaai',
          contactName: 'Danie van Zyl',
          contactPhone: '129 888 9999',
          contactEmail: 'danie.vz@email.com',
          imageUrls: ['/images/placeholder-bucket.jpg'],
          timestamp: Date.now() - 82800000, // 23 hours ago
          userId: 'dummy_user_53',
          isSold: false
        },
        {
          id: '54',
          title: 'Fishing Headlamp with Red Light',
          description: 'LED fishing headlamp with red light mode to preserve night vision. Waterproof and rechargeable.',
          price: 180.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Langebaan',
          contactName: 'Hendrik Steyn',
          contactPhone: '130 999 0000',
          contactEmail: 'hendrik.steyn@email.com',
          imageUrls: ['/images/placeholder-headlamp.jpg'],
          timestamp: Date.now() - 84600000, // 23.5 hours ago
          userId: 'dummy_user_54',
          isSold: false
        },
        {
          id: '55',
          title: 'Fishing First Aid Kit',
          description: 'Compact fishing first aid kit with bandages, antiseptic, and fishing-specific medical supplies.',
          price: 120.00,
          category: 'Accessories',
          condition: 'New',
          location: 'Saldanha',
          contactName: 'Marietjie van der Merwe',
          contactPhone: '131 000 1111',
          contactEmail: 'marietjie.vdm@email.com',
          imageUrls: ['/images/placeholder-firstaid.jpg'],
          timestamp: Date.now() - 86400000, // 24 hours ago
          userId: 'dummy_user_55',
          isSold: false
        },
        {
          id: '56',
          title: 'Ocean Kayak Prowler 13',
          description: 'Ocean Kayak Prowler 13 fishing kayak with rod holders and storage compartments. Excellent condition.',
          price: 8500.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '132 111 2222',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 88200000, // 24.5 hours ago
          userId: 'dummy_user_56',
          isSold: false
        },
        {
          id: '57',
          title: 'Hobie Mirage Outback Kayak',
          description: 'Hobie Mirage Outback kayak with MirageDrive pedal system. Perfect for hands-free fishing.',
          price: 12000.00,
          category: 'Boats & Kayaks',
          condition: 'Excellent',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '133 222 3333',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 90000000, // 25 hours ago
          userId: 'dummy_user_57',
          isSold: false
        },
        {
          id: '58',
          title: 'Perception Pescador 12 Kayak',
          description: 'Perception Pescador 12 fishing kayak with comfortable seat and rod holders. Great for beginners.',
          price: 4500.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '134 333 4444',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 91800000, // 25.5 hours ago
          userId: 'dummy_user_58',
          isSold: false
        },
        {
          id: '59',
          title: 'Old Town Sportsman 106 Kayak',
          description: 'Old Town Sportsman 106 kayak with fishing features and stable design. Perfect for calm waters.',
          price: 3800.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '135 444 5555',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 93600000, // 26 hours ago
          userId: 'dummy_user_59',
          isSold: false
        },
        {
          id: '60',
          title: 'Native Watercraft Slayer 10 Kayak',
          description: 'Native Watercraft Slayer 10 kayak with Propel pedal drive system. Excellent for fishing.',
          price: 9500.00,
          category: 'Boats & Kayaks',
          condition: 'Like New',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '136 555 6666',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 95400000, // 26.5 hours ago
          userId: 'dummy_user_60',
          isSold: false
        },
        {
          id: '61',
          title: 'Shimano Terez TZS-80MH Spinning Rod',
          description: 'Shimano Terez 8ft medium-heavy spinning rod. Perfect for jigging and bottom fishing.',
          price: 1800.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Mossel Bay',
          contactName: 'Carlos Rodriguez',
          contactPhone: '137 666 7777',
          contactEmail: 'carlos.r@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 97200000, // 27 hours ago
          userId: 'dummy_user_61',
          isSold: false
        },
        {
          id: '62',
          title: 'Penn Battalion 8ft Heavy Spinning Rod',
          description: 'Penn Battalion 8ft heavy action spinning rod. Great for surf fishing and heavy lures.',
          price: 1200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Jeffreys Bay',
          contactName: 'Anton Steyn',
          contactPhone: '138 777 8888',
          contactEmail: 'anton.steyn@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 99000000, // 27.5 hours ago
          userId: 'dummy_user_62',
          isSold: false
        },
        {
          id: '63',
          title: 'Daiwa Saltist 7ft Medium-Heavy Rod',
          description: 'Daiwa Saltist 7ft medium-heavy spinning rod. Perfect for saltwater fishing and lures.',
          price: 1500.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Plettenberg Bay',
          contactName: 'Willem du Toit',
          contactPhone: '139 888 9999',
          contactEmail: 'willem.dt@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 100800000, // 28 hours ago
          userId: 'dummy_user_63',
          isSold: false
        },
        {
          id: '64',
          title: 'Shimano Trevala TVC-66MH Jigging Rod',
          description: 'Shimano Trevala 6ft 6in medium-heavy jigging rod. Perfect for vertical jigging and bottom fishing.',
          price: 2200.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Knysna',
          contactName: 'Johan van Rensburg',
          contactPhone: '140 999 0000',
          contactEmail: 'johan.vr@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 102600000, // 28.5 hours ago
          userId: 'dummy_user_64',
          isSold: false
        },
        {
          id: '65',
          title: 'Penn Rampage 7ft Heavy Spinning Rod',
          description: 'Penn Rampage 7ft heavy action spinning rod. Great for big game fishing and heavy lures.',
          price: 1800.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'George',
          contactName: 'Pieter van der Walt',
          contactPhone: '141 000 1111',
          contactEmail: 'pieter.vdw@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 104400000, // 29 hours ago
          userId: 'dummy_user_65',
          isSold: false
        },
        {
          id: '66',
          title: 'Assorted Sinkers and Weights',
          description: 'Large collection of sinkers and weights from 1oz to 8oz. Various shapes including pyramid, bank, and egg sinkers.',
          price: 120.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Wilderness',
          contactName: 'Sandra van Zyl',
          contactPhone: '142 111 2222',
          contactEmail: 'sandra.vz@email.com',
          imageUrls: ['/images/placeholder-sinkers.jpg'],
          timestamp: Date.now() - 106200000, // 29.5 hours ago
          userId: 'dummy_user_66',
          isSold: false
        },
        {
          id: '67',
          title: 'Fishing Swivels and Snaps Collection',
          description: 'Collection of fishing swivels and snaps in various sizes. Ball bearing swivels and snap swivels included.',
          price: 80.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Stilbaai',
          contactName: 'Kobus Botha',
          contactPhone: '143 222 3333',
          contactEmail: 'kobus.botha@email.com',
          imageUrls: ['/images/placeholder-swivels.jpg'],
          timestamp: Date.now() - 108000000, // 30 hours ago
          userId: 'dummy_user_67',
          isSold: false
        },
        {
          id: '68',
          title: 'Fishing Leaders and Wire Trace',
          description: 'Collection of fishing leaders and wire trace in various lengths and strengths. Perfect for toothy fish.',
          price: 150.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Gansbaai',
          contactName: 'Danie Steyn',
          contactPhone: '144 333 4444',
          contactEmail: 'danie.steyn@email.com',
          imageUrls: ['/images/placeholder-leaders.jpg'],
          timestamp: Date.now() - 109800000, // 30.5 hours ago
          userId: 'dummy_user_68',
          isSold: false
        },
        {
          id: '69',
          title: 'Fishing Beads and Floats Set',
          description: 'Set of fishing beads and floats in various colors and sizes. Great for rig making and float fishing.',
          price: 60.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Langebaan',
          contactName: 'Hendrik van der Merwe',
          contactPhone: '145 444 5555',
          contactEmail: 'hendrik.vdm@email.com',
          imageUrls: ['/images/placeholder-beads.jpg'],
          timestamp: Date.now() - 111600000, // 31 hours ago
          userId: 'dummy_user_69',
          isSold: false
        },
        {
          id: '70',
          title: 'Fishing Crimps and Crimping Tool',
          description: 'Fishing crimps and crimping tool for making strong connections. Various crimp sizes included.',
          price: 100.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Saldanha',
          contactName: 'Marietjie van Rensburg',
          contactPhone: '146 555 6666',
          contactEmail: 'marietjie.vr@email.com',
          imageUrls: ['/images/placeholder-crimps.jpg'],
          timestamp: Date.now() - 113400000, // 31.5 hours ago
          userId: 'dummy_user_70',
          isSold: false
        },
        {
          id: '71',
          title: 'Fishing Rod Rack Wall Mount',
          description: 'Wall-mounted fishing rod rack that holds 8 rods. Made from durable wood with protective padding.',
          price: 350.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '147 666 7777',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-rack.jpg'],
          timestamp: Date.now() - 115200000, // 32 hours ago
          userId: 'dummy_user_71',
          isSold: false
        },
        {
          id: '72',
          title: 'Fishing Tackle Bag Large',
          description: 'Large fishing tackle bag with multiple compartments and rod holders. Perfect for organizing gear.',
          price: 280.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '148 777 8888',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-bag.jpg'],
          timestamp: Date.now() - 117000000, // 32.5 hours ago
          userId: 'dummy_user_72',
          isSold: false
        },
        {
          id: '73',
          title: 'Fishing Sunglasses Polarized',
          description: 'Polarized fishing sunglasses with UV protection and anti-glare coating. Perfect for spotting fish.',
          price: 450.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '149 888 9999',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-sunglasses.jpg'],
          timestamp: Date.now() - 118800000, // 33 hours ago
          userId: 'dummy_user_73',
          isSold: false
        },
        {
          id: '74',
          title: 'Fishing Waders Neoprene',
          description: 'Neoprene fishing waders with built-in boots. Perfect for cold water fishing and wading.',
          price: 650.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '150 999 0000',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-waders.jpg'],
          timestamp: Date.now() - 120600000, // 33.5 hours ago
          userId: 'dummy_user_74',
          isSold: false
        },
        {
          id: '75',
          title: 'Fishing Life Jacket Type III',
          description: 'Type III fishing life jacket with multiple pockets and comfortable fit. Essential safety equipment.',
          price: 380.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '151 000 1111',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-lifejacket.jpg'],
          timestamp: Date.now() - 122400000, // 34 hours ago
          userId: 'dummy_user_75',
          isSold: false
        },
        // Additional 50 items to expand inventory
        {
          id: '76',
          title: 'Shimano Twin Power 4000 Spinning Reel',
          description: 'Shimano Twin Power 4000 spinning reel with X-Protect technology. Premium saltwater reel in excellent condition.',
          price: 4200.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '152 111 2222',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 124200000, // 34.5 hours ago
          userId: 'dummy_user_76',
          isSold: false
        },
        {
          id: '77',
          title: 'Penn Spinfisher VI 4500 Combo',
          description: 'Penn Spinfisher VI 4500 spinning reel with 7ft medium-heavy rod. Perfect for surf fishing.',
          price: 2800.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '153 222 3333',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-combo.jpg'],
          timestamp: Date.now() - 126000000, // 35 hours ago
          userId: 'dummy_user_77',
          isSold: false
        },
        {
          id: '78',
          title: 'Daiwa Saltist MQ 4000 Spinning Reel',
          description: 'Daiwa Saltist MQ 4000 spinning reel with Magsealed technology. Excellent for saltwater fishing.',
          price: 3800.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '154 333 4444',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 127800000, // 35.5 hours ago
          userId: 'dummy_user_78',
          isSold: false
        },
        {
          id: '79',
          title: 'Shimano Terez TZS-70MH Spinning Rod',
          description: 'Shimano Terez 7ft medium-heavy spinning rod. Perfect for jigging and bottom fishing.',
          price: 1600.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '155 444 5555',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 129600000, // 36 hours ago
          userId: 'dummy_user_79',
          isSold: false
        },
        {
          id: '80',
          title: 'Penn Fathom 30 Lever Drag Reel',
          description: 'Penn Fathom 30 lever drag conventional reel. Perfect for bottom fishing and trolling.',
          price: 4800.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '156 555 6666',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 131400000, // 36.5 hours ago
          userId: 'dummy_user_80',
          isSold: false
        },
        {
          id: '81',
          title: 'Assorted Metal Jigs Collection',
          description: 'Collection of 25 metal jigs including butterfly jigs, slow pitch jigs, and knife jigs. Various weights and colors.',
          price: 1500.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Carlos Rodriguez',
          contactPhone: '157 666 7777',
          contactEmail: 'carlos.r@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 133200000, // 37 hours ago
          userId: 'dummy_user_81',
          isSold: false
        },
        {
          id: '82',
          title: 'Halco Laser Pro Lures (Set of 8)',
          description: 'Set of 8 Halco Laser Pro lures in various colors and sizes. Perfect for game fish and pelagic species.',
          price: 600.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Jeffreys Bay',
          contactName: 'Anton Steyn',
          contactPhone: '158 777 8888',
          contactEmail: 'anton.steyn@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 135000000, // 37.5 hours ago
          userId: 'dummy_user_82',
          isSold: false
        },
        {
          id: '83',
          title: 'Rapala Shadow Rap Lures Collection',
          description: 'Collection of 12 Rapala Shadow Rap lures in various sizes and colors. Great for freshwater and saltwater.',
          price: 900.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Plettenberg Bay',
          contactName: 'Willem du Toit',
          contactPhone: '159 888 9999',
          contactEmail: 'willem.dt@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 136800000, // 38 hours ago
          userId: 'dummy_user_83',
          isSold: false
        },
        {
          id: '84',
          title: 'Berkley PowerBait Soft Baits Set',
          description: 'Set of 40 Berkley PowerBait soft baits including worms, minnows, and crawfish. Various colors and sizes.',
          price: 400.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Knysna',
          contactName: 'Johan van Rensburg',
          contactPhone: '160 999 0000',
          contactEmail: 'johan.vr@email.com',
          imageUrls: ['/images/placeholder-lures.jpg'],
          timestamp: Date.now() - 138600000, // 38.5 hours ago
          userId: 'dummy_user_84',
          isSold: false
        },
        {
          id: '85',
          title: 'Gamakatsu Hooks Assorted Pack',
          description: 'Large pack of Gamakatsu hooks in various sizes from 1/0 to 10/0. Premium quality hooks for different applications.',
          price: 220.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'George',
          contactName: 'Pieter van der Walt',
          contactPhone: '161 000 1111',
          contactEmail: 'pieter.vdw@email.com',
          imageUrls: ['/images/placeholder-hooks.jpg'],
          timestamp: Date.now() - 140400000, // 39 hours ago
          userId: 'dummy_user_85',
          isSold: false
        },
        {
          id: '86',
          title: 'Garmin ECHOMAP UHD 93sv Fish Finder',
          description: 'Garmin ECHOMAP UHD 93sv fish finder with GPS and CHIRP sonar. Large 9-inch display with ActiveCaptain.',
          price: 12000.00,
          category: 'Electronics',
          condition: 'Like New',
          location: 'Wilderness',
          contactName: 'Sandra van Zyl',
          contactPhone: '162 111 2222',
          contactEmail: 'sandra.vz@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 142200000, // 39.5 hours ago
          userId: 'dummy_user_86',
          isSold: false
        },
        {
          id: '87',
          title: 'Lowrance HDS-9 Live Fish Finder',
          description: 'Lowrance HDS-9 Live fish finder with Active Imaging and GPS. Professional grade electronics with large display.',
          price: 15000.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Stilbaai',
          contactName: 'Kobus Botha',
          contactPhone: '163 222 3333',
          contactEmail: 'kobus.botha@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 144000000, // 40 hours ago
          userId: 'dummy_user_87',
          isSold: false
        },
        {
          id: '88',
          title: 'Raymarine Axiom 9 Fish Finder',
          description: 'Raymarine Axiom 9 fish finder with RealVision 3D and GPS. Includes transducer and mounting kit.',
          price: 13000.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Gansbaai',
          contactName: 'Danie Steyn',
          contactPhone: '164 333 4444',
          contactEmail: 'danie.steyn@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 145800000, // 40.5 hours ago
          userId: 'dummy_user_88',
          isSold: false
        },
        {
          id: '89',
          title: 'Humminbird Helix 9 CHIRP Fish Finder',
          description: 'Humminbird Helix 9 CHIRP fish finder with GPS and down imaging. Great for finding fish structure.',
          price: 8500.00,
          category: 'Electronics',
          condition: 'Good',
          location: 'Langebaan',
          contactName: 'Hendrik van der Merwe',
          contactPhone: '165 444 5555',
          contactEmail: 'hendrik.vdm@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 147600000, // 41 hours ago
          userId: 'dummy_user_89',
          isSold: false
        },
        {
          id: '90',
          title: 'Furuno FCV-628 Fish Finder',
          description: 'Furuno FCV-628 fish finder with CHIRP sonar technology. Professional marine electronics.',
          price: 18000.00,
          category: 'Electronics',
          condition: 'Excellent',
          location: 'Saldanha',
          contactName: 'Marietjie van Rensburg',
          contactPhone: '166 555 6666',
          contactEmail: 'marietjie.vr@email.com',
          imageUrls: ['/images/placeholder-fishfinder.jpg'],
          timestamp: Date.now() - 149400000, // 41.5 hours ago
          userId: 'dummy_user_90',
          isSold: false
        },
        {
          id: '91',
          title: 'Fishing Cooler Box 80L',
          description: 'Large 80L fishing cooler box with drain plug and tie-down points. Perfect for keeping catch fresh on long trips.',
          price: 650.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '167 666 7777',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-cooler.jpg'],
          timestamp: Date.now() - 151200000, // 42 hours ago
          userId: 'dummy_user_91',
          isSold: false
        },
        {
          id: '92',
          title: 'Fishing Chair with Canopy',
          description: 'Comfortable fishing chair with built-in canopy for sun protection. Perfect for long fishing sessions.',
          price: 850.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '168 777 8888',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-chair.jpg'],
          timestamp: Date.now() - 153000000, // 42.5 hours ago
          userId: 'dummy_user_92',
          isSold: false
        },
        {
          id: '93',
          title: 'Fishing Scale Digital 100kg',
          description: 'Digital fishing scale with 100kg capacity and backlit display. Accurate weight measurements for big fish.',
          price: 450.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '169 888 9999',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-scale.jpg'],
          timestamp: Date.now() - 154800000, // 43 hours ago
          userId: 'dummy_user_93',
          isSold: false
        },
        {
          id: '94',
          title: 'Fishing Pliers Set Professional',
          description: 'Professional fishing pliers set with line cutter, hook remover, and crimping tool. Made from titanium.',
          price: 350.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '170 999 0000',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-pliers.jpg'],
          timestamp: Date.now() - 156600000, // 43.5 hours ago
          userId: 'dummy_user_94',
          isSold: false
        },
        {
          id: '95',
          title: 'Fishing Line 500m Spool (Various Weights)',
          description: 'Collection of fishing line spools in various weights from 15lb to 80lb. Different brands and types.',
          price: 400.00,
          category: 'Accessories',
          condition: 'New',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '171 000 1111',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-line.jpg'],
          timestamp: Date.now() - 158400000, // 44 hours ago
          userId: 'dummy_user_95',
          isSold: false
        },
        {
          id: '96',
          title: 'Fishing Gloves with Grip (Set of 2)',
          description: 'Set of 2 fishing gloves with enhanced grip and UV protection. Perfect for handling fish and equipment.',
          price: 180.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Carlos Rodriguez',
          contactPhone: '172 111 2222',
          contactEmail: 'carlos.r@email.com',
          imageUrls: ['/images/placeholder-gloves.jpg'],
          timestamp: Date.now() - 160200000, // 44.5 hours ago
          userId: 'dummy_user_96',
          isSold: false
        },
        {
          id: '97',
          title: 'Fishing Knife Set with Sheath',
          description: 'Set of 3 fishing knives with protective sheath. Perfect for cleaning fish and cutting line.',
          price: 250.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Jeffreys Bay',
          contactName: 'Anton Steyn',
          contactPhone: '173 222 3333',
          contactEmail: 'anton.steyn@email.com',
          imageUrls: ['/images/placeholder-knife.jpg'],
          timestamp: Date.now() - 162000000, // 45 hours ago
          userId: 'dummy_user_97',
          isSold: false
        },
        {
          id: '98',
          title: 'Fishing Bucket with Aerator Pro',
          description: 'Professional fishing bucket with built-in aerator and battery pack. Keeps live bait fresh for hours.',
          price: 350.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Plettenberg Bay',
          contactName: 'Willem du Toit',
          contactPhone: '174 333 4444',
          contactEmail: 'willem.dt@email.com',
          imageUrls: ['/images/placeholder-bucket.jpg'],
          timestamp: Date.now() - 163800000, // 45.5 hours ago
          userId: 'dummy_user_98',
          isSold: false
        },
        {
          id: '99',
          title: 'Fishing Headlamp with Red/White Light',
          description: 'LED fishing headlamp with red and white light modes. Waterproof and rechargeable with long battery life.',
          price: 280.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Knysna',
          contactName: 'Johan van Rensburg',
          contactPhone: '175 444 5555',
          contactEmail: 'johan.vr@email.com',
          imageUrls: ['/images/placeholder-headlamp.jpg'],
          timestamp: Date.now() - 165600000, // 46 hours ago
          userId: 'dummy_user_99',
          isSold: false
        },
        {
          id: '100',
          title: 'Fishing First Aid Kit Pro',
          description: 'Professional fishing first aid kit with bandages, antiseptic, and fishing-specific medical supplies.',
          price: 180.00,
          category: 'Accessories',
          condition: 'New',
          location: 'George',
          contactName: 'Pieter van der Walt',
          contactPhone: '176 555 6666',
          contactEmail: 'pieter.vdw@email.com',
          imageUrls: ['/images/placeholder-firstaid.jpg'],
          timestamp: Date.now() - 167400000, // 46.5 hours ago
          userId: 'dummy_user_100',
          isSold: false
        },
        {
          id: '101',
          title: 'Ocean Kayak Prowler 15',
          description: 'Ocean Kayak Prowler 15 fishing kayak with rod holders and storage compartments. Excellent condition.',
          price: 9500.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Wilderness',
          contactName: 'Sandra van Zyl',
          contactPhone: '177 666 7777',
          contactEmail: 'sandra.vz@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 169200000, // 47 hours ago
          userId: 'dummy_user_101',
          isSold: false
        },
        {
          id: '102',
          title: 'Hobie Mirage Pro Angler 14 Kayak',
          description: 'Hobie Mirage Pro Angler 14 kayak with MirageDrive pedal system. Perfect for hands-free fishing.',
          price: 15000.00,
          category: 'Boats & Kayaks',
          condition: 'Excellent',
          location: 'Stilbaai',
          contactName: 'Kobus Botha',
          contactPhone: '178 777 8888',
          contactEmail: 'kobus.botha@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 171000000, // 47.5 hours ago
          userId: 'dummy_user_102',
          isSold: false
        },
        {
          id: '103',
          title: 'Perception Pescador 14 Kayak',
          description: 'Perception Pescador 14 fishing kayak with comfortable seat and rod holders. Great for beginners.',
          price: 5500.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Gansbaai',
          contactName: 'Danie Steyn',
          contactPhone: '179 888 9999',
          contactEmail: 'danie.steyn@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 172800000, // 48 hours ago
          userId: 'dummy_user_103',
          isSold: false
        },
        {
          id: '104',
          title: 'Old Town Sportsman 120 Kayak',
          description: 'Old Town Sportsman 120 kayak with fishing features and stable design. Perfect for calm waters.',
          price: 4800.00,
          category: 'Boats & Kayaks',
          condition: 'Good',
          location: 'Langebaan',
          contactName: 'Hendrik van der Merwe',
          contactPhone: '180 999 0000',
          contactEmail: 'hendrik.vdm@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 174600000, // 48.5 hours ago
          userId: 'dummy_user_104',
          isSold: false
        },
        {
          id: '105',
          title: 'Native Watercraft Slayer 12 Kayak',
          description: 'Native Watercraft Slayer 12 kayak with Propel pedal drive system. Excellent for fishing.',
          price: 11000.00,
          category: 'Boats & Kayaks',
          condition: 'Like New',
          location: 'Saldanha',
          contactName: 'Marietjie van Rensburg',
          contactPhone: '181 000 1111',
          contactEmail: 'marietjie.vr@email.com',
          imageUrls: ['/images/placeholder-kayak.jpg'],
          timestamp: Date.now() - 176400000, // 49 hours ago
          userId: 'dummy_user_105',
          isSold: false
        },
        {
          id: '106',
          title: 'Shimano Terez TZS-90MH Spinning Rod',
          description: 'Shimano Terez 9ft medium-heavy spinning rod. Perfect for surf fishing and heavy lures.',
          price: 2000.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '182 111 2222',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 178200000, // 49.5 hours ago
          userId: 'dummy_user_106',
          isSold: false
        },
        {
          id: '107',
          title: 'Penn Battalion 9ft Heavy Spinning Rod',
          description: 'Penn Battalion 9ft heavy action spinning rod. Great for surf fishing and heavy lures.',
          price: 1500.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '183 222 3333',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 180000000, // 50 hours ago
          userId: 'dummy_user_107',
          isSold: false
        },
        {
          id: '108',
          title: 'Daiwa Saltist 8ft Medium-Heavy Rod',
          description: 'Daiwa Saltist 8ft medium-heavy spinning rod. Perfect for saltwater fishing and lures.',
          price: 1800.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '184 333 4444',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 181800000, // 50.5 hours ago
          userId: 'dummy_user_108',
          isSold: false
        },
        {
          id: '109',
          title: 'Shimano Trevala TVC-70MH Jigging Rod',
          description: 'Shimano Trevala 7ft medium-heavy jigging rod. Perfect for vertical jigging and bottom fishing.',
          price: 2400.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '185 444 5555',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 183600000, // 51 hours ago
          userId: 'dummy_user_109',
          isSold: false
        },
        {
          id: '110',
          title: 'Penn Rampage 8ft Heavy Spinning Rod',
          description: 'Penn Rampage 8ft heavy action spinning rod. Great for big game fishing and heavy lures.',
          price: 2000.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '186 555 6666',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 185400000, // 51.5 hours ago
          userId: 'dummy_user_110',
          isSold: false
        },
        {
          id: '111',
          title: 'Assorted Sinkers and Weights Pro',
          description: 'Professional collection of sinkers and weights from 2oz to 12oz. Various shapes including pyramid, bank, and egg sinkers.',
          price: 180.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Mossel Bay',
          contactName: 'Carlos Rodriguez',
          contactPhone: '187 666 7777',
          contactEmail: 'carlos.r@email.com',
          imageUrls: ['/images/placeholder-sinkers.jpg'],
          timestamp: Date.now() - 187200000, // 52 hours ago
          userId: 'dummy_user_111',
          isSold: false
        },
        {
          id: '112',
          title: 'Fishing Swivels and Snaps Pro Collection',
          description: 'Professional collection of fishing swivels and snaps in various sizes. Ball bearing swivels and snap swivels included.',
          price: 120.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Jeffreys Bay',
          contactName: 'Anton Steyn',
          contactPhone: '188 777 8888',
          contactEmail: 'anton.steyn@email.com',
          imageUrls: ['/images/placeholder-swivels.jpg'],
          timestamp: Date.now() - 189000000, // 52.5 hours ago
          userId: 'dummy_user_112',
          isSold: false
        },
        {
          id: '113',
          title: 'Fishing Leaders and Wire Trace Pro',
          description: 'Professional collection of fishing leaders and wire trace in various lengths and strengths. Perfect for toothy fish.',
          price: 200.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'Plettenberg Bay',
          contactName: 'Willem du Toit',
          contactPhone: '189 888 9999',
          contactEmail: 'willem.dt@email.com',
          imageUrls: ['/images/placeholder-leaders.jpg'],
          timestamp: Date.now() - 190800000, // 53 hours ago
          userId: 'dummy_user_113',
          isSold: false
        },
        {
          id: '114',
          title: 'Fishing Beads and Floats Pro Set',
          description: 'Professional set of fishing beads and floats in various colors and sizes. Great for rig making and float fishing.',
          price: 90.00,
          category: 'Tackle & Lures',
          condition: 'New',
          location: 'Knysna',
          contactName: 'Johan van Rensburg',
          contactPhone: '190 999 0000',
          contactEmail: 'johan.vr@email.com',
          imageUrls: ['/images/placeholder-beads.jpg'],
          timestamp: Date.now() - 192600000, // 53.5 hours ago
          userId: 'dummy_user_114',
          isSold: false
        },
        {
          id: '115',
          title: 'Fishing Crimps and Crimping Tool Pro',
          description: 'Professional fishing crimps and crimping tool for making strong connections. Various crimp sizes included.',
          price: 150.00,
          category: 'Tackle & Lures',
          condition: 'Good',
          location: 'George',
          contactName: 'Pieter van der Walt',
          contactPhone: '191 000 1111',
          contactEmail: 'pieter.vdw@email.com',
          imageUrls: ['/images/placeholder-crimps.jpg'],
          timestamp: Date.now() - 194400000, // 54 hours ago
          userId: 'dummy_user_115',
          isSold: false
        },
        {
          id: '116',
          title: 'Fishing Rod Rack Wall Mount Pro',
          description: 'Professional wall-mounted fishing rod rack that holds 12 rods. Made from durable wood with protective padding.',
          price: 500.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Wilderness',
          contactName: 'Sandra van Zyl',
          contactPhone: '192 111 2222',
          contactEmail: 'sandra.vz@email.com',
          imageUrls: ['/images/placeholder-rack.jpg'],
          timestamp: Date.now() - 196200000, // 54.5 hours ago
          userId: 'dummy_user_116',
          isSold: false
        },
        {
          id: '117',
          title: 'Fishing Tackle Bag Extra Large',
          description: 'Extra large fishing tackle bag with multiple compartments and rod holders. Perfect for organizing gear.',
          price: 400.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Stilbaai',
          contactName: 'Kobus Botha',
          contactPhone: '193 222 3333',
          contactEmail: 'kobus.botha@email.com',
          imageUrls: ['/images/placeholder-bag.jpg'],
          timestamp: Date.now() - 198000000, // 55 hours ago
          userId: 'dummy_user_117',
          isSold: false
        },
        {
          id: '118',
          title: 'Fishing Sunglasses Polarized Pro',
          description: 'Professional polarized fishing sunglasses with UV protection and anti-glare coating. Perfect for spotting fish.',
          price: 650.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Gansbaai',
          contactName: 'Danie Steyn',
          contactPhone: '194 333 4444',
          contactEmail: 'danie.steyn@email.com',
          imageUrls: ['/images/placeholder-sunglasses.jpg'],
          timestamp: Date.now() - 199800000, // 55.5 hours ago
          userId: 'dummy_user_118',
          isSold: false
        },
        {
          id: '119',
          title: 'Fishing Waders Neoprene Pro',
          description: 'Professional neoprene fishing waders with built-in boots. Perfect for cold water fishing and wading.',
          price: 850.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Langebaan',
          contactName: 'Hendrik van der Merwe',
          contactPhone: '195 444 5555',
          contactEmail: 'hendrik.vdm@email.com',
          imageUrls: ['/images/placeholder-waders.jpg'],
          timestamp: Date.now() - 201600000, // 56 hours ago
          userId: 'dummy_user_119',
          isSold: false
        },
        {
          id: '120',
          title: 'Fishing Life Jacket Type V',
          description: 'Type V fishing life jacket with multiple pockets and comfortable fit. Essential safety equipment for offshore fishing.',
          price: 550.00,
          category: 'Accessories',
          condition: 'Good',
          location: 'Saldanha',
          contactName: 'Marietjie van Rensburg',
          contactPhone: '196 555 6666',
          contactEmail: 'marietjie.vr@email.com',
          imageUrls: ['/images/placeholder-lifejacket.jpg'],
          timestamp: Date.now() - 203400000, // 56.5 hours ago
          userId: 'dummy_user_120',
          isSold: false
        },
        {
          id: '121',
          title: 'Shimano Twin Power 5000 Spinning Reel',
          description: 'Shimano Twin Power 5000 spinning reel with X-Protect technology. Premium saltwater reel in excellent condition.',
          price: 4800.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Cape Town',
          contactName: 'Johan van der Berg',
          contactPhone: '197 666 7777',
          contactEmail: 'johan.vdb@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 205200000, // 57 hours ago
          userId: 'dummy_user_121',
          isSold: false
        },
        {
          id: '122',
          title: 'Penn Spinfisher VI 5000 Combo',
          description: 'Penn Spinfisher VI 5000 spinning reel with 8ft medium-heavy rod. Perfect for surf fishing.',
          price: 3200.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'Durban',
          contactName: 'Mike Thompson',
          contactPhone: '198 777 8888',
          contactEmail: 'mike.t@email.com',
          imageUrls: ['/images/placeholder-combo.jpg'],
          timestamp: Date.now() - 207000000, // 57.5 hours ago
          userId: 'dummy_user_122',
          isSold: false
        },
        {
          id: '123',
          title: 'Daiwa Saltist MQ 5000 Spinning Reel',
          description: 'Daiwa Saltist MQ 5000 spinning reel with Magsealed technology. Excellent for saltwater fishing.',
          price: 4200.00,
          category: 'Rods & Reels',
          condition: 'Like New',
          location: 'Port Elizabeth',
          contactName: 'David Wilson',
          contactPhone: '199 888 9999',
          contactEmail: 'david.w@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 208800000, // 58 hours ago
          userId: 'dummy_user_123',
          isSold: false
        },
        {
          id: '124',
          title: 'Shimano Terez TZS-80MH Spinning Rod',
          description: 'Shimano Terez 8ft medium-heavy spinning rod. Perfect for jigging and bottom fishing.',
          price: 1800.00,
          category: 'Rods & Reels',
          condition: 'Good',
          location: 'East London',
          contactName: 'Steve Brown',
          contactPhone: '200 999 0000',
          contactEmail: 'steve.brown@email.com',
          imageUrls: ['/images/placeholder-rod.jpg'],
          timestamp: Date.now() - 210600000, // 58.5 hours ago
          userId: 'dummy_user_124',
          isSold: false
        },
        {
          id: '125',
          title: 'Penn Fathom 40 Lever Drag Reel',
          description: 'Penn Fathom 40 lever drag conventional reel. Perfect for bottom fishing and trolling.',
          price: 5200.00,
          category: 'Rods & Reels',
          condition: 'Excellent',
          location: 'Hermanus',
          contactName: 'Paul van der Merwe',
          contactPhone: '201 000 1111',
          contactEmail: 'paul.vdm@email.com',
          imageUrls: ['/images/placeholder-reel.jpg'],
          timestamp: Date.now() - 212400000, // 59 hours ago
          userId: 'dummy_user_125',
          isSold: false
        }
              ]
        console.log('✅ Loaded dummy items:', dummyItems.length, 'items (125 total with realistic timestamps)')
        setItems(dummyItems)
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
