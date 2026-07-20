import type { CanvasElement, ElementLayout } from "@/lib/content";

const ALIGN_CLASS: Record<string, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

/** Renders a single canvas element's visual content. Shared between the
 * public page (Canvas.tsx) and the admin freeform editor so both stay
 * pixel-identical. */
export function ElementContent({
  element,
  layout,
}: {
  element: CanvasElement;
  layout: ElementLayout;
}) {
  switch (element.type) {
    case "text":
      return (
        <div
          className={`flex h-full w-full items-start ${ALIGN_CLASS[element.align]}`}
          style={{
            color: element.color,
            fontWeight: element.fontWeight === "bold" ? 700 : 400,
            fontSize: layout.fontSize ?? 16,
            fontFamily:
              element.fontFamily === "script" ? "var(--font-script)" : "var(--font-sans)",
            lineHeight: 1.25,
          }}
        >
          <span>{element.text}</span>
        </div>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src}
          alt={element.alt}
          className="h-full w-full"
          style={{ objectFit: "cover", borderRadius: element.radius }}
        />
      );
    case "button":
      return (
        <a
          href={element.href}
          className="flex h-full w-full items-center justify-center px-3 text-center font-semibold no-underline"
          style={{
            background: element.bg,
            color: element.textColor,
            borderRadius: element.radius,
            fontSize: layout.fontSize ?? 14,
          }}
        >
          {element.label}
        </a>
      );
    case "shape":
      return (
        <div
          className="h-full w-full"
          style={{
            background: element.fill,
            opacity: element.opacity,
            borderRadius: element.shape === "circle" ? 9999 : element.radius,
          }}
        />
      );
    default:
      return null;
  }
}
