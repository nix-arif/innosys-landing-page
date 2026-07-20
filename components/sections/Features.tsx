import { Icon } from "@/components/decor/Icon";
import type { FeaturesContent } from "@/lib/content";

export function Features({ content }: { content: FeaturesContent }) {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-deep-blue sm:text-4xl">
            {content.heading}
          </h2>
          <p className="mt-4 text-deep-blue/70">{content.subheading}</p>
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
              <h3 className="mt-4 font-bold text-deep-blue">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-deep-blue/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
