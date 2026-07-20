"use client";

import { DragList } from "@/components/admin/DragList";
import { DragHandle } from "@/components/admin/DragHandle";
import { ElementInspector } from "./ElementInspector";
import {
  t,
  type Breakpoint,
  type CanvasContent,
  type CanvasElement,
  type ElementLayout,
  type Locale,
} from "@/lib/content";

export function CanvasControls({
  content,
  breakpoint,
  selectedId,
  selectedElement,
  locale,
  onSelect,
  onAddElement,
  onReorderElements,
  onElementChange,
  onLayoutChange,
  onDeleteElement,
}: {
  content: CanvasContent;
  breakpoint: Breakpoint;
  selectedId: string | null;
  selectedElement: CanvasElement | null;
  locale: Locale;
  onSelect: (id: string) => void;
  onAddElement: (type: CanvasElement["type"]) => void;
  onReorderElements: (elements: CanvasElement[]) => void;
  onElementChange: (element: CanvasElement) => void;
  onLayoutChange: (layout: ElementLayout) => void;
  onDeleteElement: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <p className="mb-2 text-xs font-semibold text-deep-blue/70">Add element</p>
        <div className="flex flex-wrap gap-2">
          {(["text", "image", "button", "shape"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onAddElement(type)}
              className="rounded-full border border-dashed border-deep-blue/30 px-3 py-1.5 text-xs font-semibold capitalize text-deep-blue/70 hover:border-sky-blue hover:text-sky-blue"
            >
              + {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-deep-blue/70">Layers (drag to reorder)</p>
        {content.elements.length === 0 ? (
          <p className="text-xs text-deep-blue/40">No elements yet.</p>
        ) : (
          <DragList
            items={content.elements}
            getId={(el) => el.id}
            onReorder={onReorderElements}
            className="flex flex-col gap-1.5"
            itemClassName="rounded-lg border border-deep-blue/10 bg-white p-1.5"
            renderItem={(element) => (
              <button
                type="button"
                onClick={() => onSelect(element.id)}
                className={`flex w-full items-center gap-2 text-left text-xs ${
                  selectedId === element.id ? "font-semibold text-deep-blue" : "text-deep-blue/60"
                }`}
              >
                <DragHandle />
                <span className="flex-1 truncate capitalize">
                  {element.type === "text" ? t(element.text, locale) || "Text" : element.type}
                </span>
              </button>
            )}
          />
        )}
      </div>

      {selectedElement && (
        <div className="rounded-2xl border border-deep-blue/10 bg-white p-4">
          <ElementInspector
            element={selectedElement}
            layout={selectedElement.layouts[breakpoint]}
            breakpoint={breakpoint}
            locale={locale}
            onElementChange={onElementChange}
            onLayoutChange={onLayoutChange}
            onDelete={onDeleteElement}
          />
        </div>
      )}
    </div>
  );
}
