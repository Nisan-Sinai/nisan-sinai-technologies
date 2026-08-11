export const locales = ["he", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "he";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function directionOf(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}

/** The arrow that means "forward" in the reading direction of the locale. */
export function forwardArrow(locale: Locale): string {
  return locale === "he" ? "←" : "→";
}

/**
 * Prefixes a site-root path for the given locale. Hebrew is the default and
 * lives at the root, so only English carries a prefix.
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  return normalized === "/" ? "/en" : `/en${normalized}`;
}

/** The same page in the other language, for the language switcher. */
export function alternateLocale(locale: Locale): Locale {
  return locale === "he" ? "en" : "he";
}
