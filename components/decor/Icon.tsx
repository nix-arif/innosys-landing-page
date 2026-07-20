export const ICON_KEYS = ["code", "spark", "cloud", "chat", "shield", "rocket"] as const;
export type IconKey = (typeof ICON_KEYS)[number];

type IconProps = {
  name: string;
  className?: string;
};

const paths: Record<IconKey, string> = {
  code: "M9 18 3 12l6-6m6 12 6-6-6-6",
  spark: "M12 2v6m0 8v6m10-10h-6M8 12H2m15.07-7.07-4.24 4.24m-5.66 5.66-4.24 4.24m14.14 0-4.24-4.24M6.93 4.93l4.24 4.24",
  cloud: "M7 18a4 4 0 1 1 1.1-7.85 5 5 0 0 1 9.7 1.6A3.5 3.5 0 0 1 17.5 18H7Z",
  chat: "M21 12a8 8 0 1 1-3.3-6.5L21 4l-1 4.5A7.96 7.96 0 0 1 21 12Z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z",
  rocket: "M12 2c3 2 5 6 4 11l-3 3-2-2 3-3c1-4-1-7-2-9Zm-2 13-4 4m0-4 4 4m-6-2 8-8",
};

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  const d = paths[name as IconKey] ?? paths.spark;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
