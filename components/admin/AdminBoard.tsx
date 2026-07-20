"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DragList } from "./DragList";
import { DragHandle } from "./DragHandle";
import { SectionEditorPanel } from "./SectionEditorPanel";
import {
  addCanvasSectionAction,
  removeSectionAction,
  reorderSectionsAction,
  setSectionVisibilityAction,
} from "@/app/admin/actions";
import { logout } from "@/app/admin/login/actions";
import type { Section } from "@/lib/content";

const SECTION_LABELS: Record<Section["type"], string> = {
  hero: "Hero",
  highlight: "Highlight",
  features: "Services",
  footer: "Footer",
  canvas: "Custom canvas",
};

export function AdminBoard({
  initialSections,
  dbConfigured,
}: {
  initialSections: Section[];
  dbConfigured: boolean;
}) {
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(initialSections[0]?.id ?? null);
  const [isAdding, setIsAdding] = useState(false);
  const [, startTransition] = useTransition();

  const selected = sections.find((section) => section.id === selectedId) ?? null;

  function handleReorder(next: Section[]) {
    setSections(next);
    if (dbConfigured) {
      startTransition(() => {
        reorderSectionsAction(next.map((section) => section.id));
      });
    }
  }

  function toggleVisibility(id: string) {
    const target = sections.find((section) => section.id === id);
    if (!target) return;
    const nextVisible = !target.visible;
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, visible: nextVisible } : section))
    );
    if (dbConfigured) {
      startTransition(() => {
        setSectionVisibilityAction(id, nextVisible);
      });
    }
  }

  async function handleAddCanvasSection() {
    setIsAdding(true);
    try {
      const section = await addCanvasSectionAction();
      setSections((prev) => [...prev, section]);
      setSelectedId(section.id);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDeleteSection(id: string) {
    if (!window.confirm("Delete this section? This can't be undone.")) return;
    setSections((prev) => prev.filter((section) => section.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (dbConfigured) {
      await removeSectionAction(id);
    }
  }

  return (
    <div className="flex min-h-screen bg-sky-blue-light/10">
      <aside className="flex w-72 shrink-0 flex-col border-r border-deep-blue/10 bg-white">
        <div className="flex items-center justify-between border-b border-deep-blue/10 p-4">
          <p className="font-bold text-deep-blue">Sections</p>
          <form action={logout}>
            <button type="submit" className="text-xs font-medium text-deep-blue/50 hover:text-coral">
              Log out
            </button>
          </form>
        </div>

        <p className="px-4 pt-3 text-[11px] text-deep-blue/40">
          Drag <span className="font-semibold">⠿</span> to reorder. Click a section to edit it.
        </p>

        <div className="flex-1 overflow-y-auto p-3">
          <DragList
            items={sections}
            getId={(section) => section.id}
            onReorder={handleReorder}
            className="flex flex-col gap-2"
            renderItem={(section) => (
              <button
                type="button"
                onClick={() => setSelectedId(section.id)}
                className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors ${
                  selectedId === section.id
                    ? "border-sky-blue bg-sky-blue/10"
                    : "border-transparent hover:bg-deep-blue/5"
                }`}
              >
                <DragHandle />
                <span className="flex-1 font-medium text-deep-blue">
                  {SECTION_LABELS[section.type]}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleVisibility(section.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation();
                      toggleVisibility(section.id);
                    }
                  }}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    section.visible
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-black/5 text-deep-blue/40"
                  }`}
                >
                  {section.visible ? "Visible" : "Hidden"}
                </span>
                {section.type === "canvas" && (
                  <span
                    role="button"
                    tabIndex={0}
                    title="Delete section"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.stopPropagation();
                        handleDeleteSection(section.id);
                      }
                    }}
                    className="text-deep-blue/30 hover:text-coral"
                  >
                    ✕
                  </span>
                )}
              </button>
            )}
          />
        </div>

        <div className="border-t border-deep-blue/10 p-3">
          <button
            type="button"
            disabled={!dbConfigured || isAdding}
            onClick={handleAddCanvasSection}
            className="w-full rounded-full border border-dashed border-deep-blue/30 px-3 py-2 text-xs font-semibold text-deep-blue/70 transition-colors hover:border-sky-blue hover:text-sky-blue disabled:opacity-40"
          >
            {isAdding ? "Adding…" : "+ Add custom canvas section"}
          </button>
        </div>

        <div className="border-t border-deep-blue/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-sky-blue hover:underline"
          >
            View live site →
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {selected ? (
          <SectionEditorPanel key={selected.id} section={selected} dbConfigured={dbConfigured} />
        ) : (
          <p className="text-deep-blue/60">Select a section to edit.</p>
        )}
      </main>
    </div>
  );
}
