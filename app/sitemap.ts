import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nisan-sinai-tech.nisan-sinai.chatgpt.site");

const lastModified = new Date("2026-08-11");

/** Each page is listed once per locale, with the pair cross-referenced. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: new URL(localePath(locale, page.path), siteUrl).toString(),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternate) => [
            alternate,
            new URL(localePath(alternate, page.path), siteUrl).toString(),
          ]),
        ),
      },
    })),
  );
}
