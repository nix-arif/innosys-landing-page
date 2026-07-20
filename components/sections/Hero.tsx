import Image from "next/image";
import { DotGrid } from "@/components/decor/DotGrid";
import { t, type HeroContent, type Locale } from "@/lib/content";

export function Hero({ content, locale }: { content: HeroContent; locale: Locale }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-linear-to-b from-white to-sky-blue-light/20"
    >
      <DotGrid
        color="var(--color-coral-light)"
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-70"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 sm:py-28 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            {t(content.eyebrow, locale)}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-deep-blue sm:text-5xl">
            {t(content.headline, locale)}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-deep-blue/70">
            {t(content.subheadline, locale)}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={content.ctaHref}
              className="rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-lg shadow-coral/30 transition-transform hover:-translate-y-0.5"
            >
              {t(content.ctaLabel, locale)}
            </a>
            <a
              href={content.secondaryCtaHref}
              className="rounded-full border-2 border-deep-blue px-6 py-3 font-semibold text-deep-blue transition-colors hover:bg-deep-blue hover:text-white"
            >
              {t(content.secondaryCtaLabel, locale)}
            </a>
          </div>
        </div>
        <div className="relative mx-auto flex justify-center">
          <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-sky-blue/20 blur-2xl" />
          <div className="relative rounded-4xl bg-white p-5 shadow-2xl shadow-deep-blue/10 ring-1 ring-black/5">
            <Image
              src={content.mascotImage}
              alt="Smart Innosys mascot"
              width={320}
              height={320}
              className="h-auto w-52 sm:w-64"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
