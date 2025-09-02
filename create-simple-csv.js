// Create a simple CSV with only the fields that exist in both CSV and table
import fs from 'fs'

console.log('🔄 Creating simplified CSV for Supabase...')

try {
  // Read the original CSV file
  const csvContent = fs.readFileSync('public/referencefile.csv', 'utf8')
  const lines = csvContent.split('\n')
  
  // Create simplified CSV with only matching fields
  const simpleLines = []
  
  // Header row - only include fields that exist in both
  simpleLines.push('english_name,scientific_name,afrikaans_name,photo_name,bag_limit,size_limit,closed_season,sassi_list,distribution_map,notes,salt_fresh_water,distribution')
  
  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(';')
      
      // Extract only the fields we need (in order)
      const simpleRow = [
        values[0]?.trim() || '', // English name
        values[1]?.trim() || '', // Scientific name  
        values[2]?.trim() || '', // Afrikaans name
        values[3]?.trim() || '', // Photo name
        values[5]?.trim() || '', // Bag limit
        values[6]?.trim() || '', // Size limit
        values[7]?.trim() || '', // Closed season
        values[14]?.trim() || '', // SASSI LIST
        values[15]?.trim() || '', // DISTRIBUTION MAP
        values[16]?.trim() || '', // NOTES
        values[17]?.trim() || '', // Salt / Fresh water
        values[18]?.trim() || ''  // DISTRIBUTION
      ]
      
      // Clean values - escape commas and quotes
      const cleanRow = simpleRow.map(value => {
        if (value.includes(',') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      
      simpleLines.push(cleanRow.join(','))
    }
  }
  
  // Write the simplified CSV
  const simpleContent = simpleLines.join('\n')
  fs.writeFileSync('public/referencefile-simple.csv', simpleContent)
  
  console.log('✅ Simplified CSV created: referencefile-simple.csv')
  console.log(`📊 ${simpleLines.length - 1} rows ready for import`)
  console.log('🎯 Try importing this file instead!')
  
} catch (error) {
  console.error('❌ Error creating simple CSV:', error)
}
