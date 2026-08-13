import { createRequire } from "node:module";
import { expect, test, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

test("homepage presents the studio, services, and portfolio", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ניסן סיני טכנולוגיות/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /אני בונה את הטכנולוגיה שהעסק שלך צריך/,
    }),
  ).toBeVisible();
  await expect(page.locator(".service-card")).toHaveCount(6);
  await expect(page.getByRole("heading", { name: "LD Event Design" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shel‑Yah" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "מערכת אישורי הגעה" }),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("mobile layout keeps key content and controls inside the viewport", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");

  const homeLayout = await page.evaluate(() => {
    const isInsideViewport = (element: Element | null) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.left >= -1 && rect.right <= window.innerWidth + 1;
    };
    const hasTouchHeight = (element: Element | null) =>
      Boolean(element && element.getBoundingClientRect().height >= 44);

    const heroButtons = Array.from(
      document.querySelectorAll(".hero-actions .button"),
    );
    const projectCards = Array.from(document.querySelectorAll(".project-card"));

    return {
      viewportWidth: window.innerWidth,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 2,
      headerFits: isInsideViewport(document.querySelector(".site-header")),
      headerCtaFits: isInsideViewport(document.querySelector(".header-cta")),
      headerCtaHasTouchHeight: hasTouchHeight(
        document.querySelector(".header-cta"),
      ),
      languageSwitchHasTouchHeight: hasTouchHeight(
        document.querySelector(".language-switch"),
      ),
      heroButtonsFit:
        heroButtons.length === 2 && heroButtons.every(isInsideViewport),
      heroButtonsHaveTouchHeight: heroButtons.every(hasTouchHeight),
      projectCardsFit:
        projectCards.length === 3 && projectCards.every(isInsideViewport),
    };
  });

  expect(homeLayout.viewportWidth).toBeLessThanOrEqual(500);
  expect(homeLayout.hasHorizontalOverflow).toBe(false);
  expect(homeLayout.headerFits).toBe(true);
  expect(homeLayout.headerCtaFits).toBe(true);
  expect(homeLayout.headerCtaHasTouchHeight).toBe(true);
  expect(homeLayout.languageSwitchHasTouchHeight).toBe(true);
  expect(homeLayout.heroButtonsFit).toBe(true);
  expect(homeLayout.heroButtonsHaveTouchHeight).toBe(true);
  expect(homeLayout.projectCardsFit).toBe(true);

  await page.goto("/#contact");

  const contactLayout = await page.evaluate(() => {
    const controls = Array.from(
      document.querySelectorAll(
        '.contact-form input:not([type="checkbox"]):not([name="website"]), .contact-form select, .contact-form textarea, .contact-form .submit-button',
      ),
    );

    return {
      controlCount: controls.length,
      allControlsFit: controls.every((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= -1 && rect.right <= window.innerWidth + 1;
      }),
      allControlsHaveTouchHeight: controls.every(
        (element) => element.getBoundingClientRect().height >= 44,
      ),
    };
  });

  expect(contactLayout.controlCount).toBeGreaterThanOrEqual(7);
  expect(contactLayout.allControlsFit).toBe(true);
  expect(contactLayout.allControlsHaveTouchHeight).toBe(true);
});


