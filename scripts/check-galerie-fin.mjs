import { chromium } from "playwright";
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const pinTop = await page.evaluate(() => document.querySelector("#galerie").getBoundingClientRect().top + window.scrollY);
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 4000);
await page.waitForTimeout(600);
await page.evaluate((y) => window.scrollTo(0, y), pinTop + 3400);
await page.waitForTimeout(1600);
const x = await page.evaluate(() => {
  const track = document.querySelector("#galerie .will-change-transform");
  const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
  return { tx: m.m41, max: track.scrollWidth - window.innerWidth };
});
console.log("translateX:", Math.round(x.tx), "/ max:", -x.max);
await page.screenshot({ path: `${out}/galerie-fin2.png` });
await browser.close();
