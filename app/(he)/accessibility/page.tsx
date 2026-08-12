import LegalContent from "../../legal-content";
import { getContent } from "@/lib/content";

const copy = getContent("he").accessibility;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: "/accessibility",
    languages: { he: "/accessibility", en: "/en/accessibility" },
  },
};

export default function AccessibilityPage() {
  return <LegalContent locale="he" document="accessibility" />;
}
