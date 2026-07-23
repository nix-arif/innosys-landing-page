import { randomUUID } from "node:crypto";
import { getSql } from "./db";

export type SectionType = "hero" | "highlight" | "features" | "footer" | "canvas";

// --- Localization ------------------------------------------------------

export type Locale = "en" | "ms";
export const LOCALES: Locale[] = ["en", "ms"];
export const LOCALE_LABEL: Record<Locale, string> = { en: "English", ms: "Bahasa Melayu" };
export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedText = Record<Locale, string>;

function lt(en: string, ms: string): LocalizedText {
  return { en, ms };
}

/** Reads a localized field, falling back to English if a translation is missing. */
export function t(text: LocalizedText, locale: Locale): string {
  return text[locale] || text[DEFAULT_LOCALE] || "";
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ms";
}

// --- Structured section content ----------------------------------------

export interface HeroContent {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  subheadline: LocalizedText;
  ctaLabel: LocalizedText;
  ctaHref: string;
  secondaryCtaLabel: LocalizedText;
  secondaryCtaHref: string;
  mascotImage: string;
}

export interface HighlightContent {
  eyebrow: LocalizedText;
  script: LocalizedText;
  /** One line per row; split into an array with .split("\n") when rendering. */
  headlineLines: LocalizedText;
  paragraphHeading: LocalizedText;
  paragraph: LocalizedText;
  quote: LocalizedText;
  quoteHighlight: LocalizedText;
  signOff: LocalizedText;
  mascotImage: string;
  website: string;
  email: string;
  phone: string;
  socialHandle: string;
}

export interface FeatureItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
}

export interface FeaturesContent {
  eyebrow: LocalizedText;
  heading: LocalizedText;
  subheading: LocalizedText;
  items: FeatureItem[];
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
}

export interface FooterContent {
  companyName: string;
  tagline: LocalizedText;
  website: string;
  email: string;
  phone: string;
  socials: SocialLink[];
  copyrightText: LocalizedText;
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
  text: LocalizedText;
  color: string;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
  fontFamily: "sans" | "script";
}

export type ImageObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageElement extends CanvasElementBase {
  type: "image";
  src: string;
  alt: LocalizedText;
  radius: number;
  /** CSS object-fit for how the image fills its box; defaults to "cover" when unset. */
  objectFit?: ImageObjectFit;
}

