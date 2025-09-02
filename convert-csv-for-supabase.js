// Script to convert the CSV file for Supabase import
import fs from 'fs'

console.log('🔄 Converting CSV for Supabase import...')

try {
  // Read the original CSV file
  const csvContent = fs.readFileSync('public/referencefile.csv', 'utf8')
  
  // Split into lines
  const lines = csvContent.split('\n')
  
  // Get headers and convert to match table structure
  const headers = lines[0].split(';')
  console.log('📋 Original headers:', headers.length)
  
  // Map CSV headers to table column names
  const headerMapping = {
    'English name': 'english_name',
    'Scientific name': 'scientific_name', 
    'Afrikaans name': 'afrikaans_name',
    'Photo name': 'photo_name',
    'Length to measure': 'length_to_measure',
    'Bag limit': 'bag_limit',
    'Size limit': 'size_limit',
    'Closed season': 'closed_season',
    'SASAA Heavy tackle record': 'sasaa_heavy_tackle_record',
    'SASAA Light tackle record': 'sasaa_light_tackle_record',
    'SASAA Ladies record': 'sasaa_women_record',
    'SASAA Junior U/16 record': 'sasaa_junior_u16_record',
    'Deep sea record - All tackle (kg)': 'deep_sea_record_all_tackle',
    'SASSI LIST': 'sassi_list',
    'DISTRIBUTION MAP': 'distribution_map',
    'NOTES': 'notes',
    'Salt / Fresh water': 'salt_fresh_water',
    'DISTRIBUTION': 'distribution'
  }
  
  // Create new headers for Supabase
  const newHeaders = headers.map(header => {
    const trimmed = header.trim()
    return headerMapping[trimmed] || trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_')
  })
  
  console.log('📝 New headers:', newHeaders)
  
  // Convert data rows
  const newLines = []
  newLines.push(newHeaders.join(',')) // Add header row
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(';')
      
      // Clean and format values
      const cleanValues = values.map(value => {
        const cleaned = value.trim()
        // Escape commas and quotes in values
        if (cleaned.includes(',') || cleaned.includes('"')) {
          return `"${cleaned.replace(/"/g, '""')}"`
        }
        return cleaned
      })
      
      newLines.push(cleanValues.join(','))
    }
  }
  
  // Write the converted CSV
  const convertedContent = newLines.join('\n')
  fs.writeFileSync('public/referencefile-supabase.csv', convertedContent)
  
  console.log('✅ Converted CSV saved as: referencefile-supabase.csv')
  console.log(`📊 Converted ${newLines.length - 1} data rows`)
  console.log('🎯 Ready for Supabase import!')
  
} catch (error) {
  console.error('❌ Error converting CSV:', error)
}
