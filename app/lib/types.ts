import { ComponentType } from "react";

export interface WeatherIconProps {
  className?: string;
  isNight?: boolean;
}

export type WeatherIcon = ComponentType<WeatherIconProps>;

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  timezone: string;
  sunrise: string;
  sunset: string;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

// Detailed weather for the city detail page. All values are metric
// (°C, km/h, mm, %). Open-Meteo can return null for any field, so the
// extra metrics are nullable.
export interface DailyForecastDetail extends DailyForecast {
  feelsLikeMax: number | null;
  feelsLikeMin: number | null;
  uvIndexMax: number | null;
  windSpeedMax: number | null;
  windGustsMax: number | null;
  windDirectionDominant: number | null; // degrees, 0 = north
  precipitationProbabilityMax: number | null;
  precipitationSum: number | null;
  rainSum: number | null;
  showersSum: number | null;
  precipitationHours: number | null;
  cloudCoverMean: number | null;
  sunshineHours: number | null;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string; // local time without offset, e.g. "2026-10-13T08:00"
  temperature: number | null;
  feelsLike: number | null;
  weatherCode: number | null;
  uvIndex: number | null;
  cloudCover: number | null;
  precipitationProbability: number | null;
  precipitation: number | null;
  rain: number | null;
  showers: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts: number | null;
  cape: number | null; // atmospheric instability, J/kg
  isDay: boolean;
}

// Summary of the hours in one part of a day, e.g. Morning (06:00–12:00)
export interface DayPeriodSummary {
  label: string;
  timeRange: string; // e.g. "6 AM – 12 PM"
  weatherCode: number | null; // most severe code in the period
  maxTemp: number | null;
  feelsLikeMax: number | null;
  precipitationProbability: number | null; // highest hourly value
  precipitation: number | null; // total mm
  windSpeed: number | null; // highest hourly value
  windGusts: number | null; // highest hourly value
  windDirection: number | null; // average direction, degrees
  cloudCover: number | null; // average %
}

// Estimated from hourly weather codes and instability (CAPE).
// Open-Meteo has no thunderstorm probability, so this is a rough guide.
export type ThunderstormRisk = "None" | "Possible" | "Likely";

export interface DailyForecastWithPeriods extends DailyForecastDetail {
  periods: DayPeriodSummary[];
  thunderstormRisk: ThunderstormRisk | null;
}

export interface WeatherDetailsData {
  current: CurrentWeather;
  daily: DailyForecastDetail[];
  hourly: HourlyForecast[];
}