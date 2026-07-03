// Audit visuel Playwright — usage :
//   node scripts/audit.mjs <chantier> [baseUrl]
// Screenshots desktop 1440px + mobile 390px des pages clés dans audits/chantier-<N>/.
// Le serveur (next start ou next dev) doit tourner sur baseUrl (défaut http://localhost:3210).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const chantier = process.argv[2] ?? "x";
const baseUrl = process.argv[3] ?? "http://localhost:3210";
const outDir = `audits/chantier-${chantier}`;
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: "home-fr", path: "/" },
  { name: "home-en", path: "/en" },
  { name: "reservation-fr", path: "/reservation" },
  { name: "styleguide", path: "/styleguide" },
];

const browser = await chromium.launch();

async function snap(ctx, path, file, opts = {}) {
  await ctx.clearCookies(); // isole chaque capture (cookie NEXT_LOCALE)
  const page = await ctx.newPage();
  await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const fullPage = opts.fullPage ?? true;
  if (fullPage) {
    // Balayage de scroll pour déclencher les reveals ScrollTrigger
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
  }
  if (opts.beforeShot) await opts.beforeShot(page);
  await page.screenshot({ path: `${outDir}/${file}.png`, fullPage });
  await page.close();
  return file;
}

// Desktop 1440
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
for (const p of pages) {
  await snap(desktop, p.path, `${p.name}-desktop`);
  console.log(`✓ ${p.name}-desktop`);
}
// Scroll au milieu de page (état nav scrollée)
await snap(desktop, "/", "home-fr-desktop-scrolled", {
  fullPage: false,
  beforeShot: async (page) => {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1200);
  },
});
console.log("✓ home-fr-desktop-scrolled");
await desktop.close();

// Mobile 390
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
for (const p of pages) {
  await snap(mobile, p.path, `${p.name}-mobile`);
  console.log(`✓ ${p.name}-mobile`);
}
// Nav mobile ouverte
await snap(mobile, "/", "home-fr-mobile-nav-open", {
  fullPage: false,
  beforeShot: async (page) => {
    await page.locator("header button[aria-controls='mobile-menu']").tap();
    await page.waitForTimeout(900);
  },
});
console.log("✓ home-fr-mobile-nav-open");
await mobile.close();

await browser.close();
console.log(`Audit → ${outDir}/`);
