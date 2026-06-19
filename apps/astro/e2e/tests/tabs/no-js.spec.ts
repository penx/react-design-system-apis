import { test, expect } from "../../helpers/fixture";

// No JavaScript at all: only the SSR radio-group fallback exists.
test.use({ javaScriptEnabled: false });

test.beforeEach(async ({ page }) => {
  await page.goto("/test/hydrated");
});

test("shows exactly one panel - the checked radio's", async ({ page }) => {
  const demo = page.locator('[data-testid="demo-h"]');
  await expect(
    demo.locator('[data-tabs-content][data-value="account"]'),
  ).toBeVisible();
  await expect(
    demo.locator('[data-tabs-content][data-value="documents"]'),
  ).toBeHidden();
  await expect(
    demo.locator('[data-tabs-content][data-value="settings"]'),
  ).toBeHidden();
});

test("the initially visible panel is the default", async ({ page }) => {
  await expect(page.locator("#h-account")).toBeChecked();
});

test("selecting a tab switches the panel without touching the URL", async ({
  page,
}) => {
  const url = page.url();
  await page.locator('[data-testid="demo-h"] label[for="h-documents"]').click();
  const demo = page.locator('[data-testid="demo-h"]');
  await expect(
    demo.locator('[data-tabs-content][data-value="documents"]'),
  ).toBeVisible();
  await expect(
    demo.locator('[data-tabs-content][data-value="account"]'),
  ).toBeHidden();
  expect(page.url()).toBe(url);
});

test("exposes no tablist roles before upgrade", async ({ page }) => {
  await expect(page.locator('[role="tablist"]')).toHaveCount(0);
});

test("radios are excluded from form submission (null form owner)", async ({
  page,
}) => {
  await expect(page.locator("#h-account")).toHaveAttribute("form", "h-none");
  await expect(page.locator("form#h-none")).toHaveCount(0);
});

test("instances use distinct radio-group names (no cross-talk)", async ({
  page,
}) => {
  await expect(
    page.locator('[data-testid="demo-h"] input[type="radio"]').first(),
  ).toHaveAttribute("name", "h");
  await expect(
    page.locator('[data-testid="demo-v"] input[type="radio"]').first(),
  ).toHaveAttribute("name", "v");
});
