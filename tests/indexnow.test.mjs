import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { hasPublicChanges, publicIndexNowUrls, submitIndexNow, verifyProduction } from "../scripts/submit-indexnow.mjs";

const config = JSON.parse(readFileSync(new URL("../config/indexnow.json", import.meta.url)));
const proof = config.ownershipFile.slice(1, -4);
const sha = "a".repeat(40);
const urls = ["/", "/en", "/blog", "/en/blog", "/blog/business-search-ai-visibility", "/en/blog/business-search-ai-visibility", "/privacy", "/en/accessibility"].map((path) => config.origin + path);
const xml = (list = urls) => `<urlset>${list.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
function server({ status = 200, release = sha, keyFile = proof, sitemap = xml(), healthStatus = 200, sitemapStatus = 200, keyStatus = 200 } = {}) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("/api/health")) return Response.json({ release }, { status: healthStatus });
    if (url.endsWith("/sitemap.xml")) return new Response(sitemap, { status: sitemapStatus });
    if (url.endsWith(".txt")) return new Response(keyFile, { status: keyStatus });
    return new Response("", { status });
  };
  return { calls, fetcher };
}

test("uses public sitemap URLs in both languages and a matching published ownership file", () => {
  assert.deepEqual(publicIndexNowUrls(xml([...urls, urls[0]])), urls);
  assert.equal(readFileSync(new URL(`../public${config.ownershipFile}`, import.meta.url), "utf8").trim(), proof);
});
test("rejects a poisoned sitemap before any submission", () => {
  for (const path of ["/admin", "/en/admin", "/api/leads", "/invite/private", "/share/private", "/en/", "/blog/a?token=private", "/blog/a#contact", "/%62log/a", "/blog/a/../admin"])
    assert.throws(() => publicIndexNowUrls(xml([config.origin + path])));
  for (const url of ["https://other.test/blog/a", "http://nisan-sinai-technologies.vercel.app/blog", "https://user:password@nisan-sinai-technologies.vercel.app/blog"])
    assert.throws(() => publicIndexNowUrls(xml([url])));
  assert.throws(() => publicIndexNowUrls(xml([])));
  assert.throws(() => publicIndexNowUrls(xml(Array(101).fill(urls[0]))));
  assert.throws(() => publicIndexNowUrls(xml(), { ...config, origin: "https://other.test" }));
  assert.throws(() => publicIndexNowUrls(xml(), { ...config, ownershipFile: "bad" }));
});
test("private changes do not notify; public content and new articles do", () => {
  assert.equal(hasPublicChanges(["app/admin/page.tsx", "app/api/leads/route.ts", "supabase/migrations/x.sql", "docs/x.md"]), false);
  for (const path of ["lib/blog.ts", "lib/content.ts", "lib/business.ts", "app/(he)/blog/page.tsx", "app/site-footer.tsx", "app/globals.css", "app/sitemap.ts", "config/indexnow.json", "public/projects/example.jpg"])
    assert.equal(hasPublicChanges([path]), true);
  assert.equal(hasPublicChanges([], true), true);
});
test("requires the exact production SHA before any network call or notification", async () => {
  const s = server();
  for (const value of [undefined, "", "main", "abc"])
    await assert.rejects(verifyProduction(value, s.fetcher), /release SHA/);
  assert.equal(s.calls.length, 0);
  for (const options of [{ release: "b".repeat(40) }, { healthStatus: 503 }]) {
    const wrong = server(options);
    await assert.rejects(submitIndexNow(sha, wrong.fetcher), /expected release/);
    assert.equal(wrong.calls.length, 1);
  }
});
test("unavailable or private sitemap cannot cause a POST", async () => {
  for (const options of [{ sitemapStatus: 503 }, { sitemap: xml([config.origin + "/api/leads"]) }]) {
    const s = server(options);
    await assert.rejects(submitIndexNow(sha, s.fetcher));
    assert.equal(s.calls.length, 2);
  }
});
test("missing, wrong or unreadable ownership proof cannot cause a POST", async () => {
  for (const options of [{ keyFile: "wrong" }, { keyStatus: 404 }]) {
    const s = server(options);
    await assert.rejects(submitIndexNow(sha, s.fetcher), /key file/);
    assert.equal(s.calls.length, 3);
  }
});
for (const status of [200, 202]) {
  test(`one official submission distinguishes HTTP ${status} without claiming indexing`, async () => {
    const s = server({ status });
    assert.deepEqual(await submitIndexNow(sha, s.fetcher), {
      count: urls.length, status, outcome: status === 200 ? "key_validated" : "pending_key_validation",
    });
    assert.equal(s.calls.length, 4);
    const post = s.calls[3];
    assert.equal(post.url, "https://api.indexnow.org/indexnow");
    assert.equal(post.options.method, "POST");
    assert.deepEqual(JSON.parse(post.options.body), {
      host: "nisan-sinai-technologies.vercel.app", key: proof, keyLocation: config.origin + config.ownershipFile, urlList: urls,
    });
    for (const call of s.calls) {
      assert.equal(call.options.redirect, "error");
      assert(call.options.signal instanceof AbortSignal);
    }
  });
}
test("errors and rate limits are surfaced without duplicate POST attempts", async () => {
  for (const status of [400, 403, 422, 429, 500]) {
    const s = server({ status });
    await assert.rejects(submitIndexNow(sha, s.fetcher), new RegExp(`HTTP ${status}`));
    assert.equal(s.calls.length, 4);
  }
});
test("notifications use reviewed main pushes, read-only permissions and a production smoke gate", () => {
  const workflow = readFileSync(new URL("../.github/workflows/indexnow.yml", import.meta.url), "utf8");
  for (const pattern of [/workflows: \['Centrally managed CI'\]/, /branches: \[main\]/, /conclusion == 'success'/, /event == 'push'/, /head_repository.full_name == github.repository/, /contents: read/, /persist-credentials: false/, /bash scripts\/smoke.sh/, /--verify-production/]) assert.match(workflow, pattern);
  assert.doesNotMatch(workflow, /secrets\.|contents: write|pull_request_target|schedule:/);
});
