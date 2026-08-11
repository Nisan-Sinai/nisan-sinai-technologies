import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://nisan-sinai-tech.nisan-sinai.chatgpt.site");

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: new Date("2026-08-11"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/privacy", siteUrl).toString(),
      lastModified: new Date("2026-08-11"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
