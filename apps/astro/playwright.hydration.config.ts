import { defineConfig, devices } from "@playwright/test";

// Builds with dev React (E2E_DEV_REACT) so hydration mismatches actually throw.
export default defineConfig({
  testDir: "./e2e/tests",
  testMatch: "**/hydration-warnings.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "E2E_DEV_REACT=true pnpm build && pnpm preview",
    url: "http://localhost:4321",
    reuseExistingServer: false,
    timeout: 120_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
