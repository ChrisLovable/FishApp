// Script to investigate the referencefile.xlsx contents
import XLSX from 'xlsx';
import fs from 'fs';

console.log('🔍 Investigating referencefile.xlsx...\n');

try {
  // Read the Excel file
  const workbook = XLSX.readFile('public/referencefile.xlsx');
  
  // Get all sheet names
  const sheetNames = workbook.SheetNames;
  console.log('📋 Sheet names found:');
  sheetNames.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Analyze each sheet
  sheetNames.forEach((sheetName, index) => {
    console.log(`📊 Sheet ${index + 1}: "${sheetName}"`);
    console.log('-'.repeat(30));
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length > 0) {
      // Show headers (first row)
      const headers = jsonData[0];
      console.log('📝 Headers/Columns:');
      headers.forEach((header, colIndex) => {
        console.log(`  ${colIndex + 1}. ${header}`);
      });
      
      // Show sample data (first few rows)
      console.log('\n📄 Sample data (first 3 rows):');
      for (let i = 0; i < Math.min(3, jsonData.length); i++) {
        console.log(`  Row ${i + 1}:`, jsonData[i]);
      }
      
      // Count total rows
      console.log(`\n📊 Total rows: ${jsonData.length}`);
      
      // Look for specific patterns
      const allText = JSON.stringify(jsonData).toLowerCase();
      if (allText.includes('map')) {
        console.log('🗺️  Contains map references');
      }
      if (allText.includes('image')) {
        console.log('🖼️  Contains image references');
      }
      if (allText.includes('species')) {
        console.log('🐟 Contains species information');
      }
      if (allText.includes('distribution')) {
        console.log('🌍 Contains distribution information');
      }
    } else {
      console.log('❌ No data found in this sheet');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  });
  
  // Save detailed analysis to JSON for further processing
  const analysis = {
    sheets: sheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      return {
        name: sheetName,
        headers: jsonData[0] || [],
        rowCount: jsonData.length,
        sampleData: jsonData.slice(0, 5)
      };
    })
  };
  
  fs.writeFileSync('reference-analysis.json', JSON.stringify(analysis, null, 2));
  console.log('💾 Detailed analysis saved to reference-analysis.json');
  
} catch (error) {
  console.error('❌ Error reading reference file:', error.message);
  console.log('\n💡 Make sure you have the xlsx package installed:');
  console.log('   npm install xlsx');
}
