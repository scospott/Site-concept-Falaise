import { chromium } from "playwright";
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2800);
await page.locator("footer").screenshot({ path: `${out}/footer-v2.png` });
await browser.close();
