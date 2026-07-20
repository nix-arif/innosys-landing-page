import Image from "next/image";
import { t, type FooterContent, type Locale } from "@/lib/content";

const SOCIAL_LABEL: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  threads: "Threads",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  x: "X",
};

export function Footer({ content, locale }: { content: FooterContent; locale: Locale }) {
  return (
    <footer className="bg-deep-blue-dark text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Image
            src="/assets/mascot/favicon-32x32.png"
            alt="Smart Innosys mascot"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full bg-white/10 p-1"
          />
          <div>
            <p className="text-lg font-bold text-white">{content.companyName}</p>
            <p className="mt-1 max-w-xs text-sm text-white/60">{t(content.tagline, locale)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span>{content.website}</span>
          <span>{content.email}</span>
          <span>{content.phone}</span>
        </div>
        <div className="flex gap-3 text-sm">
          {content.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-3 py-1.5 transition-colors hover:border-coral hover:text-coral"
            >
              {SOCIAL_LABEL[social.platform] ?? social.platform}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
        {t(content.copyrightText, locale)}
      </div>
    </footer>
  );
}
