import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLlmsText } from "@/lib/llms";
import { businessProfiles, founderProfile } from "@/lib/business";
import { getContent, contact } from "@/lib/content";
import * as contentModule from "@/lib/content";
import { getPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { buildStructuredData, buildIdentityStructuredData, buildArticleStructuredData, buildBreadcrumbStructuredData } from "@/lib/structured-data";

const SITE = "https://nisan-sinai-technologies.vercel.app";
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("public discovery and identity", () => {
  it("serves UTF-8 text rather than HTML at both discovery endpoints", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
    const summary = (await import("@/app/llms.txt/route")).GET();
    const full = (await import("@/app/llms-full.txt/route")).GET();
    for (const response of [summary, full]) {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    }
    expect(await summary.text()).toBe(buildLlmsText(SITE));
    expect(await full.text()).toBe(buildLlmsText(SITE, true));
  });

  it("does not publish an undefined link for a portfolio entry without a URL", () => {
    const original = contentModule.getContent;
    vi.spyOn(contentModule, "getContent").mockImplementation((locale) => {
      const copy = original(locale);
      return { ...copy, projects: { ...copy.projects, items: copy.projects.items.map((project) => ({ ...project, href: undefined })) as typeof copy.projects.items } };
    });
    const text = buildLlmsText(SITE);
    expect(text).toContain("LD Event Design");
    expect(text).not.toContain("Project URL:");
    expect(text).not.toContain("undefined");
  });
  it("keeps summaries and full text tied to the public bilingual content", () => {
    const summary = buildLlmsText(SITE);
    const full = buildLlmsText(SITE, true);
    expect(full.length).toBeGreaterThan(summary.length);
    for (const locale of locales) {
      const copy = getContent(locale);
      for (const service of copy.services.items) expect(summary).toContain(service.description);
      for (const project of copy.projects.items) {
        expect(summary).toContain(project.description);
        expect(summary).toContain(project.href);
      }
      for (const question of copy.faq.items) expect(full).toContain(question.answer);
      for (const post of getPosts(locale)) {
        expect(summary).toContain(post.slug);
        expect(full).toContain(post.intro);
        expect(full).toContain(post.sections[0].body[0]);
        expect(full).toContain(post.modified);
        for (const source of post.sources) expect(full).toContain(source.url);
      }
    }
    expect(summary).toContain(contact.email);
    expect(summary).toContain(contact.phoneHref);
    expect(summary).toContain(`${SITE}/llms-full.txt`);
    expect(summary).toContain(`${SITE}/sitemap.xml`);
  });

  it("does not read secrets or customer records into public discovery files", () => {
    vi.stubEnv("SUPABASE_URL", "https://private-test.invalid");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "test-key-not-for-discovery");
    const text = buildLlmsText(SITE, true);
    expect(text).not.toMatch(/private-test|test-key-not-for-discovery|contact_leads|service_role|\/admin/);
    expect(text).not.toContain("chatgpt.site");
  });

  it("publishes only verified business profiles and identifies the human founder separately", () => {
    for (const locale of locales) {
      const [business, website] = buildStructuredData(locale, SITE)["@graph"];
      expect(business.sameAs).toEqual(businessProfiles.map((profile) => profile.url));
      expect(business.sameAs).not.toContain(founderProfile);
      expect(business.founder.url).toBe(founderProfile);
      expect(business.founder.worksFor["@id"]).toBe(business["@id"]);
      expect(business.areaServed).toEqual({ "@type": "Country", name: "Israel" });
      for (const invented of ["address", "geo", "aggregateRating", "review", "openingHours", "priceRange"]) {
        expect(business).not.toHaveProperty(invented);
      }
      expect(website.inLanguage).toEqual(["he", "en"]);
      expect(business.contactPoint.availableLanguage).toEqual(["he", "en"]);
      expect(buildIdentityStructuredData(locale, SITE)["@graph"]).toEqual([business, website]);
      for (const offer of business.makesOffer) {
        expect(offer.itemOffered.provider["@id"]).toBe(business["@id"]);
        expect(offer.itemOffered.url).toMatch(/#service-\d+$/);
      }
      for (const post of getPosts(locale)) {
        const article = buildArticleStructuredData(locale, SITE, post);
        expect(article.author).toEqual(business.founder);
        expect(article.publisher["@id"]).toBe(business["@id"]);
        expect(article.citation).toEqual(post.sources.map((source) => source.url));
        expect(Date.parse(post.modified)).toBeGreaterThanOrEqual(Date.parse(post.date));
      }
    }
  });

  it("uses ordered absolute breadcrumb URLs", () => {
    const data = buildBreadcrumbStructuredData(SITE, [{ name: "Home", path: "/en" }, { name: "Blog", path: "/en/blog" }]);
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/en` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/en/blog` },
    ]);
  });
});

describe("metadata regressions", () => {
  it("pairs translations with self canonicals and the matching social copy", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
    const { buildMetadata, buildPageMetadata, buildArticleMetadata, languageAlternates, shareImage } = await import("@/lib/seo-metadata");
    expect(languageAlternates).toEqual({ he: "/", en: "/en", "x-default": "/" });
    for (const locale of locales) {
      const base = buildMetadata(locale);
      expect(new URL(String(base.metadataBase)).origin).toBe(SITE);
      expect(shareImage(locale)).toBe(locale === "he" ? "/og.png" : "/og-en.png");
      const page = buildPageMetadata(locale, "/blog", "Page title", "Page description");
      expect(page.alternates?.languages).toEqual({ he: "/blog", en: "/en/blog", "x-default": "/blog" });
      expect(page.alternates?.canonical).toBe(locale === "he" ? "/blog" : "/en/blog");
      expect(page.openGraph?.title).toBe("Page title");
      expect(page.twitter?.title).toBe("Page title");
      expect(page.twitter?.description).toBe("Page description");
      for (const post of getPosts(locale)) {
        const article = buildArticleMetadata(locale, post);
        expect(article.description).toBe(post.excerpt);
        expect(article.twitter?.description).toBe(post.excerpt);
        expect(article.openGraph).toMatchObject({ type: "article", publishedTime: post.date, modifiedTime: post.modified });
      }
    }
  });

  it("preserves optional verification and never emits a blank verification token", async () => {
    for (const token of ["", "test-public-verification"] as const) {
      vi.resetModules();
      vi.stubEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", token);
      const { buildMetadata } = await import("@/lib/seo-metadata");
      expect(buildMetadata("en").verification).toEqual(token ? { google: token } : undefined);
    }
  });
});
