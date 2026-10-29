import type { Metadata } from "next";
import { getContent } from "./content";
import { localePath, type Locale } from "./i18n";
import { resolveSiteUrl } from "./site-url";
import { founderProfile } from "./business";
import type { BlogPost } from "./blog";

export const siteUrl = new URL(resolveSiteUrl());

/** Google Search Console verification token; the env var overrides this default. */
const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
  "E28NaBeiOIjkaklYu2ZeTrE9hEni9yBGcYeyGkrZ7MQ";

/** Every locale points at every other one, so search engines can pair them. */
export const languageAlternates = {
  he: localePath("he", "/"),
  en: localePath("en", "/"),
  "x-default": localePath("he", "/"),
};

/** Each locale shares its own card, so the preview is in the reader's language. */
export function shareImage(locale: Locale): string {
  return locale === "he" ? "/og.png" : "/og-en.png";
}

export function buildMetadata(locale: Locale, path = "/"): Metadata {
  const t = getContent(locale);
  const canonical = localePath(locale, path);

  return {
    metadataBase: siteUrl,
    title: { default: t.meta.title, template: `%s | ${t.brand.name} ${t.brand.suffix}` },
    description: t.meta.description,
    applicationName: `${t.brand.name} ${t.brand.suffix}`,
    keywords: t.meta.keywords,
    authors: [{ name: t.brand.name, url: founderProfile }],
    creator: t.brand.name,
    publisher: `${t.brand.name} ${t.brand.suffix}`,
    alternates: {
      canonical,
      languages: {
        he: localePath("he", path),
        en: localePath("en", path),
        "x-default": localePath("he", path),
      },
    },
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      alternateLocale: [getContent(locale === "he" ? "en" : "he").meta.ogLocale],
      url: canonical,
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
    verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
    manifest: "/site.webmanifest",
    icons: {
      // A single stable PNG favicon for browsers and Google Search.
      // Larger icons are provided separately by the installable PWA manifest.
      icon: [{ url: "/app-icon-192.png", sizes: "192x192", type: "image/png" }],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}


/** Keep page metadata, OG and Twitter in sync instead of inheriting home copy. */
export function buildPageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const base = buildMetadata(locale, path);
  return {
    ...base,
    title: { absolute: title },
    description,
    openGraph: { ...base.openGraph, title, description },
    twitter: { ...base.twitter, title, description },
  };
}

export function buildArticleMetadata(locale: Locale, post: BlogPost): Metadata {
  const t = getContent(locale);
  const base = buildPageMetadata(locale, `/blog/${post.slug}`, `${post.title} | ${t.brand.name} ${t.brand.suffix}`, post.excerpt);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [founderProfile],
    },
  };
}
