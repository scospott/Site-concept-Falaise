// Effet 4 : océan nocturne au pied du footer (2 instants pour le mouvement).
import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3210/reservation", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2200);
await page.screenshot({ path: "audits/chantier-8/effet4-ocean-t1.png" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "audits/chantier-8/effet4-ocean-t2.png" });
console.log("✓ effet4 océan ×2");
console.log(errors.filter(e => !e.includes("404")).join("\n") || "console propre");
await browser.close();
