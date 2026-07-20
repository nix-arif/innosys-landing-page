import { Hero } from "@/components/sections/Hero";
import { Highlight } from "@/components/sections/Highlight";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Canvas } from "@/components/sections/Canvas";
import type {
  Section,
  HeroContent,
  HighlightContent,
  FeaturesContent,
  FooterContent,
  CanvasContent,
  Locale,
} from "@/lib/content";

export function SectionRenderer({
  sections,
  locale,
}: {
  sections: Section[];
  locale: Locale;
}) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <Hero key={section.id} content={section.content as HeroContent} locale={locale} />
            );
          case "highlight":
            return (
              <Highlight
                key={section.id}
                content={section.content as HighlightContent}
                locale={locale}
              />
            );
          case "features":
            return (
              <Features
                key={section.id}
                content={section.content as FeaturesContent}
                locale={locale}
              />
            );
          case "footer":
            return (
              <Footer
                key={section.id}
                content={section.content as FooterContent}
                locale={locale}
              />
            );
          case "canvas":
            return (
              <Canvas
                key={section.id}
                content={section.content as CanvasContent}
                locale={locale}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
