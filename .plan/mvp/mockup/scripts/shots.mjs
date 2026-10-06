// Mobile + desktop screenshots with real device emulation, using the locally installed Chrome.
// usage: node scripts/shots.mjs [baseUrl]   → writes ../evidence/mobile/*.png and ../evidence/desktop/*.png
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3100";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const routes = [["landing", "/"], ["profile", "/p/7hq2k"], ["inactive", "/p/q7w2xn"], ["join", "/join"], ["members", "/members"], ["me", "/me"], ["events", "/events"], ["event", "/events/cloud-101-oct-2026"], ["department", "/departments/technical"], ["archive", "/archive"], ["login", "/login"], ["admin", "/admin"], ["admin-apps", "/admin/applications"], ["admin-members", "/admin/members"]];
const devices = { mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, desktop: { width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false } };
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-first-run"] });
for (const [name, vp] of Object.entries(devices)) {
  const dir = new URL(`../../evidence/${name}/`, import.meta.url).pathname; mkdirSync(dir, { recursive: true });
  const page = await browser.newPage(); await page.setViewport(vp);
  for (const [file, path] of routes) {
    await page.goto(base + path, { waitUntil: "networkidle0" });
    // let entrance animations finish, then scroll through so IntersectionObserver reveals fire, then back to top
    await new Promise((r) => setTimeout(r, 1400));
    await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 300) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 80)); } scrollTo({ top: 0, behavior: "instant" }); });
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${dir}${file}.png`, fullPage: true });
    if (file === "landing") await page.screenshot({ path: `${dir}landing-fold.png`, fullPage: false });
    const overflow = await page.evaluate(() => { const cw = document.documentElement.clientWidth; const bad = [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.right > cw + 1 && getComputedStyle(e).position !== "fixed"; }).slice(0, 3).map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "")); return { px: document.documentElement.scrollWidth - cw, bad }; });
    console.log(`${name.padEnd(7)} ${file.padEnd(14)} ${overflow.px > 0 ? "HORIZONTAL OVERFLOW +" + overflow.px + "px  " + overflow.bad.join(", ") : "ok"}`);
    if (file === "landing" && vp.isMobile) { await page.click(".nav-burger"); await new Promise((r) => setTimeout(r, 500)); await page.screenshot({ path: `${dir}landing-menu.png` }); await page.keyboard.press("Escape"); }
  }
  await page.close();
}
await browser.close();
