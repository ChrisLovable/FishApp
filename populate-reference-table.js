// Script to populate the reference_table in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvijhiueitaujezwsdut.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aWpoaXVlaXRhdWplendzZHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDE3NjEsImV4cCI6MjA3MjM3Nzc2MX0.x3ScEnQlt5pmQn9qE9Tw7qTSDeyvJkOa3nQAn7beaIs'

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample data based on what we know from the species images
const referenceData = [
  {
    english_name: 'Bronze bream',
    scientific_name: 'Pachymetopon blochii',
    afrikaans_name: 'Bronze bream',
    photo_name: 'bronze-bream.jpg',
    slope: 2.8,
    intercept: 0.12,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '5',
    size_limit: '30cm',
    closed_season: 'Open all year',
    notes: 'Popular angling species found along rocky shores'
  },
  {
    english_name: 'Common / Dusky kob',
    scientific_name: 'Argyrosomus japonicus',
    afrikaans_name: 'Kabeljou',
    photo_name: 'common-kob.jpg',
    slope: 3.1,
    intercept: 0.15,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: '60cm',
    closed_season: 'Open all year',
    notes: 'Large predatory fish highly sought after by anglers'
  },
  {
    english_name: 'Black musselcracker',
    scientific_name: 'Cymatoceps nasutus',
    afrikaans_name: 'Swart musselcracker',
    photo_name: 'black-musselcracker.jpg',
    slope: 2.9,
    intercept: 0.14,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '2',
    size_limit: '50cm',
    closed_season: 'Open all year',
    notes: 'Powerful reef fish found in rocky areas'
  },
  {
    english_name: 'Shorttail stingray / Black stingray',
    scientific_name: 'Dasyatis brevicaudata',
    afrikaans_name: 'Swart pylstert',
    photo_name: 'black-stingray.jpg',
    slope: 2.7,
    intercept: 0.13,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Large stingray species'
  },
  {
    english_name: 'Blacktail',
    scientific_name: 'Diplodus sargus',
    afrikaans_name: 'Swartstert',
    photo_name: 'blacktail.jpg',
    slope: 2.6,
    intercept: 0.11,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '10',
    size_limit: '25cm',
    closed_season: 'Open all year',
    notes: 'Common inshore species'
  },
  {
    english_name: 'Blue stingray (Female)',
    scientific_name: 'Dasyatis chrysonota',
    afrikaans_name: 'Blou pylstert (Vroulik)',
    photo_name: 'blue-stingray.jpg',
    slope: 2.8,
    intercept: 0.15,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Female blue stingray'
  },
  {
    english_name: 'Blue stingray (Male)',
    scientific_name: 'Dasyatis chrysonota',
    afrikaans_name: 'Blou pylstert (Manlik)',
    photo_name: 'blue-stingray.jpg',
    slope: 2.8,
    intercept: 0.15,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Male blue stingray'
  },
  {
    english_name: 'Cape stumpnose',
    scientific_name: 'Rhabdosargus holubi',
    afrikaans_name: 'Kaapse stompneus',
    photo_name: 'cape-stumpnose.jpg',
    slope: 2.5,
    intercept: 0.10,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '10',
    size_limit: '20cm',
    closed_season: 'Open all year',
    notes: 'Popular estuary species'
  },
  {
    english_name: 'Diamond / Butterfly ray',
    scientific_name: 'Gymnura natalensis',
    afrikaans_name: 'Diamant pylstert',
    photo_name: 'diamon-ray.jpg',
    slope: 2.4,
    intercept: 0.12,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Diamond-shaped ray species'
  },
  {
    english_name: 'Bull ray / Duckbill',
    scientific_name: 'Myliobatis aquila',
    afrikaans_name: 'Bul pylstert',
    photo_name: 'duckbill.jpg',
    slope: 2.9,
    intercept: 0.16,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Large eagle ray species'
  },
  {
    english_name: 'Galjoen',
    scientific_name: 'Dichistius capensis',
    afrikaans_name: 'Galjoen',
    photo_name: 'galjoen.jpg',
    slope: 2.7,
    intercept: 0.13,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '5',
    size_limit: '35cm',
    closed_season: 'Open all year',
    notes: 'South Africa\'s national fish'
  },
  {
    english_name: 'Leervis / Garrick',
    scientific_name: 'Lichia amia',
    afrikaans_name: 'Leervis',
    photo_name: 'garrick.jpg',
    slope: 3.0,
    intercept: 0.17,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '2',
    size_limit: '70cm',
    closed_season: 'Open all year',
    notes: 'Popular game fish'
  },
  {
    english_name: 'Giant kingfish',
    scientific_name: 'Caranx ignobilis',
    afrikaans_name: 'Reuse koningvis',
    photo_name: 'giant-kingfish.jpg',
    slope: 3.2,
    intercept: 0.18,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '2',
    size_limit: '80cm',
    closed_season: 'Open all year',
    notes: 'Large predatory fish'
  },
  {
    english_name: 'Greyspot guitarfish',
    scientific_name: 'Rhinobatos annulatus',
    afrikaans_name: 'Grysplek kitaarvis',
    photo_name: 'lesser-guitarfish.jpg',
    slope: 2.6,
    intercept: 0.12,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Guitarfish species'
  },
  {
    english_name: 'Roman',
    scientific_name: 'Chrysoblephus laticeps',
    afrikaans_name: 'Roman',
    photo_name: 'roman.jpg',
    slope: 2.8,
    intercept: 0.14,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '5',
    size_limit: '30cm',
    closed_season: 'Open all year',
    notes: 'Popular reef fish'
  },
  {
    english_name: 'Sevengill cowshark',
    scientific_name: 'Notorynchus cepedianus',
    afrikaans_name: 'Sevengill koeihaai',
    photo_name: 'sevengill-cowshark.jpg',
    slope: 3.1,
    intercept: 0.16,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Large shark species with 7 gill slits'
  },
  {
    english_name: 'Elf / Shad',
    scientific_name: 'Pomatomus saltatrix',
    afrikaans_name: 'Elf',
    photo_name: 'shad.jpg',
    slope: 2.9,
    intercept: 0.15,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '4',
    size_limit: '35cm',
    closed_season: 'Open all year',
    notes: 'Migratory fish species'
  },
  {
    english_name: 'Spotted grunter',
    scientific_name: 'Pomadasys commersonnii',
    afrikaans_name: 'Gevlekte knorhaan',
    photo_name: 'spotted-grunter.jpg',
    slope: 2.7,
    intercept: 0.13,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '5',
    size_limit: '30cm',
    closed_season: 'Open all year',
    notes: 'Estuary and surf species'
  },
  {
    english_name: 'Spotted gullyshark',
    scientific_name: 'Triakis megalopterus',
    afrikaans_name: 'Gevlekte slootshaai',
    photo_name: 'spotted-gullyshark.jpg',
    slope: 2.8,
    intercept: 0.14,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Small shark species'
  },
  {
    english_name: 'Spotted ragged-tooth shark (Female)',
    scientific_name: 'Carcharias taurus',
    afrikaans_name: 'Gevlekte ragtandhaai (Vroulik)',
    photo_name: 'spotted-raggedtoothshark.jpg',
    slope: 3.0,
    intercept: 0.17,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Female ragged-tooth shark'
  },
  {
    english_name: 'Spotted ragged-tooth shark (Male)',
    scientific_name: 'Carcharias taurus',
    afrikaans_name: 'Gevlekte ragtandhaai (Manlik)',
    photo_name: 'spotted-raggedtoothshark.jpg',
    slope: 3.0,
    intercept: 0.17,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '1',
    size_limit: 'No limit',
    closed_season: 'Open all year',
    notes: 'Male ragged-tooth shark'
  },
  {
    english_name: 'White musselcracker',
    scientific_name: 'Sparodon durbanensis',
    afrikaans_name: 'Wit musselcracker',
    photo_name: 'white-musselcracker.jpg',
    slope: 2.9,
    intercept: 0.15,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '2',
    size_limit: '50cm',
    closed_season: 'Open all year',
    notes: 'White variant of musselcracker'
  },
  {
    english_name: 'White steenbras',
    scientific_name: 'Lithognathus lithognathus',
    afrikaans_name: 'Wit steenbras',
    photo_name: 'white-steenbras.jpg',
    slope: 2.8,
    intercept: 0.14,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '2',
    size_limit: '60cm',
    closed_season: 'Open all year',
    notes: 'Large steenbras species'
  },
  {
    english_name: 'Zebra',
    scientific_name: 'Diplodus cervinus',
    afrikaans_name: 'Zebra',
    photo_name: 'zebra.jpg',
    slope: 2.6,
    intercept: 0.12,
    distribution_map: 'map1.jpg',
    angling_species: true,
    salt_fresh_water: 'Salt',
    distribution: 'South African coast',
    bag_limit: '10',
    size_limit: '25cm',
    closed_season: 'Open all year',
    notes: 'Zebra-striped fish species'
  }
]

async function populateReferenceTable() {
  console.log('🚀 Populating reference_table with species data...')
  
  try {
    // Insert all reference data
    const { data, error } = await supabase
      .from('reference_table')
      .insert(referenceData)
      .select()
    
    if (error) {
      console.error('❌ Error inserting reference data:', error)
      return false
    }
    
    console.log('✅ Successfully inserted', data.length, 'species into reference_table')
    console.log('📊 Sample data inserted:')
    data.slice(0, 3).forEach((species, index) => {
      console.log(`  ${index + 1}. ${species.english_name} (${species.photo_name})`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Error populating reference table:', error)
    return false
  }
}

// Run the population
populateReferenceTable()
