import { createElement } from "react";
import { notFound } from "next/navigation";
import { cities } from "@/data/cities";
import { getWeatherDetails } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { getWeatherBackground } from "../lib/weatherBackgrounds";
import {
  getCurrentTimeInTimezone,
  formatDate,
  isNightTime,
} from "../lib/utils";
import { ForecastSection } from "../components/ForecastSection";
import { TemperatureDisplay } from "../components/TemperatureDisplay";

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
  const todayForecast = weather.daily[0];
  const Icon = getWeatherIcon(weather.current.weatherCode);
  const description = getWeatherDescription(weather.current.weatherCode);
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );
  const background = getWeatherBackground(weather.current.weatherCode, isNight);

  return (
    <div className={`min-h-screen bg-linear-to-b ${background}`}>
      <div className="max-w-xl mx-auto py-24 px-6">
        <div className="flex flex-col gap-16 py-8">
          <header className="flex flex-col gap-8">
            <section className="flex flex-col">
              <h2 className="text-xl font-semibold text-shadow-md">
                {location.name}
              </h2>
              <p className="text-base text-white text-shadow-sm">
                {formatDate(todayForecast.date)}{" "}
                {getCurrentTimeInTimezone(weather.current.timezone)}
              </p>
            </section>

            <section className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <TemperatureDisplay
                  value={weather.current.temperature}
                  className="text-6xl font-light text-shadow-lg"
                />
                <p className="text-base text-white text-shadow-sm">
                  {description}
                </p>
              </div>
              {createElement(Icon, { isNight, className: "size-28" })}
            </section>
          </header>

          <ForecastSection days={weather.daily} />
        </div>
      </div>
    </div>
  );
}