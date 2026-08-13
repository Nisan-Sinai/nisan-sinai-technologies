import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/blog";
import { resolveSiteUrl } from "@/lib/site-url";
import { locales, localePath } from "@/lib/i18n";

const siteUrl = resolveSiteUrl();

const lastModified = new Date("2026-08-12");

/** Each page is listed once per locale, with the pair cross-referenced. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/accessibility", changeFrequency: "yearly" as const, priority: 0.3 },
    // The slugs are shared across languages, so one list covers both sides.
    ...getSlugs("he").map((slug) => ({
      path: `/blog/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
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
