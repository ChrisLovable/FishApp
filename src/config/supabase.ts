import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions for image URLs
export const getFishImageUrl = (imageName: string) => {
  if (!imageName) return null
  
  // If Supabase is not configured, use local images
  if (!supabase) {
    return `/images/fish/${imageName}`
  }
  
  // Try Supabase first, fallback to local
  try {
    const { data } = supabase.storage
      .from('fish-images')
      .getPublicUrl(imageName)
    return data.publicUrl
  } catch (error) {
    console.warn('Supabase unavailable, using local image:', error)
    return `/images/fish/${imageName}`
  }
}

export const getDistributionMapUrl = (mapName: string) => {
  if (!mapName) return null
  
  // If Supabase is not configured, use local images
  if (!supabase) {
    return `/images/maps/${mapName}`
  }
  
  // Try Supabase first, fallback to local
  try {
    const { data } = supabase.storage
      .from('distribution-maps')
      .getPublicUrl(mapName)
    return data.publicUrl
  } catch (error) {
    console.warn('Supabase unavailable, using local map:', error)
    return `/images/maps/${mapName}`
  }
}
