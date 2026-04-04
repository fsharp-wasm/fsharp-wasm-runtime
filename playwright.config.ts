import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for fsharp-wasm-runtime integration tests.
 * The `webServer` option starts a static file server before any test runs,
 * so Playwright tests can connect to http://localhost:8080.
 */
export default defineConfig({
  testDir: "./tests/Integration",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /** Start a local static server that serves the project root. */
  webServer: {
    command: "npx serve . -l 8080",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
