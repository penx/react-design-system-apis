import { test, expect } from "../../helpers/fixture";

test.describe("native popover modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/modal");
  });

  test("trigger opens the dialog (un-hydrated SSR instance)", async ({
    page,
  }) => {
    await expect(page.locator("#ssr")).toBeHidden();
    await page.locator('[data-testid="ssr-open"]').click();
    await expect(page.locator("#ssr")).toBeVisible();
  });

  test("the X and Done buttons close it", async ({ page }) => {
    const dialog = page.locator("#ssr");
    await page.locator('[data-testid="ssr-open"]').click();
    await expect(dialog).toBeVisible();
    await page.locator('[data-testid="ssr-x"]').click();
    await expect(dialog).toBeHidden();

    await page.locator('[data-testid="ssr-open"]').click();
    await expect(dialog).toBeVisible();
    await page.locator('[data-testid="ssr-done"]').click();
    await expect(dialog).toBeHidden();
  });

  test("Escape closes it (native)", async ({ page }) => {
    await page.locator('[data-testid="ssr-open"]').click();
    await expect(page.locator("#ssr")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#ssr")).toBeHidden();
  });

  test("outside click light-dismisses it (native)", async ({ page }) => {
    await page.locator('[data-testid="ssr-open"]').click();
    await expect(page.locator("#ssr")).toBeVisible();
    await page.mouse.click(3, 3); // top-left corner, outside the centered dialog
    await expect(page.locator("#ssr")).toBeHidden();
  });

  test("has an accessible name and a labelled close button", async ({
    page,
  }) => {
    const dialog = page.locator("#ssr");
    await expect(dialog).toHaveAttribute("aria-labelledby", "ssr-title");
    await expect(page.locator("#ssr-title")).toHaveText("Account settings");
    await expect(page.locator('[data-testid="ssr-x"]')).toHaveAttribute(
      "aria-label",
      "Close",
    );
  });

  test("the hydrated instance also opens and closes", async ({ page }) => {
    await expect(page.locator('[data-testid="modal-hyd"]')).toHaveAttribute(
      "data-hydrated",
      "true",
    );
    await page.locator('[data-testid="hyd-open"]').click();
    await expect(page.locator("#hyd")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#hyd")).toBeHidden();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the trigger still opens the dialog", async ({ page }) => {
    await page.goto("/test/modal");
    await expect(page.locator("#ssr")).toBeHidden();
    await page.locator('[data-testid="ssr-open"]').click();
    await expect(page.locator("#ssr")).toBeVisible();
  });
});
