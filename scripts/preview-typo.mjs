// Contrôle typo XXL : heros + débordement horizontal à 1440/390/360.
import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
for (const [w, h, label] of [[1440, 900, "1440"], [390, 844, "390"], [360, 780, "360"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 });
  for (const [name, path] of [["home", "/"], ["resa", "/reservation"], ["home-en", "/en"]]) {
    const page = await ctx.newPage();
    await page.goto("http://localhost:3210" + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    // débordement horizontal ?
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${name}@${label}: overflowX=${overflow}px`);
    await page.screenshot({ path: `${out}/typo-${name}-${label}-hero.png` });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
