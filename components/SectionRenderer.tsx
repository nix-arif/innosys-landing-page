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
} from "@/lib/content";

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} content={section.content as HeroContent} />;
          case "highlight":
            return (
              <Highlight key={section.id} content={section.content as HighlightContent} />
            );
          case "features":
            return (
              <Features key={section.id} content={section.content as FeaturesContent} />
            );
          case "footer":
            return <Footer key={section.id} content={section.content as FooterContent} />;
          case "canvas":
            return <Canvas key={section.id} content={section.content as CanvasContent} />;
          default:
            return null;
        }
      })}
    </>
  );
}
