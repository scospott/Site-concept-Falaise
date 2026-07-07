import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/nulle-part", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: process.argv[2] });
await browser.close();
