"use client";

import { useTemperatureUnit } from "./TemperatureUnitProvider";

interface TemperatureDisplayProps {
  value: number;
  className?: string;
}

export function TemperatureDisplay({
  value,
  className,
}: TemperatureDisplayProps) {
  const { unit } = useTemperatureUnit();
  const temperature =
    unit === "F" ? Math.round((value * 9) / 5 + 32) : value;

  return (
    <span className={className}>
      {temperature}°{unit}
    </span>
  );
}
