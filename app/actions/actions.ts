"use server";

import { WeatherData } from "../lib/types";

export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto&forecast_days=7`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    current: {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      timezone: data.timezone,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    },
    daily: data.daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: Math.round(data.daily.temperature_2m_max[index]),
      minTemp: Math.round(data.daily.temperature_2m_min[index]),
      weatherCode: data.daily.weather_code[index],
    })),
  };
}

// Fetches weather for several cities in parallel, keyed by slug.
// Cities whose request fails are left out of the result.
export async function getWeatherForCities(
  cities: { slug: string; latitude: number; longitude: number }[]
): Promise<Record<string, WeatherData>> {
  const results = await Promise.allSettled(
    cities.map((city) => getWeather(city.latitude, city.longitude))
  );

  const weatherBySlug: Record<string, WeatherData> = {};
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      weatherBySlug[cities[index].slug] = result.value;
    }
  });
  return weatherBySlug;
}