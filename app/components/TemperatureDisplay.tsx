"use client";

import { useTemperatureUnit } from "./TemperatureUnitProvider";

interface TemperatureDisplayProps {
  value: number;
  className?: string;
  showUnit?: boolean; // false renders a compact "18°" without C/F
}

export function TemperatureDisplay({
  value,
  className,
  showUnit = true,
}: TemperatureDisplayProps) {
  const { unit } = useTemperatureUnit();
  const temperature =
    unit === "F" ? Math.round((value * 9) / 5 + 32) : value;

  return (
    <span className={className}>
      {temperature}°{showUnit && unit}
    </span>
  );
}
