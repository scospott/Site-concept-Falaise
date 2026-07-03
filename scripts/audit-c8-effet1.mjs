// Effet 1 : capture le titre en cours de condensation (~250ms) puis stabilisé.
import { chromium } from "playwright";
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl + "/", { waitUntil: "commit" });
await page.waitForTimeout(350);
await page.screenshot({ path: "audits/chantier-8/effet1-condensation-mi.png" });
await page.waitForTimeout(2500);
await page.screenshot({ path: "audits/chantier-8/effet1-final.png" });
console.log("✓ effet1 captures");
await browser.close();
