import LegalContent from "../../../legal-content";
import { getContent } from "@/lib/content";

const copy = getContent("en").accessibility;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: "/en/accessibility",
    languages: { he: "/accessibility", en: "/en/accessibility" },
  },
};

export default function EnglishAccessibilityPage() {
  return <LegalContent locale="en" document="accessibility" />;
}
