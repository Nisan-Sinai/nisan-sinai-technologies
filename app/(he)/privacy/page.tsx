import PrivacyContent from "../../privacy-content";
import { getContent } from "@/lib/content";

const copy = getContent("he").privacy;

export const metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/privacy", languages: { he: "/privacy", en: "/en/privacy" } },
};

export default function PrivacyPage() {
  return <PrivacyContent locale="he" />;
}
