import { describe, expect, it } from "vitest";
import {
  hasFilledHoneypot,
  parseContactLead,
} from "@/lib/lead-validation";

const validLead = {
  name: " ניסן סיני ",
  business_name: " העסק שלי ",
  phone: "058-7170978",
  email: " NISAN@example.com ",
  service: "crm",
  message: " אני צריך מערכת חדשה לניהול לקוחות. ",
  consent: "accepted",
};

describe("parseContactLead", () => {
  it("normalizes a valid lead", () => {
    expect(parseContactLead(validLead)).toEqual({
      success: true,
      lead: {
        name: "ניסן סיני",
        business_name: "העסק שלי",
        phone: "058-7170978",
        email: "nisan@example.com",
        service: "crm",
        message: "אני צריך מערכת חדשה לניהול לקוחות.",
        source: "nisan-sinai-tech-site",
      },
    });
  });

  it("accepts empty optional fields", () => {
    expect(
      parseContactLead({
        ...validLead,
        business_name: "",
        email: "",
        service: "",
      }),
    ).toMatchObject({
      success: true,
      lead: { business_name: null, email: null, service: null },
    });
  });

  it.each([
    null,
    [],
    "not-an-object",
    { ...validLead, name: "א" },
    { ...validLead, name: "א".repeat(81) },
    { ...validLead, business_name: "א".repeat(101) },
    { ...validLead, phone: "abc" },
    { ...validLead, email: "not-an-email" },
    { ...validLead, email: `${"a".repeat(151)}@example.com` },
    { ...validLead, service: "unknown" },
    { ...validLead, message: "קצר" },
    { ...validLead, message: "א".repeat(1501) },
    { ...validLead, consent: "" },
    { ...validLead, name: 123 },
  ])("rejects invalid input %#", (input) => {
    expect(parseContactLead(input)).toEqual({ success: false });
  });
});

describe("hasFilledHoneypot", () => {
  it("detects a filled honeypot", () => {
    expect(hasFilledHoneypot({ website: "bot.example" })).toBe(true);
  });

  it("ignores missing, blank, and invalid honeypots", () => {
    expect(hasFilledHoneypot({ website: "   " })).toBe(false);
    expect(hasFilledHoneypot({})).toBe(false);
    expect(hasFilledHoneypot(null)).toBe(false);
  });
});
