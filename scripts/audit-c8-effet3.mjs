// Effet 3 : brume + lucioles dans les heros (desktop + mobile) + console.
import { chromium } from "playwright";
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // montage +300ms, fade-in 0.8s, brume animée
const hasCanvas = await page.evaluate(() => {
  const canvases = document.querySelectorAll("section canvas");
  return canvases.length;
});
console.log(`canvases dans le hero : ${hasCanvas}`);
await page.screenshot({ path: "audits/chantier-8/effet3-hero-home.png" });
console.log("✓ effet3-hero-home");
await page.waitForTimeout(1800);
await page.screenshot({ path: "audits/chantier-8/effet3-hero-home-t2.png" });
console.log("✓ effet3-hero-home-t2 (comparaison mouvement)");

// réservation
await page.goto(baseUrl + "/reservation", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.screenshot({ path: "audits/chantier-8/effet3-hero-reservation.png" });
console.log("✓ effet3-hero-reservation");
const filtered = errors.filter((e) => !e.includes("404"));
console.log(filtered.length ? "ERREURS:\n" + filtered.join("\n") : "console propre");
await page.close();

// mobile
const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mp.goto(baseUrl + "/", { waitUntil: "networkidle" });
await mp.waitForTimeout(2200);
await mp.screenshot({ path: "audits/chantier-8/effet3-hero-mobile.png" });
console.log("✓ effet3-hero-mobile");

await browser.close();
