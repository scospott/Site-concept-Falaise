// QA finale chantier 7 : 8 captures pleine page (2 pages × 2 locales ×
// desktop/390) + nav mobile ouverte + widget Maël + 404.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-7";
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: "home-fr", path: "/" },
  { name: "home-en", path: "/en" },
  { name: "reservation-fr", path: "/reservation" },
  { name: "reservation-en", path: "/en/reservation" },
];

const browser = await chromium.launch();

async function fullPage(ctx, path, file) {
  await ctx.clearCookies();
  const page = await ctx.newPage();
  await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/${file}.png`, fullPage: true });
  await page.close();
  console.log(`✓ ${file}`);
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const p of pages) await fullPage(desktop, p.path, `${p.name}-desktop`);

// 404 desktop
const p404 = await desktop.newPage();
await p404.goto(baseUrl + "/sentier-perdu", { waitUntil: "networkidle" });
await p404.waitForTimeout(600);
await p404.screenshot({ path: `${outDir}/404-desktop.png` });
console.log("✓ 404-desktop");
await p404.close();
await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
for (const p of pages) await fullPage(mobile, p.path, `${p.name}-mobile`);

// nav mobile ouverte
const nav = await mobile.newPage();
await nav.goto(baseUrl + "/", { waitUntil: "networkidle" });
await nav.locator("header button[aria-controls='mobile-menu']").tap();
await nav.waitForTimeout(900);
await nav.screenshot({ path: `${outDir}/nav-mobile-ouverte.png` });
console.log("✓ nav-mobile-ouverte");
await nav.close();

// widget Maël ouvert (desktop)
const d2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const w = await d2.newPage();
await w.goto(baseUrl + "/", { waitUntil: "networkidle" });
await w.locator("button[aria-label*='Ouvrir la conversation']").click();
await w.waitForTimeout(900);
await w.screenshot({ path: `${outDir}/widget-ouvert.png` });
console.log("✓ widget-ouvert");

await browser.close();
console.log(`Audit → ${outDir}/`);
