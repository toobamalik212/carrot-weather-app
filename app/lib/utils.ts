export function getCurrentTimeInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getDayName(date: string, index: number): string {
  if (index === 0) {
    return "Today";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
}

export function isNightTime(
  timezone: string,
  sunrise: string,
  sunset: string
): boolean {
  const now = new Date();
  const currentTime = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );

  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  return currentTime < sunriseTime || currentTime > sunsetTime;
}