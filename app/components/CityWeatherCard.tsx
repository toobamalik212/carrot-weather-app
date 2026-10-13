import type { City } from "@/data/cities";
import type { WeatherData } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { isNightTime } from "../lib/utils";
import { LocationCard } from "./LocationCard";

interface CityWeatherCardProps {
  city: City;
  weather: WeatherData;
}

export function CityWeatherCard({ city, weather }: CityWeatherCardProps) {
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );

  return (
    <LocationCard
      slug={city.slug}
      name={city.name}
      description={getWeatherDescription(weather.current.weatherCode)}
      temperature={weather.current.temperature}
      timezone={weather.current.timezone}
      Icon={getWeatherIcon(weather.current.weatherCode)}
      isNight={isNight}
      weatherCode={weather.current.weatherCode}
    />
  );
}
