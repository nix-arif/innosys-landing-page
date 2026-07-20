import type { Locale, LocalizedText } from "@/lib/content";

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-deep-blue/70">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm outline-none focus:border-sky-blue"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-deep-blue/70">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-deep-blue/20 px-3 py-2 text-sm outline-none focus:border-sky-blue"
      />
    </label>
  );
}

/** Edits one locale's value of a LocalizedText field; `locale` picks which
 * language is currently being edited (driven by the section editor's
 * language tabs), while the other language's value is preserved untouched. */
export function LocalizedTextField({
  label,
  value,
  locale,
  onChange,
}: {
  label: string;
  value: LocalizedText;
  locale: Locale;
  onChange: (value: LocalizedText) => void;
}) {
  return (
    <TextField
      label={label}
      value={value[locale] ?? ""}
      onChange={(next) => onChange({ ...value, [locale]: next })}
    />
  );
}

export function LocalizedTextAreaField({
  label,
  value,
  locale,
  onChange,
  rows,
}: {
  label: string;
  value: LocalizedText;
  locale: Locale;
  onChange: (value: LocalizedText) => void;
  rows?: number;
}) {
  return (
    <TextAreaField
      label={label}
      value={value[locale] ?? ""}
      onChange={(next) => onChange({ ...value, [locale]: next })}
      rows={rows}
    />
  );
}
