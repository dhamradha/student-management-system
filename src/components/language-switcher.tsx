"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { useTranslation } from "@/lib/i18n/provider";

/**
 * EN/SI toggle. Switches language at runtime with no page reload and persists
 * to LocalStorage via the i18n provider (SRS §2).
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const next = LOCALES.find((l) => l !== locale) ?? "en";

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => setLocale(next)}
      aria-label={`Switch to ${LOCALE_LABELS[next]}`}
    >
      <Languages className="size-4" />
      {LOCALE_LABELS[next]}
    </Button>
  );
}
