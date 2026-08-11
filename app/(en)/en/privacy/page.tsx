import PrivacyContent from "../../../privacy-content";
import { getContent } from "@/lib/content";

const copy = getContent("en").privacy;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/en/privacy", languages: { he: "/privacy", en: "/en/privacy" } },
};

export default function EnglishPrivacyPage() {
  return <PrivacyContent locale="en" />;
}
