# 🌊 Tide API Setup Guide

## WorldTides API (Recommended)

The FishApp uses WorldTides API for accurate global tide data including South African coastal areas.

### Step 1: Get API Key
1. Visit [worldtides.info](https://www.worldtides.info/)
2. Click "Sign Up" or "Get API Key"
3. Create a free account
4. **Free Tier**: 100 requests/month
5. **Paid**: $0.10 per request after free tier

### Step 2: Add API Key to Your App
1. Create a `.env` file in your FishApp root directory:
```env
VITE_WORLDTIDES_API_KEY=your_api_key_here
```

2. Add `.env` to your `.gitignore` file to keep the key secure
3. Restart your development server: `npm run dev`

### Step 3: Test the Integration
1. Open FishApp
2. Click "Tide and Moon" button
3. Select a coastal location (e.g., Cape Town)
4. You should see live tide data!

## Alternative APIs

### Storm Glass API
- **Free**: 50 requests/day
- **Website**: [stormglass.io](https://stormglass.io/)
- **Data**: Tides + Weather + Moon
- **Setup**: Similar to WorldTides, get API key and add to `.env`

### NOAA Tides API (US Only)
- **Free**: Unlimited
- **Coverage**: US locations only
- **Not suitable**: for South African locations

## API Response Format

WorldTides API returns data like this:
```json
{
  "extremes": [
    {
      "dt": 1640995200,
      "height": 1.8,
      "type": "High"
    },
    {
      "dt": 1641016800,
      "height": 0.4,
      "type": "Low"
    }
  ]
}
```

## Troubleshooting

### "Demo API key used" Error
- You're using the demo key (limited functionality)
- Get a real API key from worldtides.info
- Add it to your `.env` file

### "No tide data available"
- Location might not have tide station coverage
- Try a different coastal location
- Check if coordinates are correct

### Rate Limit Exceeded
- Free tier: 100 requests/month
- Implement caching to reduce API calls
- Consider upgrading to paid tier

## Cost Management

### Free Tier Strategy (100 requests/month)
- Cache tide data for 24 hours
- Limit to popular locations
- Show cached data when possible

### Caching Implementation
```javascript
// Store in localStorage with timestamp
const cacheKey = `tides_${lat}_${lng}_${date}`
const cached = localStorage.getItem(cacheKey)
if (cached) {
  const { data, timestamp } = JSON.parse(cached)
  if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
    // Use cached data (less than 24 hours old)
    return data
  }
}
```

## South African Coverage

WorldTides API covers these South African locations:
✅ Cape Town, Durban, Port Elizabeth
✅ East London, Hermanus, Knysna
✅ Plettenberg Bay, Mossel Bay
✅ All major coastal towns

The app includes 27 pre-configured South African coastal locations with accurate coordinates.
