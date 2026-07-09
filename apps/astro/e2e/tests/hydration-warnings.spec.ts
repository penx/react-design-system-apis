import { test, expect } from "../helpers/fixture";

const pages = [
  "/test/hydrated",
  "/test/controlled",
  "/test/composition",
  "/test/modal",
];

for (const path of pages) {
  test(`no hydration warnings or errors on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(path);
    await expect(page.locator('[data-hydrated="true"]').first()).toBeVisible();
    await page.locator('[role="tab"], button').first().click();

    expect(errors).toEqual([]);
  });
}
