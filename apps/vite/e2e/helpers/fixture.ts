import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test as base, expect } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const V8_DIR = resolve(here, "..", ".v8");

export const test = base.extend({
  page: async ({ page }, use) => {
    if (process.env.E2E_COVERAGE !== "true") {
      await use(page);
      return;
    }
    await page.coverage.startJSCoverage({ resetOnNavigation: false });
    await use(page);
    const entries = await page.coverage.stopJSCoverage();
    const appEntries = entries.filter((entry) => {
      const { pathname } = new URL(entry.url);
      return (
        pathname.startsWith("/assets/") && !pathname.includes("node_modules")
      );
    });
    if (appEntries.length > 0) {
      mkdirSync(V8_DIR, { recursive: true });
      writeFileSync(
        resolve(V8_DIR, `${randomUUID()}.json`),
        JSON.stringify(appEntries),
      );
    }
  },
});

export { expect };
export type { Page } from "@playwright/test";