test("the system diagram stays readable on a phone", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");

  // The diagram used to be laid out wider than the screen, which silently
  // sliced the satellite cards off the left edge: the page reported no
  // horizontal overflow because the excess was clipped rather than scrollable.
  const diagram = await page.evaluate(() => {
    const rect = (selector: string) =>
      document.querySelector(selector)?.getBoundingClientRect() ?? null;
    const overlap = (a: DOMRect, b: DOMRect) => {
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      return x > 0 && y > 0 ? x * y : 0;
    };

    const satellites = Array.from(
      document.querySelectorAll(".capability, .signal-card"),
    ).map((element) => element.getBoundingClientRect());

    const coreParts = [".system-core strong", ".core-kicker", ".core-status"]
      .map(rect)
      .filter((part): part is DOMRect => part !== null);

    let collisions = 0;
    for (let i = 0; i < satellites.length; i += 1) {
      for (let j = i + 1; j < satellites.length; j += 1) {
        collisions += overlap(satellites[i], satellites[j]);
      }
    }

    return {
      satelliteCount: satellites.length,
      allSatellitesFit: satellites.every(
        (r) => r.left >= -1 && r.right <= window.innerWidth + 1,
      ),
      coreLabelsFound: coreParts.length,
      coreCoveredPx: coreParts.reduce(
        (total, part) =>
          total + satellites.reduce((sum, s) => sum + overlap(part, s), 0),
        0,
      ),
      collisionPx: collisions,
    };
  });

  expect(diagram.satelliteCount).toBe(5);
  expect(diagram.coreLabelsFound).toBe(3);
  expect(diagram.allSatellitesFit).toBe(true);
  // The core names the product; nothing may sit on top of it.
  expect(diagram.coreCoveredPx).toBe(0);
  expect(diagram.collisionPx).toBe(0);
});

test("contact form reports a successful submission without a real write", async ({
  page,
}) => {
  let submittedBody: Record<string, unknown> | undefined;
  await page.route("**/api/leads", async (route) => {
    submittedBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":true}' });
  });

  await page.goto("/#contact");
  await page.getByLabel("שם מלא *").fill("לקוח בדיקה");
  await page.getByLabel("שם העסק").fill("עסק בדיקה");
  await page.getByLabel("טלפון *").fill("050-1234567");
  await page.getByLabel("אימייל").fill("qa@example.com");
  await page.getByLabel("מה תרצו לבנות?").selectOption("crm");
  await page
    .getByLabel("כמה מילים על הפרויקט *")
    .fill("אני צריך מערכת לניהול לקוחות ותהליכי מכירה.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /שליחת הפרטים/ }).click();

  await expect(page.getByRole("status")).toContainText("הפרטים התקבלו");
  expect(submittedBody).toMatchObject({
    name: "לקוח בדיקה",
    service: "crm",
    consent: "accepted",
  });
});

/** The address is named several times in a policy; every one must be a link. */
async function expectEveryAddressIsAMailtoLink(page: Page) {
  const links = page.getByRole("link", { name: /nisan.sinai5@gmail.com/ });
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(links.nth(index)).toHaveAttribute(
      "href",
      "mailto:nisan.sinai5@gmail.com",
    );
  }
}

test("privacy page is reachable", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "מדיניות פרטיות" })).toBeVisible();
  await expectEveryAddressIsAMailtoLink(page);
});

test("serves Hebrew at the root and English at /en", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(
    page.getByRole("heading", { level: 1, name: /your business needs/i }),
  ).toBeVisible();
});

test("the language switch moves between the two locales", async ({ page }) => {
  await page.goto("/");
  await page.locator(".language-switch").click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.locator(".language-switch").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
});

test("both privacy pages are reachable and cross-linked", async ({ page }) => {
  await page.goto("/en/privacy");
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy policy" }),
  ).toBeVisible();
  await expectEveryAddressIsAMailtoLink(page);
});

test("the English page reads left to right without overflowing", async ({
  page,
}) => {
  await page.goto("/en");

  const layout = await page.evaluate(() => ({
    overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    // The tags sit at the reading start of each card, which flips with dir.
    // Measured on the first pill rather than the list: the list is in normal
    // flow now and spans the card so its tags can wrap.
    tagsStartAtReadingEdge: (() => {
      const card = document.querySelector(".service-card");
      const tag = card?.querySelector("li");
      if (!card || !tag) return false;
      const cardBox = card.getBoundingClientRect();
      const tagBox = tag.getBoundingClientRect();
      return tagBox.left - cardBox.left < cardBox.right - tagBox.right;
    })(),
  }));

  expect(layout.overflows).toBe(false);
  expect(layout.tagsStartAtReadingEdge).toBe(true);
});

