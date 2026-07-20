import { Header } from "@/components/Header";
import { SectionRenderer } from "@/components/SectionRenderer";
import { getVisibleSections } from "@/lib/content";

export default async function Home() {
  const sections = await getVisibleSections();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <SectionRenderer sections={sections} />
      </main>
    </div>
  );
}
