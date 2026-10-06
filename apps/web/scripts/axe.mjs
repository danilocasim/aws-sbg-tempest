// Runs axe-core against /dev/ui at phone and desktop widths, and checks every design token resolves in the browser.
// usage: node scripts/axe.mjs [baseUrl]   (needs a running `pnpm dev` and the locally installed Chrome)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";
const require = createRequire(import.meta.url);
const base = process.argv[2] ?? "http://localhost:3000";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const tokensCss = readFileSync(new URL("../../../packages/ui/tokens.css", import.meta.url), "utf8");
const tokenNames = [...new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-first-run"] });
let failed = false;
try {
  for (const [name, vp] of Object.entries({ mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, desktop: { width: 1280, height: 800 } })) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(`${base}/dev/ui`, { waitUntil: "networkidle0" });
    await page.evaluate(axeSource);
    const result = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }));
    const unresolved = await page.evaluate((names) => { const cs = getComputedStyle(document.documentElement); return names.filter((n) => cs.getPropertyValue(n).trim() === ""); }, tokenNames);
    console.log(`${name.padEnd(8)} axe violations: ${result.violations.length}   tokens unresolved: ${unresolved.length}/${tokenNames.length}`);
    for (const v of result.violations) { failed = true; console.log(`  [${v.impact}] ${v.id}: ${v.help}`); for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(" ")}`); }
    if (unresolved.length) { failed = true; console.log("  unresolved tokens:", unresolved.join(", ")); }
    await page.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
