import { randomUUID } from "@/components/admin/randomId";
import { LocalizedTextField, LocalizedTextAreaField } from "@/components/admin/Field";
import { DragList } from "@/components/admin/DragList";
import { DragHandle } from "@/components/admin/DragHandle";
import { ICON_KEYS } from "@/components/decor/Icon";
import type { FeaturesContent, FeatureItem, Locale } from "@/lib/content";

export function FeaturesEditor({
  content,
  locale,
  onChange,
}: {
  content: FeaturesContent;
  locale: Locale;
  onChange: (content: FeaturesContent) => void;
}) {
  const set = <K extends keyof FeaturesContent>(key: K, value: FeaturesContent[K]) =>
    onChange({ ...content, [key]: value });

  const setItem = (id: string, patch: Partial<FeatureItem>) =>
    set(
      "items",
      content.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );

  const addItem = () =>
    set("items", [
      ...content.items,
      {
        id: randomUUID(),
        title: { en: "New service", ms: "Perkhidmatan baharu" },
        description: { en: "", ms: "" },
        icon: "spark",
      },
    ]);

  const removeItem = (id: string) =>
    set("items", content.items.filter((item) => item.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <LocalizedTextField
        label="Eyebrow"
        value={content.eyebrow}
        locale={locale}
        onChange={(v) => set("eyebrow", v)}
      />
      <LocalizedTextField
        label="Heading"
        value={content.heading}
        locale={locale}
        onChange={(v) => set("heading", v)}
      />
      <LocalizedTextAreaField
        label="Subheading"
        value={content.subheading}
        locale={locale}
        onChange={(v) => set("subheading", v)}
      />

      <div>
        <p className="mb-2 text-xs font-semibold text-deep-blue/70">
          Service cards (drag to reorder)
        </p>
        <DragList
          items={content.items}
          getId={(item) => item.id}
          onReorder={(items) => set("items", items)}
          className="flex flex-col gap-3"
          itemClassName="rounded-xl border border-deep-blue/10 bg-white p-3"
          renderItem={(item) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DragHandle />
                <input
                  value={item.title[locale] ?? ""}
                  onChange={(event) =>
                    setItem(item.id, { title: { ...item.title, [locale]: event.target.value } })
                  }
                  className="flex-1 rounded-lg border border-deep-blue/20 px-2 py-1 text-sm font-semibold outline-none focus:border-sky-blue"
                  placeholder="Title"
                />
                <select
                  value={item.icon}
                  onChange={(event) => setItem(item.id, { icon: event.target.value })}
                  className="rounded-lg border border-deep-blue/20 px-2 py-1 text-xs"
                >
                  {ICON_KEYS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-coral hover:bg-coral/10"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={item.description[locale] ?? ""}
                onChange={(event) =>
                  setItem(item.id, {
                    description: { ...item.description, [locale]: event.target.value },
                  })
                }
                rows={2}
                placeholder="Description"
                className="w-full resize-y rounded-lg border border-deep-blue/20 px-2 py-1 text-sm outline-none focus:border-sky-blue"
              />
            </div>
          )}
        />
        <button
          type="button"
          onClick={addItem}
          className="mt-3 rounded-full border border-dashed border-deep-blue/30 px-4 py-1.5 text-xs font-semibold text-deep-blue/70 hover:border-sky-blue hover:text-sky-blue"
        >
          + Add service card
        </button>
      </div>
    </div>
  );
}
