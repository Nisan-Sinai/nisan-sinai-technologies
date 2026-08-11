import { buildMetadata, SiteShell, viewport } from "../site-shell";

export const metadata = buildMetadata("he");
export { viewport };

export default function HebrewLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="he">{children}</SiteShell>;
}
