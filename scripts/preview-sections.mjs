import { chromium } from "playwright";
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
for (const [sel, name] of [["#villa", "manifeste"], ["#espaces", "espaces"]]) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  }, sel);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/sect-${name}.png` });
}
await browser.close();
