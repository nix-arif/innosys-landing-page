"use client";

import type { RefObject } from "react";
import { CanvasElementView } from "./CanvasElementView";
import {
  BREAKPOINTS,
  BREAKPOINT_WIDTH,
  type Breakpoint,
  type CanvasContent,
  type ElementLayout,
  type Locale,
} from "@/lib/content";

const BREAKPOINT_LABEL: Record<Breakpoint, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

export function CanvasStage({
  content,
  breakpoint,
  setBreakpoint,
  selectedId,
  stageRef,
  locale,
  onSelect,
  onLayoutChange,
  onDeselect,
  onHeightChange,
  onBackgroundChange,
  onCopyDesktopLayout,
}: {
  content: CanvasContent;
  breakpoint: Breakpoint;
  setBreakpoint: (breakpoint: Breakpoint) => void;
  selectedId: string | null;
  stageRef: RefObject<HTMLDivElement | null>;
  locale: Locale;
  onSelect: (id: string) => void;
  onLayoutChange: (id: string, layout: ElementLayout) => void;
  onDeselect: () => void;
  onHeightChange: (px: number) => void;
  onBackgroundChange: (color: string) => void;
  onCopyDesktopLayout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-deep-blue/10 bg-white px-6 py-3">
        <div className="flex rounded-full border border-deep-blue/15 p-1">
          {BREAKPOINTS.map((bp) => (
            <button
              key={bp}
              type="button"
              onClick={() => setBreakpoint(bp)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                breakpoint === bp
                  ? "bg-deep-blue text-white"
                  : "text-deep-blue/60 hover:text-deep-blue"
              }`}
            >
              {BREAKPOINT_LABEL[bp]}
            </button>
          ))}
        </div>
        {breakpoint !== "desktop" && (
          <button
            type="button"
            onClick={onCopyDesktopLayout}
            className="text-xs font-semibold text-sky-blue hover:underline"
          >
            Copy Desktop layout here
          </button>
        )}
        <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-deep-blue/70">
          Height
          <input
            type="number"
            value={content.heightPx[breakpoint]}
            onChange={(event) => onHeightChange(Number(event.target.value))}
            className="w-20 rounded-lg border border-deep-blue/20 px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-deep-blue/70">
          Background
          <input
            type="color"
            value={content.background.startsWith("#") ? content.background : "#ffffff"}
            onChange={(event) => onBackgroundChange(event.target.value)}
            className="h-7 w-10 cursor-pointer rounded border border-deep-blue/20"
          />
        </label>
      </div>

      <div className="flex-1 overflow-auto bg-[#eef3f7] p-10">
        <div
          ref={stageRef}
          onPointerDown={onDeselect}
          className="relative mx-auto overflow-hidden rounded-2xl border border-deep-blue/15 bg-white shadow-sm"
          style={{
            width: BREAKPOINT_WIDTH[breakpoint],
            maxWidth: "100%",
            aspectRatio: `${BREAKPOINT_WIDTH[breakpoint]} / ${content.heightPx[breakpoint]}`,
            background: content.background,
          }}
        >
          {content.elements.map((element, index) => (
            <CanvasElementView
              key={element.id}
              element={element}
              layout={element.layouts[breakpoint]}
              index={index}
              selected={selectedId === element.id}
              stageRef={stageRef}
              locale={locale}
              onSelect={() => onSelect(element.id)}
              onLayoutChange={(next) => onLayoutChange(element.id, next)}
            />
          ))}
          {content.elements.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-deep-blue/40">
              Add a text, image, button, or shape to start designing this section.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
