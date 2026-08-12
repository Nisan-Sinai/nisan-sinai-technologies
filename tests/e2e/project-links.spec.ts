import { expect, test } from "@playwright/test";

test("LD Event Design card uses the live site link and polished Hebrew copy", async ({
  page,
}) => {
  await page.goto("/#projects");

  const card = page.locator(".project-ld");
  const link = card.locator("a.case-study-label");

  await expect(card).toContainText("אתר ומערכת הזמנות ל־LD Event Design");
  await expect(link).toContainText("לאתר הפעיל");
  await expect(link).toHaveAttribute(
    "href",
    "https://ld-event-design.vercel.app/",
  );
});

test("LD Event Design card keeps the live link in English", async ({ page }) => {
  await page.goto("/en/#projects");

  const card = page.locator(".project-ld");
  const link = card.locator("a.case-study-label");

  await expect(card).toContainText("Website and ordering system for LD Event Design");
  await expect(link).toContainText("Live site");
  await expect(link).toHaveAttribute(
    "href",
    "https://ld-event-design.vercel.app/",
  );
});
