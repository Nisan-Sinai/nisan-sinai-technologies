import { afterEach, describe, expect, it, vi } from "vitest";

/** The module reads the environment, so each case needs a fresh import. */
async function load() {
  vi.resetModules();
  return (await import("@/app/robots")).default;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots.txt", () => {
  it("invites crawlers and points them at the sitemap", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const robots = await load();
    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
  });

  it("prefers the configured site URL over the deployment host", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "ignored.vercel.app");
    const robots = await load();

    expect(robots().sitemap).toBe("https://example.com/sitemap.xml");
  });

  it("falls back to the deployment host when no site URL is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "preview.vercel.app");
    const robots = await load();

    // A sitemap pointing at the wrong host is worse than none: it invites the
    // crawler to index a preview deployment.
    expect(robots().sitemap).toBe("https://preview.vercel.app/sitemap.xml");
  });

  it("still names a host when neither variable is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    const robots = await load();

    expect(robots().sitemap).toMatch(/^https:\/\/.+\/sitemap\.xml$/);
  });
});

describe("resolveSiteUrl", () => {
  it("treats a variable that exists but is blank as unset", async () => {
    // A variable created in a dashboard and left empty arrives as "", which
    // `??` accepts and `new URL("")` then rejects — so robots.txt and the
    // sitemap used to throw rather than fall back.
    vi.resetModules();
    const { resolveSiteUrl, DEFAULT_SITE_URL } = await import("@/lib/site-url");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(resolveSiteUrl()).toBe(DEFAULT_SITE_URL);

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "  deploy.vercel.app  ");
    expect(resolveSiteUrl()).toBe("https://deploy.vercel.app");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "  https://trimmed.example  ");
    expect(resolveSiteUrl()).toBe("https://trimmed.example");
  });

  it("never returns something new URL cannot parse", async () => {
    vi.resetModules();
    const { resolveSiteUrl } = await import("@/lib/site-url");

    for (const [site, deployment] of [
      ["", ""],
      ["   ", "   "],
      ["", "host.vercel.app"],
      ["https://example.com", ""],
    ] as const) {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", site);
      vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", deployment);
      expect(() => new URL(resolveSiteUrl())).not.toThrow();
    }
  });
});
