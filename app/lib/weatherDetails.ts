import type {
  DailyForecastDetail,
  DailyForecastWithPeriods,
  DayPeriodSummary,
  HourlyForecast,
  ThunderstormRisk,
} from "./types";

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

// Parts of the day shown under the detail panel, in local time.
// endHour is exclusive, so Morning covers 06:00 to 11:00 inclusive.
const DAY_PERIODS = [
  { label: "Morning", startHour: 6, endHour: 12, timeRange: "6 AM – 12 PM" },
  { label: "Afternoon", startHour: 12, endHour: 18, timeRange: "12 PM – 6 PM" },
];

// Hourly times are local strings like "2026-10-13T08:00" (no offset), so we
// read the date and hour straight from the text. Passing them to new Date()
// would apply the server's timezone instead of the city's.
function getDatePart(time: string): string {
  return time.slice(0, 10);
}

function getHourPart(time: string): number {
  return Number(time.slice(11, 13));
}

function numbersOnly(values: (number | null)[]): number[] {
  return values.filter((value): value is number => value !== null);
}

function maxOrNull(values: (number | null)[]): number | null {
  const numbers = numbersOnly(values);
  return numbers.length > 0 ? Math.max(...numbers) : null;
}

function sumOrNull(values: (number | null)[]): number | null {
  const numbers = numbersOnly(values);
  if (numbers.length === 0) {
    return null;
  }
  // Round to 1 decimal to avoid floating point noise like 0.30000000000000004
  return Math.round(numbers.reduce((total, value) => total + value, 0) * 10) / 10;
}

function averageOrNull(values: (number | null)[]): number | null {
  const numbers = numbersOnly(values);
  if (numbers.length === 0) {
    return null;
  }
  return Math.round(
    numbers.reduce((total, value) => total + value, 0) / numbers.length
  );
}

// Directions wrap around (350° and 10° average to 0°, not 180°),
// so average them as vectors
function averageDirectionOrNull(values: (number | null)[]): number | null {
  const numbers = numbersOnly(values);
  if (numbers.length === 0) {
    return null;
  }
  let x = 0;
  let y = 0;
  for (const degrees of numbers) {
    const radians = (degrees * Math.PI) / 180;
    x += Math.cos(radians);
    y += Math.sin(radians);
  }
  const average = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((average + 360) % 360);
}

// Groups hourly entries by local date. Uses the date text rather than
// "24 hours per day", because days with a clock change have 23 or 25 hours.
export function groupHourlyByDate(
  hourly: HourlyForecast[]
): Map<string, HourlyForecast[]> {
  const groups = new Map<string, HourlyForecast[]>();
  for (const hour of hourly) {
    const date = getDatePart(hour.time);
    const group = groups.get(date) ?? [];
    group.push(hour);
    groups.set(date, group);
  }
  return groups;
}

// Summarises the hours between startHour (inclusive) and endHour (exclusive).
// Returns null when there's no data for that part of the day.
export function summarizePeriod(
  hours: HourlyForecast[],
  period: (typeof DAY_PERIODS)[number]
): DayPeriodSummary | null {
  const periodHours = hours.filter((hour) => {
    const hourOfDay = getHourPart(hour.time);
    return hourOfDay >= period.startHour && hourOfDay < period.endHour;
  });

  if (periodHours.length === 0) {
    return null;
  }

  return {
    label: period.label,
    timeRange: period.timeRange,
    // WMO codes rise with severity (clear → rain → thunderstorm),
    // so the highest code is the most notable weather in the period
    weatherCode: maxOrNull(periodHours.map((hour) => hour.weatherCode)),
    maxTemp: maxOrNull(periodHours.map((hour) => hour.temperature)),
    feelsLikeMax: maxOrNull(periodHours.map((hour) => hour.feelsLike)),
    precipitationProbability: maxOrNull(
      periodHours.map((hour) => hour.precipitationProbability)
    ),
    precipitation: sumOrNull(periodHours.map((hour) => hour.precipitation)),
    windSpeed: maxOrNull(periodHours.map((hour) => hour.windSpeed)),
    windGusts: maxOrNull(periodHours.map((hour) => hour.windGusts)),
    windDirection: averageDirectionOrNull(
      periodHours.map((hour) => hour.windDirection)
    ),
    cloudCover: averageOrNull(periodHours.map((hour) => hour.cloudCover)),
  };
}

// WMO codes 95, 96 and 99 are thunderstorms
const THUNDERSTORM_CODES = [95, 96, 99];
// CAPE (J/kg) above this means the air is unstable enough for storms
const UNSTABLE_CAPE = 1000;
// ...but storms also need moisture, so require some chance of rain
const MIN_PRECIPITATION_PROBABILITY = 30;

// Rough thunderstorm risk for one day. Open-Meteo has no thunderstorm
// probability, so this is an estimate, not a forecast percentage.
export function getThunderstormRisk(
  hours: HourlyForecast[]
): ThunderstormRisk | null {
  const codes = numbersOnly(hours.map((hour) => hour.weatherCode));
  const maxCape = maxOrNull(hours.map((hour) => hour.cape));

  if (codes.length === 0 && maxCape === null) {
    return null;
  }
  if (codes.some((code) => THUNDERSTORM_CODES.includes(code))) {
    return "Likely";
  }

  const maxPrecipitationProbability =
    maxOrNull(hours.map((hour) => hour.precipitationProbability)) ?? 0;
  if (
    maxCape !== null &&
    maxCape >= UNSTABLE_CAPE &&
    maxPrecipitationProbability >= MIN_PRECIPITATION_PROBABILITY
  ) {
    return "Possible";
  }

  return "None";
}

// Adds summaries built from the hourly data (Morning/Afternoon and
// thunderstorm risk) to each day. Runs on the server so the browser
// receives a few summaries instead of all 168 hourly entries.
export function addHourlySummaries(
  daily: DailyForecastDetail[],
  hourly: HourlyForecast[]
): DailyForecastWithPeriods[] {
  const hoursByDate = groupHourlyByDate(hourly);

  return daily.map((day) => {
    const hours = hoursByDate.get(day.date) ?? [];
    const periods = DAY_PERIODS.map((period) =>
      summarizePeriod(hours, period)
    ).filter((summary): summary is DayPeriodSummary => summary !== null);

    return { ...day, periods, thunderstormRisk: getThunderstormRisk(hours) };
  });
}
