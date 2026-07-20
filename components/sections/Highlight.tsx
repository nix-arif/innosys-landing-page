import Image from "next/image";
import { DotGrid } from "@/components/decor/DotGrid";
import { Skyline } from "@/components/decor/Skyline";
import { WaveDivider } from "@/components/decor/WaveDivider";
import { QuoteMark } from "@/components/decor/QuoteMark";
import { t, type HighlightContent, type Locale } from "@/lib/content";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6 8 7 8-7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4c0 1-1 2-2 2C10 22 2 14 2 6c0-1 1-2 2-2Z" />
    </svg>
  );
}
function AtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5" />
    </svg>
  );
}

export function Highlight({ content, locale }: { content: HighlightContent; locale: Locale }) {
  return (
    <section id="highlight" className="relative overflow-hidden bg-white">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-20 md:grid-cols-2">
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wide text-deep-blue">
            {t(content.eyebrow, locale)}
          </p>
          <p className="-mt-1 font-script text-3xl text-sky-blue sm:text-4xl">
            {t(content.script, locale)}
          </p>
          <h2 className="mt-2 text-4xl font-extrabold leading-[1.05] text-deep-blue sm:text-5xl">
            {t(content.headlineLines, locale)
              .split("\n")
              .map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
          </h2>
          <div className="mt-5 flex gap-1.5">
            <span className="h-1.5 w-10 rounded-full bg-deep-blue" />
            <span className="h-1.5 w-6 rounded-full bg-coral" />
            <span className="h-1.5 w-4 rounded-full bg-coral-light" />
          </div>
          <h3 className="mt-6 font-bold text-sky-blue">
            {t(content.paragraphHeading, locale)}
          </h3>
          <p className="mt-2 max-w-md leading-relaxed text-deep-blue/70">
            {t(content.paragraph, locale)}
          </p>
        </div>

        <div className="relative mx-auto h-95 w-full max-w-md overflow-hidden rounded-4xl bg-linear-to-b from-sky-blue-light/35 to-white sm:h-110">
          <DotGrid
            color="var(--color-coral-light)"
            className="pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-90"
          />
          <Skyline
            color="var(--color-sky-blue)"
            className="absolute inset-x-0 bottom-0 h-36 w-full opacity-25"
          />
          <Skyline
            color="var(--color-deep-blue)"
            className="absolute inset-x-6 bottom-0 h-28 w-[calc(100%-3rem)] opacity-20"
          />
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <div className="rounded-3xl bg-white p-4 shadow-2xl shadow-deep-blue/15 ring-1 ring-black/5">
              <Image
                src={content.mascotImage}
                alt="Smart Innosys mascot"
                width={320}
                height={320}
                className="h-auto w-40 sm:w-48"
              />
            </div>
          </div>
          <span className="absolute bottom-8 left-6 h-8 w-8 rounded-full bg-coral/70" />
          <span className="absolute bottom-24 right-8 h-5 w-5 rounded-full bg-coral-light" />
        </div>
      </div>

      <div className="relative">
        <WaveDivider color="var(--color-deep-blue)" className="h-20 sm:h-28" />
        <div className="bg-deep-blue pb-24 pt-2 sm:pb-32">
          <div className="mx-auto max-w-3xl px-6 text-center text-white">
            <QuoteMark color="var(--color-coral)" className="mx-auto h-9 w-12 opacity-90" />
            <p className="mt-4 text-xl font-semibold sm:text-2xl">
              {t(content.quote, locale)}{" "}
              <span className="text-sky-blue-light">{t(content.quoteHighlight, locale)}</span>
            </p>
            <p className="mt-4 font-script text-2xl text-white/90 sm:text-3xl">
              {t(content.signOff, locale)}
            </p>
          </div>
        </div>

        <div id="contact" className="relative z-10 -mt-12 px-6">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-deep-blue shadow-xl">
            <span className="flex items-center gap-2">
              <GlobeIcon /> {content.website}
            </span>
            <span className="flex items-center gap-2">
              <MailIcon /> {content.email}
            </span>
            <span className="flex items-center gap-2">
              <PhoneIcon /> {content.phone}
            </span>
            <span className="flex items-center gap-2">
              <AtIcon /> {content.socialHandle}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
