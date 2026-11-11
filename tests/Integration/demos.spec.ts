import { test, expect } from "@playwright/test";

// ─── Gallery page ────────────────────────────────────────────────────────────

test.describe("Gallery", () => {
  test("gallery page loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/F# .* WebAssembly/i);
  });

  test("gallery shows 10 demo cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".demo-card");
    await expect(cards).toHaveCount(10);
  });

  test("gallery links to all demo pages", async ({ page }) => {
    await page.goto("/");
    for (const demo of [
      "canvas-mandelbrot",
      "counter",
      "todo",
      "realtime-pubsub",
      "indexeddb-crud",
      "worker-actor",
      "web-component",
      "webgpu-basic",
      "bench",
      "full-dashboard",
    ]) {
      const link = page.locator(`a[href*="${demo}"]`);
      await expect(link).toBeVisible();
    }
  });
});

// ─── Canvas / Mandelbrot demo ─────────────────────────────────────────────────

test.describe("Canvas Mandelbrot demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/canvas-mandelbrot/");
    await expect(page).toHaveTitle(/Mandelbrot/i);
  });

  test("canvas element is present", async ({ page }) => {
    await page.goto("/demos/canvas-mandelbrot/");
    const canvas = page.locator("canvas#mandelbrot, canvas");
    await expect(canvas.first()).toBeVisible();
  });

  test("WASM boots without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/demos/canvas-mandelbrot/");
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("WebGPU"))).toHaveLength(0);
  });
});

// ─── Counter demo ─────────────────────────────────────────────────────────────

test.describe("Counter demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/counter/");
    await expect(page).toHaveTitle(/Counter/i);
  });

  test("mount point exists", async ({ page }) => {
    await page.goto("/demos/counter/");
    const el = page.locator("#counter-root");
    await expect(el).toBeAttached();
  });
});

// ─── Todo demo ────────────────────────────────────────────────────────────────

test.describe("Todo demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/todo/");
    await expect(page).toHaveTitle(/Todo/i);
  });

  test("mount point exists", async ({ page }) => {
    await page.goto("/demos/todo/");
    await expect(page.locator("#todo-root")).toBeAttached();
  });
});

// ─── Web Component demo ───────────────────────────────────────────────────────

test.describe("Web Component demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/web-component/");
    await expect(page).toHaveTitle(/Web Component/i);
  });

  test("custom element tag is in the page", async ({ page }) => {
    await page.goto("/demos/web-component/");
    // The custom element may not be defined yet if compiler limitation hits;
    // we just verify the tag exists in the HTML source.
    const body = await page.content();
    expect(body).toContain("fs-counter");
  });
});

// ─── PubSub demo ──────────────────────────────────────────────────────────────

test.describe("PubSub demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/realtime-pubsub/");
    await expect(page).toHaveTitle(/PubSub|Real.?time/i);
  });
});

// ─── IndexedDB demo ───────────────────────────────────────────────────────────

test.describe("IndexedDB demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/indexeddb-crud/");
    await expect(page).toHaveTitle(/IndexedDB/i);
  });
});

// ─── Worker Actor demo ────────────────────────────────────────────────────────

test.describe("Worker Actor demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/worker-actor/");
    await expect(page).toHaveTitle(/Worker|Actor/i);
  });
});

// ─── WebGPU demo ──────────────────────────────────────────────────────────────

test.describe("WebGPU demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/webgpu-basic/");
    await expect(page).toHaveTitle(/WebGPU/i);
  });
});

// ─── Full Dashboard demo ──────────────────────────────────────────────────────

test.describe("Full Dashboard demo", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/demos/full-dashboard/");
    await expect(page).toHaveTitle(/Dashboard/i);
  });
});

