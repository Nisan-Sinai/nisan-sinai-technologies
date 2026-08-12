import { expect, test } from "@playwright/test";

test("admin route stays private and fits the viewport", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "כניסה לניהול" })).toBeVisible();
  await expect(page.getByLabel("אימייל מנהל")).toHaveValue("nisan.sinai5@gmail.com");
  await expect(page.getByText("כל המתעניינים וההודעות")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("business core is clear of the first moving strip", async ({ page }) => {
  await page.goto("/");

  const core = await page.locator(".system-core").boundingBox();
  const strip = await page.locator(".services-intro").boundingBox();
  expect(core).not.toBeNull();
  expect(strip).not.toBeNull();

  if (core && strip) {
    expect(core.y + core.height).toBeLessThan(strip.y);
  }

  await expect(page.locator(".services-intro .marquee-track")).toHaveCSS(
    "animation-name",
    "marquee-right",
  );
  await expect(page.locator(".tech-strip .marquee-track")).toHaveCSS(
    "animation-name",
    "marquee-right",
  );
});
