import type { Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { directionOf, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo-metadata";
import { buildIdentityStructuredData } from "@/lib/structured-data";
import { AccessibilityMenu } from "./accessibility-menu";
import { AnalyticsConsent } from "./analytics-consent";
import { analyticsConfig } from "@/lib/analytics-config";
import "./globals.css";

export { buildMetadata, siteUrl } from "@/lib/seo-metadata";

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
      <body className={GeistSans.className}>
        {children}
        <AccessibilityMenu locale={locale} />
        <AnalyticsConsent locale={locale} config={analyticsConfig} />
        {/* Keep the page-specific graph first in document order. Existing crawler QA
            intentionally validates that richer homepage graph, while this shared
            identity still gives secondary pages a WebSite entity. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildIdentityStructuredData(locale, siteUrl.toString())).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
