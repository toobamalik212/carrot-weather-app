"use client";

import { DEFAULT_CITY_SLUGS, useSavedCities } from "../hooks/useSavedCities";
import { useCityWeather } from "../hooks/useCityWeather";
import { AddCityDialog } from "./AddCityDialog";
import { CityWeatherCard } from "./CityWeatherCard";
import { PlaceholderCard } from "./PlaceholderCard";

export function CityList() {
  const { savedCities, addCity } = useSavedCities();
  const { weatherBySlug, failedSlugs } = useCityWeather(savedCities);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AddCityDialog
          savedSlugs={(savedCities ?? []).map((city) => city.slug)}
          onAddCity={addCity}
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
