import { describe, expect, it } from "vitest";
import { contact, getContent } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";

/** The shape of a value, ignoring the strings themselves. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, shapeOf(entry)]),
    );
  }
  return typeof value;
}

function collectStrings(value: unknown, found: string[] = []): string[] {
  if (typeof value === "string") found.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collectStrings(entry, found));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((entry) =>
      collectStrings(entry, found),
    );
  }
  return found;
}

describe("site content", () => {
  it("serves a dictionary for every locale", () => {
    for (const locale of locales) {
      expect(getContent(locale).meta.title).toBeTruthy();
    }
  });

  it("keeps both languages structurally identical", () => {
    // A missing translation is a missing key, and a missing key is a blank
    // space on the page. The two dictionaries must match branch for branch.
    expect(shapeOf(getContent("en"))).toEqual(shapeOf(getContent("he")));
  });

  it("leaves no string empty in either language", () => {
    for (const locale of locales) {
      for (const value of collectStrings(getContent(locale))) {
        expect(value.trim()).not.toBe("");
      }
    }
  });

  it("translates the prose rather than copying it across", () => {
    const he = getContent("he");
    const en = getContent("en");
    expect(en.hero.lead).not.toBe(he.hero.lead);
    expect(en.services.title).not.toBe(he.services.title);
    expect(en.contact.lead).not.toBe(he.contact.lead);
  });

  it("keeps the service option values stable across languages", () => {
    // The labels are translated; the values are stored in the database and a
    // check constraint rejects anything unexpected, so they must not drift.
    const values = (locale: Locale) =>
      getContent(locale).form.serviceOptions.map((option) => option.value);
    expect(values("en")).toEqual(values("he"));
    expect(values("he")).toEqual([
      "website",
      "crm",
      "erp",
      "automation",
      "custom",
      "other",
    ]);
  });

  it("builds the tag label from the service it belongs to", () => {
    expect(getContent("he").services.tagsAria("CRM")).toContain("CRM");
    expect(getContent("en").services.tagsAria("CRM")).toContain("CRM");
  });

  it("keeps one set of contact details for the whole site", () => {
    expect(contact.email).toBe("nisan.sinai5@gmail.com");
    expect(contact.phoneHref).toBe("+972587170978");
    expect(contact.phoneDisplay).toBe("058-7170978");
  });

  it("marks where the address belongs in the privacy copy", () => {
    for (const locale of locales) {
      const bodies = getContent(locale).privacy.sections.map((s) => s.body);
      expect(bodies.some((body) => body.includes("{email}"))).toBe(true);
    }
  });
});
