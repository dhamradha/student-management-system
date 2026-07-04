import { en, type TranslationKey } from "./dictionaries/en";
import { si } from "./dictionaries/si";

export type Locale = "en" | "si";

export const LOCALES: Locale[] = ["en", "si"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "hdv.lang";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  si: "සිංහල",
};

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  si,
};

export type { TranslationKey };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "si";
}
