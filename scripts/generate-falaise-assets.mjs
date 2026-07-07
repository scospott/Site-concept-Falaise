// Assets « La Falaise » : og.jpg (fond bible/k0-cour + tagline) + favicons
// (monogramme F Bodoni crème sur granit). Rendus via Chromium (Playwright)
// pour avoir la vraie Bodoni Moda sans dépendre de fontconfig.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const browser = await chromium.launch();
const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&display=block" rel="stylesheet">`;

// ---- og.jpg 1200×630
{
  const bg = readFileSync("bible/k0-cour.png").toString("base64");
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(`<!doctype html><head>${fontLink}</head>
<body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 50% 55%, rgba(20,22,15,0.52) 0%, rgba(20,22,15,0.28) 55%, rgba(20,22,15,0.10) 100%)"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#F3ECDB">
    <div style="font-family:'Bodoni Moda',serif;font-size:26px;letter-spacing:0.55em;text-indent:0.55em;text-shadow:0 2px 24px rgba(20,22,15,0.5)">LA FALAISE</div>
    <div style="font-family:'Bodoni Moda',serif;font-style:italic;font-size:58px;margin-top:26px;text-shadow:0 2px 28px rgba(20,22,15,0.55)">Là où la mer rencontre la forêt</div>
    <div style="font-family:sans-serif;font-size:15px;letter-spacing:0.35em;text-indent:0.35em;opacity:0.65;margin-top:30px">VILLA · CÔTE SAUVAGE</div>
  </div>
</body>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 90 });
  console.log("✓ public/og.jpg");
  await page.close();
}

// ---- favicon.png 96 + apple-icon.png 180 — F crème sur granit
for (const [size, file] of [[96, "favicon.png"], [180, "apple-icon.png"]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const radius = Math.round(size * 20 / 96);
  const fs = Math.round(size * 58 / 96);
  await page.setContent(`<!doctype html><head>${fontLink}</head>
<body style="margin:0;width:${size}px;height:${size}px;background:transparent">
  <div style="width:100%;height:100%;border-radius:${radius}px;background:#37322A;display:flex;align-items:center;justify-content:center">
    <span style="font-family:'Bodoni Moda',serif;font-size:${fs}px;color:#F3ECDB;transform:translateY(-2%)">F</span>
  </div>
</body>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `public/${file}`, omitBackground: true });
  console.log(`✓ public/${file}`);
  await page.close();
}

await browser.close();
