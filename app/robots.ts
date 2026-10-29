import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep /admin crawlable so its noindex can be read. Authentication and
      // RLS protect data; robots.txt is never a security boundary.
      disallow: ["/api/"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
