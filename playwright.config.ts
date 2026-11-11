import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for fsharp-wasm-runtime integration tests.
 *
 * The `webServer` option starts a static file server on dist/ before any
 * test run so Playwright tests can connect to http://localhost:4000.
 *
 * Before running tests, compile demos first:
 *   node build/build.js && npx playwright test
 */
export default defineConfig({
  testDir: "./tests/Integration",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /** Start a static file server on dist/ before any test runs. */
  webServer: {
    command: "npx serve dist -p 4000",
    url: "http://localhost:4000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

