import { test, expect } from "../../helpers/fixture";

// Two instances in one React tree with no explicit id.
test.beforeEach(async ({ page }) => {
  await page.goto("/test/composition");
  await expect(page.locator("ds-tabs")).toHaveCount(2);
});

test("each instance gets a distinct radio-group name via useId", async ({
  page,
}) => {
  const names = await page
    .locator('ds-tabs input[type="radio"]')
    .evaluateAll((els) =>
      Array.from(new Set(els.map((el) => (el as HTMLInputElement).name))),
    );
  expect(names).toHaveLength(2);
});

test("the instances operate independently", async ({ page }) => {
  const first = page.locator("ds-tabs").nth(0);
  const second = page.locator("ds-tabs").nth(1);
  await first.getByRole("tab", { name: "Settings" }).click();
  await expect(first.getByRole("tab", { name: "Settings" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(second.getByRole("tab", { name: "Account" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
