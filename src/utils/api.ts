// Weather API
export const getWeatherUrl = (lat: number, lon: number, type: 'current' | 'astronomy' = 'current', date?: string) => {
  if (import.meta.env.DEV) {
    const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
    if (!apiKey) throw new Error('Missing VITE_WEATHERAPI_KEY in .env');

    if (type === 'astronomy') {
      return `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${date}`;
    }
    return `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
  }

  // Production: go through Vercel serverless function
  if (type === 'astronomy') {
    return `/api/weather?lat=${lat}&lon=${lon}&type=astronomy&date=${date}`;
  }
  return `/api/weather?lat=${lat}&lon=${lon}&type=current`;
};

// Tides API
export const getTidesUrl = (lat: number, lon: number, start: number, length: number) => {
  if (import.meta.env.DEV) {
    const apiKey = import.meta.env.VITE_WORLDTIDES_KEY;
    if (!apiKey) throw new Error('Missing VITE_WORLDTIDES_KEY in .env');

    return `https://www.worldtides.info/api?extremes&lat=${lat}&lon=${lon}&start=${start}&length=${length}&key=${apiKey}`;
  }

  // Production: go through Vercel serverless function
  return `/api/tides?lat=${lat}&lon=${lon}&start=${start}&length=${length}`;
};
