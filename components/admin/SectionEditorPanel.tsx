"use client";

import { useState, useTransition } from "react";
import { saveSectionContentAction } from "@/app/admin/actions";
import { HeroEditor } from "./editors/HeroEditor";
import { HighlightEditor } from "./editors/HighlightEditor";
import { FeaturesEditor } from "./editors/FeaturesEditor";
import { FooterEditor } from "./editors/FooterEditor";
import { CanvasEditor } from "./canvas/CanvasEditor";
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
  const dirty = JSON.stringify(content) !== JSON.stringify(section.content);

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
    <div className={`mx-auto ${section.type === "canvas" ? "max-w-4xl" : "max-w-2xl"}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-deep-blue">{SECTION_LABELS[section.type]}</h2>
        <div className="flex items-center gap-3">
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

      <div className="mb-6 flex items-center gap-2">
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

      {!dbConfigured && (
        <p className="mb-6 rounded-lg bg-coral/10 p-3 text-xs text-coral">
          DATABASE_URL is not set, so changes here can&rsquo;t be saved yet. Add your
          Neon connection string to .env.local and restart the server.
        </p>
      )}

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
      {section.type === "canvas" && (
        <CanvasEditor
          content={content as CanvasContent}
          locale={locale}
          onChange={(next) => setContent(next)}
        />
      )}
    </div>
  );
}