test("every page carries what a crawler needs", async ({ page }) => {
  for (const [path, expectedCard] of [
    ["/", "/og.png"],
    ["/en", "/og-en.png"],
  ] as const) {
    await page.goto(path);

    const head = await page.evaluate(() => {
      const meta = (selector: string) =>
        document.querySelector(selector)?.getAttribute("content") ?? null;
      const structured = document.querySelector(
        'script[type="application/ld+json"]',
      );

      return {
        canonical: document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute("href"),
        alternates: Array.from(
          document.querySelectorAll('link[rel="alternate"][hreflang]'),
        ).map((link) => link.getAttribute("hreflang")),
        robots: meta('meta[name="robots"]'),
        googleBot: meta('meta[name="googlebot"]'),
        title: meta('meta[property="og:title"]'),
        description: meta('meta[name="description"]'),
        image: meta('meta[property="og:image"]'),
        twitterCard: meta('meta[name="twitter:card"]'),
        structured: structured?.textContent ?? null,
      };
    });

    // A page with no canonical competes with itself; one with no share card
    // posts as a bare link.
    expect(head.canonical).toBeTruthy();
    expect(head.description).toBeTruthy();
    expect(head.title).toBeTruthy();
    expect(head.alternates?.sort()).toEqual(["en", "he"]);
    expect(head.robots).toContain("index");
    expect(head.robots).not.toContain("noindex");
    expect(head.googleBot).toContain("max-image-preview:large");
    expect(head.image).toContain(expectedCard);
    expect(head.twitterCard).toBe("summary_large_image");

    const graph = JSON.parse(head.structured ?? "{}")["@graph"];
    expect(graph.map((node: { "@type": string }) => node["@type"])).toEqual([
      "ProfessionalService",
      "WebSite",
      "FAQPage",
    ]);
  }
});

test("the share cards and manifest are actually served", async ({ request }) => {
  for (const asset of ["/og.png", "/og-en.png", "/site.webmanifest", "/favicon.svg"]) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
  }
});

test("robots.txt invites crawlers and names the sitemap", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).not.toContain("Disallow: /\n");
  expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  // Both languages, both pages, cross-referenced.
  for (const path of [
    "/",
    "/en",
    "/privacy",
    "/en/privacy",
    "/accessibility",
    "/en/accessibility",
    "/blog",
    "/en/blog",
    "/blog/website-cost-israel",
    "/en/blog/website-cost-israel",
  ]) {
    expect(sitemap).toContain(`${path}<`.replace("/<", "/<"));
  }
  expect(sitemap).toContain("hreflang");
});

const ALL_PAGES = [
  "/",
  "/en",
  "/privacy",
  "/en/privacy",
  "/accessibility",
  "/en/accessibility",
  "/blog",
  "/en/blog",
  "/blog/website-cost-israel",
  "/en/blog/website-cost-israel",
] as const;

test("has no serious or critical automated accessibility violations", async ({
  page,
}) => {
  // Every page, not only the home page: a policy page nobody looks at is
  // exactly where a contrast or landmark regression survives unnoticed.
  for (const path of ALL_PAGES) {
    await page.goto(path);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        resultTypes: ["violations"],
      });
      return result.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );
    });

    expect(violations, path).toEqual([]);
  }
});

test("publishes an accessibility statement in both languages", async ({ page }) => {
  // Israeli service-accessibility regulations require a published statement
  // naming the standard claimed and a coordinator who can be reached.
  await page.goto("/accessibility");
  await expect(
    page.getByRole("heading", { level: 1, name: "הצהרת נגישות" }),
  ).toBeVisible();
  await expect(page.locator(".legal-page")).toContainText("5568");
  await expect(page.locator(".legal-page")).toContainText("רכז הנגישות");
  await expectEveryAddressIsAMailtoLink(page);

  await page.goto("/en/accessibility");
  await expect(
    page.getByRole("heading", { level: 1, name: "Accessibility statement" }),
  ).toBeVisible();
  await expect(page.locator(".legal-page")).toContainText("5568");
  await expect(page.locator(".legal-page")).toContainText("coordinator");
});

