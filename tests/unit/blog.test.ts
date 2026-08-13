import { describe, expect, it } from "vitest";
import {
  formatPostDate,
  getPost,
  getPosts,
  getSlugs,
  slugsMatchAcrossLocales,
} from "@/lib/blog";
import { locales } from "@/lib/i18n";

describe("blog", () => {
  it("publishes the same articles in both languages", () => {
    // A slug present in one language and missing in the other 404s on half the
    // site while looking fine on the other half.
    expect(slugsMatchAcrossLocales()).toBe(true);
    expect(getSlugs("he")).toEqual(getSlugs("en"));
  });

  it("returns the newest post first", () => {
    for (const locale of locales) {
      const dates = getPosts(locale).map((post) => post.date);
      expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
    }
  });

  it("gives every post the parts a page and a share card need", () => {
    for (const locale of locales) {
      for (const post of getPosts(locale)) {
        expect(post.slug, "slug").toMatch(/^[a-z0-9-]+$/);
        expect(post.date, `${post.slug} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(post.date))).toBe(false);
        for (const field of ["title", "excerpt", "intro", "readingTime"] as const) {
          expect(post[field].trim(), `${post.slug} ${field}`).not.toBe("");
        }
        expect(post.sections.length).toBeGreaterThan(0);
        for (const section of post.sections) {
          expect(section.title.trim()).not.toBe("");
          expect(section.body.length).toBeGreaterThan(0);
          for (const paragraph of section.body) {
            expect(paragraph.trim()).not.toBe("");
          }
        }
      }
    }
  });

  it("translates the prose rather than shipping one language twice", () => {
    for (const slug of getSlugs("he")) {
      const he = getPost("he", slug);
      const en = getPost("en", slug);
      expect(he?.title).not.toBe(en?.title);
      expect(he?.intro).not.toBe(en?.intro);
    }
  });

  it("keeps a post's publication date the same in both languages", () => {
    for (const slug of getSlugs("he")) {
      expect(getPost("he", slug)?.date).toBe(getPost("en", slug)?.date);
    }
  });

  it("writes the date the way each language reads it", () => {
    // Rendered in UTC on purpose: a server an hour behind the reader must not
    // print a different day than the browser does.
    expect(formatPostDate("he", "2026-08-13")).toBe("13 באוגוסט 2026");
    expect(formatPostDate("en", "2026-08-13")).toBe("13 August 2026");
    expect(formatPostDate("en", "2026-01-01")).toBe("1 January 2026");
  });

  it("finds a post by slug and reports an unknown one as missing", () => {
    expect(getPost("he", getSlugs("he")[0])).toBeDefined();
    expect(getPost("he", "no-such-post")).toBeUndefined();
    expect(getPost("en", "no-such-post")).toBeUndefined();
  });
});
