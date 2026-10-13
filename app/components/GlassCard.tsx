import type { HTMLAttributes } from "react";

const GLASS_CARD_CLASSES =
  "py-6 px-7 rounded-2xl bg-white/5 shadow-lg shadow-black/30 inset-shadow-xs inset-shadow-white/10";

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section";
}

// Translucent card surface shared by placeholder cards and the day detail panel
export function GlassCard({ as = "div", className, ...props }: GlassCardProps) {
  const Element = as;
  const classes = className
    ? `${className} ${GLASS_CARD_CLASSES}`
    : GLASS_CARD_CLASSES;
  return <Element {...props} className={classes} />;
}
