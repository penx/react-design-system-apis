import { test, expect, type Page } from "../../helpers/fixture";

// Holds every island/define JS chunk until release(), so a test can interact
// with the no-JS radio fallback BEFORE React hydrates, then let it hydrate and
// assert the selection is handed off.
async function gateIslandJs(page: Page) {
  let release = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route(
    (url) => url.pathname.includes("/_astro/") && url.pathname.endsWith(".js"),
    async (route) => {
      await gate;
      await route.continue();
    },
  );
  return { release: () => release() };
}

test("uncontrolled: a selection made before hydration is reported via onValueChange", async ({
  page,
}) => {
  const { release } = await gateIslandJs(page);
  await page.goto("/test/hydrated", { waitUntil: "commit" });

  // Pick a non-default tab via the native radio fallback (no JS yet).
  await page.locator('[data-testid="demo-h"] label[for="h-settings"]').click();
  await expect(page.locator("#h-settings")).toBeChecked();

  release(); // let the island + define script load and hydrate
  await expect(page.locator('[data-testid="demo-h"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  // The pre-hydration pick differs from defaultValue, so it is handed off.
  await expect(page.locator('[data-testid="last-h"]')).toHaveText("settings");
});

test('controlled "report": a pre-hydration pick is adopted over the value', async ({
  page,
}) => {
  const { release } = await gateIslandJs(page);
  await page.goto("/test/controlled", { waitUntil: "commit" });

  // Controlled value is "account"; pick "settings" before hydration.
  await page
    .locator('[data-testid="ctrl-cs"] label[for="cs-settings"]')
    .click();
  await expect(page.locator("#cs-settings")).toBeChecked();

  release();
  await expect(page.locator('[data-testid="ctrl-cs"]')).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  // "report" reports the pick via onValueChange, so the consumer adopts it.
  await expect(page.locator('[data-testid="cs-value"]')).toHaveText("settings");
});
