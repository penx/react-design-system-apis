import { test, expect, type Page } from "../../helpers/fixture";

// Custom element upgraded by the define script, but React never hydrates
// (the page renders TabsDemo with no client directive).
test.beforeEach(async ({ page }) => {
  await page.goto("/test/upgraded");
  await page.waitForFunction(() => !!customElements.get("ds-tabs"));
});

const demo = (page: Page) => page.locator('[data-testid="demo-up"]');

test("upgrades the list to a tablist with aria-orientation", async ({
  page,
}) => {
  const list = demo(page).locator('[role="tablist"]');
  await expect(list).toBeVisible();
  await expect(list).toHaveAttribute("aria-orientation", "horizontal");
});

test("assigns roles, roving tabindex, and one visible panel", async ({
  page,
}) => {
  const d = demo(page);
  await expect(d.getByRole("tab")).toHaveCount(3);
  await expect(d.getByRole("tabpanel")).toHaveCount(1); // hidden panels excluded
  const account = d.getByRole("tab", { name: "Account" });
  await expect(account).toHaveAttribute("aria-selected", "true");
  await expect(account).toHaveAttribute("tabindex", "0");
  await expect(account).toHaveAttribute("data-state", "active");
  await expect(d.getByRole("tab", { name: "Documents" })).toHaveAttribute(
    "tabindex",
    "-1",
  );
});

test("links the active tab and panel via aria-controls/labelledby", async ({
  page,
}) => {
  const tab = demo(page).getByRole("tab", { name: "Documents" });
  await tab.click();
  const panelId = await tab.getAttribute("aria-controls");
  const tabId = await tab.getAttribute("id");
  const panel = page.locator(`#${panelId}`);
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("aria-labelledby", tabId ?? "");
});

test("arrow keys move along the horizontal axis; Home/End jump", async ({
  page,
}) => {
  const d = demo(page);
  await d.getByRole("tab", { name: "Account" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(d.getByRole("tab", { name: "Documents" })).toBeFocused();
  await expect(d.getByRole("tab", { name: "Documents" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(d.getByRole("tab", { name: "Settings" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(d.getByRole("tab", { name: "Account" })).toBeFocused();
  await page.keyboard.press("ArrowLeft"); // previous, wrapping to the last
  await expect(d.getByRole("tab", { name: "Settings" })).toBeFocused();
});

test("ignores off-axis arrows on a horizontal tablist", async ({ page }) => {
  const account = demo(page).getByRole("tab", { name: "Account" });
  await account.focus();
  await page.keyboard.press("ArrowDown");
  await expect(account).toBeFocused();
  await expect(account).toHaveAttribute("aria-selected", "true");
});

test("seeds the initial tab from the checked radio (beats default/first)", async ({
  page,
}) => {
  await page.evaluate(() => {
    const host = document.createElement("div");
    host.id = "inject-pick";
    host.innerHTML = `<ds-tabs><div data-tabs-list><label data-tabs-trigger data-value="a">A</label><label data-tabs-trigger data-value="b">B</label></div><div data-tabs-content data-value="a"><input type="radio" name="pk" value="a"></div><div data-tabs-content data-value="b"><input type="radio" name="pk" value="b" checked></div></ds-tabs>`;
    document.body.appendChild(host);
  });
  await expect(
    page.locator("#inject-pick").getByRole("tab", { name: "B" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("falls back to the first trigger when nothing else selects one", async ({
  page,
}) => {
  await page.evaluate(() => {
    const host = document.createElement("div");
    host.id = "inject-first";
    // No value, no default-value, no checked radio -> first trigger wins.
    host.innerHTML = `<ds-tabs><div data-tabs-list><label data-tabs-trigger data-value="a">A</label><label data-tabs-trigger data-value="b">B</label></div><div data-tabs-content data-value="a"><input type="radio" name="fb" value="a"></div><div data-tabs-content data-value="b"><input type="radio" name="fb" value="b"></div></ds-tabs>`;
    document.body.appendChild(host);
  });
  await expect(
    page.locator("#inject-first").getByRole("tab", { name: "A" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("no change event on initial activation; re-selection is deduped", async ({
  page,
}) => {
  await page.evaluate(() => {
    (window as unknown as { __changes: string[] }).__changes = [];
    const host = document.createElement("div");
    host.id = "inject-evt";
    host.addEventListener("ds-tabs:change", (e) =>
      (window as unknown as { __changes: string[] }).__changes.push(
        (e as CustomEvent<{ value: string }>).detail.value,
      ),
    );
    host.innerHTML = `<ds-tabs default-value="a"><div data-tabs-list><label data-tabs-trigger data-value="a" for="ev-a">A</label><label data-tabs-trigger data-value="b" for="ev-b">B</label></div><div data-tabs-content data-value="a"><input type="radio" name="ev" id="ev-a" value="a"></div><div data-tabs-content data-value="b"><input type="radio" name="ev" id="ev-b" value="b"></div></ds-tabs>`;
    document.body.appendChild(host);
  });
  const host = page.locator("#inject-evt");
  await expect(host.getByRole("tab", { name: "A" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const changes = () =>
    page.evaluate(
      () => (window as unknown as { __changes: string[] }).__changes,
    );
  expect(await changes()).toEqual([]); // none on initial
  await host.getByRole("tab", { name: "B" }).click();
  expect(await changes()).toEqual(["b"]);
  await host.getByRole("tab", { name: "B" }).click(); // re-select active
  expect(await changes()).toEqual(["b"]);
});

test("upgrades once triggers appear later (MutationObserver)", async ({
  page,
}) => {
  await page.evaluate(() => {
    const el = document.createElement("ds-tabs");
    const host = document.createElement("div");
    host.id = "inject-late";
    host.appendChild(el);
    document.body.appendChild(host);
    setTimeout(() => {
      el.innerHTML = `<div data-tabs-list><label data-tabs-trigger data-value="a">A</label></div><div data-tabs-content data-value="a"><input type="radio"></div>`;
    }, 50);
  });
  await expect(page.locator("#inject-late [role='tablist']")).toBeVisible();
});
