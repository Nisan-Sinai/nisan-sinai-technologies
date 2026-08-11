import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://nisan-sinai-tech.nisan-sinai.chatgpt.site"),
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "ניסן סיני טכנולוגיות | אתרים ומערכות לעסקים",
    template: "%s | ניסן סיני טכנולוגיות",
  },
  description:
    "פיתוח אתרים, מערכות CRM ו-ERP, אוטומציות ופתרונות תוכנה בהתאמה אישית לעסקים.",
  applicationName: "ניסן סיני טכנולוגיות",
  keywords: [
    "פיתוח אתרים",
    "מערכות CRM",
    "מערכות ERP",
    "אוטומציות לעסקים",
    "פיתוח תוכנה",
    "ניסן סיני",
  ],
  authors: [{ name: "ניסן סיני", url: "https://www.linkedin.com/in/nisansinai" }],
  creator: "ניסן סיני",
  publisher: "ניסן סיני טכנולוגיות",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/",
    siteName: "ניסן סיני טכנולוגיות",
    title: "ניסן סיני טכנולוגיות | אתרים ומערכות לעסקים",
    description:
      "אתרים, CRM, ERP, אוטומציות ומערכות Web בהתאמה אישית לעסקים קטנים ובינוניים.",
  },
  twitter: {
    card: "summary",
    title: "ניסן סיני טכנולוגיות",
    description: "פיתוח דיגיטלי מקצה לקצה לעסקים קטנים ובינוניים.",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  );
}
