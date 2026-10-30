import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const settings = JSON.parse(readFileSync(new URL("../config/indexnow.json", import.meta.url)));
const productionOrigin = "https://nisan-sinai-technologies.vercel.app";
const endpoint = "https://api.indexnow.org/indexnow";
const publicPath = /^\/(?:en(?:\/|$))?(?:(?:privacy|accessibility)|blog(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)?$/;

/** Read only the generated public sitemap, never application or customer records. */
export function publicIndexNowUrls(xml, config = settings) {
  if (config.origin !== productionOrigin || !/^\/[a-f0-9]{32}\.txt$/.test(config.ownershipFile))
    throw new Error("Invalid public IndexNow configuration");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0 || urls.length > 100) throw new Error("Invalid public sitemap size");
  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== productionOrigin || url.search || url.hash ||
        url.username || url.password || !publicPath.test(url.pathname) ||
        value !== url.href || url.pathname === "/en/")
      throw new Error("Refusing off-property, private or unapproved URLs");
  }
  return [...new Set(urls)];
}

/** Private admin, database and API-only updates never notify search engines. */
export function hasPublicChanges(files, allPublic = false) {
  return allPublic || files.some((file) =>
    /^lib\/(?:blog|content|business|structured-data|seo-metadata|site-url|i18n|llms)\.ts$/.test(file) ||
    /^app\/\((?:he|en)\)\//.test(file) ||
    /^app\/[^/]+\.(?:tsx|css)$/.test(file) ||
    /^app\/(?:sitemap|robots)\.ts$/.test(file) ||
    /^config\/indexnow\.json$/.test(file) ||
    /^public\/(?:og-|projects\/|favicon|logo)/.test(file));
}

const requestOptions = () => ({ redirect: "error", signal: AbortSignal.timeout(20_000) });

export async function verifyProduction(expectedSha, fetcher = fetch) {
  if (!/^[a-f0-9]{40}$/.test(expectedSha ?? ""))
    throw new Error("An exact production release SHA is required");
  const health = await fetcher(`${productionOrigin}/api/health`, {
    ...requestOptions(), cache: "no-store",
  });
  if (!health.ok || (await health.json()).release !== expectedSha)
    throw new Error("Production does not serve the expected release; nothing submitted");
}

/** Validate live release, public sitemap and ownership before the single POST. */
export async function submitIndexNow(expectedSha, fetcher = fetch) {
  await verifyProduction(expectedSha, fetcher);
  const sitemap = await fetcher(`${productionOrigin}/sitemap.xml`, requestOptions());
  if (!sitemap.ok) throw new Error("Public sitemap unavailable; nothing submitted");
  const urls = publicIndexNowUrls(await sitemap.text());
  const key = settings.ownershipFile.slice(1, -4);
  const keyLocation = `${productionOrigin}${settings.ownershipFile}`;
  const proof = await fetcher(keyLocation, requestOptions());
  if (!proof.ok || (await proof.text()).trim() !== key)
    throw new Error("Public IndexNow key file is missing or incorrect; nothing submitted");
  const response = await fetcher(endpoint, {
    ...requestOptions(), method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(productionOrigin).host, key, keyLocation, urlList: urls }),
  });
  if (![200, 202].includes(response.status))
    throw new Error(`IndexNow rejected the notification (HTTP ${response.status}); no automatic retry`);
  return { count: urls.length, status: response.status,
    outcome: response.status === 200 ? "key_validated" : "pending_key_validation" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv.includes("--verify-production")) {
      await verifyProduction(process.env.EXPECTED_SHA);
      console.log("Production serves the exact expected release");
    } else {
      const files = execFileSync("git", ["diff", "--name-only", "HEAD^", "HEAD"], { encoding: "utf8" }).trim().split("\n");
      const result = hasPublicChanges(files, process.env.INDEXNOW_ALL_PUBLIC === "1")
        ? await submitIndexNow(process.env.EXPECTED_SHA)
        : { count: 0, outcome: "no_public_changes" };
      console.log(`IndexNow: ${JSON.stringify(result)}. Acceptance does not confirm crawling or indexing.`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
