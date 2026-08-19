import { expect, test } from "@playwright/test";

test("accessibility menu applies, persists, and resets preferences", async ({ page }) => {
  await page.goto("/");

  const root = page.locator("html");
  const trigger = page.getByRole("button", { name: "פתיחת תפריט נגישות" });
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const panel = page.getByRole("dialog", { name: "כלי נגישות" });
  await expect(panel).toBeVisible();

  const largerText = panel.getByRole("button", { name: "הגדלת טקסט" });
  const reduceMotion = panel.getByRole("button", { name: "הפחתת תנועה" });

  await largerText.click();
  await reduceMotion.click();

  await expect(largerText).toHaveAttribute("aria-pressed", "true");
  await expect(reduceMotion).toHaveAttribute("aria-pressed", "true");
  await expect(root).toHaveAttribute("data-a11y-large-text", "true");
  await expect(root).toHaveAttribute("data-a11y-reduce-motion", "true");

  await page.reload();
  await expect(root).toHaveAttribute("data-a11y-large-text", "true");
  await expect(root).toHaveAttribute("data-a11y-reduce-motion", "true");

  await page.getByRole("button", { name: "פתיחת תפריט נגישות" }).click();
  const reopenedPanel = page.getByRole("dialog", { name: "כלי נגישות" });
  await reopenedPanel.getByRole("button", { name: "איפוס הגדרות" }).click();

  await expect(root).not.toHaveAttribute("data-a11y-large-text", "true");
  await expect(root).not.toHaveAttribute("data-a11y-reduce-motion", "true");
});

test("accessibility controls fit the viewport and close with Escape", async ({ page }) => {
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "פתיחת תפריט נגישות" });
  await trigger.click();

  const panel = page.getByRole("dialog", { name: "כלי נגישות" });
  await expect(panel).toBeVisible();

  const geometry = await page.evaluate(() => {
    const button = document.querySelector('button[aria-controls="accessibility-tools"]');
    const dialog = document.getElementById("accessibility-tools");
    if (!button || !dialog) return null;

    const buttonRect = button.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    return {
      buttonWidth: buttonRect.width,
      buttonHeight: buttonRect.height,
      dialogLeft: dialogRect.left,
      dialogRight: dialogRect.right,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry?.buttonWidth).toBeGreaterThanOrEqual(44);
  expect(geometry?.buttonHeight).toBeGreaterThanOrEqual(44);
  expect(geometry?.dialogLeft).toBeGreaterThanOrEqual(-1);
  expect(geometry?.dialogRight).toBeLessThanOrEqual((geometry?.viewportWidth ?? 0) + 1);

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
});
