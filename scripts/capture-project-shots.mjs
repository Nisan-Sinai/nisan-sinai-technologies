#!/usr/bin/env node
// Photographs the live project sites so the portfolio shows what is actually
// running rather than a drawing of it. Two of the three sites refuse to be
// framed (x-frame-options), which is correct for sites with a login, so a real
// browser visits them instead of embedding them.
//
//   node scripts/capture-project-shots.mjs
//
// Each site is photographed twice, once per language, into `<slug>.jpg` and
// `<slug>-en.jpg`. Same viewport, same crop, same waits — only the language of
// the page differs, so the two shots frame the same thing.
//
// A site that fails to load leaves its existing image untouched: a stale but
// real screenshot beats a blank or half-painted one. The same goes for a
// language that cannot be reached or cannot be confirmed.
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

// `height` is how much of the page each shot keeps. It defaults to the 16:10
// fold, but a site whose layout puts a headline right on that line gets cut
// through the middle of it, so that one is trimmed to the seam above instead.
// These numbers are mirrored in PROJECT_SITES in app/site-page.tsx, which sets
// the img dimensions — change one and change the other, or the card shifts as
// the image loads.
const SITES = [
  { slug: "ld-event-design", url: "https://ld-event-design.vercel.app/" },
  { slug: "shel-yah", url: "https://shel-yah-web.vercel.app/" },
  { slug: "rsvp", url: "https://arrival-confirmations.vercel.app/", height: 800 },
];

// 16:10 of the top of the page — the part a visitor sees first.
const WIDTH = 1440;
const HEIGHT = 900;

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});

/** What the document itself claims to be in, which is the only reliable signal. */
async function documentLanguage(page) {
  return page.evaluate(() =>
    (document.documentElement.getAttribute("lang") ?? "").toLowerCase(),
  );
}

/**
 * Reaches the English version. These sites are built the same way this one is,
 * so /en is tried first; if that is not the convention, the language control is
 * found by its accessible name and clicked, which is what a visitor does.
 *
 * Returns true only once the document says it is in English — a control that
 * did nothing must not be mistaken for a successful switch.
 */
async function switchToEnglish(page, siteUrl) {
  const direct = new URL("/en", siteUrl).toString();
  const response = await page
    .goto(direct, { waitUntil: "networkidle", timeout: 45_000 })
    .catch(() => null);

  if (response?.ok() && (await documentLanguage(page)).startsWith("en")) {
    return true;
  }

  await page.goto(siteUrl, { waitUntil: "networkidle", timeout: 45_000 });
  const control = page
    .getByRole("link", { name: /english|^en$|אנגלית/i })
    .or(page.getByRole("button", { name: /english|^en$|אנגלית/i }))
    .first();

  if ((await control.count()) === 0) return false;

  await control.click({ timeout: 10_000 });
  await page.waitForLoadState("networkidle", { timeout: 45_000 });
  await page.waitForTimeout(1_000);

  return (await documentLanguage(page)).startsWith("en");
}

async function shoot(page, site) {
  // Entry animations would otherwise be caught mid-flight.
  await page.waitForTimeout(2_500);
  return page.screenshot({
    type: "jpeg",
    quality: 82,
    clip: { x: 0, y: 0, width: WIDTH, height: site.height ?? HEIGHT },
  });
}

function save(name, image) {
  writeFileSync(`public/projects/${name}.jpg`, image);
  console.log(`captured ${name} (${Math.round(image.length / 1024)}KB)`);
}

let hebrewFailures = 0;

for (const site of SITES) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
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
    save(site.slug, await shoot(page, site));
  } catch (error) {
    hebrewFailures += 1;
    console.error(`skipped ${site.slug}: ${error.message}`);
    await context.close();
    continue;
  }

  try {
    if (await switchToEnglish(page, site.url)) {
      save(`${site.slug}-en`, await shoot(page, site));
    } else {
      // Deliberately not fatal: the Hebrew shot stands in until this works.
      console.error(`skipped ${site.slug}-en: could not confirm an English page`);
    }
  } catch (error) {
    console.error(`skipped ${site.slug}-en: ${error.message}`);
  } finally {
    await context.close();
  }
}

await browser.close();

if (hebrewFailures === SITES.length) {
  console.error("every site failed to load; not treating this as a refresh");
  process.exit(1);
}
