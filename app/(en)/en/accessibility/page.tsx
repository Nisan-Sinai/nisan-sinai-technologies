import LegalContent from "../../../legal-content";
import { buildMetadata } from "../../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("en").accessibility;

const base = buildMetadata("en", "/accessibility");

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

export default function EnglishAccessibilityPage() {
  return <LegalContent locale="en" document="accessibility" />;
}
