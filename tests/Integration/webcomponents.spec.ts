import { test, expect } from "@playwright/test";

test.describe("Web Components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/web-component/");
  });

  test("web-component demo page loads", async ({ page }) => {
    await expect(page).toHaveTitle(/Web Component/i);
  });

  test("fs-counter elements are present in HTML", async ({ page }) => {
    const body = await page.content();
    expect(body).toContain("fs-counter");
  });

  test("fs-counter elements are in the DOM", async ({ page }) => {
    const counters = page.locator("fs-counter");
    const count = await counters.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("multiple fs-counter instances exist", async ({ page }) => {
    // Three instances are rendered by the demo
    const counters = page.locator("fs-counter");
    const count = await counters.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

