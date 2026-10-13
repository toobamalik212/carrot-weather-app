import { formatDate, getCurrentTimeInTimezone } from "../lib/utils";

interface LocationHeaderProps {
  name: string;
  date: string;
  timezone: string;
}

// City name with today's date and the city's local time
export function LocationHeader({ name, date, timezone }: LocationHeaderProps) {
  return (
    <section className="flex flex-col">
      <h2 className="text-xl font-semibold text-shadow-md">{name}</h2>
      <p className="text-base text-white text-shadow-sm">
        {formatDate(date)} {getCurrentTimeInTimezone(timezone)}
      </p>
    </section>
  );
}
