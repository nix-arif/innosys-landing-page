import { TextField, LocalizedTextField, LocalizedTextAreaField } from "@/components/admin/Field";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { HighlightContent, Locale } from "@/lib/content";

export function HighlightEditor({
  content,
  locale,
  onChange,
}: {
  content: HighlightContent;
  locale: Locale;
  onChange: (content: HighlightContent) => void;
}) {
  const set = <K extends keyof HighlightContent>(key: K, value: HighlightContent[K]) =>
    onChange({ ...content, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <LocalizedTextField
        label="Eyebrow (company name)"
        value={content.eyebrow}
        locale={locale}
        onChange={(v) => set("eyebrow", v)}
      />
      <LocalizedTextField
        label="Script line (cursive)"
        value={content.script}
        locale={locale}
        onChange={(v) => set("script", v)}
      />
      <LocalizedTextAreaField
        label="Headline (one line per row)"
        value={content.headlineLines}
        locale={locale}
        onChange={(v) => set("headlineLines", v)}
        rows={3}
      />
      <LocalizedTextField
        label="Paragraph heading"
        value={content.paragraphHeading}
        locale={locale}
        onChange={(v) => set("paragraphHeading", v)}
      />
      <LocalizedTextAreaField
        label="Paragraph"
        value={content.paragraph}
        locale={locale}
        onChange={(v) => set("paragraph", v)}
        rows={4}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LocalizedTextField
          label="Quote (plain part)"
          value={content.quote}
          locale={locale}
          onChange={(v) => set("quote", v)}
        />
        <LocalizedTextField
          label="Quote (highlighted part)"
          value={content.quoteHighlight}
          locale={locale}
          onChange={(v) => set("quoteHighlight", v)}
        />
      </div>
      <LocalizedTextField
        label="Sign-off line (cursive)"
        value={content.signOff}
        locale={locale}
        onChange={(v) => set("signOff", v)}
      />
      <ImageDropzone
        label="Mascot image"
        value={content.mascotImage}
        onChange={(url) => set("mascotImage", url)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Website" value={content.website} onChange={(v) => set("website", v)} />
        <TextField label="Email" value={content.email} onChange={(v) => set("email", v)} />
        <TextField label="Phone" value={content.phone} onChange={(v) => set("phone", v)} />
        <TextField
          label="Social handle"
          value={content.socialHandle}
          onChange={(v) => set("socialHandle", v)}
        />
      </div>
    </div>
  );
}
