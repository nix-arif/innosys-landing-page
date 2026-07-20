import { randomUUID } from "node:crypto";
import { getSql } from "./db";

export type SectionType = "hero" | "highlight" | "features" | "footer" | "canvas";

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  mascotImage: string;
}

export interface HighlightContent {
  eyebrow: string;
  script: string;
  headlineLines: string[];
  paragraphHeading: string;
  paragraph: string;
  quote: string;
  quoteHighlight: string;
  signOff: string;
  mascotImage: string;
  website: string;
  email: string;
  phone: string;
  socialHandle: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: FeatureItem[];
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
}

export interface FooterContent {
  companyName: string;
  tagline: string;
  website: string;
  email: string;
  phone: string;
  socials: SocialLink[];
  copyrightText: string;
}

// --- Canvas (Canva-style freeform) sections -------------------------------

export type Breakpoint = "desktop" | "tablet" | "mobile";
export const BREAKPOINTS: Breakpoint[] = ["desktop", "tablet", "mobile"];
/** Reference design width (px) used only to size the editor stage / preview aspect ratio. */
export const BREAKPOINT_WIDTH: Record<Breakpoint, number> = {
  desktop: 1200,
  tablet: 820,
  mobile: 390,
};

export interface ElementLayout {
  x: number; // % from left of the canvas
  y: number; // % from top of the canvas
  width: number; // % of canvas width
  height: number; // % of canvas height
  rotation: number; // degrees
  fontSize?: number; // px, text/button elements only
  hidden?: boolean; // hide this element at this specific breakpoint
}

interface CanvasElementBase {
  id: string;
  layouts: Record<Breakpoint, ElementLayout>;
}

export interface TextElement extends CanvasElementBase {
  type: "text";
  text: string;
  color: string;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
  fontFamily: "sans" | "script";
}

export interface ImageElement extends CanvasElementBase {
  type: "image";
  src: string;
  alt: string;
  radius: number;
}

export interface ButtonElement extends CanvasElementBase {
  type: "button";
  label: string;
  href: string;
  bg: string;
  textColor: string;
  radius: number;
}

export interface ShapeElement extends CanvasElementBase {
  type: "shape";
  shape: "rectangle" | "circle";
  fill: string;
  opacity: number;
  radius: number;
}

export type CanvasElement = TextElement | ImageElement | ButtonElement | ShapeElement;

export interface CanvasContent {
  background: string;
  heightPx: Record<Breakpoint, number>;
  elements: CanvasElement[];
}

export function createDefaultCanvasContent(): CanvasContent {
  return {
    background: "#ffffff",
    heightPx: { desktop: 400, tablet: 420, mobile: 480 },
    elements: [],
  };
}

// ---------------------------------------------------------------------------

export type SectionContent =
  | HeroContent
  | HighlightContent
  | FeaturesContent
  | FooterContent
  | CanvasContent;

export interface Section<T extends SectionContent = SectionContent> {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  content: T;
}

