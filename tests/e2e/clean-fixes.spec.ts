import { expect, test } from "@playwright/test";

test("only intended strips animate horizontally", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".marquee-track")).toHaveCount(2);
  await expect(page.locator(".marquee-group")).toHaveCount(8);

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

  // Both strips move, at every width. The services strip used to be frozen and
  // stripped of its lead line on phones while the one below it kept scrolling,
  // which read as a bug rather than a decision.
  expect(motion.serviceAnimation).toBe("marquee-right");
  expect(motion.techAnimation).toBe("marquee-right");

  expect(motion.fixedTransforms.every((value) => value === "none")).toBe(true);
  expect(motion.overflows).toBe(false);
});

test("the services strip reads the same on a phone as on a desktop", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"));
  await page.goto("/");

  const result = await page.evaluate(() => {
    const strip = document.querySelector<HTMLElement>(".services-intro");
    const track = strip?.querySelector<HTMLElement>(".marquee-track");
    const groups = Array.from(
      strip?.querySelectorAll<HTMLElement>(".marquee-group") ?? [],
    );
    const lead = strip?.querySelector<HTMLElement>(
      ".marquee-group > span:first-child",
    );
    const items = strip
      ? Array.from(strip.querySelectorAll<HTMLElement>(".marquee-item"))
      : [];

    return {
      animation: track ? getComputedStyle(track).animationName : "",
      // The duplicate group is what makes the loop seamless; hiding it on
      // phones left a gap on every pass.
      duplicateShown:
        groups.length > 1 ? getComputedStyle(groups[1]).display !== "none" : false,
      leadShown: lead ? getComputedStyle(lead).display !== "none" : false,
      leadText: lead?.textContent?.trim() ?? "",
      itemCount: items.length,
      // The section clips its own overflow; the document must not scroll.
      stripClips: strip ? getComputedStyle(strip).overflow : "",
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });

  expect(result.animation).toBe("marquee-right");
  expect(result.duplicateShown).toBe(true);
  expect(result.leadShown).toBe(true);
  expect(result.leadText).not.toBe("");
  expect(result.itemCount).toBe(16);
  expect(result.stripClips).toBe("hidden");
  expect(result.overflows).toBe(false);
});

test("the strips loop without running dry or jumping", async ({ page }) => {
  // Two separate faults, so two separate invariants.
  //
  // The strip was hung from the right edge of an RTL block, so a track wider
  // than the screen started fully off to the left: the strip was empty for most
  // of every pass and the words slid in from nowhere. That is the coverage
  // check — some part of the track has to fill the strip at every instant.
  //
  // Separately, the loop only reads as continuous if one pass travels exactly
  // one copy of the run. Travel further and the content teleports at the seam,
  // which still leaves the strip full, so coverage alone does not catch it.
  await page.goto("/");

  const result = await page.evaluate(() => {
    const readStrip = (selector: string) => {
      const strip = document.querySelector(selector);
      const track = strip?.querySelector<HTMLElement>(".marquee-track");
      const groups = strip?.querySelectorAll(".marquee-group");
      if (!strip || !track || !groups?.length) return null;

      const stripBox = strip.getBoundingClientRect();
      const groupWidth = groups[0].getBoundingClientRect().width;
      const animations = track.getAnimations();
      const duration = Number(animations[0]?.effect?.getTiming()?.duration ?? 0);

      const offsetAt = (time: number) => {
        for (const animation of animations) {
          animation.pause();
          animation.currentTime = time;
        }
        return track.getBoundingClientRect().left;
      };

      let leastCovered = 100;
      for (let step = 0; step <= 40; step += 1) {
        offsetAt((step / 40) * duration * 0.9999);
        const trackBox = track.getBoundingClientRect();
        const covered =
          Math.max(
            0,
            Math.min(stripBox.right, trackBox.right) -
              Math.max(stripBox.left, trackBox.left),
          ) / stripBox.width;
        leastCovered = Math.min(leastCovered, Math.round(covered * 100));
      }

      const travel = offsetAt(duration * 0.9999) - offsetAt(0);
      for (const animation of animations) animation.play();

      return {
        leastCovered,
        travelInGroups: travel / groupWidth,
        groupCount: groups.length,
      };
    };

    return {
      services: readStrip(".services-intro"),
      tech: readStrip(".tech-strip"),
    };
  });

  for (const [name, strip] of Object.entries(result)) {
    expect(strip, name).not.toBeNull();
    expect(strip!.leastCovered, `${name} runs dry mid-cycle`).toBe(100);
    expect(
      Math.abs(strip!.travelInGroups - 1),
      `${name} travels ${strip!.travelInGroups.toFixed(2)} copies per pass, not 1`,
    ).toBeLessThan(0.02);
  }
});

test("no service card prints its tags over its own description", async ({
  page,
}) => {
  // The tags were pinned with position:absolute, so the card with the longest
  // copy laid them across its own last line.
  await page.goto("/");

  const gaps = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".service-card")).map((card, index) => {
      const copy = card.querySelector("p");
      const tag = card.querySelector("li");
      if (!copy || !tag) return { index, gap: Number.NaN };
      return {
        index,
        gap: Math.round(
          tag.getBoundingClientRect().top - copy.getBoundingClientRect().bottom,
        ),
      };
    }),
  );

  expect(gaps.length).toBeGreaterThan(0);
  for (const { index, gap } of gaps) {
    expect(gap, `service card ${index + 1} overlaps its copy`).toBeGreaterThan(0);
  }
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
  expect(result.count).toBe(7);
  expect(result.labels).toEqual([
    "אימייל",
    "טלפון",
    "וואטסאפ",
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
