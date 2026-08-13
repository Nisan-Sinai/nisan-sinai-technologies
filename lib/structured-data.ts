import { contact, getContent } from "./content";
import { locales, localePath, type Locale } from "./i18n";

type Offer = {
  "@type": "Offer";
  itemOffered: { "@type": "Service"; name: string; description: string };
};

export type BusinessNode = {
  "@type": "ProfessionalService";
  "@id": string;
  name: string;
  description: string;
  url: string;
  image: string;
  logo: string;
  email: string;
  telephone: string;
  areaServed: { "@type": "Country"; name: string };
  availableLanguage: { "@type": "Language"; alternateName: Locale }[];
  knowsAbout: string[];
  sameAs: string[];
  founder: { "@type": "Person"; name: string; url: string };
  makesOffer: Offer[];
};

export type WebSiteNode = {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  inLanguage: Locale;
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
        description: t.meta.description,
        url: absolute(localePath(locale, "/")),
        image: absolute(locale === "he" ? "/og.png" : "/og-en.png"),
        logo: absolute("/favicon.svg"),
        email: contact.email,
        telephone: contact.phoneHref,
        areaServed: { "@type": "Country", name: "Israel" },
        availableLanguage: locales.map((code) => ({
          "@type": "Language",
          alternateName: code,
        })),
        knowsAbout: t.meta.keywords,
        sameAs: ["https://www.linkedin.com/in/nisansinai"],
        founder: {
          "@type": "Person",
          name: t.brand.name,
          url: "https://www.linkedin.com/in/nisansinai",
        },
        makesOffer: t.services.items.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        url: absolute(localePath(locale, "/")),
        name: `${t.brand.name} ${t.brand.suffix}`,
        inLanguage: locale,
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
