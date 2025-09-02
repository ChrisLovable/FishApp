// Check what files actually exist in Supabase storage
// Run this in browser console

const checkStorageFiles = async () => {
  console.log('🔍 Checking what files exist in Supabase storage...')
  
  // We need to use the Supabase client from the app
  // Let's try to access it from the global scope
  if (typeof window !== 'undefined' && window.supabase) {
    const supabase = window.supabase
    
    try {
      // List files in fish-images bucket
      console.log('📁 Checking fish-images bucket...')
      const { data: fishFiles, error: fishError } = await supabase.storage
        .from('fish-images')
        .list('')
      
      if (fishError) {
        console.log('❌ Error listing fish-images:', fishError)
      } else {
        console.log('✅ Fish images found:', fishFiles)
      }
      
      // List files in distribution-maps bucket
      console.log('📁 Checking distribution-maps bucket...')
      const { data: mapFiles, error: mapError } = await supabase.storage
        .from('distribution-maps')
        .list('')
      
      if (mapError) {
        console.log('❌ Error listing distribution-maps:', mapError)
      } else {
        console.log('✅ Distribution maps found:', mapFiles)
      }
      
    } catch (error) {
      console.log('❌ Error accessing Supabase:', error)
    }
  } else {
    console.log('❌ Supabase client not found in global scope')
    console.log('💡 Try running this from the Species Information modal where Supabase is imported')
  }
}

// Run the check
checkStorageFiles()