test("states in the privacy policy who holds the data and where it goes", async ({
  page,
}) => {
  await page.goto("/privacy");
  const body = page.locator(".legal-page");
  for (const phrase of ["בעל המאגר", "Supabase", "מחוץ לישראל", "זכות עיון"]) {
    await expect(body, phrase).toContainText(phrase);
  }

  await page.goto("/en/privacy");
  const english = page.locator(".legal-page");
  for (const phrase of ["controller", "Supabase", "outside Israel", "Access"]) {
    await expect(english, phrase).toContainText(phrase);
  }
});

test("reaches both policy pages from the footer of every page", async ({ page }) => {
  // A statement nobody can find is a statement nobody published.
  for (const path of ALL_PAGES) {
    await page.goto(path);
    const english = path.startsWith("/en");
    const footer = page.locator(".site-footer");
    await expect(footer, path).toBeVisible();
    await expect(
      footer.getByRole("link", { name: english ? "Accessibility" : "נגישות" }),
      path,
    ).toHaveAttribute("href", english ? "/en/accessibility" : "/accessibility");
    await expect(
      footer.getByRole("link", { name: english ? "Privacy" : "פרטיות" }),
      path,
    ).toHaveAttribute("href", english ? "/en/privacy" : "/privacy");
  }
});

test("warns before a link hands the reader to another site", async ({ page }) => {
  await page.goto("/");
  const external = page.locator('a[target="_blank"]');
  const count = await external.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    const link = external.nth(index);
    // The accessible name carries the warning; the arrow only serves the eye.
    expect(await link.evaluate((node) => node.textContent ?? "")).toContain(
      "נפתח בכרטיסייה חדשה",
    );
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }
});

test("marks Latin words inside the Hebrew page with their own language", async ({
  page,
}) => {
  // Unmarked, a screen reader reads "CRM" and "LD Event Design" with Hebrew
  // phonetics (WCAG 3.1.2). Scripts and hidden decoration do not count.
  await page.goto("/");

  const unmarked = await page.evaluate(() => {
    const found: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const text = node.textContent?.trim() ?? "";
      const parent = node.parentElement;
      const inScript = parent?.closest("script") !== null;

      if (text.length >= 3 && /[A-Za-z]{3}/.test(text) && !/[\u0590-\u05ff]/.test(text) && !inScript) {
        let element: HTMLElement | null = parent;
        let language: string | null = null;
        let hidden = false;
        while (element) {
          if (element.getAttribute("aria-hidden") === "true") hidden = true;
          if (element.lang && !language) language = element.lang;
          element = element.parentElement;
        }
        if (language !== "en" && !hidden) found.push(text.slice(0, 40));
      }
      node = walker.nextNode();
    }

    return found;
  });

  expect(unmarked).toEqual([]);
});

test("answers the price question in both languages", async ({ page }) => {
  // The one thing every visitor wants to know before they fill in a form.
  for (const [path, heading] of [
    ["/", "כמה זה עולה?"],
    ["/en", "What does it cost?"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    const cards = page.locator(".pricing-card");
    await expect(cards, path).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      await expect(cards.nth(index).locator(".pricing-figure strong")).toContainText("₪");
    }
    await expect(page.locator(".pricing-footnote")).toContainText("₪");
  }
});

test("offers WhatsApp alongside the form", async ({ page }) => {
  // Israeli small businesses answer on WhatsApp; a form and an inbox are a
  // higher bar than most visitors will clear.
  await page.goto("/");
  const link = page.locator('a[href^="https://wa.me/"]').first();
  await expect(link).toHaveAttribute("href", "https://wa.me/972587170978");
  await expect(link).toHaveAttribute("rel", /noreferrer/);
  expect(await link.evaluate((node) => node.textContent ?? "")).toContain(
    "נפתח בכרטיסייה חדשה",
  );
});

test("every page names itself in its share card", async ({ page }) => {
  // og:url used to point at the home page from every page, so sharing the
  // privacy policy previewed as the home page.
  for (const path of ["/", "/privacy", "/accessibility", "/en/privacy"] as const) {
    await page.goto(path);
    const meta = await page.evaluate(() => ({
      ogUrl: document
        .querySelector('meta[property="og:url"]')
        ?.getAttribute("content"),
      canonical: document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
      devTag: document.querySelector('meta[name="codex-preview"]'),
    }));
    expect(meta.ogUrl, path).toBe(meta.canonical);
    expect(meta.devTag, `${path} still ships the development marker`).toBeNull();
  }
});

test("the project preview keeps its size when the card is hovered", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile"), "hover is a pointer state");

  // A selector that lost its declaration block once merged into the rule below
  // it, which handed the preview a 38px bar height and collapsed the shot.
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();

  const preview = card.locator(".mock-browser");
  const before = await preview.boundingBox();
  await card.hover();
  await page.waitForTimeout(500);
  const after = await preview.boundingBox();

  expect(before?.height).toBeGreaterThan(100);
  expect(after?.height).toBeGreaterThan((before?.height ?? 0) * 0.9);
  expect(after?.width).toBeGreaterThan((before?.width ?? 0) * 0.9);
});

