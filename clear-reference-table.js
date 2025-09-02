// Script to clear the reference_table in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvijhiueitaujezwsdut.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aWpoaXVlaXRhdWplendzZHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDE3NjEsImV4cCI6MjA3MjM3Nzc2MX0.x3ScEnQlt5pmQn9qE9Tw7qTSDeyvJkOa3nQAn7beaIs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearReferenceTable() {
  console.log('🗑️ Clearing reference_table...')
  
  try {
    // Delete all rows from reference_table
    const { error } = await supabase
      .from('reference_table')
      .delete()
      .neq('id', 0) // This deletes all rows
    
    if (error) {
      console.error('❌ Error clearing reference table:', error)
      return false
    }
    
    console.log('✅ Successfully cleared reference_table')
    console.log('📝 Table is now empty and ready for your data import')
    
    return true
    
  } catch (error) {
    console.error('❌ Error clearing reference table:', error)
    return false
  }
}

// Run the clear operation
clearReferenceTable()
