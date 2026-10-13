"use client";

import { useEffect, useRef, useState } from "react";
import type { City } from "@/data/cities";
import { getWeatherForCities } from "../actions/actions";
import type { WeatherData } from "../lib/types";

// Fetches weather once per city and remembers which requests failed.
// Pass null while the city list isn't known yet.
export function useCityWeather(cities: City[] | null) {
  const [weatherBySlug, setWeatherBySlug] = useState<
    Record<string, WeatherData>
  >({});
  const [failedSlugs, setFailedSlugs] = useState<string[]>([]);
  const requestedSlugs = useRef(new Set<string>());

  // Fetch weather for any city we haven't requested yet
  useEffect(() => {
    if (cities === null) {
      return;
    }
    const missing = cities.filter(
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
  }, [cities]);

  return { weatherBySlug, failedSlugs };
}
