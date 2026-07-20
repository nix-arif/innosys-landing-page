"use client";

import { useState, useTransition } from "react";
import { saveSectionContentAction } from "@/app/admin/actions";
import { HeroEditor } from "./editors/HeroEditor";
import { HighlightEditor } from "./editors/HighlightEditor";
import { FeaturesEditor } from "./editors/FeaturesEditor";
import { FooterEditor } from "./editors/FooterEditor";
import { CanvasWorkspace } from "./canvas/CanvasWorkspace";
import { LivePreview } from "./LivePreview";
import {
  LOCALES,
  LOCALE_LABEL,
  DEFAULT_LOCALE,
  type Section,
  type SectionContent,
  type HeroContent,
  type HighlightContent,
  type FeaturesContent,
  type FooterContent,
  type CanvasContent,
  type Locale,
} from "@/lib/content";

const SECTION_LABELS: Record<Section["type"], string> = {
  hero: "Hero",
  highlight: "Highlight (brand spotlight)",
  features: "Services",
  footer: "Footer",
  canvas: "Custom canvas section",
};

export function SectionEditorPanel({
  section,
  dbConfigured,
}: {
  section: Section;
  dbConfigured: boolean;
}) {
  const [content, setContent] = useState<SectionContent>(section.content);
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [dockNode, setDockNode] = useState<HTMLDivElement | null>(null);
  const dirty = JSON.stringify(content) !== JSON.stringify(section.content);
  const isCanvas = section.type === "canvas";

  function handleSave() {
    startTransition(async () => {
      try {
        await saveSectionContentAction(section.id, content);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-deep-blue/10 bg-white px-6 py-3">
        <h2 className="text-lg font-bold text-deep-blue">{SECTION_LABELS[section.type]}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-deep-blue/50">Language:</span>
            <div className="flex rounded-full border border-deep-blue/15 p-1">
              {LOCALES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLocale(option)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    locale === option
                      ? "bg-deep-blue text-white"
                      : "text-deep-blue/60 hover:text-deep-blue"
                  }`}
                >
                  {LOCALE_LABEL[option]}
                </button>
              ))}
            </div>
          </div>
          {status === "saved" && (
            <span className="text-xs font-medium text-emerald-600">Saved</span>
          )}
          {status === "error" && (
            <span className="text-xs font-medium text-coral">Save failed</span>
          )}
          <button
            type="button"
            disabled={!dbConfigured || isPending || !dirty}
            onClick={handleSave}
            className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {!dbConfigured && (
        <p className="border-b border-coral/20 bg-coral/10 px-6 py-2 text-xs text-coral">
          DATABASE_URL is not set, so changes here can&rsquo;t be saved yet. Add your Neon
          connection string to .env.local and restart the server.
        </p>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-[#eef3f7]">
          {isCanvas ? (
            <CanvasWorkspace
              content={content as CanvasContent}
              locale={locale}
              onChange={(next) => setContent(next)}
              dockNode={dockNode}
            />
          ) : (
            <div className="p-8">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <LivePreview type={section.type} content={content} locale={locale} />
              </div>
            </div>
          )}
        </div>

        <aside className="w-[380px] shrink-0 overflow-y-auto border-l border-deep-blue/10 bg-white">
          {isCanvas ? (
            <div ref={setDockNode} />
          ) : (
            <div className="p-5">
              {section.type === "hero" && (
                <HeroEditor
                  content={content as HeroContent}
                  locale={locale}
                  onChange={(next) => setContent(next)}
                />
              )}
              {section.type === "highlight" && (
                <HighlightEditor
                  content={content as HighlightContent}
                  locale={locale}
                  onChange={(next) => setContent(next)}
                />
              )}
              {section.type === "features" && (
                <FeaturesEditor
                  content={content as FeaturesContent}
                  locale={locale}
                  onChange={(next) => setContent(next)}
                />
              )}
              {section.type === "footer" && (
                <FooterEditor
                  content={content as FooterContent}
                  locale={locale}
                  onChange={(next) => setContent(next)}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
