import { supabase } from '../config/supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    if (!supabase) {
      console.error('Supabase not configured - check environment variables')
      return { success: false, error: 'Supabase not configured - check environment variables' }
    }
    
    // Test basic connection
    const { data, error } = await supabase
      .from('species')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful!')
    return { success: true, data }
  } catch (error) {
    console.error('Supabase test failed:', error)
    return { success: false, error: error.message }
  }
}

export const testImageUrls = () => {
  console.log('Testing image URL generation...')
  
  if (!supabase) {
    console.log('Supabase not configured, using local URLs')
    return {
      fishUrl: '/images/fish/bronze-bream.jpg',
      mapUrl: '/images/maps/map-001.jpg'
    }
  }
  
  // Test fish image URL
  const fishUrl = supabase.storage
    .from('fish-images')
    .getPublicUrl('bronze-bream.jpg')
  
  console.log('Fish image URL:', fishUrl.data.publicUrl)
  
  // Test distribution map URL
  const mapUrl = supabase.storage
    .from('distribution-maps')
    .getPublicUrl('map-001.jpg')
  
  console.log('Distribution map URL:', mapUrl.data.publicUrl)
  
  return {
    fishUrl: fishUrl.data.publicUrl,
    mapUrl: mapUrl.data.publicUrl
  }
}
