import { test, expect } from "../../helpers/fixture";

// Controlled modal: `open` is React state, `onOpenChange` mirrors the native
// toggle (user + programmatic).
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const dialog = (page: import("../../helpers/fixture").Page) =>
  page.locator('[data-testid="cmodal"] dialog');

test("starts closed; the in-modal trigger opens it and syncs state", async ({
  page,
}) => {
  await expect(page.locator('[data-testid="cmodal-state"]')).toHaveText(
    "false",
  );
  await expect(dialog(page)).toBeHidden();
  await page.locator('[data-testid="cmodal-trigger"]').click();
  await expect(dialog(page)).toBeVisible();
  // onOpenChange (native toggle) drove React state to open.
  await expect(page.locator('[data-testid="cmodal-state"]')).toHaveText("true");
});

test("an external button opens it programmatically (open prop drives it)", async ({
  page,
}) => {
  await page.locator('[data-testid="cmodal-ext-open"]').click();
  await expect(dialog(page)).toBeVisible();
  await expect(page.locator('[data-testid="cmodal-state"]')).toHaveText("true");
});

test("Escape closes it and reports back through onOpenChange", async ({
  page,
}) => {
  await page.locator('[data-testid="cmodal-trigger"]').click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(page.locator('[data-testid="cmodal-state"]')).toHaveText(
    "false",
  );
});
