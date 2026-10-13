import { createElement } from "react";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescriptions";
import { TemperatureDisplay } from "./TemperatureDisplay";

interface CurrentConditionsProps {
  temperature: number;
  weatherCode: number;
  isNight: boolean;
}

// Large current temperature, description and weather icon
export function CurrentConditions({
  temperature,
  weatherCode,
  isNight,
}: CurrentConditionsProps) {
  const Icon = getWeatherIcon(weatherCode);

  return (
    <section className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <TemperatureDisplay
          value={temperature}
          className="text-6xl font-light text-shadow-lg"
        />
        <p className="text-base text-white text-shadow-sm">
          {getWeatherDescription(weatherCode)}
        </p>
      </div>
      {createElement(Icon, { isNight, className: "size-28" })}
    </section>
  );
}
