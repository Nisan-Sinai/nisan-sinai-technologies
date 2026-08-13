import { describe, expect, it } from "vitest";
import { buildStructuredData } from "@/lib/structured-data";
import { getContent, contact } from "@/lib/content";
import { locales } from "@/lib/i18n";

const SITE = "https://example.com";

describe("buildStructuredData", () => {
  it("describes the business and the site for every locale", () => {
    for (const locale of locales) {
      const graph = buildStructuredData(locale, SITE)["@graph"];
      expect(graph.map((node) => node["@type"])).toEqual([
        "ProfessionalService",
        "WebSite",
        "FAQPage",
      ]);
    }
  });

  it("publishes every answer the page shows, and no others", () => {
    // A rich result that answers something the page does not is the kind of
    // mismatch search engines penalise, so the two lists are built from one
    // source and asserted to match.
    for (const locale of locales) {
      const faq = buildStructuredData(locale, SITE)["@graph"][2];
      const items = getContent(locale).faq.items;

      expect(faq.mainEntity).toHaveLength(items.length);
      expect(faq.mainEntity.map((entry) => entry.name)).toEqual(
        items.map((item) => item.question),
      );
      expect(faq.mainEntity.map((entry) => entry.acceptedAnswer.text)).toEqual(
        items.map((item) => item.answer),
      );
    }
  });

  it("emits absolute URLs, which is what crawlers require", () => {
    const [business, site] = buildStructuredData("he", SITE)["@graph"];
    for (const url of [business.url, business.image, business.logo, site.url]) {
      expect(url).toMatch(/^https:\/\/example\.com\//);
    }
  });

  it("points each locale at its own page and share card", () => {
    const he = buildStructuredData("he", SITE)["@graph"][0];
    const en = buildStructuredData("en", SITE)["@graph"][0];

    expect(he.url).toBe("https://example.com/");
    expect(en.url).toBe("https://example.com/en");
    expect(he.image).toBe("https://example.com/og.png");
    expect(en.image).toBe("https://example.com/og-en.png");
  });

  it("declares the language of each document", () => {
    for (const locale of locales) {
      const site = buildStructuredData(locale, SITE)["@graph"][1];
      expect(site.inLanguage).toBe(locale);
    }
  });

  it("ties the site to the business by reference rather than repeating it", () => {
    const [business, site] = buildStructuredData("he", SITE)["@graph"];
    expect(site.publisher["@id"]).toBe(business["@id"]);
  });

  it("carries the one set of contact details the site publishes", () => {
    const business = buildStructuredData("en", SITE)["@graph"][0];
    expect(business.email).toBe(contact.email);
    expect(business.telephone).toBe(contact.phoneHref);
  });

  it("offers every service the page lists, in that locale's words", () => {
    for (const locale of locales) {
      const business = buildStructuredData(locale, SITE)["@graph"][0];
      const offered = business.makesOffer.map(
        (offer) => offer.itemOffered.name,
      );
      expect(offered).toEqual(
        getContent(locale).services.items.map((service) => service.title),
      );
    }
  });

  it("survives a site URL given without a trailing slash", () => {
    const business = buildStructuredData("en", "https://example.com")["@graph"][0];
    expect(business.url).toBe("https://example.com/en");
  });

  it("serialises to JSON, since it ships inside a script tag", () => {
    for (const locale of locales) {
      expect(() =>
        JSON.parse(JSON.stringify(buildStructuredData(locale, SITE))),
      ).not.toThrow();
    }
  });
});
