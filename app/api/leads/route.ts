import { hasFilledHoneypot, parseContactLead } from "@/lib/lead-validation";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return Response.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  let input: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "invalid_json" }, { status: 400 });
    }
    input = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots often fill the hidden field. A successful-looking response prevents retries.
  if (hasFilledHoneypot(input)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const parsedLead = parseContactLead(input);
  if (!parsedLead.success) {
    return Response.json({ error: "invalid_fields" }, { status: 422 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  let endpoint: URL;
  try {
    const baseUrl = new URL(supabaseUrl);
    if (baseUrl.protocol !== "https:") {
      throw new Error("Supabase URL must use HTTPS");
    }
    endpoint = new URL("/rest/v1/contact_leads", baseUrl);
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  let supabaseResponse: Response;
  try {
    supabaseResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: publishableKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(parsedLead.lead),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return Response.json({ error: "storage_unreachable" }, { status: 502 });
  }

  if (!supabaseResponse.ok) {
    // The status alone cannot distinguish a rejected key from a rejected row.
    // Supabase explains which in the body, and that body never echoes the key.
    const detail = await supabaseResponse.text().catch(() => "");
    console.error(
      "Supabase lead insert failed",
      supabaseResponse.status,
      detail.slice(0, 500),
    );
    return Response.json({ error: "storage_failed" }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
