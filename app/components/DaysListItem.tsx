import { cn } from "@/lib/utils";
import { WeatherIcon } from "../lib/types";
import { TemperatureDisplay } from "./TemperatureDisplay";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: WeatherIcon;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function DaysListItem({
  day,
  maxTemp,
  minTemp,
  Icon,
  isSelected = false,
  onSelect,
}: DaysListItemProps) {
  const buttonClassName = cn(
    "flex w-full items-center gap-4 py-3 px-3 rounded-lg text-left transition-colors duration-150 hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-white/50",
    // Repeat the selected background on hover. Otherwise hover:bg-white/5
    // would make the selected row look less selected.
    isSelected && "bg-white/10 hover:bg-white/10"
  );

  return (
    <li className="border-t border-border [--animation-duration:0]">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={buttonClassName}
      >
        <span className="text-base font-medium text-shadow-sm">{day}</span>
        <Icon className="size-8 ml-auto" />
        <span className="flex gap-4 w-16 justify-end text-base font-normal">
          <TemperatureDisplay value={maxTemp} showUnit={false} />
          <TemperatureDisplay
            value={minTemp}
            showUnit={false}
            className="text-muted-foreground text-shadow-sm"
          />
        </span>
      </button>
    </li>
  );
}
