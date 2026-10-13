import { GlassCard } from "./GlassCard";

interface PlaceholderCardProps {
  name?: string;
  failed?: boolean;
}

// Same shape as LocationCard, shown while weather loads or if it fails
export function PlaceholderCard({ name, failed = false }: PlaceholderCardProps) {
  return (
    <GlassCard>
      <div className="flex justify-between items-center min-h-12">
        <div>
          {name ? (
            <h2 className="text-base font-semibold text-shadow-md">{name}</h2>
          ) : (
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
          )}
          <p className="text-sm text-muted-foreground text-shadow-sm">
            {failed ? "Couldn't load weather" : "Loading weather..."}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
