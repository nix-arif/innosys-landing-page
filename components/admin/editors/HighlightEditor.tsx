import { TextField, TextAreaField } from "@/components/admin/Field";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { HighlightContent } from "@/lib/content";

export function HighlightEditor({
  content,
  onChange,
}: {
  content: HighlightContent;
  onChange: (content: HighlightContent) => void;
}) {
  const set = <K extends keyof HighlightContent>(key: K, value: HighlightContent[K]) =>
    onChange({ ...content, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <TextField label="Eyebrow (company name)" value={content.eyebrow} onChange={(v) => set("eyebrow", v)} />
      <TextField
        label="Script line (cursive)"
        value={content.script}
        onChange={(v) => set("script", v)}
      />
      <TextAreaField
        label="Headline (one line per row)"
        value={content.headlineLines.join("\n")}
        onChange={(v) => set("headlineLines", v.split("\n"))}
        rows={3}
      />
      <TextField
        label="Paragraph heading"
        value={content.paragraphHeading}
        onChange={(v) => set("paragraphHeading", v)}
      />
      <TextAreaField
        label="Paragraph"
        value={content.paragraph}
        onChange={(v) => set("paragraph", v)}
        rows={4}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Quote (plain part)" value={content.quote} onChange={(v) => set("quote", v)} />
        <TextField
          label="Quote (highlighted part)"
          value={content.quoteHighlight}
          onChange={(v) => set("quoteHighlight", v)}
        />
      </div>
      <TextField
        label="Sign-off line (cursive)"
        value={content.signOff}
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
