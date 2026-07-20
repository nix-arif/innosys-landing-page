"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions";
import type { Locale } from "@/lib/content";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "ms", label: "MY" },
];

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === current || isPending) return;
    startTransition(async () => {
      await setLocaleAction(locale);
    });
  }

  return (
    <div className="flex items-center rounded-full border border-deep-blue/15 p-0.5 text-xs font-semibold">
      {OPTIONS.map((option) => (
        <button
          key={option.locale}
          type="button"
          onClick={() => switchTo(option.locale)}
          aria-current={current === option.locale}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            current === option.locale
              ? "bg-deep-blue text-white"
              : "text-deep-blue/60 hover:text-deep-blue"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
