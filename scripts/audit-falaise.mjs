// QA chantier La Falaise : heros renommés (3 positions de scrub), hero
// réservation avec frames, footer v2 desktop+390, page FR 390 complète.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("audits/falaise", { recursive: true });
const base = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

// Heros accueil FR + EN : 0/50/100 % du scrub (home scrubVh 300 → ~3×vh)
for (const [name, path] of [["hero-fr", "/"], ["hero-en", "/en"]]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  for (const p of [0, 0.5, 1.0]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.min(p * 2700, 2698));
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `audits/falaise/${name}-${Math.round(p * 100)}.png` });
    console.log(`✓ ${name}-${Math.round(p * 100)}`);
  }
  await page.close();
}

// Hero réservation : 0/50/100 % (scrubVh 200 → ~2×vh = 1800)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/reservation", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  for (const p of [0, 0.5, 1.0]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.min(p * 1800, 1798));
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `audits/falaise/hero-resa-${Math.round(p * 100)}.png` });
    console.log(`✓ hero-resa-${Math.round(p * 100)}`);
  }
  await page.close();
}

// Footer complet desktop + 390
for (const [vw, vh, dpr, mob, tag] of [[1440, 980, 1, false, "desktop"], [390, 844, 2, true, "390"]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2800);
  await page.locator("footer").screenshot({ path: `audits/falaise/footer-${tag}.png` });
  console.log(`✓ footer-${tag}`);
  await ctx.close();
}

// Page FR complète 390
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "audits/falaise/page-fr-390.png", fullPage: true });
  console.log("✓ page-fr-390");
  await ctx.close();
}

await browser.close();
console.log("Audit → audits/falaise/");
