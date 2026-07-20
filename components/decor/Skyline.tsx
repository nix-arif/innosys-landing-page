type SkylineProps = {
  color: string;
  className?: string;
};

/**
 * Procedural abstract city skyline silhouette (generic buildings + a
 * twin-tower motif), echoing the KL skyline in Picture2.png without
 * reproducing any specific landmark's likeness.
 */
export function Skyline({ color, className = "" }: SkylineProps) {
  return (
    <svg
      viewBox="0 0 900 320"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <g fill={color} opacity="0.9">
        <rect x="0" y="200" width="60" height="120" />
        <rect x="70" y="160" width="45" height="160" />
        <rect x="125" y="220" width="55" height="100" />
        <rect x="190" y="140" width="40" height="180" />
        <rect x="240" y="190" width="60" height="130" />

        {/* twin-tower motif */}
        <rect x="330" y="90" width="34" height="230" />
        <polygon points="330,90 347,60 364,90" />
        <rect x="343" y="40" width="8" height="24" />
        <rect x="420" y="90" width="34" height="230" />
        <polygon points="420,90 437,60 454,90" />
        <rect x="433" y="40" width="8" height="24" />
        <rect x="368" y="150" width="48" height="18" />

        <rect x="470" y="210" width="50" height="110" />
        <rect x="530" y="170" width="42" height="150" />
        <rect x="580" y="230" width="60" height="90" />
        <rect x="650" y="150" width="38" height="170" />
        <rect x="700" y="200" width="55" height="120" />
        <rect x="765" y="175" width="45" height="145" />
        <rect x="820" y="215" width="80" height="105" />
      </g>
    </svg>
  );
}
