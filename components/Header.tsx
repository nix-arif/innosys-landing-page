import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/content";

const NAV_LABELS: Record<Locale, { about: string; services: string; contact: string; cta: string }> = {
  en: { about: "About", services: "Services", contact: "Contact", cta: "Get in touch" },
  ms: { about: "Tentang", services: "Perkhidmatan", contact: "Hubungi", cta: "Hubungi kami" },
};

export function Header({ locale }: { locale: Locale }) {
  const labels = NAV_LABELS[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/mascot/favicon-32x32.png"
            alt="Smart Innosys mascot"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-deep-blue">Smart Innosys</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-deep-blue/80 sm:flex">
          <Link href="#highlight" className="hover:text-coral">
            {labels.about}
          </Link>
          <Link href="#features" className="hover:text-coral">
            {labels.services}
          </Link>
          <Link href="#contact" className="hover:text-coral">
            {labels.contact}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <Link
            href="#contact"
            className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
          >
            {labels.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
