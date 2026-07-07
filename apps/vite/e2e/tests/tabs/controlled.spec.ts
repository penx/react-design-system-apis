import { test, expect } from "../../helpers/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('[data-testid="controlled"] [role="tablist"]'),
  ).toBeVisible();
});

const tabs = (page: import("../../helpers/fixture").Page) =>
  page.locator('[data-testid="controlled"]');

test("the active tab reflects the controlled value", async ({ page }) => {
  await expect(
    tabs(page).getByRole("tab", { name: "Account" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-testid="value"]')).toHaveText("account");
});

test("an external (programmatic) value change drives the tab, no echo", async ({
  page,
}) => {
  await page.locator('[data-testid="ext"]').click();
  await expect(
    tabs(page).getByRole("tab", { name: "Settings" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-testid="value"]')).toHaveText("settings");
  await expect(page.locator('[data-testid="changes"]')).toHaveText("0");
});

test("a user click is reported through onValueChange", async ({ page }) => {
  await tabs(page).getByRole("tab", { name: "Documents" }).click();
  await expect(page.locator('[data-testid="value"]')).toHaveText("documents");
  await expect(page.locator('[data-testid="changes"]')).toHaveText("1");
  await expect(
    tabs(page).getByRole("tab", { name: "Documents" }),
  ).toHaveAttribute("aria-selected", "true");
});
