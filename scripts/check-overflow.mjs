import { chromium } from "playwright";
const browser = await chromium.launch();
for (const w of [390, 360]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  for (const path of ["/", "/reservation", "/en"]) {
    const page = await ctx.newPage();
    await page.goto("http://localhost:3210" + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${path}@${w}: overflowX=${overflow}px`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
