import { TextField, TextAreaField } from "@/components/admin/Field";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { HeroContent } from "@/lib/content";

export function HeroEditor({
  content,
  onChange,
}: {
  content: HeroContent;
  onChange: (content: HeroContent) => void;
}) {
  const set = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) =>
    onChange({ ...content, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <TextField label="Eyebrow" value={content.eyebrow} onChange={(v) => set("eyebrow", v)} />
      <TextAreaField
        label="Headline"
        value={content.headline}
        onChange={(v) => set("headline", v)}
        rows={2}
      />
      <TextAreaField
        label="Subheadline"
        value={content.subheadline}
        onChange={(v) => set("subheadline", v)}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Primary button label"
          value={content.ctaLabel}
          onChange={(v) => set("ctaLabel", v)}
        />
        <TextField
          label="Primary button link"
          value={content.ctaHref}
          onChange={(v) => set("ctaHref", v)}
        />
        <TextField
          label="Secondary button label"
          value={content.secondaryCtaLabel}
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
