// QA refonte Solaire : pages complètes FR/EN × desktop/390 + zones clés.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("audits/solaire", { recursive: true });
const baseUrl = "http://localhost:3210";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl"] });

// réplique isBooked pour une sélection déterministe (haute saison)
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

async function sweep(page){ await page.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}window.scrollTo(0,0);}); await page.waitForTimeout(1100);}

// ---- pleines pages FR/EN desktop/mobile
for (const [vw,vh,dpr,label] of [[1440,900,1,"desktop"],[390,844,2,"mobile"]]) {
  const ctx = await browser.newContext({ viewport:{width:vw,height:vh}, deviceScaleFactor:dpr, isMobile:vw<600, hasTouch:vw<600 });
  for (const p of [["home-fr","/"],["home-en","/en"],["resa-fr","/reservation"],["resa-en","/en/reservation"]]) {
    await ctx.clearCookies();
    const page = await ctx.newPage();
    await page.goto(baseUrl+p[1],{waitUntil:"networkidle"});
    await page.waitForTimeout(1500);
    await sweep(page);
    await page.screenshot({path:`audits/solaire/${p[0]}-${label}.png`,fullPage:true});
    console.log(`✓ ${p[0]}-${label}`);
    await page.close();
  }
  await ctx.close();
}

// ---- zones clés desktop
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto(baseUrl+"/",{waitUntil:"networkidle"});
await page.waitForTimeout(2200);
for (const p of [0,0.5,1.0]) {
  await page.evaluate((y)=>window.scrollTo(0,y),Math.min(p*2700,2698));
  await page.waitForTimeout(1300);
  await page.screenshot({path:`audits/solaire/hero-${Math.round(p*100)}.png`});
  console.log(`✓ hero-${Math.round(p*100)}`);
}
await page.locator("#espaces").scrollIntoViewIfNeeded();
await page.evaluate(()=>window.scrollBy(0,60));
await page.waitForTimeout(800);
for (const [n,i] of [["verriere",1],["suite",3],["piscine",6]]) {
  await page.locator(`#espaces ul li:nth-child(${i}) button`).hover();
  await page.waitForTimeout(900);
  await page.screenshot({path:`audits/solaire/espaces-${n}.png`});
  console.log(`✓ espaces-${n}`);
}
const pinTop = await page.evaluate(()=>document.querySelector("#galerie").getBoundingClientRect().top+window.scrollY);
await page.evaluate((y)=>window.scrollTo(0,y),pinTop+1600);
await page.waitForTimeout(1200);
await page.screenshot({path:`audits/solaire/galerie-traversee.png`});
console.log("✓ galerie-traversee");
await page.evaluate((y)=>window.scrollTo(0,y),pinTop+30);
await page.waitForTimeout(800);
await page.locator("#galerie button[data-cursor='view']").first().click();
await page.waitForTimeout(700);
await page.screenshot({path:`audits/solaire/lightbox.png`});
console.log("✓ lightbox");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
await page.locator("button[aria-label*='Ouvrir la conversation']").click();
await page.waitForTimeout(800);
await page.screenshot({path:`audits/solaire/widget-mael.png`});
console.log("✓ widget-mael");
await page.keyboard.press("Escape");
await page.close();

// ---- réservation : calendrier sélection + étape 3
const rp = await browser.newPage({viewport:{width:1440,height:1000}});
await rp.goto(baseUrl+"/reservation",{waitUntil:"networkidle"});
await rp.waitForTimeout(1200);
await rp.locator("nav[aria-label*='Étape']").scrollIntoViewIfNeeded();
await rp.evaluate(()=>window.scrollBy(0,-90));
await rp.locator(`button[aria-label="${fmtFR.format(start)}"]`).click();
await rp.locator(`button[aria-label="${fmtFR.format(end)}"]`).click();
await rp.waitForTimeout(700);
await rp.screenshot({path:"audits/solaire/calendrier-selection.png"});
console.log("✓ calendrier-selection");
await rp.locator("button",{hasText:"Continuer"}).click();
await rp.waitForTimeout(500);
await rp.locator("button",{hasText:"Continuer"}).click();
await rp.waitForTimeout(700);
await rp.screenshot({path:"audits/solaire/etape3-recap.png"});
console.log("✓ etape3-recap");
await rp.close();

// ---- nav mobile ouverte + footer desktop
const mp = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await mp.goto(baseUrl+"/",{waitUntil:"networkidle"});
await mp.waitForTimeout(800);
await mp.locator("header button[aria-controls='mobile-menu']").tap();
await mp.waitForTimeout(900);
await mp.screenshot({path:"audits/solaire/nav-mobile-ouverte.png"});
console.log("✓ nav-mobile-ouverte");
await mp.close();

const fp = await browser.newPage({viewport:{width:1440,height:900}});
await fp.goto(baseUrl+"/reservation",{waitUntil:"networkidle"});
await fp.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await fp.waitForTimeout(2000);
await fp.screenshot({path:"audits/solaire/footer.png"});
console.log("✓ footer");
await fp.close();

await browser.close();
console.log("Audit → audits/solaire/");
