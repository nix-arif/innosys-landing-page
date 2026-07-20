"use client";

import { Hero } from "@/components/sections/Hero";
import { Highlight } from "@/components/sections/Highlight";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import type {
  Section,
  SectionContent,
  Locale,
  HeroContent,
  HighlightContent,
  FeaturesContent,
  FooterContent,
} from "@/lib/content";

/** Renders the real public section component with the in-progress edited
 * content, so the admin shows exactly what the live site will look like as
 * you type — no separate preview markup to keep in sync. */
export function LivePreview({
  type,
  content,
  locale,
}: {
  type: Section["type"];
  content: SectionContent;
  locale: Locale;
}) {
  switch (type) {
    case "hero":
      return <Hero content={content as HeroContent} locale={locale} />;
    case "highlight":
      return <Highlight content={content as HighlightContent} locale={locale} />;
    case "features":
      return <Features content={content as FeaturesContent} locale={locale} />;
    case "footer":
      return <Footer content={content as FooterContent} locale={locale} />;
    default:
      return null;
  }
}
