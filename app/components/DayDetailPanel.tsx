import { createElement } from "react";
import type { DailyForecastDetail } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { formatDate } from "../lib/utils";
import {
  formatMetric,
  formatUvIndex,
  formatWind,
} from "../lib/weatherDetails";
import { TemperatureDisplay } from "./TemperatureDisplay";

interface DayDetailPanelProps {
  dayName: string;
  day: DailyForecastDetail;
}

export function DayDetailPanel({ dayName, day }: DayDetailPanelProps) {
  const Icon = getWeatherIcon(day.weatherCode);

  const metrics = [
    { label: "Max UV index", value: formatUvIndex(day.uvIndexMax) },
    {
      label: "Wind",
      value: formatWind(day.windSpeedMax, day.windDirectionDominant),
    },
    { label: "Wind gusts", value: formatMetric(day.windGustsMax, "km/h") },
    {
      label: "Chance of precipitation",
      value: formatMetric(day.precipitationProbabilityMax, "%"),
    },
    {
      label: "Precipitation",
      value: formatMetric(day.precipitationSum, "mm", 1),
    },
    { label: "Rain", value: formatMetric(day.rainSum, "mm", 1) },
    { label: "Showers", value: formatMetric(day.showersSum, "mm", 1) },
    {
      label: "Hours of precipitation",
      value: formatMetric(day.precipitationHours, "h"),
    },
    { label: "Cloud cover", value: formatMetric(day.cloudCoverMean, "%") },
  ];

  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-6 py-6 px-7 rounded-2xl bg-white/5 shadow-lg shadow-black/30 inset-shadow-xs inset-shadow-white/10"
    >
      <header className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-shadow-md">{dayName}</h3>
          <p className="text-sm text-muted-foreground text-shadow-sm">
            {formatDate(day.date)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TemperatureDisplay
            value={day.maxTemp}
            className="text-4xl font-light text-shadow-md"
          />
          {createElement(Icon, {
            className: "size-12 [--animation-duration:0]",
          })}
        </div>
      </header>

      <div className="flex flex-col gap-1">
        <p className="text-base text-shadow-sm">
          {getWeatherDescription(day.weatherCode)}
        </p>
        <p className="text-sm text-muted-foreground text-shadow-sm">
          Feels like{" "}
          {day.feelsLikeMax === null ? (
            "—"
          ) : (
            <TemperatureDisplay value={day.feelsLikeMax} />
          )}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground text-shadow-sm">
              {metric.label}
            </dt>
            <dd className="text-base font-medium text-shadow-sm">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
