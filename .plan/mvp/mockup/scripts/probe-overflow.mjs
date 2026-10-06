import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" }); await new Promise(r => setTimeout(r, 1500));
const out = await p.evaluate(() => {
  const cw = document.documentElement.clientWidth; const res = [];
  for (const e of document.querySelectorAll("body *")) { const cs = getComputedStyle(e); if (cs.position === "fixed") continue; const r = e.getBoundingClientRect(); const sw = e.scrollWidth, cwE = e.clientWidth;
    if (r.right > cw + 1 || (sw > cwE + 1 && cs.overflowX === "visible")) res.push({ sel: e.tagName.toLowerCase() + "." + String(e.className).trim().split(/\s+/).slice(0, 2).join("."), right: Math.round(r.right), left: Math.round(r.left), sw, cwE, ov: cs.overflowX, parentOv: getComputedStyle(e.parentElement).overflowX }); }
  const deep = [...document.querySelectorAll("main *")].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return (r.right > cw + 1 || r.left < -1) && !e.closest(".marquee") && cs.position !== "fixed"; }).map((e) => ({ sel: e.tagName.toLowerCase() + "." + String(e.className).trim().split(/\s+/).slice(0, 3).join("."), left: Math.round(e.getBoundingClientRect().left), right: Math.round(e.getBoundingClientRect().right), w: Math.round(e.getBoundingClientRect().width) }));
  return { cw, docSW: document.documentElement.scrollWidth, deep: deep.slice(0, 15) };
});
console.log(JSON.stringify(out, null, 1)); await b.close();
