import { test, expect } from "../../helpers/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('[data-testid="uncontrolled"] [role="tablist"]'),
  ).toBeVisible();
});

test("upgrades to a tablist with no define script", async ({ page }) => {
  await expect(page.locator("ds-tabs").first()).toBeVisible();
  const d = page.locator('[data-testid="uncontrolled"]');
  await expect(d.getByRole("tab")).toHaveCount(3);
  await expect(d.getByRole("tabpanel")).toHaveCount(1);
  await expect(d.getByRole("tab", { name: "Account" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("roving tabindex: active tab is 0, the rest -1", async ({ page }) => {
  const d = page.locator('[data-testid="uncontrolled"]');
  await expect(d.getByRole("tab", { name: "Account" })).toHaveAttribute(
    "tabindex",
    "0",
  );
  await expect(d.getByRole("tab", { name: "Documents" })).toHaveAttribute(
    "tabindex",
    "-1",
  );
});

test("arrow keys move on-axis; Home/End jump; off-axis ignored", async ({
  page,
}) => {
  const d = page.locator('[data-testid="uncontrolled"]');
  await d.getByRole("tab", { name: "Account" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(d.getByRole("tab", { name: "Documents" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(d.getByRole("tab", { name: "Documents" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(d.getByRole("tab", { name: "Settings" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(d.getByRole("tab", { name: "Account" })).toBeFocused();
});

test("onValueChange fires on a user change, not on mount", async ({ page }) => {
  await expect(page.locator('[data-testid="last"]')).toHaveText("");
  await page
    .locator('[data-testid="uncontrolled"]')
    .getByRole("tab", { name: "Documents" })
    .click();
  await expect(page.locator('[data-testid="last"]')).toHaveText("documents");
});
