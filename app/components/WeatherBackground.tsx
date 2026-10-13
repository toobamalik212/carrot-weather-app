import type { ReactNode } from "react";
import { getWeatherBackground } from "../lib/weatherBackgrounds";

interface WeatherBackgroundProps {
  weatherCode: number;
  isNight: boolean;
  children: ReactNode;
}

// Full-height gradient that matches the current weather and time of day
export function WeatherBackground({
  weatherCode,
  isNight,
  children,
}: WeatherBackgroundProps) {
  const background = getWeatherBackground(weatherCode, isNight);

  return (
    <div className={`min-h-screen bg-linear-to-b ${background}`}>{children}</div>
  );
}
