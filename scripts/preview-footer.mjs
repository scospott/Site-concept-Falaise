import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
// descendre jusqu'au footer, laisser l'océan se monter et s'animer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2600);
const footer = page.locator("footer");
await footer.screenshot({ path: process.argv[2] });
await browser.close();
