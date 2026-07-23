"use client";

import type { ElementLayout } from "@/lib/content";

type HAlign = "left" | "center" | "right";
type VAlign = "top" | "middle" | "bottom";

const BUTTON_CLASS =
  "flex-1 rounded-lg border border-deep-blue/15 py-1.5 text-xs font-semibold text-deep-blue/70 hover:border-sky-blue hover:text-sky-blue";

export function AlignmentToolbar({
  layout,
  onLayoutChange,
}: {
  layout: ElementLayout;
  onLayoutChange: (layout: ElementLayout) => void;
}) {
  function alignH(align: HAlign) {
    const x =
      align === "left" ? 0 : align === "center" ? 50 - layout.width / 2 : 100 - layout.width;
    onLayoutChange({ ...layout, x });
  }

  function alignV(align: VAlign) {
    const y =
      align === "top" ? 0 : align === "middle" ? 50 - layout.height / 2 : 100 - layout.height;
    onLayoutChange({ ...layout, y });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-deep-blue/70">Align to canvas</p>
      <div className="flex gap-1.5">
        <button type="button" className={BUTTON_CLASS} onClick={() => alignH("left")}>
          Left
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => alignH("center")}>
          Center
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => alignH("right")}>
          Right
        </button>
      </div>
      <div className="flex gap-1.5">
        <button type="button" className={BUTTON_CLASS} onClick={() => alignV("top")}>
          Top
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => alignV("middle")}>
          Middle
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => alignV("bottom")}>
          Bottom
        </button>
      </div>
    </div>
  );
}
