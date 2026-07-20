import { randomUUID } from "@/components/admin/randomId";
import { TextField, LocalizedTextField } from "@/components/admin/Field";
import { DragList } from "@/components/admin/DragList";
import { DragHandle } from "@/components/admin/DragHandle";
import type { FooterContent, SocialLink, Locale } from "@/lib/content";

const PLATFORMS = ["facebook", "instagram", "threads", "linkedin", "tiktok", "x"];

export function FooterEditor({
  content,
  locale,
  onChange,
}: {
  content: FooterContent;
  locale: Locale;
  onChange: (content: FooterContent) => void;
}) {
  const set = <K extends keyof FooterContent>(key: K, value: FooterContent[K]) =>
    onChange({ ...content, [key]: value });

  const setSocial = (id: string, patch: Partial<SocialLink>) =>
    set(
      "socials",
      content.socials.map((social) => (social.id === id ? { ...social, ...patch } : social))
    );

  const addSocial = () =>
    set("socials", [...content.socials, { id: randomUUID(), platform: "facebook", href: "" }]);

  const removeSocial = (id: string) =>
    set("socials", content.socials.filter((social) => social.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Company name"
        value={content.companyName}
        onChange={(v) => set("companyName", v)}
      />
      <LocalizedTextField
        label="Tagline"
        value={content.tagline}
        locale={locale}
        onChange={(v) => set("tagline", v)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField label="Website" value={content.website} onChange={(v) => set("website", v)} />
        <TextField label="Email" value={content.email} onChange={(v) => set("email", v)} />
        <TextField label="Phone" value={content.phone} onChange={(v) => set("phone", v)} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-deep-blue/70">
          Social links (drag to reorder)
        </p>
        <DragList
          items={content.socials}
          getId={(social) => social.id}
          onReorder={(socials) => set("socials", socials)}
          className="flex flex-col gap-2"
          itemClassName="flex items-center gap-2 rounded-xl border border-deep-blue/10 bg-white p-2"
          renderItem={(social) => (
            <>
              <DragHandle />
              <select
                value={social.platform}
                onChange={(event) => setSocial(social.id, { platform: event.target.value })}
                className="rounded-lg border border-deep-blue/20 px-2 py-1 text-xs"
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
              <input
                value={social.href}
                onChange={(event) => setSocial(social.id, { href: event.target.value })}
                placeholder="https://…"
                className="flex-1 rounded-lg border border-deep-blue/20 px-2 py-1 text-sm outline-none focus:border-sky-blue"
              />
              <button
                type="button"
                onClick={() => removeSocial(social.id)}
                className="rounded-full px-2 py-1 text-xs font-semibold text-coral hover:bg-coral/10"
              >
                Remove
              </button>
            </>
          )}
        />
        <button
          type="button"
          onClick={addSocial}
          className="mt-3 rounded-full border border-dashed border-deep-blue/30 px-4 py-1.5 text-xs font-semibold text-deep-blue/70 hover:border-sky-blue hover:text-sky-blue"
        >
          + Add social link
        </button>
      </div>

      <LocalizedTextField
        label="Copyright text"
        value={content.copyrightText}
        locale={locale}
        onChange={(v) => set("copyrightText", v)}
      />
    </div>
  );
}
