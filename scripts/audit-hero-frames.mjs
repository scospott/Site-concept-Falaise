// Branchement frames réelles : hero home à 0/33/66/100 % du scrub,
// desktop 1440 + mobile 390. Vérifie aussi qu'aucune position ne montre
// un canvas noir ou le fallback seul.
import { chromium } from "playwright";
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

async function series(vw, vh, label, dpr) {
  const page = await browser.newPage({
    viewport: { width: vw, height: vh },
    deviceScaleFactor: dpr,
  });
  await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500); // probe + lots de frames + fade NightLayer
  const pinLen = vh * 3.0; // scrubVh: 300
  for (const p of [0, 0.33, 0.66, 1.0]) {
    const y = Math.min(p * pinLen, pinLen - 2);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1400); // laisse les frames du lot arriver
    // le canvas affiche-t-il autre chose que du noir/vide ?
    const check = await page.evaluate(() => {
      const canvas = document.querySelector("section canvas");
      if (!canvas) return { ok: false, reason: "canvas absent (mode fallback ?)" };
      const ctx = canvas.getContext("2d");
      const { width: w, height: h } = canvas;
      if (!w || !h) return { ok: false, reason: "canvas vide" };
      const d = ctx.getImageData(Math.floor(w / 2) - 40, Math.floor(h / 2) - 40, 80, 80).data;
      let sum = 0, opaque = 0;
      for (let i = 0; i < d.length; i += 4) {
        sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
        if (d[i + 3] > 0) opaque++;
      }
      const lum = sum / (d.length / 4);
      const cov = opaque / (d.length / 4);
      return { ok: cov > 0.95 && lum > 8, lum: Math.round(lum), cov: Math.round(cov * 100) };
    });
    const pct = Math.round(p * 100);
    console.log(`${check.ok ? "✓" : "✗"} ${label} ${pct}% — canvas lum=${check.lum ?? "?"} cov=${check.cov ?? "?"}% ${check.reason ?? ""}`);
    await page.screenshot({ path: `audits/hero-frames/${label}-${String(pct).padStart(3, "0")}.png` });
  }
  await page.close();
}

await series(1440, 900, "desktop", 1);
await series(390, 844, "mobile", 2);
await browser.close();
console.log("Audit → audits/hero-frames/");
