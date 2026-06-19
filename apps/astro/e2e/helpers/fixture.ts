import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test as base, expect } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const V8_DIR = resolve(here, "..", ".v8");

// Overrides the built-in `page` fixture so every spec collects V8 coverage when
// E2E_COVERAGE is set, writing one raw-V8 JSON per test for generate-reports.mjs
// to convert. A no-op otherwise.
export const test = base.extend({
  page: async ({ page }, use) => {
    if (process.env.E2E_COVERAGE !== "true") {
      await use(page);
      return;
    }
    // startJSCoverage throws when JS is disabled (the no-JS specs); skip quietly.
    let started = false;
    try {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
      started = true;
    } catch {
      /* no coverage for this page */
    }
    await use(page);
    if (!started) return;
    const entries = await page.coverage.stopJSCoverage();
    const appEntries = entries.filter((entry) => {
      const { pathname } = new URL(entry.url);
      return (
        pathname.startsWith("/_astro/") && !pathname.includes("node_modules")
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
