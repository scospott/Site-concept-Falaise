// Hero réservation v3 (pan 2 segments) : /reservation à
// 0/25/45/50/55/75/100 % du scrub, desktop 1440 + mobile 390.
// Attention particulière au trio 45/50/55 % : jonction entre les 2 clips.
import { chromium } from "playwright";
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

async function series(vw, vh, label, dpr) {
  const page = await browser.newPage({
    viewport: { width: vw, height: vh },
    deviceScaleFactor: dpr,
  });
  await page.goto(baseUrl + "/reservation", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500); // probe + lots de frames
  const pinLen = vh * 2.6; // scrubVh: 260
  for (const p of [0, 0.25, 0.45, 0.5, 0.55, 0.75, 1.0]) {
    const y = Math.min(p * pinLen, pinLen - 2);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1400); // laisse les frames du lot arriver
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
    await page.screenshot({ path: `audits/hero-resa-v3/${label}-${String(pct).padStart(3, "0")}.png` });
  }
  await page.close();
}

await series(1440, 900, "desktop", 1);
await series(390, 844, "mobile", 2);
await browser.close();
console.log("Audit → audits/hero-resa-v3/");
