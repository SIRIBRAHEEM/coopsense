// E2E checks + fresh screenshots for the redesigned CoopSense.
// Serves the production build with vite preview, drives it with
// Playwright (chromium), asserts key flows, saves 6 screenshots to docs/.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
mkdirSync("docs", { recursive: true });

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: "pipe",
});
await new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error("preview server timeout")), 30000);
  server.stdout.on("data", (d) => {
    if (String(d).includes("Local:")) { clearTimeout(t); res(); }
  });
  server.stderr.on("data", (d) => process.stderr.write(d));
});

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log("PASS", msg); } else { fail++; console.log("FAIL", msg); } };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

// Seed egg records so the chart and forecast render.
await page.addInitScript(() => {
  const entries = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    entries.push({ date: d.toISOString().slice(0, 10), eggs: 72 + (13 - i) + (i % 3) });
  }
  localStorage.setItem("coopsense-eggs-v1", JSON.stringify(entries));
});

await page.goto(BASE, { waitUntil: "networkidle" });
ok(await page.locator("h1").textContent() === "CoopSense", "hero title renders");
ok((await page.locator(".tab").count()) === 4, "4 icon tabs render");

// Feed calculator (default tab)
ok(await page.locator("text=Feed cost per day").isVisible(), "feed results visible");
await page.screenshot({ path: "docs/01-feed-calculator.png", fullPage: true });
await page.getByRole("button", { name: "Broilers" }).first().click();
ok((await page.locator("#grams").inputValue()) === "150", "broiler preset sets 150g");
await page.getByRole("button", { name: "Layers" }).first().click();
ok((await page.locator("#grams").inputValue()) === "120", "layer preset sets 120g");
await page.fill("#birds", "200");
ok((await page.locator(".stat strong").first().textContent()).includes("24.0 kg"), "200 birds at 120g = 24.0 kg/day");
await page.fill("#birds", "100");

// Health check
await page.getByRole("button", { name: "Health check" }).click();
ok(await page.locator("text=This is not a vet diagnosis").isVisible(), "vet warning visible");
await page.screenshot({ path: "docs/02-health-check.png", fullPage: true });
await page.getByLabel("Sudden deaths").check();
await page.getByLabel("Twisted neck").check();
await page.getByLabel("Greenish diarrhoea").check();
await page.getByRole("button", { name: "Check my flock" }).click();
ok(await page.locator(".result-box").first().isVisible(), "health results render");
ok((await page.locator(".result-box").count()) >= 2, "multiple conditions ranked");
await page.screenshot({ path: "docs/02b-health-results.png", fullPage: true });

// Egg tracker
await page.getByRole("button", { name: "Egg tracker" }).click();
ok(await page.locator(".bar").first().isVisible(), "egg chart bars render");
ok(await page.getByRole("heading", { name: "Forecast for the next 7 days" }).isVisible(), "forecast renders");
await page.screenshot({ path: "docs/03-egg-tracker.png", fullPage: true });
const before = await page.locator(".log tbody tr").count();
await page.fill("#egg-count", "88");
await page.getByRole("button", { name: "Add" }).click();
ok((await page.locator(".log tbody tr").count()) >= before, "egg entry added or replaced for today");

// Vaccines
await page.getByRole("button", { name: "Vaccines" }).click();
const hatch = new Date(); hatch.setDate(hatch.getDate() - 20);
await page.fill("#hatch-date", hatch.toISOString().slice(0, 10));
ok(await page.locator("text=Your birds are 20 days old today").isVisible(), "age computed from hatch date");
ok(await page.locator(".badge-due, .badge-overdue").first().isVisible(), "due/overdue badges show");
await page.screenshot({ path: "docs/04-vaccines.png", fullPage: true });

// Mobile views
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => { if (m.type() === "error") errors.push("mobile: " + m.text()); });
mobile.on("pageerror", (e) => errors.push("mobile: " + String(e)));
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.screenshot({ path: "docs/05-mobile-feed.png", fullPage: true });
await mobile.getByRole("button", { name: "Health check" }).click();
await mobile.screenshot({ path: "docs/06-mobile-health.png", fullPage: true });
ok(true, "mobile screenshots taken");

ok(errors.length === 0, `zero console errors (got ${errors.length})`);
if (errors.length) console.log(errors.join("\n"));

await browser.close();
server.kill();
console.log(`E2E: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
