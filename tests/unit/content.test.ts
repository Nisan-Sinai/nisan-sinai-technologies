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

  it("marks where the address belongs in both policy documents", () => {
    for (const locale of locales) {
      for (const document of ["privacy", "accessibility"] as const) {
        const bodies = getContent(locale)[document].sections.flatMap((section) =>
          section.body ? [section.body] : [],
        );
        expect(bodies.some((body) => body.includes("{email}"))).toBe(true);
      }
    }
  });

  it("gives every policy section something to render", () => {
    // A section with neither prose nor a list is a heading over blank space.
    for (const locale of locales) {
      for (const document of ["privacy", "accessibility"] as const) {
        for (const section of getContent(locale)[document].sections) {
          expect(section.title.trim()).not.toBe("");
          expect(Boolean(section.body) || Boolean(section.items?.length)).toBe(true);
        }
      }
    }
  });

  it("states in the privacy policy what Israeli law requires it to state", () => {
    // Section 11 of the Protection of Privacy Law asks for the controller, the
    // purpose, whether disclosure is voluntary and who the data reaches;
    // Amendment 13 adds access, correction and erasure. Losing any of these in
    // an edit is the kind of regression nobody notices by reading the page.
    const required: Record<Locale, string[]> = {
      he: [
        "בעל המאגר",
        "מרצון",
        "Supabase",
        "Vercel",
        "מחוץ לישראל",
        "זכות עיון",
        "זכות תיקון",
        "זכות מחיקה",
        "רשות להגנת הפרטיות",
        "עוגיות",
      ],
      en: [
        "controller",
        "voluntary",
        "Supabase",
        "Vercel",
        "outside Israel",
        "Access",
        "Correction",
        "Erasure",
        "Privacy Protection Authority",
        "Cookies",
      ],
    };

    for (const locale of locales) {
      const text = collectStrings(getContent(locale).privacy).join(" ");
      for (const phrase of required[locale]) {
        expect(text, `${locale}: ${phrase}`).toContain(phrase);
      }
    }
  });

  it("names the standard and the coordinator in the accessibility statement", () => {
    // The Israeli service-accessibility regulations require the statement to
    // name the standard it claims and to give a coordinator who can be reached.
    const required: Record<Locale, string[]> = {
      he: ["5568", "AA", "רכז הנגישות", "058-7170978", "{email}"],
      en: ["5568", "AA", "coordinator", "058-7170978", "{email}"],
    };

    for (const locale of locales) {
      const text = collectStrings(getContent(locale).accessibility).join(" ");
      for (const phrase of required[locale]) {
        expect(text, `${locale}: ${phrase}`).toContain(phrase);
      }
    }
  });

  it("quotes a real figure for every price tier", () => {
    // A tier with a vague figure is worse than no pricing section: it reads as
    // evasive on the one question every visitor arrives with.
    for (const locale of locales) {
      const pricing = getContent(locale).pricing;
      expect(pricing.tiers).toHaveLength(4);
      for (const tier of pricing.tiers) {
        expect(tier.name.trim()).not.toBe("");
        expect(tier.note.trim()).not.toBe("");
        expect(tier.from, `${locale}: ${tier.name}`).toMatch(/₪/);
        expect(tier.from, `${locale}: ${tier.name}`).toMatch(/\d[\d,]{2,}/);
      }
      expect(pricing.hourly).toMatch(/₪/);
    }
  });

  it("keeps the same figures in both languages", () => {
    // The English page is the same offer, so a number may not drift between
    // them: only the words around it are translated.
    const digits = (value: string) => value.replace(/[^\d]/g, "");
    const he = getContent("he").pricing;
    const en = getContent("en").pricing;
    expect(en.tiers.map((t) => digits(t.from))).toEqual(
      he.tiers.map((t) => digits(t.from)),
    );
    expect(digits(en.hourly)).toBe(digits(he.hourly));
  });

  it("never invents a testimonial", () => {
    // The section is social proof, so a placeholder here would be a lie on the
    // page. Either a quote is real and complete, or the list stays empty and
    // the section does not render at all.
    for (const locale of locales) {
      for (const item of getContent(locale).testimonials.items) {
        expect(item.quote.trim()).not.toBe("");
        expect(item.name.trim()).not.toBe("");
        expect(item.role.trim()).not.toBe("");
        expect(item.quote.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("publishes the same testimonials in both languages", () => {
    // A quote that appears in Hebrew but not in English is a different offer
    // on each page, and the missing one is invisible until someone complains.
    const names = (locale: Locale) =>
      getContent(locale).testimonials.items.map((item) => item.name);
    expect(names("en")).toEqual(names("he"));
  });

  it("dates both policy documents", () => {
    for (const locale of locales) {
      for (const document of ["privacy", "accessibility"] as const) {
        expect(getContent(locale)[document].updated).toMatch(/2026/);
      }
    }
  });
});
