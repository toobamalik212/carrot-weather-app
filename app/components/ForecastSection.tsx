"use client";

import { useState } from "react";
import type { DailyForecastWithPeriods } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getDayName } from "../lib/utils";
import { DaysListItem } from "./DaysListItem";
import { DayDetailPanel } from "./DayDetailPanel";

interface ForecastSectionProps {
  days: DailyForecastWithPeriods[];
}

export function ForecastSection({ days }: ForecastSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDay = days[selectedIndex];
  const forecastItems = days.map((day, index) => (
    <DaysListItem
      key={day.date}
      day={getDayName(day.date, index)}
      maxTemp={day.maxTemp}
      minTemp={day.minTemp}
      Icon={getWeatherIcon(day.weatherCode)}
      isSelected={index === selectedIndex}
      onSelect={() => setSelectedIndex(index)}
    />
  ));
  const selectedDayPanel = selectedDay ? (
    <DayDetailPanel
      dayName={getDayName(selectedDay.date, selectedIndex)}
      day={selectedDay}
    />
  ) : null;

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="text-base font-semibold mb-4 text-shadow-md">
          7-Day Forecast
        </h2>
        <ul className="flex flex-col">
          {forecastItems}
        </ul>
      </div>

      {selectedDayPanel}
    </section>
  );
}
