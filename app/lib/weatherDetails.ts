const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

// Converts a wind direction in degrees (0 = north) to a compass label like "SW"
export function windDirectionToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS_POINTS[Math.round(normalized / 22.5) % 16];
}

// WHO UV index categories
export function getUvIndexLevel(uvIndex: number): string {
  if (uvIndex < 3) return "Low";
  if (uvIndex < 6) return "Moderate";
  if (uvIndex < 8) return "High";
  if (uvIndex < 11) return "Very high";
  return "Extreme";
}

// Formats a nullable number with a unit, or "—" when the value is missing
export function formatMetric(
  value: number | null,
  unit: string,
  decimals = 0
): string {
  if (value === null) {
    return "—";
  }
  const separator = unit === "%" ? "" : " ";
  return `${value.toFixed(decimals)}${separator}${unit}`;
}

export function formatWind(
  speed: number | null,
  direction: number | null
): string {
  if (speed === null) {
    return "—";
  }
  const compass = direction === null ? "" : `${windDirectionToCompass(direction)} `;
  return `${compass}${speed} km/h`;
}

export function formatUvIndex(uvIndex: number | null): string {
  if (uvIndex === null) {
    return "—";
  }
  return `${Math.round(uvIndex)} · ${getUvIndexLevel(uvIndex)}`;
}
