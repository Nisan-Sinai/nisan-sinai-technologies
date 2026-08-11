import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

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

test("privacy page is reachable", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "מדיניות פרטיות" })).toBeVisible();
  await expect(page.getByRole("link", { name: /nisan.sinai5@gmail.com/ })).toHaveAttribute(
    "href",
    "mailto:nisan.sinai5@gmail.com",
  );
});

test("has no serious or critical automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      resultTypes: ["violations"],
    });
    return result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
  });

  expect(violations).toEqual([]);
});

declare global {
  interface Window {
    axe: typeof import("axe-core");
  }
}
