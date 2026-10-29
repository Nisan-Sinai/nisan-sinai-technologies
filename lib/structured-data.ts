import { contact, getContent } from "./content";
import { locales, localePath, type Locale } from "./i18n";
import type { BlogPost } from "./blog";
import { businessProfiles, founderProfile, serviceArea } from "./business";

/** Article facts come from the same published record rendered on the page. */
export function buildArticleStructuredData(locale: Locale, siteUrl: string, post: BlogPost) {
  const url = new URL(localePath(locale, `/blog/${post.slug}`), siteUrl).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified,
    image: new URL(locale === "he" ? "/og.png" : "/og-en.png", siteUrl).toString(),
    publisher: { "@id": new URL("/#business", siteUrl).toString() },
    isPartOf: { "@id": new URL("/#website", siteUrl).toString() },
    citation: post.sources.map((source) => source.url),
    inLanguage: locale,
    author: buildFounder(locale, siteUrl),
  };
}

type Offer = {
  "@type": "Offer";
  itemOffered: { "@type": "Service"; "@id": string; name: string; description: string; url: string; provider: { "@id": string }; areaServed: typeof serviceArea };
};

export type BusinessNode = {
  "@type": "ProfessionalService";
  "@id": string;
  name: string;
  alternateName: string;
  description: string;
  url: string;
  image: string;
  logo: string;
  email: string;
  telephone: string;
  areaServed: { "@type": "Country"; name: string };
  contactPoint: { "@type": "ContactPoint"; contactType: string; telephone: string; email: string; availableLanguage: readonly Locale[] };
  knowsAbout: string[];
  sameAs: string[];
  founder: ReturnType<typeof buildFounder>;
  makesOffer: Offer[];
};

export type WebSiteNode = {
  "@type": "WebSite";
  alternateName: string[];
  "@id": string;
  url: string;
  name: string;
  inLanguage: readonly Locale[];
  publisher: { "@id": string };
};

export type FaqNode = {
  "@type": "FAQPage";
  "@id": string;
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
};

export type StructuredData = {
  "@context": "https://schema.org";
  "@graph": [BusinessNode, WebSiteNode, FaqNode];
};

/**
 * Search engines read the page to rank it and read this to understand what the
 * business is. Built from the same dictionary as the page so the two cannot
 * drift apart, and returned as data so it can be asserted in a unit test.
 */
export function buildStructuredData(
  locale: Locale,
  siteUrl: string,
): StructuredData {
  const t = getContent(locale);
  const absolute = (path: string) => new URL(path, siteUrl).toString();
  const businessId = absolute("/#business");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: `${t.brand.name} ${t.brand.suffix}`,
        alternateName: locale === "he" ? "Nisan Sinai Technologies" : "ניסן סיני טכנולוגיות",
        description: t.meta.description,
        url: absolute("/"),
        image: absolute(locale === "he" ? "/og.png" : "/og-en.png"),
        logo: absolute("/app-icon-512.png"),
        email: contact.email,
        telephone: contact.phoneHref,
        areaServed: serviceArea,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer enquiries",
          telephone: contact.phoneHref,
          email: contact.email,
          availableLanguage: locales,
        },
        knowsAbout: t.meta.keywords,
        sameAs: businessProfiles.map((profile) => profile.url),
        founder: buildFounder(locale, siteUrl),
        makesOffer: t.services.items.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": absolute(`${localePath(locale, "/")}#service-${service.number}`),
            url: absolute(`${localePath(locale, "/")}#service-${service.number}`),
            provider: { "@id": businessId },
            areaServed: serviceArea,
            name: service.title,
            description: service.description,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        alternateName: [
          locale === "he" ? "Nisan Sinai Technologies" : "ניסן סיני טכנולוגיות",
          "NS.",
        ],
        url: absolute("/"),
        name: `${t.brand.name} ${t.brand.suffix}`,
        inLanguage: locales,
        publisher: { "@id": businessId },
      },
      // The same questions the page answers, in the form search engines read.
      {
        "@type": "FAQPage",
        "@id": absolute(`${localePath(locale, "/")}#faq`),
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/** The same person identity is used for the founder and article authors. */
export function buildFounder(locale: Locale, siteUrl: string) {
  return {
    "@type": "Person" as const,
    "@id": new URL("/#founder", siteUrl).toString(),
    name: getContent(locale).brand.name,
    alternateName: locale === "he" ? "Nisan Sinai" : "ניסן סיני",
    url: founderProfile,
    jobTitle: "Founder & Full-stack Developer",
    worksFor: { "@id": new URL("/#business", siteUrl).toString() },
  };
}

/** Shared identity on secondary pages, without claiming an invisible FAQ. */
export function buildIdentityStructuredData(locale: Locale, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": buildStructuredData(locale, siteUrl)["@graph"].slice(0, 2),
  };
}

export function buildBreadcrumbStructuredData(
  siteUrl: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}
