#!/usr/bin/env node
// Renders the Open Graph share cards. The copy on a card has to match the copy
// on the page, so the cards are generated rather than hand-drawn — rerun this
// after changing the hero wording:
//
//   node scripts/build-og-images.mjs
//
// Set PLAYWRIGHT_CHROMIUM_PATH to override the browser binary.
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const TEMPLATE = "<!doctype html><html dir=\"rtl\"><head><meta charset=\"utf-8\"><style>\n*{margin:0;padding:0;box-sizing:border-box}\nhtml{overflow:hidden;width:1200px;height:630px}\nbody{width:1200px;height:630px;background:#05070b;font-family:Arial,\"Noto Sans Hebrew\",sans-serif;color:#f5f8fb;position:relative;overflow:hidden}\n.glow{position:absolute;border-radius:50%;filter:blur(90px)}\n.g1{width:620px;height:620px;background:rgba(83,228,255,.16);top:-200px;right:0}\n.g2{width:520px;height:520px;background:rgba(140,108,255,.13);bottom:-220px;left:0}\n.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(166,199,228,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(166,199,228,.05) 1px,transparent 1px);background-size:64px 64px}\n.wrap{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 84px}\n.mark{display:flex;align-items:center;gap:18px;margin-bottom:44px}\n.ns{font-size:40px;font-weight:800;letter-spacing:-.02em;direction:ltr}\n.ns i{color:#53e4ff;font-style:normal}\n.rule{width:1px;height:38px;background:rgba(166,199,228,.28)}\n.who{font-size:19px;line-height:1.35;color:#c7d2df}\n.who b{display:block;font-weight:700;color:#f5f8fb}\n.kick{display:flex;align-items:center;gap:14px;font-size:16px;font-weight:700;letter-spacing:.18em;color:#d7c4a0;margin-bottom:26px}\n.kick span{width:44px;height:1px;background:#d7c4a0}\nh1{font-size:74px;line-height:1.12;font-weight:800;letter-spacing:-.01em;max-width:930px}\nh1 em{font-style:normal;background:linear-gradient(90deg,#53e4ff,#8c6cff);-webkit-background-clip:text;background-clip:text;color:transparent}\np{margin-top:30px;font-size:25px;line-height:1.5;color:#aab6c4;max-width:820px}\n.foot{position:absolute;bottom:52px;display:flex;align-items:center;gap:26px;font-size:19px;color:#8f9daf}\n.dot{width:8px;height:8px;border-radius:50%;background:#53e4ff;box-shadow:0 0 14px rgba(83,228,255,.9)}\nhtml[dir=rtl] .foot{right:84px}\nhtml[dir=ltr] .foot{left:84px}\n</style></head><body></body></html>\n";

const CARDS = [
  {
    file: "public/og.png",
    dir: "rtl",
    kick: "פיתוח דיגיטלי מקצה לקצה",
    h1: 'אני בונה את <em>הטכנולוגיה</em><br>שהעסק שלך צריך.',
    p: "אתרים, מערכות CRM ו־ERP, אוטומציות ופיתוח בהתאמה אישית.",
    who: "<b>ניסן סיני</b>טכנולוגיות",
  },
  {
    file: "public/og-en.png",
    dir: "ltr",
    kick: "END-TO-END DIGITAL DEVELOPMENT",
    h1: 'I build the <em>technology</em><br>your business needs.',
    p: "Websites, CRM and ERP systems, automations and custom development.",
    who: "<b>Nisan Sinai</b>Technologies",
  },
];

const FOOT = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
  : "nisan-sinai-technologies.vercel.app";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});

for (const card of CARDS) {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(TEMPLATE, { waitUntil: "load" });
  await page.evaluate(
    ([card, foot]) => {
      document.documentElement.setAttribute("dir", card.dir);
      document.body.innerHTML = `
        <div class="glow g1"></div><div class="glow g2"></div><div class="grid"></div>
        <div class="wrap">
          <div class="mark">
            <div class="ns">NS<i>.</i></div><div class="rule"></div>
            <div class="who">${card.who}</div>
          </div>
          <div class="kick"><span></span>${card.kick}</div>
          <h1>${card.h1}</h1>
          <p>${card.p}</p>
        </div>
        <div class="foot"><div class="dot"></div>${foot}</div>`;
    },
    [card, FOOT],
  );
  await page.waitForTimeout(400);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > 1200,
  );
  if (overflow) {
    throw new Error(`${card.file}: content overflows the 1200px card`);
  }

  const png = await page.screenshot({
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  writeFileSync(card.file, png);
  console.log(`wrote ${card.file}`);
  await context.close();
}

await browser.close();
