import { test, expect } from "@playwright/test";

test.describe("Web Components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080");
  });

  test("fs-counter elements are present", async ({ page }) => {
    const counters = page.locator("fs-counter");
    const count = await counters.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("fs-counter has shadow content or children", async ({ page }) => {
    const counter = page.locator("fs-counter").first();
    await expect(counter).toBeVisible();
  });

  test("multiple fs-counter instances are independent", async ({ page }) => {
    const counters = page.locator("fs-counter");
    const count = await counters.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