function sameForAllBreakpoints(layout: ElementLayout): Record<Breakpoint, ElementLayout> {
  return { desktop: { ...layout }, tablet: { ...layout }, mobile: { ...layout } };
}

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    type: "hero",
    order: 0,
    visible: true,
    content: {
      eyebrow: "Smart Innosys Sdn Bhd",
      headline: "Smart automation for a sharper business.",
      subheadline:
        "We design and build digital systems, automation, and software that help Malaysian businesses move faster and work smarter.",
      ctaLabel: "Talk to us",
      ctaHref: "#contact",
      secondaryCtaLabel: "See what we do",
      secondaryCtaHref: "#highlight",
      mascotImage: "/assets/mascot/android-chrome-512x512.png",
    } satisfies HeroContent,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    type: "highlight",
    order: 1,
    visible: true,
    content: {
      eyebrow: "Smart Innosys Sdn Bhd",
      script: "Memperkenalkan",
      headlineLines: ["Rakan digital", "yang membina", "masa depan anda"],
      paragraphHeading: "Kenapa Smart Innosys?",
      paragraph:
        "Kami menggabungkan kepakaran teknologi dengan pemahaman mendalam tentang perniagaan tempatan untuk membina penyelesaian yang benar-benar berfungsi — dari automasi proses sehingga pembangunan sistem tersuai.",
      quote: "Bersama Smart Innosys, mari kita",
      quoteHighlight: "terus melangkah ke hadapan.",
      signOff: "Membina masa depan digital, bersama.",
      mascotImage: "/assets/mascot/android-chrome-512x512.png",
      website: "www.smartinnosys.com",
      email: "smartinnosys@gmail.com",
      phone: "+6012 256 7411",
      socialHandle: "@smartinnosys",
    } satisfies HighlightContent,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    type: "features",
    order: 2,
    visible: true,
    content: {
      eyebrow: "What we do",
      heading: "Solutions built around your business",
      subheading:
        "From custom software to process automation, we cover the full journey from idea to deployment.",
      items: [
        {
          id: "f1",
          title: "Custom Software",
          description:
            "Web and mobile applications tailored to how your team actually works.",
          icon: "code",
        },
        {
          id: "f2",
          title: "Process Automation",
          description:
            "Cut manual work with automated workflows that save time and reduce errors.",
          icon: "spark",
        },
        {
          id: "f3",
          title: "Cloud & Infrastructure",
          description:
            "Reliable, scalable systems that grow with your business.",
          icon: "cloud",
        },
        {
          id: "f4",
          title: "Consulting",
          description:
            "Strategic guidance to help you choose the right technology, the first time.",
          icon: "chat",
        },
      ],
    } satisfies FeaturesContent,
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    type: "canvas",
    order: 3,
    visible: true,
    content: {
      background: "#f2f9fc",
      heightPx: { desktop: 340, tablet: 380, mobile: 460 },
      elements: [
        {
          id: "demo-text",
          type: "text",
          text: "Design any section exactly the way you want — drag, resize, and rotate freely, with independent layouts for desktop, tablet, and mobile.",
          color: "var(--color-deep-blue)",
          fontWeight: "bold",
          align: "left",
          fontFamily: "sans",
          layouts: sameForAllBreakpoints({
            x: 8,
            y: 30,
            width: 54,
            height: 36,
            rotation: 0,
            fontSize: 24,
          }),
        },
        {
          id: "demo-shape",
          type: "shape",
          shape: "circle",
          fill: "var(--color-sky-blue)",
          opacity: 0.22,
          radius: 999,
          layouts: sameForAllBreakpoints({
            x: 66,
            y: 5,
            width: 30,
            height: 90,
            rotation: 0,
          }),
        },
        {
          id: "demo-button",
          type: "button",
          label: "Open the canvas editor →",
          href: "/admin",
          bg: "var(--color-coral)",
          textColor: "#ffffff",
          radius: 999,
          layouts: sameForAllBreakpoints({
            x: 8,
            y: 72,
            width: 34,
            height: 12,
            rotation: 0,
            fontSize: 14,
          }),
        },
      ],
    } satisfies CanvasContent,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    type: "footer",
    order: 4,
    visible: true,
    content: {
      companyName: "Smart Innosys Sdn Bhd",
      tagline: "Smart automation for a sharper business.",
      website: "www.smartinnosys.com",
      email: "smartinnosys@gmail.com",
      phone: "+6012 256 7411",
      socials: [
        { id: "s1", platform: "facebook", href: "https://facebook.com/smartinnosys" },
        { id: "s2", platform: "instagram", href: "https://instagram.com/smartinnosys" },
        { id: "s3", platform: "threads", href: "https://threads.net/@smartinnosys" },
      ],
      copyrightText: `© ${new Date().getFullYear()} Smart Innosys Sdn Bhd. All rights reserved.`,
    } satisfies FooterContent,
  },
];

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  const sql = getSql();
  if (!sql) return Promise.resolve();
  if (!ready) {
    ready = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS sections (
          id uuid PRIMARY KEY,
          type text NOT NULL,
          "order" integer NOT NULL,
          visible boolean NOT NULL DEFAULT true,
          content jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      // Insert any default sections that don't exist yet. ON CONFLICT DO NOTHING
      // means this never touches rows a user has already edited, so it's safe
      // to run on every cold start (and lets us add new defaults later, like
      // the canvas demo section, without clobbering existing databases).
      for (const section of DEFAULT_SECTIONS) {
        await sql`
          INSERT INTO sections (id, type, "order", visible, content)
          VALUES (
            ${section.id},
            ${section.type},
            ${section.order},
            ${section.visible},
            ${JSON.stringify(section.content)}::jsonb
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
    })();
  }
  return ready;
}

interface SectionRow {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  content: SectionContent;
}

export async function getAllSections(): Promise<Section[]> {
  const sql = getSql();
  if (!sql) return DEFAULT_SECTIONS;
  await ensureReady();
  const rows = (await sql`
    SELECT id, type, "order", visible, content FROM sections ORDER BY "order" ASC
  `) as SectionRow[];
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    order: row.order,
    visible: row.visible,
    content: row.content,
  }));
}

export async function getVisibleSections(): Promise<Section[]> {
  const sections = await getAllSections();
  return sections.filter((section) => section.visible);
}

export async function updateSectionContent(
  id: string,
  content: SectionContent
): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  await sql`
    UPDATE sections
    SET content = ${JSON.stringify(content)}::jsonb, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function reorderSections(orderedIds: string[]): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  for (let i = 0; i < orderedIds.length; i++) {
    await sql`UPDATE sections SET "order" = ${i} WHERE id = ${orderedIds[i]}`;
  }
}

export async function setSectionVisibility(
  id: string,
  visible: boolean
): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  await sql`
    UPDATE sections SET visible = ${visible}, updated_at = now() WHERE id = ${id}
  `;
}

/** Only "canvas" sections can be freely added/removed; the other section types are fixed. */
export async function createCanvasSection(): Promise<Section> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  const rows = (await sql`
    SELECT COALESCE(MAX("order"), -1)::int AS max FROM sections
  `) as { max: number }[];
  const order = (rows[0]?.max ?? -1) + 1;
  const section: Section<CanvasContent> = {
    id: randomUUID(),
    type: "canvas",
    order,
    visible: true,
    content: createDefaultCanvasContent(),
  };
  await sql`
    INSERT INTO sections (id, type, "order", visible, content)
    VALUES (
      ${section.id},
      ${section.type},
      ${section.order},
      ${section.visible},
      ${JSON.stringify(section.content)}::jsonb
    )
  `;
  return section;
}

export async function deleteSection(id: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureReady();
  await sql`DELETE FROM sections WHERE id = ${id} AND type = 'canvas'`;
}
