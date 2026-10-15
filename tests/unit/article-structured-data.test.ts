import { describe, expect, it } from "vitest";
import { getPosts } from "@/lib/blog";
import { locales, localePath } from "@/lib/i18n";
import { buildArticleStructuredData } from "@/lib/structured-data";

describe("article structured data", () => {
  it("identifies each translation with its own canonical URL and published content", () => {
    for (const locale of locales) {
      for (const post of getPosts(locale)) {
        const data = buildArticleStructuredData(locale, "https://example.com", post);
        const url = `https://example.com${localePath(locale, `/blog/${post.slug}`)}`;
        expect(data["@type"]).toBe("BlogPosting");
        expect(data.url).toBe(url);
        expect(data.mainEntityOfPage).toBe(url);
        expect(data["@id"]).toBe(`${url}#article`);
        expect(data.headline).toBe(post.title);
        expect(data.description).toBe(post.excerpt);
        expect(data.datePublished).toBe(post.date);
        expect(data.inLanguage).toBe(locale);
        expect(data.author["@type"]).toBe("Person");
        expect(data.author.name).toBeTruthy();
        expect(data.author.url).toBe("https://www.linkedin.com/in/nisansinai");
        expect(data).not.toHaveProperty("dateModified");
      }
    }
  });
});
