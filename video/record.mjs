// Records a 1920x1080 walkthrough of the built CoopSense app with a
// visible cursor and click ripples, following DEMO-SCRIPT.md order.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = 4181;
const BASE = `http://localhost:${PORT}/`;
mkdirSync("video/raw", { recursive: true });

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
for (let i = 0; i < 60; i++) {
  try { const r = await fetch(BASE); if (r.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 500));
  if (i === 59) throw new Error("preview timeout");
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: "video/raw", size: { width: 1920, height: 1080 } },
});
const page = await ctx.newPage();

await page.addInitScript(() => {
  const entries = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    entries.push({ date: d.toISOString().slice(0, 10), eggs: 72 + (13 - i) + (i % 3) });
  }
  localStorage.setItem("coopsense-eggs-v1", JSON.stringify(entries));
  // Cursor + ripple overlay
  window.__moveCursor = () => {};
  window.__ripple = () => {};
  document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    #demo-cursor { position: fixed; width: 26px; height: 26px; z-index: 99999; pointer-events: none;
      border-radius: 50%; background: rgba(200,90,50,.9); border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,.4);
      transform: translate(-50%,-50%); transition: left .45s ease, top .45s ease; left: 50%; top: 50%; }
    .demo-ripple { position: fixed; z-index: 99998; pointer-events: none; border-radius: 50%;
      border: 4px solid rgba(47,107,51,.85); transform: translate(-50%,-50%); animation: rip .7s ease-out forwards; }
    @keyframes rip { from { width: 10px; height: 10px; opacity: 1; } to { width: 90px; height: 90px; opacity: 0; } }`;
  document.documentElement.appendChild(style);
  const cur = document.createElement("div"); cur.id = "demo-cursor";
  document.documentElement.appendChild(cur);
  window.__moveCursor = (x, y) => { cur.style.left = x + "px"; cur.style.top = y + "px"; };
  window.__ripple = (x, y) => {
    const r = document.createElement("div"); r.className = "demo-ripple";
    r.style.left = x + "px"; r.style.top = y + "px";
    document.documentElement.appendChild(r); setTimeout(() => r.remove(), 750);
  };
  });
});

const wait = (ms) => page.waitForTimeout(ms);
async function clickAt(locator, pauseAfter = 1600) {
  const box = await locator.boundingBox();
  if (box) {
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.evaluate(([x, y]) => window.__moveCursor(x, y), [x, y]);
    await wait(600);
    await page.evaluate(([x, y]) => window.__ripple(x, y), [x, y]);
  }
  await locator.click();
  await wait(pauseAfter);
}

await page.goto(BASE, { waitUntil: "networkidle" });
await wait(6000); // intro / problem section on home screen

// Feed calculator
await clickAt(page.getByRole("button", { name: "Broilers" }).first(), 2500);
await clickAt(page.getByRole("button", { name: "Layers" }).first(), 2500);
await page.fill("#birds", "200");
await wait(3000);
await page.fill("#birds", "100");
await wait(2500);

// Health check
await clickAt(page.getByRole("button", { name: "Health check" }), 2000);
await clickAt(page.getByLabel("Sudden deaths"), 900);
await clickAt(page.getByLabel("Twisted neck"), 900);
await clickAt(page.getByLabel("Greenish diarrhoea"), 900);
await clickAt(page.getByRole("button", { name: "Check my flock" }), 3500);
await page.mouse.wheel(0, 600);
await wait(3500);

// Egg tracker
await clickAt(page.getByRole("button", { name: "Egg tracker" }), 3000);
await page.fill("#egg-count", "88");
await clickAt(page.getByRole("button", { name: "Add" }), 3000);

// Vaccines
await clickAt(page.getByRole("button", { name: "Vaccines" }), 2000);
const hatch = new Date(); hatch.setDate(hatch.getDate() - 20);
await page.fill("#hatch-date", hatch.toISOString().slice(0, 10));
await wait(3000);
const tick = page.locator('input[type="checkbox"]').first();
if (await tick.count()) await clickAt(tick, 2500);
await wait(4000); // closing hold

await ctx.close();
await browser.close();
server.kill();
console.log("recorded");
