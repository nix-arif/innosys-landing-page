import { ElementContent } from "@/components/canvas/ElementContent";
import {
  BREAKPOINTS,
  BREAKPOINT_WIDTH,
  type Breakpoint,
  type CanvasContent,
  type Locale,
} from "@/lib/content";

// Matches Tailwind's default sm/md/lg breakpoints so the three variants below
// hand off to each other with no gap or overlap.
const VISIBILITY: Record<Breakpoint, string> = {
  mobile: "block md:hidden",
  tablet: "hidden md:block lg:hidden",
  desktop: "hidden lg:block",
};

export function Canvas({ content, locale }: { content: CanvasContent; locale: Locale }) {
  return (
    <section className="relative w-full">
      {BREAKPOINTS.map((breakpoint) => (
        <div
          key={breakpoint}
          className={`relative w-full overflow-hidden ${VISIBILITY[breakpoint]}`}
          style={{
            aspectRatio: `${BREAKPOINT_WIDTH[breakpoint]} / ${content.heightPx[breakpoint]}`,
            background: content.background,
          }}
        >
          {content.elements.map((element, index) => {
            const layout = element.layouts[breakpoint];
            if (layout.hidden) return null;
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  width: `${layout.width}%`,
                  height: `${layout.height}%`,
                  transform: `rotate(${layout.rotation}deg)`,
                  zIndex: index,
                }}
              >
                <ElementContent element={element} layout={layout} locale={locale} />
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
