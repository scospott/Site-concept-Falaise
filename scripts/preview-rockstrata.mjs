import { chromium } from "playwright";
const back = "M0 120L0 40L88 37L96 24L240 26L246 16L420 19L428 31L600 28L680 30L688 18L850 16L858 27L1000 25L1100 28L1108 20L1260 17L1268 29L1440 26L1440 120Z";
const front = "M0 120L0 70L120 68L128 55L310 53L316 66L354 65L470 63L478 47L560 46L640 49L646 61L820 59L826 68L866 67L1010 65L1018 50L1180 48L1186 60L1256 59L1334 62L1440 60L1440 120Z";
const html = `<!doctype html><body style="margin:0;background:#EFE6D2">
<div style="height:180px"></div>
<svg viewBox="0 0 1440 120" preserveAspectRatio="none" style="display:block;width:100%;height:96px;margin-bottom:-1px">
<path fill="#55503F" d="${back}"/>
<path fill="#3A362C" d="${front}"/>
</svg>
<div style="height:260px;background:#3A362C"></div></body>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 540 } });
await page.setContent(html);
await page.screenshot({ path: process.argv[2] });
await browser.close();
