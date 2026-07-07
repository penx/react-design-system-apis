import { test, expect } from "../../helpers/fixture";

// React island (client:load) on top of the upgraded element.
test.beforeEach(async ({ page }) => {
  await page.goto("/test/hydrated");
  await expect(page.locator('[data-testid="demo-h"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
});

test("does not call onValueChange on mount", async ({ page }) => {
  await expect(page.locator('[data-testid="last-h"]')).toHaveText("");
});

test("calls onValueChange on a user change", async ({ page }) => {
  await page
    .locator('[data-testid="demo-h"]')
    .getByRole("tab", { name: "Documents" })
    .click();
  await expect(page.locator('[data-testid="last-h"]')).toHaveText("documents");
});

test("vertical instance moves with Up/Down and ignores Left/Right", async ({
  page,
}) => {
  const d = page.locator('[data-testid="demo-v"]');
  const account = d.getByRole("tab", { name: "Account" });
  await account.focus();
  await page.keyboard.press("ArrowLeft"); // off-axis on a vertical tablist
  await expect(account).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(d.getByRole("tab", { name: "Documents" })).toBeFocused();
});

test("instances are independent", async ({ page }) => {
  await page
    .locator('[data-testid="demo-h"]')
    .getByRole("tab", { name: "Settings" })
    .click();
  await expect(
    page
      .locator('[data-testid="demo-h"]')
      .getByRole("tab", { name: "Settings" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page
      .locator('[data-testid="demo-v"]')
      .getByRole("tab", { name: "Account" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("logs no hydration warnings or errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/test/hydrated");
  await expect(page.locator('[data-testid="demo-h"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await page
    .locator('[data-testid="demo-h"]')
    .getByRole("tab", { name: "Documents" })
    .click();
  expect(errors).toEqual([]);
});
