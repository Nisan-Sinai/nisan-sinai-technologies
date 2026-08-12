#!/usr/bin/env node
// Photographs the live project sites so the portfolio shows what is actually
// running rather than a drawing of it. Two of the three sites refuse to be
// framed (x-frame-options), which is correct for sites with a login, so a real
// browser visits them instead of embedding them.
//
//   node scripts/capture-project-shots.mjs
//
// A site that fails to load leaves its existing image untouched: a stale but
// real screenshot beats a blank or half-painted one.
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const SITES = [
  { slug: "ld-event-design", url: "https://ld-event-design.vercel.app/" },
  { slug: "shel-yah", url: "https://shel-yah-web.vercel.app/" },
  { slug: "rsvp", url: "https://arrival-confirmations.vercel.app/" },
];

// 16:10 of the top of the page — the part a visitor sees first.
const WIDTH = 1440;
const HEIGHT = 900;

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
let failures = 0;

for (const site of SITES) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    // Animations that run on entry would otherwise be caught mid-flight.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(site.url, {
      waitUntil: "networkidle",
      timeout: 45_000,
    });
    if (!response || !response.ok()) {
      throw new Error(`responded ${response ? response.status() : "nothing"}`);
    }
    await page.waitForTimeout(2_500);

    const image = await page.screenshot({
      type: "jpeg",
      quality: 82,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    writeFileSync(`public/projects/${site.slug}.jpg`, image);
    console.log(`captured ${site.slug} (${Math.round(image.length / 1024)}KB)`);
  } catch (error) {
    failures += 1;
    console.error(`skipped ${site.slug}: ${error.message}`);
  } finally {
    await context.close();
  }
}

await browser.close();

if (failures === SITES.length) {
  console.error("every site failed to load; not treating this as a refresh");
  process.exit(1);
}
