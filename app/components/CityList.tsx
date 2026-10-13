"use client";

import { useEffect, useRef, useState } from "react";
import { cities, type City } from "@/data/cities";
import { getWeatherForCities } from "../actions/actions";
import type { WeatherData } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { isNightTime } from "../lib/utils";
import { LocationCard } from "./LocationCard";
import { AddCityDialog } from "./AddCityDialog";

const STORAGE_KEY = "weather-saved-cities";
const DEFAULT_CITY_SLUGS = ["london", "new-york", "tokyo"];

function findCitiesBySlugs(slugs: string[]): City[] {
  return slugs
    .map((slug) => cities.find((city) => city.slug === slug))
    .filter((city): city is City => city !== undefined);
}

function loadSavedCities(): City[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const slugs: unknown = JSON.parse(stored);
      if (Array.isArray(slugs) && slugs.length > 0) {
        return findCitiesBySlugs(slugs.filter((s) => typeof s === "string"));
      }
    }
  } catch {
    // Unreadable or blocked storage: fall back to the defaults
  }
  return findCitiesBySlugs(DEFAULT_CITY_SLUGS);
}

export function CityList() {
  // null until the saved cities have been read from localStorage
  const [savedCities, setSavedCities] = useState<City[] | null>(null);
  const [weatherBySlug, setWeatherBySlug] = useState<
    Record<string, WeatherData>
  >({});
  const [failedSlugs, setFailedSlugs] = useState<string[]>([]);
  const requestedSlugs = useRef(new Set<string>());

  // Load the saved cities once, when the page first mounts.
  // localStorage only exists in the browser, so this can't run during render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedCities(loadSavedCities());
  }, []);

  // Keep localStorage in sync whenever the list changes
  useEffect(() => {
    if (savedCities === null) {
      return;
    }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedCities.map((city) => city.slug))
      );
    } catch {
      // Storage unavailable: the list still works for this visit
    }
  }, [savedCities]);

  // Fetch weather for any city we haven't requested yet
  useEffect(() => {
    if (savedCities === null) {
      return;
    }
    const missing = savedCities.filter(
      (city) => !requestedSlugs.current.has(city.slug)
    );
    if (missing.length === 0) {
      return;
    }
    missing.forEach((city) => requestedSlugs.current.add(city.slug));

    getWeatherForCities(missing)
      .then((result) => {
        setWeatherBySlug((previous) => ({ ...previous, ...result }));
        const failed = missing
          .map((city) => city.slug)
          .filter((slug) => !(slug in result));
        if (failed.length > 0) {
          setFailedSlugs((previous) => [...previous, ...failed]);
        }
      })
      .catch(() => {
        setFailedSlugs((previous) => [
          ...previous,
          ...missing.map((city) => city.slug),
        ]);
      });
  }, [savedCities]);

  function handleAddCity(city: City) {
    setSavedCities((previous) =>
      previous === null || previous.some((c) => c.slug === city.slug)
        ? previous
        : [...previous, city]
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AddCityDialog
          savedSlugs={(savedCities ?? []).map((city) => city.slug)}
          onAddCity={handleAddCity}
        />
      </div>

      <ul className="flex flex-col gap-4">
        {savedCities === null
          ? DEFAULT_CITY_SLUGS.map((slug) => (
              <li key={slug}>
                <PlaceholderCard />
              </li>
            ))
          : savedCities.map((city) => {
              const weather = weatherBySlug[city.slug];
              return (
                <li key={city.slug}>
                  {weather ? (
                    <CityWeatherCard city={city} weather={weather} />
                  ) : (
                    <PlaceholderCard
                      name={city.name}
                      failed={failedSlugs.includes(city.slug)}
                    />
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
}

function CityWeatherCard({
  city,
  weather,
}: {
  city: City;
  weather: WeatherData;
}) {
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

// Same shape as LocationCard, shown while weather loads or if it fails
function PlaceholderCard({
  name,
  failed = false,
}: {
  name?: string;
  failed?: boolean;
}) {
  return (
    <div className="py-6 px-7 rounded-2xl bg-white/5 shadow-lg shadow-black/30 inset-shadow-xs inset-shadow-white/10">
      <div className="flex justify-between items-center min-h-12">
        <div>
          {name ? (
            <h2 className="text-base font-semibold text-shadow-md">{name}</h2>
          ) : (
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
          )}
          <p className="text-sm text-muted-foreground text-shadow-sm">
            {failed ? "Couldn't load weather" : "Loading weather..."}
          </p>
        </div>
      </div>
    </div>
  );
}
