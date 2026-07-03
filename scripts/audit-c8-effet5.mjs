// Effet 5 : nappes de brume à la navigation (capture en cours de balayage).
import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
// navigation client vers /reservation
await page.click("header nav a[href*='reservation']");
await page.waitForTimeout(200); // en plein balayage des nappes
await page.screenshot({ path: "audits/chantier-8/effet5-nappes-mi.png" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "audits/chantier-8/effet5-apres.png" });
console.log("✓ effet5 captures");
await browser.close();
