import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://nisan-sinai-tech.nisan-sinai.chatgpt.site");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
