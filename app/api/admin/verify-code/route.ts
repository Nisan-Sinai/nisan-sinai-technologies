import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_EMAIL, getSupabaseConfig } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let input: { token?: string } = {};
  try { input = (await request.json()) as { token?: string }; } catch { return Response.json({ error: "invalid_json" }, { status: 400 }); }
  const token = input.token?.trim();
  if (!token || token.length < 6 || token.length > 10) return Response.json({ error: "invalid_code" }, { status: 422 });

  try {
    const { baseUrl, key } = getSupabaseConfig();
    const endpoint = new URL("/auth/v1/verify", baseUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, token, type: "email" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return Response.json({ error: "invalid_code" }, { status: 401 });
    const session = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!session.access_token) return Response.json({ error: "invalid_session" }, { status: 502 });

    const jar = await cookies();
    jar.set(ADMIN_COOKIE, session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.min(session.expires_in ?? 3600, 3600),
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
