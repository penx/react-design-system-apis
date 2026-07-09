import { defineConfig, devices } from "@playwright/test";

// Always test the production build via `astro preview` (the shipped artifact,
// with the _astro chunks the coverage mapping and the pre-hydration route
// matcher both rely on). Coverage collection is toggled by E2E_COVERAGE in the
// fixture, not by the server mode.

export default defineConfig({
  testDir: "./e2e/tests",
  // The hydration-warning spec needs a dev-React build; it runs via
  // playwright.hydration.config.ts, not this production run.
  testIgnore: "**/hydration-warnings.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm build && pnpm preview",
    url: "http://localhost:4321",
    reuseExistingServer: false,
    timeout: 120_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
