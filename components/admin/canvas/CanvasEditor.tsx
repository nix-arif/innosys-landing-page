"use client";

import { useRef, useState } from "react";
import { DragList } from "@/components/admin/DragList";
import { DragHandle } from "@/components/admin/DragHandle";
import { randomUUID } from "@/components/admin/randomId";
import { CanvasElementView } from "./CanvasElementView";
import { ElementInspector } from "./ElementInspector";
import {
  BREAKPOINTS,
  BREAKPOINT_WIDTH,
  type Breakpoint,
  type CanvasContent,
  type CanvasElement,
  type ElementLayout,
} from "@/lib/content";

const BREAKPOINT_LABEL: Record<Breakpoint, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

function defaultLayout(): ElementLayout {
  return { x: 30, y: 35, width: 40, height: 20, rotation: 0, fontSize: 20 };
}

function sameForAllBreakpoints(layout: ElementLayout): Record<Breakpoint, ElementLayout> {
  return { desktop: { ...layout }, tablet: { ...layout }, mobile: { ...layout } };
}

function newElement(type: CanvasElement["type"]): CanvasElement {
  const id = randomUUID();
  const layouts = sameForAllBreakpoints(defaultLayout());
  switch (type) {
    case "text":
      return {
        id,
        type,
        text: "New text",
        color: "var(--color-deep-blue)",
        fontWeight: "bold",
        align: "left",
        fontFamily: "sans",
        layouts,
      };
    case "image":
      return {
        id,
        type,
        src: "/assets/mascot/android-chrome-512x512.png",
        alt: "Image",
        radius: 16,
        layouts,
      };
    case "button":
      return {
        id,
        type,
        label: "Click me",
        href: "#",
        bg: "var(--color-coral)",
        textColor: "#ffffff",
        radius: 999,
        layouts,
      };
    case "shape":
      return {
        id,
        type,
        shape: "rectangle",
        fill: "var(--color-sky-blue)",
        opacity: 0.25,
        radius: 24,
        layouts,
      };
  }
}

export function CanvasEditor({
  content,
  onChange,
}: {
  content: CanvasContent;
  onChange: (content: CanvasContent) => void;
}) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(content.elements[0]?.id ?? null);
  const stageRef = useRef<HTMLDivElement>(null);

  const selectedElement = content.elements.find((el) => el.id === selectedId) ?? null;

  function setElements(elements: CanvasElement[]) {
    onChange({ ...content, elements });
  }

  function updateElement(id: string, next: CanvasElement) {
    setElements(content.elements.map((el) => (el.id === id ? next : el)));
  }

  function updateLayout(id: string, next: ElementLayout) {
    setElements(
      content.elements.map((el) =>
        el.id === id
          ? ({ ...el, layouts: { ...el.layouts, [breakpoint]: next } } as CanvasElement)
          : el
      )
    );
  }

  function addElement(type: CanvasElement["type"]) {
    const element = newElement(type);
    setElements([...content.elements, element]);
    setSelectedId(element.id);
  }

  function removeElement(id: string) {
    setElements(content.elements.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function copyDesktopLayoutHere() {
    setElements(
      content.elements.map((el) => ({
        ...el,
        layouts: { ...el.layouts, [breakpoint]: { ...el.layouts.desktop } },
      }))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
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
            onClick={copyDesktopLayoutHere}
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
            onChange={(event) =>
              onChange({
                ...content,
                heightPx: { ...content.heightPx, [breakpoint]: Number(event.target.value) },
              })
            }
            className="w-20 rounded-lg border border-deep-blue/20 px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-deep-blue/70">
          Background
          <input
            type="color"
            value={content.background.startsWith("#") ? content.background : "#ffffff"}
            onChange={(event) => onChange({ ...content, background: event.target.value })}
            className="h-7 w-10 cursor-pointer rounded border border-deep-blue/20"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["text", "image", "button", "shape"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addElement(type)}
            className="rounded-full border border-dashed border-deep-blue/30 px-3 py-1.5 text-xs font-semibold capitalize text-deep-blue/70 hover:border-sky-blue hover:text-sky-blue"
          >
            + {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          ref={stageRef}
          onPointerDown={() => setSelectedId(null)}
          className="relative mx-auto w-full overflow-hidden rounded-2xl border border-deep-blue/15"
          style={{
            maxWidth: BREAKPOINT_WIDTH[breakpoint],
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
              onSelect={() => setSelectedId(element.id)}
              onLayoutChange={(next) => updateLayout(element.id, next)}
            />
          ))}
          {content.elements.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-deep-blue/40">
              Add a text, image, button, or shape to start designing this section.
            </p>
          )}
        </div>

        <div className="w-full shrink-0 lg:w-64">
          <p className="mb-2 text-xs font-semibold text-deep-blue/70">Layers (drag to reorder)</p>
          <DragList
            items={content.elements}
            getId={(el) => el.id}
            onReorder={setElements}
            className="flex flex-col gap-1.5"
            itemClassName="rounded-lg border border-deep-blue/10 bg-white p-1.5"
            renderItem={(element) => (
              <button
                type="button"
                onClick={() => setSelectedId(element.id)}
                className={`flex w-full items-center gap-2 text-left text-xs ${
                  selectedId === element.id ? "font-semibold text-deep-blue" : "text-deep-blue/60"
                }`}
              >
                <DragHandle />
                <span className="flex-1 truncate capitalize">
                  {element.type === "text" ? element.text || "Text" : element.type}
                </span>
              </button>
            )}
          />
        </div>
      </div>

      {selectedElement && (
        <div className="rounded-2xl border border-deep-blue/10 bg-white p-4">
          <ElementInspector
            element={selectedElement}
            layout={selectedElement.layouts[breakpoint]}
            breakpoint={breakpoint}
            onElementChange={(next) => updateElement(selectedElement.id, next)}
            onLayoutChange={(next) => updateLayout(selectedElement.id, next)}
            onDelete={() => removeElement(selectedElement.id)}
          />
        </div>
      )}
    </div>
  );
}
