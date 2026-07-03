// Audit chantier 4 : galerie horizontale (mi-traversée, sortie de pin),
// lightbox, carousel avis. Desktop 1440 + mobile 390.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-4";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

// ---- Desktop
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// position du pin de la galerie
const pinTop = await page.evaluate(() => {
  const el = document.querySelector("#galerie");
  return el.getBoundingClientRect().top + window.scrollY;
});

// mi-traversée (le pin dure ~ largeur piste - viewport)
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 1500);
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/galerie-mi-traversee.png` });
console.log("✓ galerie-mi-traversee");

// sortie de pin : on scrolle bien au-delà puis on vérifie l'après
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 4200);
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/galerie-sortie-pin.png` });
console.log("✓ galerie-sortie-pin");

// avis
await page.locator("#avis").scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -80));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/avis-desktop.png` });
console.log("✓ avis-desktop");

// drag du carousel (flèche next ×2)
await page.locator("#avis button[aria-label*='suivants']").click();
await page.waitForTimeout(800);
await page.locator("#avis button[aria-label*='suivants']").click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/avis-desktop-next.png` });
console.log("✓ avis-desktop-next");

// lightbox depuis la galerie (début de pin : première carte visible)
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 30);
await page.waitForTimeout(800);
await page.locator("#galerie button[aria-haspopup='dialog']").first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/lightbox-desktop.png` });
console.log("✓ lightbox-desktop");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await page.close();

// ---- Mobile
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
    await new Promise((r) => setTimeout(r, 50));
  }
});
await mp.waitForTimeout(800);
await mp.locator("#galerie").scrollIntoViewIfNeeded();
await mp.waitForTimeout(900);
await mp.screenshot({ path: `${outDir}/galerie-mobile.png` });
console.log("✓ galerie-mobile");

await mp.locator("#avis").scrollIntoViewIfNeeded();
await mp.waitForTimeout(900);
await mp.screenshot({ path: `${outDir}/avis-mobile.png` });
console.log("✓ avis-mobile");

// lightbox mobile (boutons de la grille visible, pas du track desktop caché)
await mp.locator("#galerie .grid button[aria-haspopup='dialog']").first().tap();
await mp.waitForTimeout(700);
await mp.screenshot({ path: `${outDir}/lightbox-mobile.png` });
console.log("✓ lightbox-mobile");

await browser.close();
console.log(`Audit → ${outDir}/`);
