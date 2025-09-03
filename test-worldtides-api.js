// Test script to debug WorldTides API 400 error
const fetch = require('node-fetch');

// Test cases to identify the issue
const testCases = [
  {
    name: 'Basic test with Cape Town',
    params: {
      heights: '',
      extremes: '',
      lat: '-33.9249',
      lon: '18.4241',
      key: process.env.VITE_WORLDTIDES_API_KEY,
      start: Math.floor(Date.now() / 1000),
      length: '86400'
    }
  },
  {
    name: 'Test without start parameter',
    params: {
      heights: '',
      extremes: '',
      lat: '-33.9249',
      lon: '18.4241',
      key: process.env.VITE_WORLDTIDES_API_KEY,
      length: '86400'
    }
  },
  {
    name: 'Test with different location (Durban)',
    params: {
      heights: '',
      extremes: '',
      lat: '-29.8587',
      lon: '31.0218',
      key: process.env.VITE_WORLDTIDES_API_KEY,
      start: Math.floor(Date.now() / 1000),
      length: '86400'
    }
  },
  {
    name: 'Test with only extremes (no heights)',
    params: {
      extremes: '',
      lat: '-33.9249',
      lon: '18.4241',
      key: process.env.VITE_WORLDTIDES_API_KEY,
      start: Math.floor(Date.now() / 1000),
      length: '86400'
    }
  },
  {
    name: 'Test with only heights (no extremes)',
    params: {
      heights: '',
      lat: '-33.9249',
      lon: '18.4241',
      key: process.env.VITE_WORLDTIDES_API_KEY,
      start: Math.floor(Date.now() / 1000),
      length: '86400'
    }
  }
];

async function testWorldTidesAPI() {
  console.log('Testing WorldTides API...\n');
  
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name} ===`);
    
    const params = new URLSearchParams(testCase.params);
    const url = `https://www.worldtides.info/api/v3?${params.toString()}`;
    
    console.log('URL:', url.replace(process.env.VITE_WORLDTIDES_API_KEY, '***HIDDEN***'));
    console.log('Parameters:', Object.fromEntries(params.entries()));
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.log('❌ FAILED');
      } else {
        console.log('✅ SUCCESS');
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
}

// Check if API key exists
if (!process.env.VITE_WORLDTIDES_API_KEY) {
  console.error('❌ VITE_WORLDTIDES_API_KEY environment variable not found');
  process.exit(1);
}

console.log('API Key length:', process.env.VITE_WORLDTIDES_API_KEY.length);
testWorldTidesAPI();
