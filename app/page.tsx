import { Header } from "@/components/Header";
import { SectionRenderer } from "@/components/SectionRenderer";
import { getVisibleSections } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Home() {
  const [sections, locale] = await Promise.all([getVisibleSections(), getLocale()]);

  return (
    <div className="flex flex-1 flex-col">
      <Header locale={locale} />
      <main className="flex-1">
        <SectionRenderer sections={sections} locale={locale} />
      </main>
    </div>
  );
}
