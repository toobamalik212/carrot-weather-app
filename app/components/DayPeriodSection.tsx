import { createElement } from "react";
import { ChevronDown } from "lucide-react";
import type { DayPeriodSummary } from "../lib/types";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { formatMetric, formatWind } from "../lib/weatherDetails";
import { TemperatureDisplay } from "./TemperatureDisplay";
import { WeatherMetrics } from "./WeatherMetrics";

interface DayPeriodSectionProps {
  period: DayPeriodSummary;
}

// One expandable Morning/Afternoon row, using the native <details> element
// so it opens with click, Enter or Space without extra JavaScript
export function DayPeriodSection({ period }: DayPeriodSectionProps) {
  const Icon =
    period.weatherCode === null ? null : getWeatherIcon(period.weatherCode);
  const weatherIcon = Icon
    ? createElement(Icon, { className: "size-8 ml-auto" })
    : null;
  const weatherDescription =
    period.weatherCode === null
      ? "No forecast"
      : getWeatherDescription(period.weatherCode);
  const maxTemperature =
    period.maxTemp === null ? (
      "—"
    ) : (
      <TemperatureDisplay value={period.maxTemp} showUnit={false} />
    );
  const feelsLike =
    period.feelsLikeMax === null ? null : (
      <>
        {" · Feels like "}
        <TemperatureDisplay value={period.feelsLikeMax} />
      </>
    );
  const temperatureClassName = `w-12 text-right text-base ${
    period.weatherCode === null ? "ml-auto" : ""
  }`;

  const metrics = [
    {
      label: "Chance of precipitation",
      value: formatMetric(period.precipitationProbability, "%"),
    },
    {
      label: "Precipitation",
      value: formatMetric(period.precipitation, "mm", 1),
    },
    { label: "Wind", value: formatWind(period.windSpeed, period.windDirection) },
    { label: "Wind gusts", value: formatMetric(period.windGusts, "km/h") },
    { label: "Cloud cover", value: formatMetric(period.cloudCover, "%") },
  ];

  return (
    <details className="group border-t border-border [--animation-duration:0]">
      {/* list-none hides the disclosure triangle in most browsers. Safari
          ignores it and needs the ::-webkit-details-marker rule as well. */}
      <summary className="flex items-center gap-4 py-3 cursor-pointer list-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/50 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col">
          <span className="text-base font-medium text-shadow-sm">
            {period.label}
          </span>
          <span className="text-xs text-muted-foreground text-shadow-sm">
            {period.timeRange}
          </span>
        </span>
        {weatherIcon}
        {/* The icon normally pushes the temperature right. Without an icon,
            the temperature takes over ml-auto so the columns still line up. */}
        <span className={temperatureClassName}>{maxTemperature}</span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-150 group-open:rotate-180" />
      </summary>

      <div className="flex flex-col gap-4 pb-4">
        <p className="text-sm text-muted-foreground text-shadow-sm">
          {weatherDescription}
          {feelsLike}
        </p>
        <WeatherMetrics
          items={metrics}
          className="grid grid-cols-2 gap-x-6 gap-y-3"
          valueClassName="text-sm font-medium text-shadow-sm"
        />
      </div>
    </details>
  );
}
