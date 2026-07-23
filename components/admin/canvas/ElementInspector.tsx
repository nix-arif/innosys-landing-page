import { TextField, LocalizedTextField, LocalizedTextAreaField } from "@/components/admin/Field";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { ColorSwatches } from "./ColorSwatches";
import type { Breakpoint, CanvasElement, ElementLayout, Locale } from "@/lib/content";

export function ElementInspector({
  element,
  layout,
  breakpoint,
  locale,
  onElementChange,
  onLayoutChange,
  onDelete,
}: {
  element: CanvasElement;
  layout: ElementLayout;
  breakpoint: Breakpoint;
  locale: Locale;
  onElementChange: (element: CanvasElement) => void;
  onLayoutChange: (layout: ElementLayout) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-deep-blue/50">
          {element.type} · editing {breakpoint}
        </p>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-semibold text-coral hover:underline"
        >
          Delete
        </button>
      </div>

      {element.type === "text" && (
        <>
          <LocalizedTextAreaField
            label="Text"
            value={element.text}
            locale={locale}
            onChange={(v) => onElementChange({ ...element, text: v })}
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-deep-blue/70">
                Font size (this size only)
              </span>
              <input
                type="number"
                value={layout.fontSize ?? 16}
                onChange={(event) =>
                  onLayoutChange({ ...layout, fontSize: Number(event.target.value) })
                }
                className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Weight</span>
              <select
                value={element.fontWeight}
                onChange={(event) =>
                  onElementChange({
                    ...element,
                    fontWeight: event.target.value as "normal" | "bold",
                  })
                }
                className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Align</span>
              <select
                value={element.align}
                onChange={(event) =>
                  onElementChange({
                    ...element,
                    align: event.target.value as "left" | "center" | "right",
                  })
                }
                className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Font</span>
              <select
                value={element.fontFamily}
                onChange={(event) =>
                  onElementChange({
                    ...element,
                    fontFamily: event.target.value as "sans" | "script",
                  })
                }
                className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
              >
                <option value="sans">Sans</option>
                <option value="script">Script</option>
              </select>
            </label>
          </div>
          <div>
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Color</span>
            <ColorSwatches
              value={element.color}
              onChange={(v) => onElementChange({ ...element, color: v })}
            />
          </div>
        </>
      )}

      {element.type === "image" && (
        <>
          <ImageDropzone
            label="Image"
            value={element.src}
            onChange={(url) => onElementChange({ ...element, src: url })}
          />
          <LocalizedTextField
            label="Alt text"
            value={element.alt}
            locale={locale}
            onChange={(v) => onElementChange({ ...element, alt: v })}
          />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">
              Corner radius
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={element.radius}
              onChange={(event) =>
                onElementChange({ ...element, radius: Number(event.target.value) })
              }
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">
              Fit inside box
            </span>
            <select
              value={element.objectFit ?? "cover"}
              onChange={(event) =>
                onElementChange({
                  ...element,
                  objectFit: event.target.value as NonNullable<typeof element.objectFit>,
                })
              }
              className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
            >
              <option value="cover">Cover (fill box, crop overflow)</option>
              <option value="contain">Contain (show full image, may letterbox)</option>
              <option value="fill">Fill (stretch to box, may distort)</option>
              <option value="scale-down">Scale down (contain, never upscale)</option>
              <option value="none">None (original size, crop overflow)</option>
            </select>
          </label>
        </>
      )}

      {element.type === "button" && (
        <>
          <LocalizedTextField
            label="Label"
            value={element.label}
            locale={locale}
            onChange={(v) => onElementChange({ ...element, label: v })}
          />
          <TextField
            label="Link"
            value={element.href}
            onChange={(v) => onElementChange({ ...element, href: v })}
          />
          <div>
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Background</span>
            <ColorSwatches
              value={element.bg}
              onChange={(v) => onElementChange({ ...element, bg: v })}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">
              Text color
            </span>
            <ColorSwatches
              value={element.textColor}
              onChange={(v) => onElementChange({ ...element, textColor: v })}
            />
          </div>
        </>
      )}

      {element.type === "shape" && (
        <>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Shape</span>
            <select
              value={element.shape}
              onChange={(event) =>
                onElementChange({
                  ...element,
                  shape: event.target.value as "rectangle" | "circle",
                })
              }
              className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </label>
          <div>
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Fill</span>
            <ColorSwatches
              value={element.fill}
              onChange={(v) => onElementChange({ ...element, fill: v })}
            />
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Opacity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={element.opacity}
              onChange={(event) =>
                onElementChange({ ...element, opacity: Number(event.target.value) })
              }
              className="w-full"
            />
          </label>
        </>
      )}

      <div className="grid grid-cols-2 gap-3 border-t border-deep-blue/10 pt-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-deep-blue/70">Rotation (°)</span>
          <input
            type="number"
            value={Math.round(layout.rotation)}
            onChange={(event) =>
              onLayoutChange({ ...layout, rotation: Number(event.target.value) })
            }
            className="w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-end gap-2 pb-2 text-xs font-semibold text-deep-blue/70">
          <input
            type="checkbox"
            checked={Boolean(layout.hidden)}
            onChange={(event) => onLayoutChange({ ...layout, hidden: event.target.checked })}
          />
          Hide on {breakpoint}
        </label>
      </div>
    </div>
  );
}
