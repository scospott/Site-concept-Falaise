// QA branchement photos : hero 0/33/66/100 %, espaces (3 survols), galerie
// mi-traversée, lightbox — desktop 1440 + mobile 390 → audits/galerie/.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("audits/galerie", { recursive: true });
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

// ---------- Desktop
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// hero scrub
for (const p of [0, 0.33, 0.66, 1.0]) {
  const y = Math.min(p * 900 * 3, 900 * 3 - 2);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `audits/galerie/hero-${Math.round(p * 100)}-desktop.png` });
  console.log(`✓ hero ${Math.round(p * 100)}% desktop`);
}

// espaces : 3 survols
await page.locator("#espaces").scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, 60));
await page.waitForTimeout(900);
for (const [name, idx] of [["verriere", 1], ["cuisine", 4], ["piscine", 6]]) {
  await page.locator(`#espaces ul li:nth-child(${idx}) button`).hover();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `audits/galerie/espaces-${name}-desktop.png` });
  console.log(`✓ espaces ${name} desktop`);
}

// galerie mi-traversée
const pinTop = await page.evaluate(() => document.querySelector("#galerie").getBoundingClientRect().top + window.scrollY);
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 1600);
await page.waitForTimeout(1300);
await page.screenshot({ path: `audits/galerie/galerie-mi-traversee-desktop.png` });
console.log("✓ galerie mi-traversée desktop");

// lightbox (début de pin, 1re carte)
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 30);
await page.waitForTimeout(900);
await page.locator("#galerie button[data-cursor='view']").first().click();
await page.waitForTimeout(800);
await page.screenshot({ path: `audits/galerie/lightbox-desktop.png` });
console.log("✓ lightbox desktop");
await page.keyboard.press("Escape");
await page.close();

// ---------- Mobile
const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mp.goto(baseUrl + "/", { waitUntil: "networkidle" });
await mp.waitForTimeout(2200);
for (const p of [0, 0.33, 0.66, 1.0]) {
  const y = Math.min(p * 844 * 3, 844 * 3 - 2);
  await mp.evaluate((yy) => window.scrollTo(0, yy), y);
  await mp.waitForTimeout(1200);
  await mp.screenshot({ path: `audits/galerie/hero-${Math.round(p * 100)}-mobile.png` });
  console.log(`✓ hero ${Math.round(p * 100)}% mobile`);
}
await mp.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
await mp.waitForTimeout(600);
await mp.locator("#espaces").scrollIntoViewIfNeeded();
await mp.waitForTimeout(900);
await mp.screenshot({ path: `audits/galerie/espaces-mobile.png` });
console.log("✓ espaces mobile");
await mp.locator("#galerie").scrollIntoViewIfNeeded();
await mp.waitForTimeout(900);
await mp.screenshot({ path: `audits/galerie/galerie-mobile.png` });
console.log("✓ galerie mobile");
await mp.locator("#galerie button[aria-haspopup='dialog']:visible").first().tap();
await mp.waitForTimeout(800);
await mp.screenshot({ path: `audits/galerie/lightbox-mobile.png` });
console.log("✓ lightbox mobile");
await browser.close();
console.log("Audit → audits/galerie/");
