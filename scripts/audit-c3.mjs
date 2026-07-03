// Audit chantier 3 : manifeste lumineux (mi-allumage) + les espaces (wipe hover).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-3";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// Scroll jusqu'au manifeste — mi-traversée (mots partiellement allumés)
const villa = page.locator("#villa");
await villa.scrollIntoViewIfNeeded();
await page.evaluate(() => {
  const el = document.querySelector(".manifeste-texte");
  const r = el.getBoundingClientRect();
  window.scrollTo(0, window.scrollY + r.top - window.innerHeight * 0.55);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/manifeste-mi-allumage.png` });
console.log("✓ manifeste-mi-allumage");

// Fin de section : tout allumé + chiffres clés
await page.evaluate(() => {
  const el = document.querySelector(".figures");
  const r = el.getBoundingClientRect();
  window.scrollTo(0, window.scrollY + r.top - window.innerHeight * 0.6);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/manifeste-chiffres.png` });
console.log("✓ manifeste-chiffres");

// Les espaces : état par défaut puis hover item 3
await page.locator("#espaces").scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, 100));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/espaces-defaut.png` });
console.log("✓ espaces-defaut");

await page.locator("#espaces button", { hasText: "suite falaise" }).hover();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/espaces-hover-suite.png` });
console.log("✓ espaces-hover-suite");

await page.locator("#espaces button", { hasText: "cuisine" }).hover();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/espaces-hover-cuisine.png` });
console.log("✓ espaces-hover-cuisine");
await page.close();

// Mobile : page complète + zoom sur les espaces empilés
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mp = await mobile.newPage();
await mp.goto(baseUrl + "/", { waitUntil: "networkidle" });
await mp.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 350) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await mp.waitForTimeout(1000);
await mp.screenshot({ path: `${outDir}/home-mobile-full.png`, fullPage: true });
console.log("✓ home-mobile-full");

await browser.close();
console.log(`Audit → ${outDir}/`);
