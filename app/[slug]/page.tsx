import { notFound } from "next/navigation";
import { cities } from "@/data/cities";
import { getWeatherDetails } from "../actions/actions";
import { isNightTime } from "../lib/utils";
import { addHourlySummaries } from "../lib/weatherDetails";
import { ForecastSection } from "../components/ForecastSection";
import { LocationHeader } from "../components/LocationHeader";
import { CurrentConditions } from "../components/CurrentConditions";
import { WeatherBackground } from "../components/WeatherBackground";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = cities.find((city) => city.slug === slug);

  if (!location) {
    notFound();
  }

  const weather = await getWeatherDetails(location.latitude, location.longitude);
  const days = addHourlySummaries(weather.daily, weather.hourly);
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );

  return (
    <WeatherBackground weatherCode={weather.current.weatherCode} isNight={isNight}>
      <div className="max-w-xl mx-auto py-24 px-6">
        <div className="flex flex-col gap-16 py-8">
          <header className="flex flex-col gap-8">
            <LocationHeader
              name={location.name}
              date={weather.daily[0].date}
              timezone={weather.current.timezone}
            />
            <CurrentConditions
              temperature={weather.current.temperature}
              weatherCode={weather.current.weatherCode}
              isNight={isNight}
            />
          </header>

          <ForecastSection days={days} />
        </div>
      </div>
    </WeatherBackground>
  );
}
