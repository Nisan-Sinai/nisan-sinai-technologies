import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/leads/route";

const validPayload = {
  name: "ניסן סיני",
  business_name: "עסק לדוגמה",
  phone: "058-7170978",
  email: "nisan@example.com",
  service: "website",
  message: "אני רוצה לבנות אתר תדמית חדש לעסק שלי.",
  consent: "accepted",
};

function jsonRequest(
  body: unknown,
  headers: Record<string, string> = {},
) {
  return new Request("https://example.com/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
  });

  it("rejects an oversized payload before parsing it", async () => {
    const response = await POST(jsonRequest({}, { "Content-Length": "12001" }));
    expect(response.status).toBe(413);
  });

  it("requires JSON content", async () => {
    const request = new Request("https://example.com/api/leads", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "hello",
    });
    const response = await POST(request);
    expect(response.status).toBe(415);
  });

  it("rejects malformed and non-object JSON", async () => {
    expect((await POST(jsonRequest("{"))).status).toBe(400);
    expect((await POST(jsonRequest([]))).status).toBe(400);
  });

  it("returns a quiet success for honeypot submissions", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(
      jsonRequest({ ...validPayload, website: "https://spam.example" }),
    );
    expect(response.status).toBe(201);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid fields", async () => {
    const response = await POST(jsonRequest({ ...validPayload, phone: "bad" }));
    expect(response.status).toBe(422);
  });

  it("returns unavailable when configuration is absent or invalid", async () => {
    delete process.env.SUPABASE_URL;
    expect((await POST(jsonRequest(validPayload))).status).toBe(503);

    process.env.SUPABASE_URL = "http://project.supabase.co";
    expect((await POST(jsonRequest(validPayload))).status).toBe(503);
  });

  it("stores a normalized lead with the publishable apikey only", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(jsonRequest(validPayload));

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [endpoint, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    const headers = new Headers(init.headers);
    expect(endpoint.toString()).toBe(
      "https://project.supabase.co/rest/v1/contact_leads",
    );
    expect(headers.get("apikey")).toBe("sb_publishable_test");
    expect(headers.get("authorization")).toBeNull();
    expect(headers.get("prefer")).toBe("return=minimal");
    expect(JSON.parse(String(init.body))).toMatchObject({
      name: "ניסן סיני",
      source: "nisan-sinai-tech-site",
    });
  });

  it("handles rejected and unsuccessful storage requests", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await POST(jsonRequest(validPayload))).status).toBe(502);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    expect((await POST(jsonRequest(validPayload))).status).toBe(502);
    expect(consoleSpy).toHaveBeenCalledWith("Supabase lead insert failed", 500);
  });
});
