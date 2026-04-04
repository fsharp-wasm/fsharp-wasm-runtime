import { test, expect } from "@playwright/test";

test.describe("Demo Applications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/F# → WebAssembly GC/);
  });

  test("counter demo renders", async ({ page }) => {
    const counter = page.locator("#counter-root");
    await expect(counter).toBeVisible();
  });

  test("todo demo renders", async ({ page }) => {
    const todo = page.locator("#todo-root");
    await expect(todo).toBeVisible();
  });

  test("canvas demo renders", async ({ page }) => {
    const canvas = page.locator("#mandelbrot");
    await expect(canvas).toBeVisible();
  });

  test("dashboard demo renders", async ({ page }) => {
    const dashboard = page.locator("#dashboard-root");
    await expect(dashboard).toBeVisible();
  });

  test("pubsub demo renders", async ({ page }) => {
    const pubsub = page.locator("#pubsub-root");
    await expect(pubsub).toBeVisible();
  });

  test("indexeddb demo renders", async ({ page }) => {
    const indexeddb = page.locator("#indexeddb-root");
    await expect(indexeddb).toBeVisible();
  });

  test("worker demo renders", async ({ page }) => {
    const worker = page.locator("#worker-root");
    await expect(worker).toBeVisible();
  });

  test("webgpu demo renders", async ({ page }) => {
    const webgpu = page.locator("#webgpu-root");
    await expect(webgpu).toBeVisible();
  });

  test("web components are defined", async ({ page }) => {
    const components = page.locator("fs-counter");
    const count = await components.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("PicoCSS is loaded", async ({ page }) => {
    const links = page.locator('link[href*="pico"]');
    await expect(links).toHaveCount(1);
  });
});
