export const ADMIN_EMAIL = "nisan.sinai5@gmail.com";
export const ADMIN_COOKIE = "nisan_admin_access_token";

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured");
  }

  const baseUrl = new URL(url);
  if (baseUrl.protocol !== "https:") {
    throw new Error("Supabase URL must use HTTPS");
  }

  return { baseUrl, key };
}

export async function getAdminUser(accessToken: string) {
  const { baseUrl, key } = getSupabaseConfig();
  const endpoint = new URL("/auth/v1/user", baseUrl);
  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) return null;
  const user = (await response.json()) as { email?: string };
  return user.email?.toLowerCase() === ADMIN_EMAIL ? user : null;
}
