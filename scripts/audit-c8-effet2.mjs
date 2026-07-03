// Effet 2 : lanterne (dot/halo/pastille Voir) + spotlight images.
import { chromium } from "playwright";
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Spotlight sur le panneau des espaces (survol court : lanterne locale)
await page.locator("#espaces").scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, 60));
await page.waitForTimeout(800);
const panel = page.locator("#espaces .spotlight-wrap");
const box = await panel.boundingBox();
await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.45, { steps: 12 });
await page.waitForTimeout(250); // < 400ms : pas encore de révélation totale
await page.screenshot({ path: "audits/chantier-8/effet2-spotlight-lanterne.png" });
console.log("✓ effet2-spotlight-lanterne");

await page.waitForTimeout(1200); // survol prolongé : version claire entière
await page.screenshot({ path: "audits/chantier-8/effet2-spotlight-full.png" });
console.log("✓ effet2-spotlight-full");

// Pastille « Voir » sur un item galerie (début de pin)
const pinTop = await page.evaluate(() => {
  const el = document.querySelector("#galerie");
  return el.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 30);
await page.waitForTimeout(900);
const card = page.locator("#galerie button[data-cursor='view']").first();
const cb = await card.boundingBox();
await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 15 });
await page.waitForTimeout(900);
await page.screenshot({ path: "audits/chantier-8/effet2-galerie-voir.png" });
console.log("✓ effet2-galerie-voir");

// Curseur sur un bouton (dot 40px filet)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
const btn = page.locator("main a[data-cursor='link']").first();
const bb = await btn.boundingBox();
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 10 });
await page.waitForTimeout(600);
await page.screenshot({ path: "audits/chantier-8/effet2-bouton-link.png" });
console.log("✓ effet2-bouton-link");

await browser.close();
