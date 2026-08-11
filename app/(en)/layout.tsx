import { buildMetadata, SiteShell, viewport } from "../site-shell";

export const metadata = buildMetadata("en");
export { viewport };

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
