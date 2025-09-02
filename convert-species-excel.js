// Node.js script to convert species details Excel file to JSON
// Run with: node convert-species-excel.js

import XLSX from 'xlsx';
import fs from 'fs';

try {
  // Read the species details Excel file
  const workbook = XLSX.readFile('public/species-details.xlsx'); // Update filename as needed
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('Species details Excel data preview:');
  console.log(jsonData.slice(0, 2)); // Show first 2 entries
  console.log(`Total species: ${jsonData.length}`);
  
  // Write to JSON file in public directory
  fs.writeFileSync('public/speciesDetails.json', JSON.stringify(jsonData, null, 2));
  
  console.log('✅ Successfully converted species details Excel to JSON!');
  console.log('📁 File saved as: public/speciesDetails.json');
  
  // Show expected column structure
  console.log('\n📋 Expected Excel columns:');
  console.log('- English name (required)');
  console.log('- Afrikaans name (optional)');
  console.log('- Scientific name (optional)');
  console.log('- Description (optional)');
  console.log('- Habitat (optional)');
  console.log('- Diet (optional)');
  console.log('- Size (optional)');
  console.log('- Distribution (optional)');
  console.log('- Image (optional - filename in /images/fish/)');
  console.log('- Distribution Map (optional - filename in /images/maps/)');
  console.log('- Slope (required for calculations)');
  console.log('- Intercept (required for calculations)');
  
} catch (error) {
  console.error('❌ Error converting species details Excel file:', error.message);
  console.log('\n📋 To fix this:');
  console.log('1. Make sure xlsx package is installed: npm install xlsx');
  console.log('2. Place your species details Excel file as: public/species-details.xlsx');
  console.log('3. Or update the filename in this script');
}
