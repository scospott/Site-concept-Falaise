import { chromium } from "playwright";
const out = "/tmp/claude-1000/-home-scotty-Documents-ScottLab-Projets-Where-the-sea-meet-the-sun/db821c65-77c7-465d-8fc1-289c09b76699/scratchpad";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

// sélection déterministe (réplique isBooked)
const OCC = { haute: 60, basse: 25 };
const season = (d) => (d.getMonth() >= 5 && d.getMonth() <= 8 ? "haute" : "basse");
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const isBooked = (iso, d) => { let h=0; for (let i=0;i<iso.length;i++) h=(h*31+iso.charCodeAt(i))%1000003; return h%100<OCC[season(d)]; };
const now = new Date(); const tomorrow = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
let start=null;
for (let o=1;o<25;o++){ const c=new Date(tomorrow); c.setDate(c.getDate()+o);
  const last=new Date(c); last.setDate(last.getDate()+3);
  if (c.getMonth()!==tomorrow.getMonth()||last.getMonth()!==tomorrow.getMonth()) continue;
  let free=true; for(let n=0;n<3;n++){const d=new Date(c); d.setDate(d.getDate()+n); if(isBooked(toISO(d),d)){free=false;break;}}
  if(free){start=c;break;}
}
const end=new Date(start); end.setDate(end.getDate()+3);
const fmtFR=new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long"});

async function run(vw, vh, dpr, mobile, tag) {
  const ctx = await browser.newContext({ viewport:{width:vw,height:vh}, deviceScaleFactor:dpr, isMobile:mobile, hasTouch:mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3210/reservation",{waitUntil:"networkidle"});
  await page.waitForTimeout(1200);
  await page.locator("nav[aria-label*='Étape']").scrollIntoViewIfNeeded();
  await page.evaluate(()=>window.scrollBy(0,-90));
  await page.locator(`button[aria-label="${fmtFR.format(start)}"]`).click();
  await page.locator(`button[aria-label="${fmtFR.format(end)}"]`).click();
  await page.waitForTimeout(700);
  await page.screenshot({path:`${out}/resa-${tag}-etape1.png`});
  // Continuer : carte récap sur desktop, barre basse sur mobile
  const zone = mobile ? "div.fixed.bottom-0" : "aside";
  const cont = page.locator(`${zone} button`, { hasText: "Continuer" });
  await cont.click(); await page.waitForTimeout(600);
  await page.screenshot({path:`${out}/resa-${tag}-voyageurs.png`});
  await cont.click(); await page.waitForTimeout(700);
  await page.screenshot({path:`${out}/resa-${tag}-etape3.png`});
  await cont.click(); await page.waitForTimeout(500);
  // Coordonnées : remplir et envoyer
  await page.fill("#bk-name","Scott Thomas");
  await page.fill("#bk-email","scott@example.com");
  await page.fill("#bk-phone","+33 6 12 34 56 78");
  await page.locator(`${zone} button`, { hasText: "Envoyer la demande" }).click();
  await page.waitForTimeout(2200);
  await page.screenshot({path:`${out}/resa-${tag}-confirmation.png`});
  await ctx.close();
  console.log(`✓ ${tag}`);
}
await run(1440, 1000, 1, false, "desktop");
await run(390, 844, 2, true, "mobile");
await browser.close();
