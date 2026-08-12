import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminUser, getSupabaseConfig } from "@/lib/admin-auth";

export async function GET() {
  try {
    const jar = await cookies();
    const accessToken = jar.get(ADMIN_COOKIE)?.value;
    if (!accessToken || !(await getAdminUser(accessToken))) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const { baseUrl, key } = getSupabaseConfig();
    const endpoint = new URL("/rest/v1/rpc/admin_contact_leads", baseUrl);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return Response.json({ error: "storage_failed" }, { status: 502 });
    return Response.json({ leads: await response.json() });
  } catch {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }
}
