"use client";

import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * EN/SI segmented toggle. Both languages are shown at once and the *active*
 * one is highlighted, so there is no ambiguity about the current language.
 * Switching is instant (no reload) and persisted to LocalStorage (SRS §2).
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      role="group"
      aria-label="Language"
      className="bg-muted inline-flex items-center rounded-md p-0.5"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors",
            locale === l
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
