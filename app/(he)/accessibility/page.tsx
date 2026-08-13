import LegalContent from "../../legal-content";
import { buildMetadata } from "../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("he").accessibility;

const base = buildMetadata("he", "/accessibility");

export const metadata = {
  ...base,
  title: copy.metaTitle,
  description: copy.metaDescription,
  openGraph: {
    ...base.openGraph,
    title: copy.metaTitle,
    description: copy.metaDescription,
  },
};

export default function AccessibilityPage() {
  return <LegalContent locale="he" document="accessibility" />;
}
