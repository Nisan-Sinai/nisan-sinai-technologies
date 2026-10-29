import LegalContent from "../../legal-content";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getContent } from "@/lib/content";

const copy = getContent("he").accessibility;

export const metadata = buildPageMetadata("he", "/accessibility", copy.metaTitle, copy.metaDescription);

export default function AccessibilityPage() {
  return <LegalContent locale="he" document="accessibility" />;
}
