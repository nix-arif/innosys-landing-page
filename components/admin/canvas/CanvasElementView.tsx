"use client";

import { useRef, type RefObject } from "react";
import { ElementContent } from "@/components/canvas/ElementContent";
import type { CanvasElement, ElementLayout } from "@/lib/content";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

type DragMode = "move" | "resize" | "rotate";

export function CanvasElementView({
  element,
  layout,
  index,
  selected,
  stageRef,
  onSelect,
  onLayoutChange,
}: {
  element: CanvasElement;
  layout: ElementLayout;
  index: number;
  selected: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onLayoutChange: (layout: ElementLayout) => void;
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

    function handleMove(moveEvent: PointerEvent) {
      const stageRect = stageRef.current?.getBoundingClientRect();
      if (!stageRect) return;
      const dxPct = ((moveEvent.clientX - startX) / stageRect.width) * 100;
      const dyPct = ((moveEvent.clientY - startY) / stageRect.height) * 100;

      if (mode === "move") {
        let x = clamp(startLayout.x + dxPct, 0, 100 - startLayout.width);
        let y = clamp(startLayout.y + dyPct, 0, 100 - startLayout.height);
        const centerXPct = x + startLayout.width / 2;
        if (Math.abs(centerXPct - 50) < 1.5) x = 50 - startLayout.width / 2;
        const centerYPct = y + startLayout.height / 2;
        if (Math.abs(centerYPct - 50) < 1.5) y = 50 - startLayout.height / 2;
        onLayoutChange({ ...startLayout, x, y });
      } else if (mode === "resize") {
        const width = clamp(startLayout.width + dxPct, 4, 100 - startLayout.x);
        const height = clamp(startLayout.height + dyPct, 4, 100 - startLayout.y);
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
      <ElementContent element={element} layout={layout} />
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
