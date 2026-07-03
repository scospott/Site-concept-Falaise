// Audit ScrollHero (chantier 2) : états initial / mi-scrub / sortie de pin,
// desktop 1440 + mobile 390. Serveur attendu sur http://localhost:3210.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-2";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

const targets = [
  { name: "home", path: "/", scrubVh: 260 },
  { name: "reservation", path: "/reservation", scrubVh: 160 },
];

async function series(ctx, vw, label) {
  for (const t of targets) {
    await ctx.clearCookies();
    const page = await ctx.newPage();
    await page.goto(baseUrl + t.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    const vh = page.viewportSize().height;
    const scrubPx = (vh * t.scrubVh) / 100;

    await page.screenshot({ path: `${outDir}/${t.name}-${label}-initial.png` });

    await page.evaluate((y) => window.scrollTo(0, y), scrubPx * 0.5);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/${t.name}-${label}-midscrub.png` });

    await page.evaluate((y) => window.scrollTo(0, y), scrubPx + 250);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/${t.name}-${label}-pinexit.png` });

    console.log(`✓ ${t.name} ${label} (initial / midscrub / pinexit)`);
    await page.close();
  }
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
await series(desktop, 1440, "desktop");
await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await series(mobile, 390, "mobile");
await mobile.close();

await browser.close();
console.log(`Audit → ${outDir}/`);
