// Vérifie l'absence d'erreurs console / clés i18n manquantes sur toutes les pages.
import { chromium } from "playwright";
const baseUrl = process.argv[2] ?? "http://localhost:3210";
const pages = ["/", "/en", "/reservation", "/en/reservation", "/styleguide", "/page-inexistante"];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let issues = 0;
for (const path of pages) {
  await ctx.clearCookies();
  const page = await ctx.newPage();
  const msgs = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") msgs.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => msgs.push(`pageerror: ${e.message}`));
  await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(800);
  const filtered = msgs.filter((m) => !m.includes("404 (Not Found)")); // probe frames + page 404 attendus
  if (filtered.length) {
    issues += filtered.length;
    console.log(`✗ ${path}:`);
    for (const m of filtered) console.log("   " + m.slice(0, 200));
  } else {
    console.log(`✓ ${path} — console propre`);
  }
  // texte « missing message » visible ?
  const missing = await page.evaluate(() => document.body.innerText.match(/[A-Za-z]+\.[A-Za-z.]+ is not available|missing message/i)?.[0] ?? null);
  if (missing) { console.log(`✗ ${path} — traduction manquante: ${missing}`); issues++; }
  await page.close();
}
await browser.close();
console.log(issues ? `${issues} problème(s)` : "AUCUN problème console/i18n");
