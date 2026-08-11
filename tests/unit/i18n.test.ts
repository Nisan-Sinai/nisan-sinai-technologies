import { describe, expect, it } from "vitest";
import {
  alternateLocale,
  defaultLocale,
  directionOf,
  forwardArrow,
  isLocale,
  localePath,
  locales,
} from "@/lib/i18n";

describe("locales", () => {
  it("offers Hebrew and English, with Hebrew as the default", () => {
    expect(locales).toEqual(["he", "en"]);
    expect(defaultLocale).toBe("he");
  });

  it("recognises supported locales and rejects anything else", () => {
    expect(isLocale("he")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  it("reads Hebrew right to left and English left to right", () => {
    expect(directionOf("he")).toBe("rtl");
    expect(directionOf("en")).toBe("ltr");
  });

  it("points the forward arrow the way the locale reads", () => {
    expect(forwardArrow("he")).toBe("←");
    expect(forwardArrow("en")).toBe("→");
  });

  it("pairs each locale with the other one", () => {
    expect(alternateLocale("he")).toBe("en");
    expect(alternateLocale("en")).toBe("he");
  });
});

describe("localePath", () => {
  it("keeps the default locale at the site root", () => {
    expect(localePath("he")).toBe("/");
    expect(localePath("he", "/")).toBe("/");
    expect(localePath("he", "/privacy")).toBe("/privacy");
  });

  it("prefixes the non-default locale", () => {
    expect(localePath("en")).toBe("/en");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/privacy")).toBe("/en/privacy");
  });

  it("tolerates a path given without its leading slash", () => {
    expect(localePath("he", "privacy")).toBe("/privacy");
    expect(localePath("en", "privacy")).toBe("/en/privacy");
  });
});
