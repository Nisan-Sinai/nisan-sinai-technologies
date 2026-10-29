import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { resolveSiteUrl } from "@/lib/site-url";
import { locales, localePath } from "@/lib/i18n";

const siteUrl = resolveSiteUrl();

/** Each page is listed once per locale, with the pair cross-referenced. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/accessibility", changeFrequency: "yearly" as const, priority: 0.3 },
    // The slugs are shared across languages, so one list covers both sides.
    ...getPosts("he").map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: post.modified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: new URL(localePath(locale, page.path), siteUrl).toString(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...("lastModified" in page ? { lastModified: page.lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(
          [["x-default", new URL(localePath("he", page.path), siteUrl).toString()], ...locales.map((alternate) => [
            alternate,
            new URL(localePath(alternate, page.path), siteUrl).toString(),
          ])],
        ),
      },
    })),
  );
}
