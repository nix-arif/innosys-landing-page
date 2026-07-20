export function DragHandle() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0 cursor-grab text-deep-blue/30 active:cursor-grabbing"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="1.5" />
      <circle cx="6" cy="10" r="1.5" />
      <circle cx="6" cy="15" r="1.5" />
      <circle cx="14" cy="5" r="1.5" />
      <circle cx="14" cy="10" r="1.5" />
      <circle cx="14" cy="15" r="1.5" />
    </svg>
  );
}
