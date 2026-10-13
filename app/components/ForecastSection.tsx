"use client";

import { useState } from "react";
import type { DailyForecastDetail } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getDayName } from "../lib/utils";
import { DaysListItem } from "./DaysListItem";
import { DayDetailPanel } from "./DayDetailPanel";

interface ForecastSectionProps {
  days: DailyForecastDetail[];
}

export function ForecastSection({ days }: ForecastSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDay = days[selectedIndex];

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="text-base font-semibold mb-4 text-shadow-md">
          7-Day Forecast
        </h2>
        <ul className="flex flex-col">
          {days.map((day, index) => (
            <DaysListItem
              key={day.date}
              day={getDayName(day.date, index)}
              maxTemp={day.maxTemp}
              minTemp={day.minTemp}
              Icon={getWeatherIcon(day.weatherCode)}
              isSelected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
        </ul>
      </div>

      {selectedDay && (
        <DayDetailPanel
          dayName={getDayName(selectedDay.date, selectedIndex)}
          day={selectedDay}
        />
      )}
    </section>
  );
}