test("narrow screens reach every section through the menu", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  // The wide nav is display:none below 1250px. Everything it lists has to be
  // reachable from the button that replaces it.
  await page.goto("/");
  await expect(page.locator(".desktop-nav")).toBeHidden();

  const button = page.getByRole("button", { name: "פתיחת תפריט הניווט" });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "false");

  // Closed means closed: the links are not in the document, so they cannot be
  // tabbed into from behind the panel.
  expect(await page.locator(".mobile-menu-panel a").count()).toBe(0);

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");

  const links = page.locator(".mobile-menu-panel a");
  const wide = page.locator(".desktop-nav a");
  expect(await links.allTextContents()).toEqual(
    await wide.allTextContents(),
  );

  // The button says which element it controls, and that element exists: an
  // aria-controls pointing at nothing is worse than none at all.
  const controls = await button.getAttribute("aria-controls");
  expect(controls).toBeTruthy();
  const pointsAtThePanel = await page.evaluate((id) => {
    const target = document.getElementById(id ?? "");
    return Boolean(target?.classList.contains("mobile-menu-panel"));
  }, controls);
  expect(pointsAtThePanel).toBe(true);
});

test("the menu opens to the first link and Escape gives focus back", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");
  const button = page.getByRole("button", { name: "פתיחת תפריט הניווט" });
  await button.click();

  // Opening moves focus into the panel, or a keyboard reader has to tab back
  // through the whole header to reach it.
  await expect(page.locator(".mobile-menu-panel a").first()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-menu-panel")).toHaveCount(0);
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("tabbing stays inside the open menu", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");
  await page.getByRole("button", { name: "פתיחת תפריט הניווט" }).click();

  const count = await page.locator(".mobile-menu-panel a").count();
  // One full cycle plus one: focus must land back on the first link rather
  // than escaping to the page behind the panel.
  for (let index = 0; index < count; index += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(page.locator(".mobile-menu-panel a").first()).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".mobile-menu-panel a").last()).toBeFocused();
});

test("choosing a link closes the menu and moves the page", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");
  await page.getByRole("button", { name: "פתיחת תפריט הניווט" }).click();
  await page.locator('.mobile-menu-panel a[href="#pricing"]').click();

  await expect(page.locator(".mobile-menu-panel")).toHaveCount(0);
  await page.waitForTimeout(800);

  const clearance = await page.evaluate(() => {
    const section = document.getElementById("pricing");
    const header = document.querySelector(".site-header");
    if (!section || !header) return null;
    return (
      section.getBoundingClientRect().top -
      header.getBoundingClientRect().bottom
    );
  });
  expect(clearance).toBeGreaterThanOrEqual(0);
});

test("an open menu does not let the page behind it scroll", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));

  await page.goto("/");
  await page.getByRole("button", { name: "פתיחת תפריט הניווט" }).click();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).toBe("hidden");

  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe("hidden");
});

test("the wide layout keeps its nav and hides the button", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile"));

  await page.goto("/");
  await expect(page.locator(".desktop-nav")).toBeVisible();
  await expect(page.locator(".mobile-menu")).toBeHidden();

  const labels = await page.locator(".desktop-nav a").allTextContents();
  expect(labels).toEqual([
    "שירותים",
    "פרויקטים",
    "איך זה עובד",
    "מחירים",
    "שאלות נפוצות",
    "בלוג",
    "אודות",
  ]);
});

