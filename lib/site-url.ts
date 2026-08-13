/**
 * Where the site believes it lives. Canonicals, share cards, the sitemap and
 * robots.txt all derive from this, so they have to agree — which is why it is
 * resolved in one place rather than three.
 */

/** The host used when nothing is configured, e.g. a local checkout. */
export const DEFAULT_SITE_URL =
  "https://nisan-sinai-tech.nisan-sinai.chatgpt.site";

/**
 * A variable created in a dashboard and left blank arrives as an empty string,
 * not as undefined. `??` accepts that happily and `new URL("")` then throws, so
 * blank has to be treated as "not set" rather than as a value.
 */
function configured(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Read at call time, and referencing `process.env.NEXT_PUBLIC_SITE_URL` as a
 * literal: Next inlines that exact expression at build time, and destructuring
 * it would leave the client bundle with nothing to inline.
 *
 * A malformed value is deliberately not caught. Blank means unconfigured, but a
 * typo means configured wrongly, and shipping the wrong canonical host quietly
 * is worse than failing the build.
 */
export function resolveSiteUrl(): string {
  const explicit = configured(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;

  const deployment = configured(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (deployment) return `https://${deployment}`;

  return DEFAULT_SITE_URL;
}
