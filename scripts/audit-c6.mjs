// Audit chantier 6 : parcours de réservation joué de bout en bout.
// Haute saison (min 3 nuits), tooltip, calcul exact, erreurs formulaire,
// confirmation. Desktop 1440 + calendrier mobile 390.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outDir = "audits/chantier-6";
mkdirSync(outDir, { recursive: true });

// -- Réplique de la logique déterministe de src/lib/pricing.ts
const OCC = { haute: 60, basse: 25 };
const season = (d) => (d.getMonth() >= 5 && d.getMonth() <= 8 ? "haute" : "basse");
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function isBooked(iso, d) {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) % 1000003;
  return h % 100 < OCC[season(d)];
}
// Cherche un départ libre avec 3 nuits libres consécutives, dans le mois de demain
const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
let startDate = null;
for (let offset = 1; offset < 25; offset++) {
  const cand = new Date(tomorrow);
  cand.setDate(cand.getDate() + offset);
  const lastNight = new Date(cand);
  lastNight.setDate(lastNight.getDate() + 3);
  if (cand.getMonth() !== tomorrow.getMonth()) break;
  if (lastNight.getMonth() !== tomorrow.getMonth()) continue;
  let free = true;
  for (let n = 0; n < 3; n++) {
    const night = new Date(cand);
    night.setDate(night.getDate() + n);
    if (isBooked(toISO(night), night)) {
      free = false;
      break;
    }
  }
  if (free) {
    startDate = cand;
    break;
  }
}
if (!startDate) throw new Error("Aucune fenêtre de 3 nuits libres trouvée ce mois-ci");
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 3);
const plus1 = new Date(startDate);
plus1.setDate(plus1.getDate() + 1);

const dayFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
console.log(`Dates retenues : ${toISO(startDate)} → ${toISO(endDate)} (3 nuits, haute saison)`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
await page.goto(baseUrl + "/reservation", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator("nav[aria-label*='Étape']").scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -90));
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/etape1-calendrier.png` });
console.log("✓ etape1-calendrier");

// Sélection du départ puis tentative J+1 (tooltip min 3 nuits)
await page.locator(`button[aria-label="${dayFmt.format(startDate)}"]`).click();
await page.waitForTimeout(300);
await page.locator(`button[aria-label="${dayFmt.format(plus1)}"]`).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/etape1-tooltip-min-nuits.png` });
console.log("✓ etape1-tooltip-min-nuits");

// Fin valide à J+3
await page.locator(`button[aria-label="${dayFmt.format(endDate)}"]`).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/etape1-range.png` });
console.log("✓ etape1-range");

// Étape 2 : voyageurs (2 adultes par défaut → 3)
await page.locator("button", { hasText: "Continuer" }).click();
await page.waitForTimeout(600);
await page.locator("button[aria-label='Ajouter — Adultes']").click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/etape2-voyageurs.png` });
console.log("✓ etape2-voyageurs");

// Étape 3 : récapitulatif — calcul exact attendu
await page.locator("button", { hasText: "Continuer" }).click();
await page.waitForTimeout(700);
const expected = { hebergement: 3 * 1900, menage: 250, taxe: 2.5 * 3 * 3 };
const total = expected.hebergement + expected.menage + expected.taxe; // 5972.5
const bodyText = await page.locator("main").innerText();
const normalized = bodyText.replace(/[  ]/g, " ");
const checks = [
  ["5 700 €", normalized.includes("5 700 €")],
  ["250 €", normalized.includes("250 €")],
  ["22,50 €", normalized.includes("22,50 €")],
  ["5 972,50 €", normalized.includes("5 972,50 €")],
];
for (const [label, ok] of checks) {
  console.log(`${ok ? "✓" : "✗ ERREUR"} montant ${label}`);
}
if (checks.some(([, ok]) => !ok)) {
  console.log("--- extrait:", normalized.match(/.{0,600}Total.{0,200}/s)?.[0]);
}
await page.screenshot({ path: `${outDir}/etape3-recap.png` });
console.log(`✓ etape3-recap (total attendu ${total} €)`);

// Étape 4 : erreurs de validation puis envoi
await page.locator("button", { hasText: "Continuer" }).click();
await page.waitForTimeout(600);
await page.locator("#bk-name").fill("Scott Thomas");
await page.locator("#bk-email").fill("scott@invalid");
await page.locator("#bk-phone").fill("06");
await page.locator("button", { hasText: "Envoyer la demande" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/etape4-erreurs.png` });
console.log("✓ etape4-erreurs");

await page.locator("#bk-email").fill("scotthomas308@gmail.com");
await page.locator("#bk-phone").fill("+33 6 12 34 56 78");
await page.locator("#bk-message").fill("Arrivée tardive possible ?");
await page.locator("button", { hasText: "Envoyer la demande" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/etape4-envoi.png` });
await page.waitForTimeout(1400);
const confText = await page.locator("main").innerText();
const hasRef = /TDL-2026-\d{4}/.test(confText);
console.log(`${hasRef ? "✓" : "✗ ERREUR"} référence TDL-2026-XXXX présente`);
await page.screenshot({ path: `${outDir}/confirmation.png` });
console.log("✓ confirmation");
await page.close();

// Mobile : calendrier + carte récap repliable
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mp = await mobile.newPage();
await mp.goto(baseUrl + "/reservation", { waitUntil: "networkidle" });
await mp.waitForTimeout(800);
await mp.locator("nav[aria-label*='Étape']").scrollIntoViewIfNeeded();
await mp.evaluate(() => window.scrollBy(0, -80));
await mp.waitForTimeout(500);
await mp.screenshot({ path: `${outDir}/mobile-calendrier.png` });
console.log("✓ mobile-calendrier");

await mp.locator(`button[aria-label="${dayFmt.format(startDate)}"]`).tap();
await mp.locator(`button[aria-label="${dayFmt.format(endDate)}"]`).tap();
await mp.waitForTimeout(600);
await mp.locator("button[aria-expanded]").last().tap(); // ouvre la carte récap
await mp.waitForTimeout(700);
await mp.screenshot({ path: `${outDir}/mobile-recap-ouvert.png` });
console.log("✓ mobile-recap-ouvert");

await browser.close();
console.log(`Audit → ${outDir}/`);
