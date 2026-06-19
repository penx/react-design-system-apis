import { test, expect } from "../../helpers/fixture";

// Tabs within tabs: the inner Tabs.Root lives in the outer "account" panel.
test.beforeEach(async ({ page }) => {
  await page.goto("/test/tabs-nested");
  await expect(page.locator('[data-testid="nested-tabs"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
});

test("inner tabs switch independently of the outer set", async ({ page }) => {
  const inner = page.locator('[data-testid="inner"]');
  // inner starts on Profile
  await expect(inner.getByRole("tab", { name: "Profile" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await inner.getByRole("tab", { name: "Email" }).click();
  await expect(inner.getByRole("tab", { name: "Email" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  // outer is unaffected: still on Account (the inner panel is still shown)
  await expect(
    page.getByRole("tab", { name: "Account" }).first(),
  ).toHaveAttribute("aria-selected", "true");
});

test("inner tablist is only present while its outer tab is active", async ({
  page,
}) => {
  await expect(page.locator('[data-testid="inner"] [role="tab"]')).toHaveCount(
    2,
  );
  await page.getByRole("tab", { name: "Settings" }).first().click();
  // outer switched away from Account; the inner panel (and its tabs) is hidden
  await expect(page.locator('[data-testid="inner"]')).toBeHidden();
});

test("the two instances use distinct radio-group names (no collision)", async ({
  page,
}) => {
  const names = await page
    .locator('[data-testid="nested-tabs"] input[type="radio"]')
    .evaluateAll((els) =>
      Array.from(new Set(els.map((el) => (el as HTMLInputElement).name))),
    );
  // outer (2 tabs) + inner (2 tabs) => two distinct names
  expect(names).toHaveLength(2);
});
