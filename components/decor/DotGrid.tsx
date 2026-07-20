type DotGridProps = {
  color: string;
  className?: string;
};

/** CSS-only dot grid accent pattern, matching the dotted corner in Picture2.png. */
export function DotGrid({ color, className = "" }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
        backgroundSize: "14px 14px",
      }}
    />
  );
}
