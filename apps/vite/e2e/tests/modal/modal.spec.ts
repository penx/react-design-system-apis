import { test, expect } from "../../helpers/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const dialog = (page: import("../../helpers/fixture").Page) =>
  page.locator('[data-testid="modal"] dialog');

test("trigger opens the dialog", async ({ page }) => {
  await expect(dialog(page)).toBeHidden();
  await page.locator('[data-testid="open"]').click();
  await expect(dialog(page)).toBeVisible();
});

test("the Done button closes it", async ({ page }) => {
  await page.locator('[data-testid="open"]').click();
  await expect(dialog(page)).toBeVisible();
  await page.locator('[data-testid="done"]').click();
  await expect(dialog(page)).toBeHidden();
});

test("Escape closes it", async ({ page }) => {
  await page.locator('[data-testid="open"]').click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
});

test("has an accessible name", async ({ page }) => {
  await expect(dialog(page)).toHaveAttribute("aria-labelledby", /.+/);
  await page.locator('[data-testid="open"]').click();
  await expect(
    dialog(page).getByRole("heading", { name: "Account settings" }),
  ).toBeVisible();
});