test("the FAQ answers open and close without script of ours", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.locator(".faq-item").first();
  const answer = first.locator("p");

  await expect(answer).toBeHidden();
  await first.locator("summary").click();
  await expect(answer).toBeVisible();
  await first.locator("summary").click();
  await expect(answer).toBeHidden();
});

test("the FAQ the page shows is the FAQ it publishes to search", async ({
  page,
}) => {
  await page.goto("/");

  const match = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    const graph = JSON.parse(script?.textContent ?? "{}")["@graph"] ?? [];
    const faq = graph.find(
      (node: { "@type": string }) => node["@type"] === "FAQPage",
    );
    const asked = Array.from(document.querySelectorAll(".faq-item summary span"))
      .map((node) => node.textContent?.trim());
    return {
      published: (faq?.mainEntity ?? []).map(
        (entry: { name: string }) => entry.name,
      ),
      asked,
    };
  });

  expect(match.published.length).toBeGreaterThan(0);
  expect(match.published).toEqual(match.asked);
});

test("every blog card reaches a post that renders", async ({ page }) => {
  await page.goto("/");

  const hrefs = await page
    .locator(".blog-section .post-card h3 a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    await page.goto(href ?? "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("time")).toHaveCount(1);
  }
});

test("the whole blog card is clickable, not only the title", async ({
  page,
}) => {
  // The "read" line under each card looked like a control and did nothing,
  // because it was decoration next to the real link rather than part of it.
  await page.goto("/");

  const card = page.locator(".blog-section .post-card").first();
  await card.scrollIntoViewIfNeeded();
  const target = await card.locator("h3 a").getAttribute("href");
  expect(target).toBeTruthy();

  const more = await card.locator(".post-more").boundingBox();
  expect(more).not.toBeNull();
  await page.mouse.click(
    more!.x + more!.width / 2,
    more!.y + more!.height / 2,
  );

  await page.waitForURL(`**${target}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("each card still offers exactly one link to its post", async ({ page }) => {
  // Stretching the title's link over the card is what makes the whole surface
  // clickable; adding a second anchor would make a screen reader read every
  // post twice.
  await page.goto("/");

  const perCard = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".blog-section .post-card")).map(
      (card) => card.querySelectorAll("a[href]").length,
    ),
  );

  expect(perCard.length).toBeGreaterThan(0);
  expect(perCard.every((count) => count === 1)).toBe(true);
});

test("a project preview is not cut through a line of text", async ({ page }) => {
  // The img dimensions and the capture height are declared in two places; if
  // they drift the card jumps as the image loads.
  await page.goto("/");
  await page.locator(".mock-shot").last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll<HTMLImageElement>(".mock-shot")).every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );

  const shots = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLImageElement>(".mock-shot")).map(
      (img) => ({
        src: img.getAttribute("src"),
        declared: `${img.getAttribute("width")}x${img.getAttribute("height")}`,
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        ratioDeclared:
          Number(img.getAttribute("width")) / Number(img.getAttribute("height")),
        ratioNatural: img.naturalWidth / img.naturalHeight,
      }),
    ),
  );

  expect(shots.length).toBe(3);
  for (const shot of shots) {
    expect(
      Math.abs(shot.ratioDeclared - shot.ratioNatural),
      `${shot.src}: declared ${shot.declared}, file is ${shot.natural}`,
    ).toBeLessThan(0.01);
  }
});

test("the blog index lists the same posts in both languages", async ({
  page,
}) => {
  const titles = async (path: string) => {
    await page.goto(path);
    return page.locator(".post-list .post-card h2 a").count();
  };

  const hebrew = await titles("/blog");
  const english = await titles("/en/blog");
  expect(hebrew).toBeGreaterThan(0);
  expect(english).toBe(hebrew);
});

test("a post that does not exist is a 404, not a blank page", async ({
  page,
}) => {
  const response = await page.goto("/blog/no-such-post");
  expect(response?.status()).toBe(404);
});

declare global {
  interface Window {
    axe: typeof import("axe-core");
  }
}
