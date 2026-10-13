"use client";

import { useEffect, useState } from "react";
import { cities, type City } from "@/data/cities";

const STORAGE_KEY = "weather-saved-cities";
export const DEFAULT_CITY_SLUGS = ["london", "new-york", "tokyo"];

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

// The user's chosen cities, persisted to localStorage.
// savedCities is null until they've been read on the client.
export function useSavedCities() {
  const [savedCities, setSavedCities] = useState<City[] | null>(null);

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

  function addCity(city: City) {
    setSavedCities((previous) =>
      previous === null || previous.some((c) => c.slug === city.slug)
        ? previous
        : [...previous, city]
    );
  }

  return { savedCities, addCity };
}
