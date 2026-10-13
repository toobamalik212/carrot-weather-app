"use client";

import { Switch } from "@/components/ui/switch";
import { useTemperatureUnit } from "./TemperatureUnitProvider";

export function TemperatureToggle() {
  const { unit, setUnit } = useTemperatureUnit();

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="text-white">
        Celsius
      </span>
      <Switch
        checked={unit === "F"}
        onCheckedChange={(checked) => setUnit(checked ? "F" : "C")}
        aria-label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
        className="data-checked:bg-sky-500"
      />
      <span className="text-white">
        Fahrenheit
      </span>
    </div>
  );
}
