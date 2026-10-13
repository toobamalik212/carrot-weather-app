"use client";

import { Switch } from "@/components/ui/switch";
import { useTemperatureUnit } from "./TemperatureUnitProvider";

export function TemperatureToggle() {
  const { unit, setUnit } = useTemperatureUnit();
  const isFahrenheit = unit === "F";
  const switchLabel = isFahrenheit
    ? "Switch to Celsius"
    : "Switch to Fahrenheit";

  function handleUnitChange(checked: boolean) {
    setUnit(checked ? "F" : "C");
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="text-white">
        Celsius
      </span>
      <Switch
        checked={isFahrenheit}
        onCheckedChange={handleUnitChange}
        aria-label={switchLabel}
        className="data-checked:bg-sky-500"
      />
      <span className="text-white">
        Fahrenheit
      </span>
    </div>
  );
}
