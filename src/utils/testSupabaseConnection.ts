// Test Supabase connection and tables
import { supabase } from '../config/supabase'

export const testSupabaseTables = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  // Log the Supabase configuration (without exposing keys)
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL as string)
  console.log('Supabase Key exists:', !!(import.meta.env.VITE_SUPABASE_ANON_KEY as string))

  try {
    // Test 1: Check if tables exist
    console.log('Testing Supabase connection...')
    
    // Test species table
    const { data: speciesData, error: speciesError } = await supabase
      .from('species')
      .select('count')
      .limit(1)
    
    if (speciesError) {
      console.error('Species table error:', speciesError)
      return false
    }
    console.log('✅ Species table: OK')
    
    // Test personal_gallery table
    const { data: personalData, error: personalError } = await supabase
      .from('personal_gallery')
      .select('count')
      .limit(1)
    
    if (personalError) {
      console.error('Personal gallery table error:', personalError)
      return false
    }
    console.log('✅ Personal gallery table: OK')
    
    // Test public_gallery table
    const { data: publicData, error: publicError } = await supabase
      .from('public_gallery')
      .select('count')
      .limit(1)
    
    if (publicError) {
      console.error('Public gallery table error:', publicError)
      return false
    }
    console.log('✅ Public gallery table: OK')
    
    // Test second_hand_store table
    const { data: storeData, error: storeError } = await supabase
      .from('second_hand_store')
      .select('count')
      .limit(1)
    
    if (storeError) {
      console.error('Second hand store table error:', storeError)
      return false
    }
    console.log('✅ Second hand store table: OK')
    
    // Test storage buckets
    console.log('Testing storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    console.log('Raw buckets response:', { buckets, bucketsError })
    
    if (bucketsError) {
      console.error('Storage buckets error:', bucketsError)
      console.log('⚠️ Storage buckets test failed, but tables are working')
      return false
    }
    
    const bucketNames = buckets?.map((b: any) => b.name) || []
    const requiredBuckets = ['fish-images', 'distribution-maps', 'catch-photos', 'store-items']
    
    console.log('Available buckets:', bucketNames)
    console.log('Required buckets:', requiredBuckets)
    
    // Test each bucket individually and track results
    const accessibleBuckets: string[] = []
    
    for (const bucket of requiredBuckets) {
      try {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket)
          .list('', { limit: 1 })
        
        if (filesError) {
          console.log(`❌ Storage bucket '${bucket}': ERROR - ${filesError.message}`)
        } else {
          console.log(`✅ Storage bucket '${bucket}': OK (accessible)`)
          accessibleBuckets.push(bucket)
        }
      } catch (err) {
        console.log(`❌ Storage bucket '${bucket}': EXCEPTION - ${err}`)
      }
    }
    
    // Since listBuckets() might not work due to permissions, but individual bucket access works,
    // we'll consider it successful if we can access the required buckets individually
    if (accessibleBuckets.length === requiredBuckets.length) {
      console.log('🎉 All Supabase tests passed!')
      console.log('✅ Tables: Working')
      console.log('✅ Storage: Working (buckets accessible)')
      console.log(`✅ Accessible buckets: ${accessibleBuckets.join(', ')}`)
      return true
    } else {
      console.log('⚠️ Supabase tables working, but some storage buckets not accessible')
      console.log(`✅ Accessible: ${accessibleBuckets.join(', ')}`)
      console.log(`❌ Missing: ${requiredBuckets.filter(b => !accessibleBuckets.includes(b)).join(', ')}`)
      return false
    }
    
  } catch (error) {
    console.error('Supabase test failed:', error)
    return false
  }
}

// Test adding sample data
export const addSampleSpeciesData = async () => {
  if (!supabase) return false
  
  try {
    const { data, error } = await supabase
      .from('species')
      .insert([
        {
          english_name: 'Bronze bream',
          afrikaans_name: 'Bronze brasem',
          scientific_name: 'Pachymetopon grande',
          slope: 2.8,
          intercept: 0.12,
          image_filename: 'bronze-bream.jpg',
          distribution_map_filename: 'bream-distribution.jpg'
        },
        {
          english_name: 'Common kob',
          afrikaans_name: 'Kabeljou',
          scientific_name: 'Argyrosomus japonicus',
          slope: 3.1,
          intercept: 0.15,
          image_filename: 'common-kob.jpg',
          distribution_map_filename: 'kob-distribution.jpg'
        }
      ])
      .select()
    
    if (error) {
      console.error('Error adding sample species data:', error)
      return false
    }
    
    console.log('✅ Sample species data added:', data)
    return true
    
  } catch (error) {
    console.error('Error adding sample data:', error)
    return false
  }
}
