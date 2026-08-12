/**
 * The admin page hands this key to the browser, which is exactly what a
 * publishable key is for. A secret key in the same variable would be published
 * to every visitor of /admin, and the variable is not named NEXT_PUBLIC_*, so
 * nothing about it warns a maintainer that its value ends up in the page.
 *
 * This site has already had one outage from the wrong value in this variable.
 * The value is therefore checked rather than trusted.
 */
export function isPublishableKey(key: string): boolean {
  const value = key.trim();
  if (value === "") return false;

  // Current-format keys say what they are in the prefix.
  if (value.startsWith("sb_publishable_")) return true;
  if (value.startsWith("sb_secret_")) return false;

  // Legacy keys are JWTs; only the anon role is safe to publish.
  const segments = value.split(".");
  if (segments.length !== 3) return false;

  try {
    const payload = JSON.parse(
      atob(segments[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { role?: unknown };
    return payload.role === "anon";
  } catch {
    return false;
  }
}
