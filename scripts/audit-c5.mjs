// Audit chantier 5 : section inline Maël + widget flottant, desktop + mobile,
// y compris le message de repli poli quand la clé API est absente.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-5";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

// Desktop
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.locator("#hote").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/inline-desktop.png` });
console.log("✓ inline-desktop");

// Suggestion cliquée → ajout optimiste + repli poli (pas de clé API)
await page.locator("#hote button", { hasText: "couchages" }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/inline-desktop-fallback.png` });
console.log("✓ inline-desktop-fallback");

// Widget ouvert (partage du même historique)
await page.locator("button[aria-label*='Ouvrir la conversation']").click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/widget-desktop.png` });
console.log("✓ widget-desktop");
await page.close();

// Widget sur /reservation (global)
const p2 = await ctx.newPage();
await p2.goto(baseUrl + "/reservation", { waitUntil: "networkidle" });
await p2.waitForTimeout(600);
await p2.locator("button[aria-label*='Ouvrir la conversation']").click();
await p2.waitForTimeout(800);
await p2.screenshot({ path: `${outDir}/widget-reservation.png` });
console.log("✓ widget-reservation");
await p2.close();

// Mobile
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mp = await mobile.newPage();
await mp.goto(baseUrl + "/", { waitUntil: "networkidle" });
await mp.locator("#hote").scrollIntoViewIfNeeded();
await mp.waitForTimeout(1000);
await mp.screenshot({ path: `${outDir}/inline-mobile.png` });
console.log("✓ inline-mobile");

await mp.locator("button[aria-label*='Ouvrir la conversation']").tap();
await mp.waitForTimeout(800);
await mp.screenshot({ path: `${outDir}/widget-mobile.png` });
console.log("✓ widget-mobile");

await browser.close();
console.log(`Audit → ${outDir}/`);
