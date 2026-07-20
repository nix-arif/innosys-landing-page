const SWATCHES = [
  { label: "Deep Blue", value: "var(--color-deep-blue)" },
  { label: "Sky Blue", value: "var(--color-sky-blue)" },
  { label: "Coral", value: "var(--color-coral)" },
  { label: "White", value: "#ffffff" },
  { label: "Charcoal", value: "#1f2937" },
];

export function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SWATCHES.map((swatch) => (
        <button
          key={swatch.value}
          type="button"
          title={swatch.label}
          onClick={() => onChange(swatch.value)}
          className={`h-6 w-6 rounded-full border-2 ${
            value === swatch.value ? "border-deep-blue" : "border-black/10"
          }`}
          style={{ background: swatch.value }}
        />
      ))}
      <input
        type="color"
        title="Custom color"
        value={value.startsWith("#") ? value : "#174a7c"}
        onChange={(event) => onChange(event.target.value)}
        className="h-6 w-8 cursor-pointer rounded border border-black/10"
      />
    </div>
  );
}
