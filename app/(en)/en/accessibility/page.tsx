import LegalContent from "../../../legal-content";
import { buildMetadata } from "../../../site-shell";
import { getContent } from "@/lib/content";

const copy = getContent("en").accessibility;
const description =
  "Accessibility statement for Nisan Sinai Technologies: standards, adjustments, known limitations and coordinator contact details.";

const base = buildMetadata("en", "/accessibility");

export const metadata = {
  ...base,
  title: copy.metaTitle,
  description,
  openGraph: {
    ...base.openGraph,
    title: copy.metaTitle,
    description,
  },
};

export default function EnglishAccessibilityPage() {
  return <LegalContent locale="en" document="accessibility" />;
}
