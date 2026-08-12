import type { Metadata } from "next";
import { SiteShell } from "../site-shell";

export const metadata: Metadata = {
  title: "ניהול פניות",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="he">{children}</SiteShell>;
}
