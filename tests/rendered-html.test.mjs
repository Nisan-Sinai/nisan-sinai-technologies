import assert from "node:assert/strict";
import test from "node:test";

/**
 * The Codex preview marker used to be rendered unconditionally, which meant
 * production shipped a meta tag announcing itself as a development build. It
 * is gone now, and this asserts it stays gone.
 */
const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])[^>]*>/i;

test("the worker build serves the page without a development marker", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  // A page that renders nothing would also pass the check above.
  assert.match(html, /<meta[^>]*\bname=["']description["'][^>]*>/i);
  assert.match(html, /id="pricing"/);
});