export interface ButtonElement extends CanvasElementBase {
  type: "button";
  label: LocalizedText;
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

function perBreakpoint(
  desktop: ElementLayout,
  tablet: ElementLayout,
  mobile: ElementLayout
): Record<Breakpoint, ElementLayout> {
  return { desktop, tablet, mobile };
}

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    type: "hero",
    order: 0,
    visible: true,
    content: {
      eyebrow: lt("Smart Innosys Sdn Bhd", "Smart Innosys Sdn Bhd"),
      headline: lt(
        "Smart automation for a sharper business.",
        "Automasi pintar untuk perniagaan yang lebih tajam."
      ),
      subheadline: lt(
        "We design and build digital systems, automation, and software that help Malaysian businesses move faster and work smarter.",
        "Kami mereka bentuk dan membina sistem digital, automasi, dan perisian yang membantu perniagaan Malaysia bergerak lebih pantas dan bekerja lebih bijak."
      ),
      ctaLabel: lt("Talk to us", "Hubungi kami"),
      ctaHref: "#contact",
      secondaryCtaLabel: lt("See what we do", "Lihat perkhidmatan kami"),
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
      eyebrow: lt("Smart Innosys Sdn Bhd", "Smart Innosys Sdn Bhd"),
      script: lt("Introducing", "Memperkenalkan"),
      headlineLines: lt(
        "Your digital partner\nbuilding your\nfuture forward",
        "Rakan digital\nyang membina\nmasa depan anda"
      ),
      paragraphHeading: lt("Why Smart Innosys?", "Kenapa Smart Innosys?"),
      paragraph: lt(
        "We combine technical expertise with a deep understanding of local business to build solutions that genuinely work — from process automation to custom system development.",
        "Kami menggabungkan kepakaran teknologi dengan pemahaman mendalam tentang perniagaan tempatan untuk membina penyelesaian yang benar-benar berfungsi — dari automasi proses sehingga pembangunan sistem tersuai."
      ),
      quote: lt("Together with Smart Innosys, let's keep", "Bersama Smart Innosys, mari kita"),
      quoteHighlight: lt("moving forward.", "terus melangkah ke hadapan."),
      signOff: lt("Building a digital future, together.", "Membina masa depan digital, bersama."),
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
      eyebrow: lt("What we do", "Perkhidmatan kami"),
      heading: lt(
        "Solutions built around your business",
        "Penyelesaian dibina di sekeliling perniagaan anda"
      ),
      subheading: lt(
        "From custom software to process automation, we cover the full journey from idea to deployment.",
        "Dari perisian tersuai hingga automasi proses, kami merangkumi keseluruhan perjalanan dari idea hingga pelaksanaan."
      ),
      items: [
        {
          id: "f1",
          title: lt("Custom Software", "Perisian Tersuai"),
          description: lt(
            "Web and mobile applications tailored to how your team actually works.",
            "Aplikasi web dan mudah alih yang disesuaikan dengan cara pasukan anda benar-benar bekerja."
          ),
          icon: "code",
        },
        {
          id: "f2",
          title: lt("Process Automation", "Automasi Proses"),
          description: lt(
            "Cut manual work with automated workflows that save time and reduce errors.",
            "Kurangkan kerja manual dengan aliran kerja automatik yang menjimatkan masa dan mengurangkan ralat."
          ),
          icon: "spark",
        },
        {
          id: "f3",
          title: lt("Cloud & Infrastructure", "Awan & Infrastruktur"),
          description: lt(
            "Reliable, scalable systems that grow with your business.",
            "Sistem yang boleh dipercayai dan berskala yang berkembang bersama perniagaan anda."
          ),
          icon: "cloud",
        },
        {
          id: "f4",
          title: lt("Consulting", "Perundingan"),
          description: lt(
            "Strategic guidance to help you choose the right technology, the first time.",
            "Panduan strategik untuk membantu anda memilih teknologi yang tepat, dari awal lagi."
          ),
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
          text: lt(
            "Drag, resize, and rotate anything — with layouts that adapt to every screen size.",
            "Seret, ubah saiz, dan putar apa-apa sahaja — dengan reka letak yang menyesuaikan diri dengan semua saiz skrin."
          ),
          color: "var(--color-deep-blue)",
          fontWeight: "bold",
          align: "left",
          fontFamily: "sans",
          layouts: perBreakpoint(
            { x: 8, y: 26, width: 50, height: 40, rotation: 0, fontSize: 22 },
            { x: 8, y: 22, width: 56, height: 38, rotation: 0, fontSize: 20 },
            { x: 8, y: 8, width: 84, height: 34, rotation: 0, fontSize: 17 }
          ),
        },
        {
          id: "demo-shape",
          type: "shape",
          shape: "circle",
          fill: "var(--color-sky-blue)",
          opacity: 0.22,
          radius: 999,
          layouts: perBreakpoint(
            { x: 66, y: 5, width: 30, height: 90, rotation: 0 },
            { x: 68, y: 8, width: 28, height: 80, rotation: 0 },
            { x: 54, y: 56, width: 44, height: 38, rotation: 0 }
          ),
        },
        {
          id: "demo-button",
          type: "button",
          label: lt("Open the canvas editor →", "Buka editor kanvas →"),
          href: "/admin",
          bg: "var(--color-coral)",
          textColor: "#ffffff",
          radius: 999,
          layouts: perBreakpoint(
            { x: 8, y: 76, width: 34, height: 12, rotation: 0, fontSize: 14 },
            { x: 8, y: 70, width: 38, height: 12, rotation: 0, fontSize: 14 },
            { x: 8, y: 80, width: 56, height: 10, rotation: 0, fontSize: 13 }
          ),
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
      tagline: lt(
        "Smart automation for a sharper business.",
        "Automasi pintar untuk perniagaan yang lebih tajam."
      ),
      website: "www.smartinnosys.com",
      email: "smartinnosys@gmail.com",
      phone: "+6012 256 7411",
      socials: [
        { id: "s1", platform: "facebook", href: "https://facebook.com/smartinnosys" },
        { id: "s2", platform: "instagram", href: "https://instagram.com/smartinnosys" },
        { id: "s3", platform: "threads", href: "https://threads.net/@smartinnosys" },
      ],
      copyrightText: lt(
        `© ${new Date().getFullYear()} Smart Innosys Sdn Bhd. All rights reserved.`,
        `© ${new Date().getFullYear()} Smart Innosys Sdn Bhd. Hak cipta terpelihara.`
      ),
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
      // Insert any default sections that don't exist yet, appending each at
      // the current end of the list (computed at insert time) rather than
      // trusting its static `order` field. That keeps a fresh database in the
      // intended order while letting a *new* default added later land after
      // whatever already exists, instead of colliding with a row that already
      // occupies that order value. Never touches rows a user has already
      // edited, so it's safe on every cold start.
      for (const section of DEFAULT_SECTIONS) {
        await sql`
          INSERT INTO sections (id, type, "order", visible, content)
          SELECT
            ${section.id},
            ${section.type},
            COALESCE((SELECT MAX("order") FROM sections), -1) + 1,
            ${section.visible},
            ${JSON.stringify(section.content)}::jsonb
          WHERE NOT EXISTS (SELECT 1 FROM sections WHERE id = ${section.id})
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
