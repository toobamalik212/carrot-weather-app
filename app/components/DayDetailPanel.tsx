import { createElement } from "react";
import type { DailyForecastWithPeriods } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { formatDate } from "../lib/utils";
import {
  formatMetric,
  formatUvIndex,
  formatWind,
} from "../lib/weatherDetails";
import { TemperatureDisplay } from "./TemperatureDisplay";
import { DayPeriodSection } from "./DayPeriodSection";
import { GlassCard } from "./GlassCard";
import { WeatherMetrics } from "./WeatherMetrics";

interface DayDetailPanelProps {
  dayName: string;
  day: DailyForecastWithPeriods;
}

export function DayDetailPanel({ dayName, day }: DayDetailPanelProps) {
  const Icon = getWeatherIcon(day.weatherCode);
  const dateLabel = formatDate(day.date);
  const weatherDescription = getWeatherDescription(day.weatherCode);
  const feelsLike =
    day.feelsLikeMax === null ? (
      "—"
    ) : (
      <TemperatureDisplay value={day.feelsLikeMax} />
    );

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
    { label: "Sunshine", value: formatMetric(day.sunshineHours, "h", 1) },
    { label: "Thunderstorm risk", value: day.thunderstormRisk ?? "—" },
  ];
  const periodSections = day.periods.map((period) => (
    <DayPeriodSection key={`${day.date}-${period.label}`} period={period} />
  ));
  const periodContent =
    day.periods.length > 0 ? <div>{periodSections}</div> : null;

  return (
    <GlassCard as="section" aria-live="polite" className="flex flex-col gap-6">
      <header className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-shadow-md">{dayName}</h3>
          <p className="text-sm text-muted-foreground text-shadow-sm">
            {dateLabel}
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
        <p className="text-base text-shadow-sm">{weatherDescription}</p>
        <p className="text-sm text-muted-foreground text-shadow-sm">
          Feels like {feelsLike}
        </p>
      </div>

      <WeatherMetrics
        items={metrics}
        className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6"
      />

      {periodContent}
    </GlassCard>
  );
}
