import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getContent } from "@/lib/content";
import { directionOf, localePath, type Locale } from "@/lib/i18n";
import "./globals.css";
import "./feature-overrides.css";

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

/** Each locale shares its own card, so the preview is in the reader's language. */
export function shareImage(locale: Locale): string {
  return locale === "he" ? "/og.png" : "/og-en.png";
}

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
      images: [
        {
          url: shareImage(locale),
          width: 1200,
          height: 630,
          alt: t.meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.brand.name} ${t.brand.suffix}`,
      description: t.meta.twitterDescription,
      images: [shareImage(locale)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    manifest: "/site.webmanifest",
    other: { "codex-preview": "development" },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
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
