// src/utils/api.ts

const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Local dev (Vite on your laptop)
    return "http://localhost:5173/api";
  } else {
    // Production (Vercel deployment)
    return "https://your-vercel-app.vercel.app/api"; // <-- replace with your actual Vercel domain
  }
};

// Weather API wrapper
export const getWeatherUrl = (lat: number, lon: number, type: "current" | "astronomy" = "current", date?: string) => {
  const base = getBaseUrl();
  if (type === "astronomy") {
    return `${base}/weather?lat=${lat}&lon=${lon}&type=astronomy&date=${date}`;
  }
  return `${base}/weather?lat=${lat}&lon=${lon}&type=current`;
};

// Tides API wrapper
export const getTidesUrl = (lat: number, lon: number, start: number, length: number) => {
  const base = getBaseUrl();
  return `${base}/tides?lat=${lat}&lon=${lon}&start=${start}&length=${length}`;
};