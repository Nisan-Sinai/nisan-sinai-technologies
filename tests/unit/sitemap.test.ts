import { afterEach, describe, expect, it, vi } from "vitest";
import { getSlugs } from "@/lib/blog";
import { locales } from "@/lib/i18n";

/** siteUrl is resolved at module scope, so each case needs a fresh import. */
async function load(env: Record<string, string> = {}) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", env.NEXT_PUBLIC_SITE_URL ?? "");
  vi.stubEnv(
    "VERCEL_PROJECT_PRODUCTION_URL",
    env.VERCEL_PROJECT_PRODUCTION_URL ?? "",
  );
  return (await import("@/app/sitemap")).default;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap.xml", () => {
  it("lists every page once per locale", async () => {
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });
    const entries = sitemap();

    const expectedPages = 4 + getSlugs("he").length;
    expect(entries).toHaveLength(expectedPages * locales.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  });

  it("carries both the home page and the blog in both languages", async () => {
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });
    const urls = sitemap().map((entry) => entry.url);

    for (const path of [
      "/",
      "/en",
      "/blog",
      "/en/blog",
      "/privacy",
      "/en/privacy",
      "/accessibility",
      "/en/accessibility",
    ]) {
      expect(urls, path).toContain(`https://example.com${path}`);
    }
  });

  it("lists every published post under both locales", async () => {
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });
    const urls = sitemap().map((entry) => entry.url);

    for (const slug of getSlugs("he")) {
      expect(urls).toContain(`https://example.com/blog/${slug}`);
      expect(urls).toContain(`https://example.com/en/blog/${slug}`);
    }
  });

  it("cross-references each page with its translation", async () => {
    // A page that does not name its alternate competes with its own
    // translation in search results instead of pairing with it.
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });

    for (const entry of sitemap()) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).sort()).toEqual([...locales].sort());
      for (const url of Object.values(languages)) {
        expect(String(url)).toMatch(/^https:\/\/example\.com/);
      }
    }
  });

  it("gives the home page the highest priority and the policies the lowest", async () => {
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });
    const entries = sitemap();
    const priorityOf = (url: string) =>
      entries.find((entry) => entry.url === url)?.priority;

    expect(priorityOf("https://example.com/")).toBe(1);
    expect(priorityOf("https://example.com/blog")).toBe(0.6);
    expect(priorityOf("https://example.com/privacy")).toBe(0.3);
    expect(priorityOf("https://example.com/accessibility")).toBe(0.3);
  });

  it("dates every entry", async () => {
    const sitemap = await load({ NEXT_PUBLIC_SITE_URL: "https://example.com" });

    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN(Number(entry.lastModified))).toBe(false);
    }
  });

  it("falls back to the deployment host, then to a default", async () => {
    const fromDeployment = await load({
      VERCEL_PROJECT_PRODUCTION_URL: "preview.vercel.app",
    });
    expect(fromDeployment()[0].url).toBe("https://preview.vercel.app/");

    const fromDefault = await load();
    expect(fromDefault()[0].url).toMatch(/^https:\/\/.+\//);
  });
});
