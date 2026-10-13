"use server";

import {
  WeatherData,
  WeatherDetailsData,
  DailyForecastDetail,
  HourlyForecast,
} from "../lib/types";

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

const DAILY_DETAIL_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "weather_code",
  "sunrise",
  "sunset",
  "uv_index_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
  "precipitation_probability_max",
  "precipitation_sum",
  "rain_sum",
  "showers_sum",
  "precipitation_hours",
  "cloud_cover_mean",
].join(",");

const HOURLY_DETAIL_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "weather_code",
  "uv_index",
  "cloud_cover",
  "precipitation_probability",
  "precipitation",
  "rain",
  "showers",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "is_day",
].join(",");

function roundOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" ? Math.round(value) : null;
}

function valueOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" ? value : null;
}

// Detailed 7-day forecast for the city detail page, including hourly data
// for building morning/afternoon summaries. Kept separate from getWeather
// so the homepage cards don't download the larger payload.
export async function getWeatherDetails(
  lat: number,
  lon: number
): Promise<WeatherDetailsData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=${DAILY_DETAIL_FIELDS}&hourly=${HOURLY_DETAIL_FIELDS}&timezone=auto&forecast_days=7`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();
  const daily = data.daily;
  const hourly = data.hourly;

  return {
    current: {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      timezone: data.timezone,
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
    },
    daily: daily.time.map(
      (date: string, i: number): DailyForecastDetail => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        weatherCode: daily.weather_code[i],
        feelsLikeMax: roundOrNull(daily.apparent_temperature_max[i]),
        feelsLikeMin: roundOrNull(daily.apparent_temperature_min[i]),
        uvIndexMax: valueOrNull(daily.uv_index_max[i]),
        windSpeedMax: roundOrNull(daily.wind_speed_10m_max[i]),
        windGustsMax: roundOrNull(daily.wind_gusts_10m_max[i]),
        windDirectionDominant: valueOrNull(
          daily.wind_direction_10m_dominant[i]
        ),
        precipitationProbabilityMax: valueOrNull(
          daily.precipitation_probability_max[i]
        ),
        precipitationSum: valueOrNull(daily.precipitation_sum[i]),
        rainSum: valueOrNull(daily.rain_sum[i]),
        showersSum: valueOrNull(daily.showers_sum[i]),
        precipitationHours: valueOrNull(daily.precipitation_hours[i]),
        cloudCoverMean: valueOrNull(daily.cloud_cover_mean[i]),
        sunrise: daily.sunrise[i],
        sunset: daily.sunset[i],
      })
    ),
    hourly: hourly.time.map(
      (time: string, i: number): HourlyForecast => ({
        time,
        temperature: roundOrNull(hourly.temperature_2m[i]),
        feelsLike: roundOrNull(hourly.apparent_temperature[i]),
        weatherCode: valueOrNull(hourly.weather_code[i]),
        uvIndex: valueOrNull(hourly.uv_index[i]),
        cloudCover: valueOrNull(hourly.cloud_cover[i]),
        precipitationProbability: valueOrNull(
          hourly.precipitation_probability[i]
        ),
        precipitation: valueOrNull(hourly.precipitation[i]),
        rain: valueOrNull(hourly.rain[i]),
        showers: valueOrNull(hourly.showers[i]),
        windSpeed: roundOrNull(hourly.wind_speed_10m[i]),
        windDirection: valueOrNull(hourly.wind_direction_10m[i]),
        windGusts: roundOrNull(hourly.wind_gusts_10m[i]),
        isDay: hourly.is_day[i] === 1,
      })
    ),
  };
}
