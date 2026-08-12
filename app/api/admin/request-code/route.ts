import { ADMIN_EMAIL, getSupabaseConfig } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let input: { email?: string } = {};
  try {
    input = (await request.json()) as { email?: string };
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (input.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
    return Response.json({ error: "not_allowed" }, { status: 403 });
  }

  try {
    const { baseUrl, key } = getSupabaseConfig();
    const endpoint = new URL("/auth/v1/otp", baseUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, create_user: true }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error("Admin OTP request failed", response.status);
      return Response.json({ error: "otp_failed" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
