import { contact, getContent } from "./content";
import { getPosts } from "./blog";
import { businessProfiles, founderProfile } from "./business";
import { locales, localePath } from "./i18n";

/** Generated from published, public content only. Never read env or lead data. */
export function buildLlmsText(siteUrl: string, full = false): string {
  const absolute = (path: string) => new URL(path, siteUrl).toString();
  const lines = [
    "# Nisan Sinai Technologies | ניסן סיני טכנולוגיות",
    "",
    "> Independent software business founded by Nisan Sinai (ניסן סיני). Websites, online stores, CRM/ERP systems, automation, integrations and AI solutions for businesses in Israel. Service in Hebrew and English.",
    "",
    `Official website: ${absolute("/")}`,
    "Service area: Israel (nationwide). No public office address is listed.",
    `Public email: ${contact.email}`,
    `Public phone: ${contact.phoneHref}`,
    `WhatsApp: ${contact.whatsappHref}`,
    "Pricing and timelines: quoted after discovery; no fixed price or delivery promise.",
    "Portfolio entries describe projects, not endorsements or customer reviews.",
    "",
    "## Official profiles",
    ...businessProfiles.map((profile) => `- [${profile.name}](${profile.url})`),
    `- [Nisan Sinai — founder, LinkedIn](${founderProfile})`,
    "",
    "## Public pages",
    ...locales.flatMap((locale) => {
      const t = getContent(locale);
      return [
        `- [${t.brand.name} ${t.brand.suffix} (${locale})](${absolute(localePath(locale, "/"))})`,
        `- [${t.blog.indexTitle} (${locale})](${absolute(localePath(locale, "/blog"))})`,
        `- [${t.privacy.title} (${locale})](${absolute(localePath(locale, "/privacy"))})`,
        `- [${t.accessibility.title} (${locale})](${absolute(localePath(locale, "/accessibility"))})`,
      ];
    }),
    "",
    "## Services and portfolio",
  ];

  for (const locale of locales) {
    const t = getContent(locale);
    lines.push("", `### ${locale === "he" ? "עברית" : "English"}`, t.about.text, "");
    for (const service of t.services.items) {
      lines.push(`- ${service.title}: ${service.description}`);
    }
    lines.push("");
    for (const project of t.projects.items) {
      lines.push(`- ${project.title}: ${project.description}`);
      if (project.href) lines.push(`  Project URL: ${project.href}`);
    }
    lines.push("", "### Guides");
    for (const post of getPosts(locale)) {
      lines.push(`- [${post.title}](${absolute(localePath(locale, `/blog/${post.slug}`))}): ${post.excerpt}`);
      if (full) {
        lines.push(`  Published: ${post.date}; updated: ${post.modified}`, "", post.intro);
        for (const section of post.sections) lines.push("", `#### ${section.title}`, ...section.body);
        for (const source of post.sources) lines.push(`Source: [${source.title}](${source.url})`);
      }
    }
    if (full) {
      lines.push("", "### Questions and answers");
      for (const item of t.faq.items) lines.push("", `#### ${item.question}`, item.answer);
    }
  }
  lines.push("", "## Further reading", `- [Complete public content](${absolute("/llms-full.txt")})`, `- [Sitemap](${absolute("/sitemap.xml")})`, "", "These files are informational, not access controls or a guarantee of inclusion in search or AI answers. Public HTML pages are the primary source. Private management pages, APIs and customer data are outside this index.", "");
  return lines.join("\n");
}
