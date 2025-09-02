import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions for image URLs
export const getFishImageUrl = (imageName: string, speciesName?: string) => {
  // Create mapping from species names to image files
  const speciesImageMap: { [key: string]: string } = {
    // Exact matches from the data
    'Common / Dusky kob': 'common-kob.jpg',
    'Small kob': 'common-kob.jpg',
    'Snapper kob': 'common-kob.jpg',
    'Squaretail kob': 'common-kob.jpg',
    'Bronze bream': 'bronze-bream.jpg',
    'King soldierbream': 'bronze-bream.jpg',
    'River bream / Perch': 'bronze-bream.jpg',
    'Stone bream': 'bronze-bream.jpg',
    'Twobar bream': 'bronze-bream.jpg',
    'Black musselcracker': 'black-musselcracker.jpg',
    'White musselcracker': 'white-musselcracker.jpg',
    'Blacktail': 'blacktail.jpg',
    'Galjoen': 'galjoen.jpg',
    'Garrick': 'garrick.jpg',
    'Giant kingfish': 'giant-kingfish.jpg',
    'Roman': 'roman.jpg',
    'Shad': 'shad.jpg',
    'Spotted grunter': 'spotted-grunter.jpg',
    'White steenbras': 'white-steenbras.jpg',
    'Zebra': 'zebra.jpg',
    'Cape stumpnose': 'cape-stumpnose.jpg',
    'Duckbill': 'duckbill.jpg',
    'Copper shark': 'copper-shark.jpg',
    'Scalloped hammerhead shark': 'scalloped-hammerheadshark.jpg',
    'Sevengill cowshark': 'sevengill-cowshark.jpg',
    'Smooth hound shark': 'smooth-houndshark.jpg',
    'Spotted gully shark': 'spotted-gullyshark.jpg',
    'Spotted raggedtooth shark': 'spotted-raggedtoothshark.jpg',
    'Black stingray': 'black-stingray.jpg',
    'Blue stingray': 'blue-stingray.jpg',
    'Lesser guitarfish': 'lesser-guitarfish.jpg',
    'Diamond ray': 'diamon-ray.jpg',
    
    // Partial matches for variations
    'Kob': 'common-kob.jpg',
    'Bream': 'bronze-bream.jpg',
    'Musselcracker': 'black-musselcracker.jpg',
    'Hammerhead': 'scalloped-hammerheadshark.jpg',
    'Guitarfish': 'lesser-guitarfish.jpg',
    'Stingray': 'black-stingray.jpg',
    'Shark': 'copper-shark.jpg'
  }

  // Try to find image by species name first
  let imageFile = imageName
  if (speciesName) {
    const mappedImage = speciesImageMap[speciesName]
    if (mappedImage) {
      imageFile = mappedImage
    }
  }

  // If no image name provided, use roman.jpg as fallback
  if (!imageFile) {
    return `/images/fish/roman.jpg`
  }
  
  // If Supabase is not configured, use local images
  if (!supabase) {
    return `/images/fish/${imageFile}`
  }
  
  // Try Supabase first, fallback to local
  try {
    const { data } = supabase.storage
      .from('fish-images')
      .getPublicUrl(imageFile)
    return data.publicUrl
  } catch (error) {
    console.warn('Supabase unavailable, using local image:', error)
    return `/images/fish/${imageFile}`
  }
}

export const getDistributionMapUrl = (mapName: string) => {
  // Use the same distribution map for all species (map1.jpg)
  const defaultMap = 'map1.jpg'
  
  // If Supabase is not configured, use local images
  if (!supabase) {
    return `/images/maps/${defaultMap}`
  }
  
  // Try Supabase first, fallback to local
  try {
    const { data } = supabase.storage
      .from('distribution-maps')
      .getPublicUrl(defaultMap)
    return data.publicUrl
  } catch (error) {
    console.warn('Supabase unavailable, using local map:', error)
    return `/images/maps/${defaultMap}`
  }
}
