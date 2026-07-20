type QuoteMarkProps = {
  color: string;
  flip?: boolean;
  className?: string;
};

export function QuoteMark({ color, flip = false, className = "" }: QuoteMarkProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={`${flip ? "-scale-x-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M0 28C0 12 10 2 26 0v9c-8 2-13 8-13 15h13v19H0V28Zm35 0c0-16 10-26 26-28v9c-8 2-13 8-13 15h13v19H35V28Z"
      />
    </svg>
  );
}
