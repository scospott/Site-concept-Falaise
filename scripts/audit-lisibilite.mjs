// QA chantier Lisibilité + Avis + Réservation — captures dans audits/lisibilite/
// + scan des textes < 14px (informatif interdit sous 14px).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("audits/lisibilite", { recursive: true });
const base = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

// Scan : liste les nœuds texte visibles < 14px
async function scanSmallText(page, tag) {
  const smalls = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const txt = node.textContent.trim();
      if (!txt) continue;
      const el = node.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const fs = parseFloat(cs.fontSize);
      if (fs < 14) out.push({ fs: Math.round(fs * 10) / 10, txt: txt.slice(0, 60), cls: (el.className || "").toString().slice(0, 80) });
    }
    return out;
  });
  if (smalls.length) {
    console.log(`⚠ ${tag} — textes < 14px :`);
    for (const s of smalls) console.log(`   ${s.fs}px « ${s.txt} » [${s.cls}]`);
  } else {
    console.log(`✓ ${tag} — aucun texte < 14px`);
  }
}

async function sweep(page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1100);
}

// ---- Accueil pleine page FR desktop + 390
for (const [vw, vh, dpr, mob, tag] of [[1440, 900, 1, false, "desktop"], [390, 844, 2, true, "390"]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await sweep(page);
  await page.screenshot({ path: `audits/lisibilite/accueil-${tag}.png`, fullPage: true });
  await scanSmallText(page, `accueil-${tag}`);
  console.log(`✓ accueil-${tag}`);
  await page.close();
  await ctx.close();
}

// ---- Galerie en traversée + avis desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const pinTop = await page.evaluate(() => document.querySelector("#galerie").getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), pinTop + 1400);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: "audits/lisibilite/galerie-traversee.png" });
  console.log("✓ galerie-traversee");
  await page.evaluate(() => document.querySelector("#avis").scrollIntoView());
  await page.waitForTimeout(1600);
  await page.screenshot({ path: "audits/lisibilite/avis-desktop-haut.png" });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.85));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "audits/lisibilite/avis-desktop-grille.png" });
  console.log("✓ avis-desktop");
  await page.close();
}

// ---- Avis mobile
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelector("#avis").scrollIntoView());
  await page.waitForTimeout(1600);
  await page.screenshot({ path: "audits/lisibilite/avis-mobile-haut.png" });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.6));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "audits/lisibilite/avis-mobile-grille.png" });
  console.log("✓ avis-mobile");
  await ctx.close();
}

// ---- Réservation : parcours complet desktop + 390
const OCC = { haute: 60, basse: 25 };
const season = (d) => (d.getMonth() >= 5 && d.getMonth() <= 8 ? "haute" : "basse");
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const isBooked = (iso, d) => { let h = 0; for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) % 1000003; return h % 100 < OCC[season(d)]; };
const now = new Date(); const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
let start = null;
for (let o = 1; o < 25; o++) {
  const c = new Date(tomorrow); c.setDate(c.getDate() + o);
  const last = new Date(c); last.setDate(last.getDate() + 3);
  if (c.getMonth() !== tomorrow.getMonth() || last.getMonth() !== tomorrow.getMonth()) continue;
  let free = true;
  for (let n = 0; n < 3; n++) { const d = new Date(c); d.setDate(d.getDate() + n); if (isBooked(toISO(d), d)) { free = false; break; } }
  if (free) { start = c; break; }
}
const end = new Date(start); end.setDate(end.getDate() + 3);
const fmtFR = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

async function parcours(vw, vh, dpr, mob, tag) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob });
  const page = await ctx.newPage();
  await page.goto(base + "/reservation", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.locator("nav[aria-label*='Étape']").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -90));
  await page.locator(`button[aria-label="${fmtFR.format(start)}"]`).click();
  await page.locator(`button[aria-label="${fmtFR.format(end)}"]`).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `audits/lisibilite/resa-${tag}-etape1-selection.png` });
  await scanSmallText(page, `resa-${tag}-etape1`);
  const zone = mob ? "div.fixed.bottom-0" : "aside";
  const cont = page.locator(`${zone} button`, { hasText: "Continuer" });
  await cont.click(); await page.waitForTimeout(600);
  await page.screenshot({ path: `audits/lisibilite/resa-${tag}-voyageurs.png` });
  await scanSmallText(page, `resa-${tag}-voyageurs`);
  await cont.click(); await page.waitForTimeout(700);
  await page.screenshot({ path: `audits/lisibilite/resa-${tag}-etape3.png` });
  await cont.click(); await page.waitForTimeout(500);
  await page.fill("#bk-name", "Scott Thomas");
  await page.fill("#bk-email", "scott@example.com");
  await page.fill("#bk-phone", "+33 6 12 34 56 78");
  await page.screenshot({ path: `audits/lisibilite/resa-${tag}-coordonnees.png` });
  await scanSmallText(page, `resa-${tag}-coordonnees`);
  await page.locator(`${zone} button`, { hasText: "Envoyer la demande" }).click();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `audits/lisibilite/resa-${tag}-confirmation.png` });
  await scanSmallText(page, `resa-${tag}-confirmation`);
  console.log(`✓ resa-${tag}`);
  await ctx.close();
}
await parcours(1440, 1000, 1, false, "desktop");
await parcours(390, 844, 2, true, "390");

await browser.close();
console.log("Audit → audits/lisibilite/");
