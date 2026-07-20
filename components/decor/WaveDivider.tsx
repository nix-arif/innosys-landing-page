type WaveDividerProps = {
  color: string;
  flip?: boolean;
  className?: string;
};

/**
 * Full-width diagonal wave transition, used to move between section
 * background colors the way the Picture2.png reference design does.
 */
export function WaveDivider({ color, flip = false, className = "" }: WaveDividerProps) {
  return (
    <svg
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
      className={`block h-full w-full ${flip ? "-scale-y-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0,64 C240,160 480,10 760,60 C1040,110 1200,20 1440,80 L1440,180 L0,180 Z"
        fill={color}
      />
    </svg>
  );
}
