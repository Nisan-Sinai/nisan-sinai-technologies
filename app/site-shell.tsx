import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getContent } from "@/lib/content";
import { directionOf, localePath, type Locale } from "@/lib/i18n";
import "./globals.css";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://nisan-sinai-tech.nisan-sinai.chatgpt.site"),
);

/** Every locale points at every other one, so search engines can pair them. */
export const languageAlternates = {
  he: localePath("he", "/"),
  en: localePath("en", "/"),
};

export function buildMetadata(locale: Locale): Metadata {
  const t = getContent(locale);

  return {
    metadataBase: siteUrl,
    title: { default: t.meta.title, template: `%s | ${t.brand.name} ${t.brand.suffix}` },
    description: t.meta.description,
    applicationName: `${t.brand.name} ${t.brand.suffix}`,
    keywords: t.meta.keywords,
    authors: [{ name: t.brand.name, url: "https://www.linkedin.com/in/nisansinai" }],
    creator: t.brand.name,
    publisher: `${t.brand.name} ${t.brand.suffix}`,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      url: localePath(locale, "/"),
      siteName: `${t.brand.name} ${t.brand.suffix}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
    twitter: {
      card: "summary",
      title: `${t.brand.name} ${t.brand.suffix}`,
      description: t.meta.twitterDescription,
    },
    other: { "codex-preview": "development" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070b",
  colorScheme: "dark",
};

export function SiteShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children: React.ReactNode }>) {
  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
