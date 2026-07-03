// Mesure le JS chargé au premier rendu de chaque page (taille sur le réseau).
import { chromium } from "playwright";
const baseUrl = process.argv[2] ?? "http://localhost:3210";
const browser = await chromium.launch();
for (const path of ["/", "/reservation"]) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const scripts = new Map();
  page.on("response", async (res) => {
    const url = res.url();
    if (url.endsWith(".js") || res.headers()["content-type"]?.includes("javascript")) {
      try {
        const body = await res.body();
        scripts.set(url.split("/").pop().slice(0, 48), body.length);
      } catch {}
    }
  });
  await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const total = [...scripts.values()].reduce((a, b) => a + b, 0);
  console.log(`\n${path} — ${scripts.size} scripts, ${Math.round(total / 1024)} kB JS (non gzip)`);
  const sorted = [...scripts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  for (const [name, size] of sorted) console.log(`  ${String(Math.round(size / 1024)).padStart(5)} kB  ${name}`);
  // vérifie que three n'est pas là (chantier 8 : doit rester hors bundle initial)
  const hasThree = [...scripts.keys()].some((k) => k.toLowerCase().includes("three"));
  console.log(`  three dans le JS initial : ${hasThree ? "OUI (✗)" : "non (✓)"}`);
  await ctx.close();
}
await browser.close();
