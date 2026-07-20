import { Icon } from "@/components/decor/Icon";
import { t, type FeaturesContent, type Locale } from "@/lib/content";

export function Features({ content, locale }: { content: FeaturesContent; locale: Locale }) {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            {t(content.eyebrow, locale)}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-deep-blue sm:text-4xl">
            {t(content.heading, locale)}
          </h2>
          <p className="mt-4 text-deep-blue/70">{t(content.subheading, locale)}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-deep-blue/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-blue/15 text-sky-blue">
                <Icon name={item.icon} />
              </div>
              <h3 className="mt-4 font-bold text-deep-blue">{t(item.title, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-deep-blue/70">
                {t(item.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
