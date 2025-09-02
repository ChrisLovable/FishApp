// Quick test script to verify Supabase image URLs
// Run this in browser console to test image URLs

const testImageUrls = async () => {
  console.log('🧪 Testing Supabase image URLs...')
  
  // Get Supabase URL from environment
  const supabaseUrl = 'https://gvijhiueitaujezwsdut.supabase.co'
  
  // Test fish image URL
  const fishImageUrl = `${supabaseUrl}/storage/v1/object/public/fish-images/bronze-bream.jpg`
  console.log('Fish image URL:', fishImageUrl)
  
  // Test distribution map URL
  const mapUrl = `${supabaseUrl}/storage/v1/object/public/distribution-maps/bream-distribution.jpg`
  console.log('Distribution map URL:', mapUrl)
  
  // Test if images load
  if (fishImageUrl) {
    const img = new Image()
    img.onload = () => console.log('✅ Fish image loads successfully')
    img.onerror = () => console.log('❌ Fish image failed to load')
    img.src = fishImageUrl
  }
  
  if (mapUrl) {
    const img = new Image()
    img.onload = () => console.log('✅ Distribution map loads successfully')
    img.onerror = () => console.log('❌ Distribution map failed to load')
    img.src = mapUrl
  }
}

// Run the test
testImageUrls()
