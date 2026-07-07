import { test, expect } from "../../helpers/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/controlled");
  // Wait for React to hydrate - controlled behaviour is a hydration feature;
  // the tablist alone only signals the custom-element upgrade.
  await expect(page.locator('[data-testid="ctrl-cv"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await expect(page.locator('[data-testid="ctrl-cs"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
});

test("the active tab reflects the controlled value", async ({ page }) => {
  await expect(
    page
      .locator('[data-testid="ctrl-cv"]')
      .getByRole("tab", { name: "Account" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("a programmatic value change switches tab without echoing onValueChange", async ({
  page,
}) => {
  await page.locator('[data-testid="cv-ext"]').click();
  await expect(
    page
      .locator('[data-testid="ctrl-cv"]')
      .getByRole("tab", { name: "Settings" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-testid="cv-value"]')).toHaveText("settings");
  await expect(page.locator('[data-testid="cv-changes"]')).toHaveText("0");
});

test("user interaction is reported through onValueChange", async ({ page }) => {
  await page
    .locator('[data-testid="ctrl-cv"]')
    .getByRole("tab", { name: "Documents" })
    .click();
  await expect(page.locator('[data-testid="cv-value"]')).toHaveText(
    "documents",
  );
  await expect(page.locator('[data-testid="cv-changes"]')).toHaveText("1");
  await expect(
    page
      .locator('[data-testid="ctrl-cv"]')
      .getByRole("tab", { name: "Documents" }),
  ).toHaveAttribute("aria-selected", "true");
});

// The preHydration strategies ("ignore" vs "report") only diverge when a
// user interacts with the no-JS fallback BEFORE the island hydrates; that race
// is exercised in pre-hydration.spec.ts (by holding the island JS). Here we
// just confirm the "report" instance mounts and is interactive once hydrated.
test('"report" instance hydrates and is interactive', async ({ page }) => {
  const d = page.locator('[data-testid="ctrl-cs"]');
  await expect(d.getByRole("tab", { name: "Account" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await d.getByRole("tab", { name: "Settings" }).click();
  await expect(page.locator('[data-testid="cs-value"]')).toHaveText("settings");
});
