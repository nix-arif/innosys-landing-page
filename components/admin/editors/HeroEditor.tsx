import { TextField, LocalizedTextField, LocalizedTextAreaField } from "@/components/admin/Field";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { HeroContent, Locale } from "@/lib/content";

export function HeroEditor({
  content,
  locale,
  onChange,
}: {
  content: HeroContent;
  locale: Locale;
  onChange: (content: HeroContent) => void;
}) {
  const set = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) =>
    onChange({ ...content, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <LocalizedTextField
        label="Eyebrow"
        value={content.eyebrow}
        locale={locale}
        onChange={(v) => set("eyebrow", v)}
      />
      <LocalizedTextAreaField
        label="Headline"
        value={content.headline}
        locale={locale}
        onChange={(v) => set("headline", v)}
        rows={2}
      />
      <LocalizedTextAreaField
        label="Subheadline"
        value={content.subheadline}
        locale={locale}
        onChange={(v) => set("subheadline", v)}
      />
      <div className="grid grid-cols-2 gap-3">
        <LocalizedTextField
          label="Primary button label"
          value={content.ctaLabel}
          locale={locale}
          onChange={(v) => set("ctaLabel", v)}
        />
        <TextField
          label="Primary button link"
          value={content.ctaHref}
          onChange={(v) => set("ctaHref", v)}
        />
        <LocalizedTextField
          label="Secondary button label"
          value={content.secondaryCtaLabel}
          locale={locale}
          onChange={(v) => set("secondaryCtaLabel", v)}
        />
        <TextField
          label="Secondary button link"
          value={content.secondaryCtaHref}
          onChange={(v) => set("secondaryCtaHref", v)}
        />
      </div>
      <ImageDropzone
        label="Mascot image"
        value={content.mascotImage}
        onChange={(url) => set("mascotImage", url)}
      />
    </div>
  );
}
