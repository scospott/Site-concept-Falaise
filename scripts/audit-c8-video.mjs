// QA finale chantier 8 : vidéo ~12s d'un scroll complet de l'accueil desktop.
import { chromium } from "playwright";
import { renameSync, readdirSync } from "node:fs";

const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "audits/chantier-8/", size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // titre-condensation + montée de la brume

// Scroll complet piloté par molette (Lenis actif) sur ~9s
const total = await page.evaluate(() => document.body.scrollHeight);
const steps = 90;
for (let i = 0; i < steps; i++) {
  await page.mouse.wheel(0, total / steps + 60);
  await page.waitForTimeout(95);
}
await page.waitForTimeout(1500);
await page.close();
await ctx.close();
await browser.close();

const file = readdirSync("audits/chantier-8").find((f) => f.endsWith(".webm"));
if (file) renameSync(`audits/chantier-8/${file}`, "audits/chantier-8/scroll-accueil-desktop.webm");
console.log("✓ vidéo enregistrée : audits/chantier-8/scroll-accueil-desktop.webm");
