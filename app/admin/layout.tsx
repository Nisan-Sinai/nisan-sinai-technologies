import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
import "../finish-fixes.css";

export const metadata: Metadata = {
  title: "ניהול פניות | ניסן סיני טכנולוגיות",
  description: "אזור ניהול מאובטח לפניות מהאתר",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} admin-body`}>{children}</body>
    </html>
  );
}
