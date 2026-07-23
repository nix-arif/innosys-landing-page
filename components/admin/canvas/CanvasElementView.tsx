"use client";

import { useRef, type RefObject } from "react";
import { ElementContent } from "@/components/canvas/ElementContent";
import type { CanvasElement, ElementLayout, Locale } from "@/lib/content";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

type DragMode = "move" | "resize" | "rotate";

/** A snap line to render on the stage while dragging/resizing, in % of stage size. */
export interface Guide {
  axis: "x" | "y";
  position: number;
}

const SNAP_TOLERANCE = 1;

/** Candidate snap lines along one axis: canvas edges/center, sibling element edges/centers, and grid lines. */
function buildAxisCandidates(
  axis: "x" | "y",
  siblingLayouts: ElementLayout[],
  gridEnabled: boolean,
  gridSize: number
): number[] {
  const candidates = [0, 50, 100];
  for (const sibling of siblingLayouts) {
    const start = axis === "x" ? sibling.x : sibling.y;
    const size = axis === "x" ? sibling.width : sibling.height;
    candidates.push(start, start + size / 2, start + size);
  }
  if (gridEnabled) {
    for (let line = 0; line <= 100; line += gridSize) candidates.push(line);
  }
  return candidates;
}

/** Finds the candidate line closest to any reference point, within tolerance. */
function findSnap(
  references: number[],
  candidates: number[],
  tolerance: number
): { delta: number; line: number } | null {
  let best: { delta: number; line: number } | null = null;
  for (const ref of references) {
    for (const line of candidates) {
      const delta = line - ref;
      if (Math.abs(delta) < tolerance && (!best || Math.abs(delta) < Math.abs(best.delta))) {
        best = { delta, line };
      }
    }
  }
  return best;
}

export function CanvasElementView({
  element,
  layout,
  index,
  selected,
  stageRef,
  locale,
  gridEnabled,
  gridSize,
  siblingLayouts,
  onSelect,
  onLayoutChange,
  onGuidesChange,
}: {
  element: CanvasElement;
  layout: ElementLayout;
  index: number;
  selected: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  locale: Locale;
  gridEnabled: boolean;
  gridSize: number;
  siblingLayouts: ElementLayout[];
  onSelect: () => void;
  onLayoutChange: (layout: ElementLayout) => void;
  onGuidesChange: (guides: Guide[]) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  function startPointer(event: React.PointerEvent, mode: DragMode) {
    event.preventDefault();
    event.stopPropagation();
    onSelect();

    const startX = event.clientX;
    const startY = event.clientY;
    const startLayout = layout;
    const rect = wrapperRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : startX;
    const centerY = rect ? rect.top + rect.height / 2 : startY;
    const xCandidates = buildAxisCandidates("x", siblingLayouts, gridEnabled, gridSize);
    const yCandidates = buildAxisCandidates("y", siblingLayouts, gridEnabled, gridSize);

    function handleMove(moveEvent: PointerEvent) {
      const stageRect = stageRef.current?.getBoundingClientRect();
      if (!stageRect) return;
      const dxPct = ((moveEvent.clientX - startX) / stageRect.width) * 100;
      const dyPct = ((moveEvent.clientY - startY) / stageRect.height) * 100;

      if (mode === "move") {
        let x = clamp(startLayout.x + dxPct, 0, 100 - startLayout.width);
        let y = clamp(startLayout.y + dyPct, 0, 100 - startLayout.height);
        const guides: Guide[] = [];

        const snapX = findSnap(
          [x, x + startLayout.width / 2, x + startLayout.width],
          xCandidates,
          SNAP_TOLERANCE
        );
        if (snapX) {
          x = clamp(x + snapX.delta, 0, 100 - startLayout.width);
          guides.push({ axis: "x", position: snapX.line });
        }

        const snapY = findSnap(
          [y, y + startLayout.height / 2, y + startLayout.height],
          yCandidates,
          SNAP_TOLERANCE
        );
        if (snapY) {
          y = clamp(y + snapY.delta, 0, 100 - startLayout.height);
          guides.push({ axis: "y", position: snapY.line });
        }

        onGuidesChange(guides);
        onLayoutChange({ ...startLayout, x, y });
      } else if (mode === "resize") {
        let width = clamp(startLayout.width + dxPct, 4, 100 - startLayout.x);
        let height = clamp(startLayout.height + dyPct, 4, 100 - startLayout.y);
        const guides: Guide[] = [];

        const snapRight = findSnap([startLayout.x + width], xCandidates, SNAP_TOLERANCE);
        if (snapRight) {
          width = clamp(snapRight.line - startLayout.x, 4, 100 - startLayout.x);
          guides.push({ axis: "x", position: snapRight.line });
        }

        const snapBottom = findSnap([startLayout.y + height], yCandidates, SNAP_TOLERANCE);
        if (snapBottom) {
          height = clamp(snapBottom.line - startLayout.y, 4, 100 - startLayout.y);
          guides.push({ axis: "y", position: snapBottom.line });
        }

        onGuidesChange(guides);
        onLayoutChange({ ...startLayout, width, height });
      } else {
        let angle =
          Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI) +
          90;
        angle = Math.round(angle);
        const mod = ((angle % 15) + 15) % 15;
        if (mod < 3 || mod > 12) angle = Math.round(angle / 15) * 15;
        onLayoutChange({ ...startLayout, rotation: angle });
      }
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      onGuidesChange([]);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  if (layout.hidden) {
    return (
      <div
        ref={wrapperRef}
        onPointerDown={(event) => startPointer(event, "move")}
        className="absolute flex cursor-move items-center justify-center rounded-md border border-dashed border-deep-blue/25 bg-deep-blue/5 text-center text-[10px] text-deep-blue/40"
        style={{
          left: `${layout.x}%`,
          top: `${layout.y}%`,
          width: `${layout.width}%`,
          height: `${layout.height}%`,
          zIndex: index,
        }}
      >
        Hidden on this size
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onPointerDown={(event) => startPointer(event, "move")}
      className={`absolute cursor-move touch-none select-none ${
        selected ? "outline outline-2 outline-offset-2 outline-sky-blue" : ""
      }`}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.width}%`,
        height: `${layout.height}%`,
        transform: `rotate(${layout.rotation}deg)`,
        zIndex: index,
      }}
    >
      <ElementContent element={element} layout={layout} locale={locale} interactive={false} />
      {selected && (
        <>
          <div
            onPointerDown={(event) => startPointer(event, "resize")}
            className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-nwse-resize rounded-sm border-2 border-white bg-sky-blue shadow"
          />
          <div
            onPointerDown={(event) => startPointer(event, "rotate")}
            className="absolute -top-6 left-1/2 h-3.5 w-3.5 -translate-x-1/2 cursor-alias rounded-full border-2 border-white bg-coral shadow"
          />
        </>
      )}
    </div>
  );
}
