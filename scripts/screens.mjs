// Screenshots every key page at 390px and 1440px. Run with the server on :3123.
// node scripts/screens.mjs [outDir]
import { chromium } from "playwright";
import fs from "node:fs/promises";
const out = process.argv[2] || "screenshots";
await fs.mkdir(out, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3123";
const PAGES = ["/", "/story/", "/rand/", "/shop/", "/shop/paul-rand/", "/product/paul-rand-option-3-red-blue-casual-tee/", "/business/", "/business/hult/", "/checkout/", "/demo/", "/credits/"];
const browser = await chromium.launch();
for (const [w, h, tag] of [[390, 844, "m"], [1440, 900, "d"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    // scroll through so reveal animations and lazy images load
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    const name = (p === "/" ? "home" : p.slice(1).replace(/\//g, "_")).slice(0, 40);
    await page.screenshot({ path: `${out}/${tag}-${name}-fold.png` });
    await page.screenshot({ path: `${out}/${tag}-${name}-full.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) console.log("HORIZONTAL OVERFLOW", tag, p);
  }
  await ctx.close();
}
await browser.close();
console.log("done");
