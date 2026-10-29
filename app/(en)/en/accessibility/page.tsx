import LegalContent from "../../../legal-content";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("en").accessibility;
export const metadata = buildPageMetadata("en", "/accessibility", copy.metaTitle, copy.metaDescription);

export default function EnglishAccessibilityPage() {
  return <LegalContent locale="en" document="accessibility" />;
}
