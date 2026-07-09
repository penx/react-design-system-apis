import { test, expect } from "../../helpers/fixture";

test.describe("nested native popover modals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/modal-nested");
  });

  const outer = (page: import("../../helpers/fixture").Page) =>
    page.locator("#ssr-outer");
  const inner = (page: import("../../helpers/fixture").Page) =>
    page.locator("#ssr-inner");

  test("opening the inner modal keeps the outer one open", async ({ page }) => {
    await page.locator('[data-testid="ssr-outer-open"]').click();
    await expect(outer(page)).toBeVisible();
    await page.locator('[data-testid="ssr-inner-open"]').click();
    await expect(inner(page)).toBeVisible();
    await expect(outer(page)).toBeVisible();
  });

  test("closing the inner modal leaves the outer open", async ({ page }) => {
    await page.locator('[data-testid="ssr-outer-open"]').click();
    await page.locator('[data-testid="ssr-inner-open"]').click();
    await expect(inner(page)).toBeVisible();
    await page.locator('[data-testid="ssr-inner-done"]').click();
    await expect(inner(page)).toBeHidden();
    await expect(outer(page)).toBeVisible();
  });

  test("Escape closes the top-most (inner) first, then the outer", async ({
    page,
  }) => {
    await page.locator('[data-testid="ssr-outer-open"]').click();
    await page.locator('[data-testid="ssr-inner-open"]').click();
    await expect(inner(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(inner(page)).toBeHidden();
    await expect(outer(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(outer(page)).toBeHidden();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("nested modals open without JS", async ({ page }) => {
    await page.goto("/test/modal-nested");
    await page.locator('[data-testid="ssr-outer-open"]').click();
    await expect(page.locator("#ssr-outer")).toBeVisible();
    await page.locator('[data-testid="ssr-inner-open"]').click();
    await expect(page.locator("#ssr-inner")).toBeVisible();
    await expect(page.locator("#ssr-outer")).toBeVisible();
  });
});
