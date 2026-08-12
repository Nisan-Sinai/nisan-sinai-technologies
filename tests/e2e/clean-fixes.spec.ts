import { expect, test } from "@playwright/test";

test("only intended strips animate horizontally", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.locator(".marquee-track")).toHaveCount(2);
  await expect(page.locator(".marquee-group")).toHaveCount(4);

  const motion = await page.evaluate(() => {
    const serviceTrack = document.querySelector<HTMLElement>(
      ".services-intro .marquee-track",
    );
    const techTrack = document.querySelector<HTMLElement>(
      ".tech-strip .marquee-track",
    );
    const fixedSections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, .hero, .content-section, .contact-section",
      ),
    );

    return {
      serviceAnimation: serviceTrack
        ? getComputedStyle(serviceTrack).animationName
        : "",
      techAnimation: techTrack ? getComputedStyle(techTrack).animationName : "",
      fixedTransforms: fixedSections.map(
        (section) => getComputedStyle(section).transform,
      ),
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });

  if (testInfo.project.name.startsWith("mobile")) {
    expect(motion.serviceAnimation).toBe("none");
    expect(motion.techAnimation).toBe("marquee-right");
  } else {
    expect(motion.serviceAnimation).toBe("marquee-right");
    expect(motion.techAnimation).toBe("marquee-right");
  }

  expect(motion.fixedTransforms.every((value) => value === "none")).toBe(true);
  expect(motion.overflows).toBe(false);
});

test("mobile services strip is static and fits on one line", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));
  await page.goto("/");

  const result = await page.evaluate(() => {
    const strip = document.querySelector<HTMLElement>(".services-intro");
    const track = strip?.querySelector<HTMLElement>(".marquee-track");
    const primaryGroup = strip?.querySelector<HTMLElement>(
      ".marquee-group:not([aria-hidden='true'])",
    );
    const duplicateGroup = strip?.querySelector<HTMLElement>(
      ".marquee-group[aria-hidden='true']",
    );
    const items = primaryGroup
      ? Array.from(primaryGroup.querySelectorAll<HTMLElement>(".marquee-item"))
      : [];

    const groupRect = primaryGroup?.getBoundingClientRect();
    const stripRect = strip?.getBoundingClientRect();

    return {
      animation: track ? getComputedStyle(track).animationName : "",
      transform: track ? getComputedStyle(track).transform : "",
      duplicateDisplay: duplicateGroup
        ? getComputedStyle(duplicateGroup).display
        : "",
      itemCount: items.length,
      oneLine: items.every((item) => {
        const rect = item.getBoundingClientRect();
        return groupRect ? rect.top >= groupRect.top && rect.bottom <= groupRect.bottom : false;
      }),
      fitsWidth:
        Boolean(groupRect && stripRect) &&
        groupRect!.left >= stripRect!.left - 1 &&
        groupRect!.right <= stripRect!.right + 1,
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });

  expect(result.animation).toBe("none");
  expect(result.transform).toBe("none");
  expect(result.duplicateDisplay).toBe("none");
  expect(result.itemCount).toBe(4);
  expect(result.oneLine).toBe(true);
  expect(result.fitsWidth).toBe(true);
  expect(result.overflows).toBe(false);
});

test("mobile business core has visible clearance from satellite cards", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));
  await page.goto("/");

  const result = await page.evaluate(() => {
    const core = document.querySelector(".system-core")?.getBoundingClientRect();
    const satellites = Array.from(
      document.querySelectorAll(".capability, .signal-card"),
    ).map((element) => element.getBoundingClientRect());

    if (!core) return { found: false, covered: true, minClearance: 0 };

    let covered = false;
    let minClearance = Number.POSITIVE_INFINITY;

    satellites.forEach((satellite) => {
      const overlapX =
        Math.min(core.right, satellite.right) - Math.max(core.left, satellite.left);
      const overlapY =
        Math.min(core.bottom, satellite.bottom) - Math.max(core.top, satellite.top);

      if (overlapX > 0 && overlapY > 0) {
        covered = true;
      }

      const horizontalGap = Math.max(
        satellite.left - core.right,
        core.left - satellite.right,
        0,
      );
      const verticalGap = Math.max(
        satellite.top - core.bottom,
        core.top - satellite.bottom,
        0,
      );
      const clearance = Math.hypot(horizontalGap, verticalGap);
      minClearance = Math.min(minClearance, clearance);
    });

    return { found: true, covered, minClearance };
  });

  expect(result.found).toBe(true);
  expect(result.covered).toBe(false);
  expect(result.minClearance).toBeGreaterThanOrEqual(12);
});

test("mobile footer links stay separated and tappable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));
  await page.goto("/");

  const result = await page.evaluate(() => {
    const nav = document.querySelector<HTMLElement>(".site-footer > nav");
    const links = Array.from(
      document.querySelectorAll<HTMLElement>(".site-footer > nav a"),
    );
    const rects = links.map((link) => link.getBoundingClientRect());

    const overlapping = rects.some((rect, index) =>
      rects.slice(index + 1).some((other) => {
        const overlapX = Math.min(rect.right, other.right) - Math.max(rect.left, other.left);
        const overlapY = Math.min(rect.bottom, other.bottom) - Math.max(rect.top, other.top);
        return overlapX > 0 && overlapY > 0;
      }),
    );

    // A link that leaves the site carries a visually hidden "opens in a new
    // tab" hint, which innerText picks up. The label under test is what a
    // sighted reader sees, so the hint is stripped rather than asserted away.
    const visibleLabel = (link: HTMLElement) => {
      const copy = link.cloneNode(true) as HTMLElement;
      copy.querySelectorAll(".visually-hidden").forEach((node) => node.remove());
      return (copy.textContent ?? "").trim();
    };

    return {
      display: nav ? getComputedStyle(nav).display : "",
      count: links.length,
      labels: links.map(visibleLabel),
      minHeight: Math.min(...rects.map((rect) => rect.height)),
      overlapping,
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });

  expect(result.display).toBe("grid");
  expect(result.count).toBe(6);
  expect(result.labels).toEqual([
    "אימייל",
    "טלפון",
    "LinkedIn",
    "פרטיות",
    "נגישות",
    "כניסה לניהול",
  ]);
  expect(result.minHeight).toBeGreaterThanOrEqual(44);
  expect(result.overlapping).toBe(false);
  expect(result.overflows).toBe(false);
});

test("public site exposes a clear admin entry button", async ({ page }) => {
  await page.goto("/");
  const adminLink = page.getByRole("link", { name: "כניסה לניהול" });
  await expect(adminLink).toBeVisible();
  await expect(adminLink).toHaveAttribute("href", "/admin");
});

test("admin page supports multiple admins without exposing a fixed email", async ({ page }) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { level: 1, name: "כניסה לניהול" }),
  ).toBeVisible();

  const email = page.getByLabel("אימייל");
  await expect(email).toBeVisible();
  await expect(email).toHaveValue("");
  await expect(email).not.toHaveAttribute("readonly", "");

  await expect(page.getByLabel("סיסמה")).toBeVisible();
  await expect(page.getByRole("button", { name: "כניסה עם סיסמה" })).toBeVisible();
  await expect(page.getByRole("button", { name: "שכחתי סיסמה" })).toBeVisible();
  await expect(page.getByRole("button", { name: "התחברות עם Google" })).toBeVisible();

  await expect(page.getByText("nisan.sinai5@gmail.com", { exact: false })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "כניסה ראשונה / קישור למייל" }),
  ).toHaveCount(0);
  await expect(page.locator(".admin-provider-note")).toHaveCount(0);

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
