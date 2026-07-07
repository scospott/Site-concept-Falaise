import { chromium } from "playwright";
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
for (const [w, h, dpr, mob, tag] of [[1440, 900, 1, false, "1440"], [360, 780, 2, true, "360"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`hero-fr@${tag}: overflowX=${overflow}px`);
  await page.screenshot({ path: `${out}/falaise-hero-${tag}.png` });
  await ctx.close();
}
await browser.close();
