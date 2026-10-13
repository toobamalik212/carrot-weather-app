interface SunProps {
  x?: number;
  y?: number;
}

export function Sun({ x = 0, y = 0 }: SunProps) {
  return (
    <>
      <circle
        cx={192 + x}
        cy={192 + y}
        r="150"
        fill="url(#yellowGlow)"
        className="animate-pulse"
        style={{ transformOrigin: "center" }}
        opacity={0.7}
      />
      <circle
        cx={192 + x}
        cy={192 + y}
        r="104"
        fill="url(#yellowGradient)"
        filter="url(#whiteInnerShadow)"
      />
    </>
  );
}
