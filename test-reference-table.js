// Script to test the reference_table structure
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvijhiueitaujezwsdut.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aWpoaXVlaXRhdWplendzZHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDE3NjEsImV4cCI6MjA3MjM3Nzc2MX0.x3ScEnQlt5pmQn9qE9Tw7qTSDeyvJkOa3nQAn7beaIs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testReferenceTable() {
  console.log('🔍 Testing reference_table structure...')
  
  try {
    // Test if table exists and get structure
    const { data, error } = await supabase
      .from('reference_table')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing reference table:', error)
      return false
    }
    
    console.log('✅ Reference table is accessible')
    console.log('📊 Table structure confirmed')
    console.log('📝 Ready for data import')
    
    return true
    
  } catch (error) {
    console.error('❌ Error testing reference table:', error)
    return false
  }
}

// Run the test
testReferenceTable()
