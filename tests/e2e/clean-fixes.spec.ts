import { expect, test } from "@playwright/test";

test("only the two text strips animate horizontally", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".marquee-track")).toHaveCount(2);
  await expect(page.locator(".marquee-group")).toHaveCount(4);

  const motion = await page.evaluate(() => {
    const tracks = Array.from(document.querySelectorAll<HTMLElement>(".marquee-track"));
    const fixedSections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, .hero, .content-section, .contact-section",
      ),
    );

    return {
      trackAnimations: tracks.map(
        (track) => getComputedStyle(track).animationName,
      ),
      fixedTransforms: fixedSections.map(
        (section) => getComputedStyle(section).transform,
      ),
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });

  expect(motion.trackAnimations).toEqual(["marquee-right", "marquee-right"]);
  expect(motion.fixedTransforms.every((value) => value === "none")).toBe(true);
  expect(motion.overflows).toBe(false);
});

test("mobile business core is not covered by satellite cards", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));
  await page.goto("/");

  const result = await page.evaluate(() => {
    const core = document.querySelector(".system-core")?.getBoundingClientRect();
    const satellites = Array.from(
      document.querySelectorAll(".capability, .signal-card"),
    ).map((element) => element.getBoundingClientRect());

    if (!core) return { found: false, covered: true };

    const covered = satellites.some((satellite) => {
      const x = Math.min(core.right, satellite.right) - Math.max(core.left, satellite.left);
      const y = Math.min(core.bottom, satellite.bottom) - Math.max(core.top, satellite.top);
      return x > 0 && y > 0;
    });

    return { found: true, covered };
  });

  expect(result.found).toBe(true);
  expect(result.covered).toBe(false);
});

test("admin page is private before authentication", async ({ page }) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { level: 1, name: "כניסה לניהול" }),
  ).toBeVisible();
  await expect(page.getByLabel("אימייל מנהל")).toHaveValue(
    "nisan.sinai5@gmail.com",
  );
  await expect(page.locator(".admin-lead-card")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  expect(overflows).toBe(false);
});
