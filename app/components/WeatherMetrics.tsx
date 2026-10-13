import type { ReactNode } from "react";

interface WeatherMetric {
  label: string;
  value: ReactNode;
}

interface WeatherMetricsProps {
  items: WeatherMetric[];
  className: string;
  valueClassName?: string;
}

export function WeatherMetrics({
  items,
  className,
  valueClassName = "text-base font-medium text-shadow-sm",
}: WeatherMetricsProps) {
  return (
    <dl className={className}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground text-shadow-sm">
            {item.label}
          </dt>
          <dd className={valueClassName}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
