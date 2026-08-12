import { describe, expect, it } from "vitest";
import { isPublishableKey } from "@/lib/supabase-key";

/** Builds a legacy-format key carrying the given payload. */
function legacyKey(payload: Record<string, unknown>): string {
  const encode = (value: string) =>
    btoa(value).replace(/\+/g, "-").replace(/\//g, "_");
  return `${encode('{"alg":"HS256"}')}.${encode(JSON.stringify(payload))}.signature`;
}

describe("isPublishableKey", () => {
  it("accepts a current-format publishable key", () => {
    expect(isPublishableKey("sb_publishable_abc123")).toBe(true);
  });

  it("refuses a current-format secret key", () => {
    expect(isPublishableKey("sb_secret_abc123")).toBe(false);
  });

  it("accepts a legacy anon key", () => {
    expect(isPublishableKey(legacyKey({ role: "anon" }))).toBe(true);
  });

  it("refuses a legacy service_role key", () => {
    // The failure this guard exists for: a service_role key published to
    // every visitor of the admin page.
    expect(isPublishableKey(legacyKey({ role: "service_role" }))).toBe(false);
  });

  it("refuses a legacy key with no role at all", () => {
    expect(isPublishableKey(legacyKey({ iss: "supabase" }))).toBe(false);
  });

  it("refuses a token whose payload is not valid base64 JSON", () => {
    expect(isPublishableKey("header.not-base64-json.signature")).toBe(false);
  });

  it("refuses anything that is not three JWT segments", () => {
    expect(isPublishableKey("just-a-string")).toBe(false);
    expect(isPublishableKey("two.parts")).toBe(false);
  });

  it("refuses an empty or blank value", () => {
    expect(isPublishableKey("")).toBe(false);
    expect(isPublishableKey("   ")).toBe(false);
  });
});
