import { expect, test } from "@playwright/test";
import { getPosts } from "../../lib/blog";
import { businessProfiles } from "../../lib/business";

const canonicalOrigin = "https://nisan-sinai-technologies.vercel.app";

test("discovery files are public UTF-8 text with no private routes", async ({ request }) => {
  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    const text = await response.text();
    expect(text).toContain("ניסן סיני טכנולוגיות");
    expect(text).toContain("Nisan Sinai Technologies");
    expect(text).toContain(`${canonicalOrigin}/sitemap.xml`);
    expect(text).not.toMatch(/<!doctype|contact_leads|service_role|\/admin|chatgpt\.site/i);
    for (const locale of ["he", "en"] as const) {
      for (const post of getPosts(locale)) expect(text).toContain(post.title);
    }
  }
});

test("every public page has self canonical, reciprocal languages and matching social metadata in server HTML", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  expect(urls.length).toBe(16);
  for (const url of urls) {
    expect(url.origin).toBe(canonicalOrigin);
    const response = await request.get(url.pathname);
    expect(response.status(), url.pathname).toBe(200);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    expect(new URL(canonical!).pathname, url.pathname).toBe(url.pathname);
    expect(new URL(canonical!).origin).toBe(canonicalOrigin);
    for (const language of ["he", "en", "x-default"]) expect(html).toContain(`hrefLang="${language}"`);
    expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/i);
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    expect(description?.length).toBeGreaterThan(25);
    if (url.pathname.includes("/blog/")) {
      expect(html).toContain(`name="twitter:description" content="${description}"`);
      expect(html).toContain('"@type":"BlogPosting"');
      expect(html).toContain('"@type":"BreadcrumbList"');
      expect(html).toContain('rel="author"');
    }
  }
  expect(sitemap).not.toMatch(/\/admin|\/api\/|llms/);
});

test("article sources, related links and translation remain accessible on mobile and desktop", async ({ page }) => {
  for (const prefix of ["", "/en"]) {
    await page.goto(`${prefix}/blog/business-search-ai-visibility`);
    await expect(page.locator(".article-byline a[rel=author]")).toBeVisible();
    await expect(page.locator(".article-related li a")).toHaveCount(3);
    await expect(page.locator(".breadcrumbs [aria-current=page]")).toBeVisible();
    await expect(page.locator(".language-switch")).toHaveAttribute("href", prefix ? "/blog/business-search-ai-visibility" : "/en/blog/business-search-ai-visibility");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
});

test("official business profiles in JSON-LD match the visible footer", async ({ page }) => {
  await page.goto("/");
  const graph = await page.locator('script[type="application/ld+json"]').first().textContent();
  const business = JSON.parse(graph!)["@graph"].find((node: { "@type": string }) => node["@type"] === "ProfessionalService");
  for (const profile of businessProfiles) {
    await expect(page.locator(`.site-footer a[href="${profile.url}"]`)).toBeVisible();
    expect(business.sameAs).toContain(profile.url);
  }
  for (const service of business.makesOffer) {
    const id = new URL(service.itemOffered.url).hash.slice(1);
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
});
