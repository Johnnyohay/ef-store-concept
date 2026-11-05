// Loads key pages with every non-localhost request blocked and reports any attempt.
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const external = new Set();
await ctx.route("**/*", (r) => {
  const u = new URL(r.request().url());
  if (u.hostname === "localhost") return r.continue();
  external.add(u.href); return r.abort();
});
const page = await ctx.newPage();
for (const p of ["/", "/story", "/rand", "/shop", "/product/paul-rand-option-1-casual-tee", "/business/hult", "/checkout", "/demo"]) {
  const t = Date.now();
  await page.goto((process.env.BASE || "http://localhost:3123") + p, { waitUntil: "load" });
  console.log(p, `${Date.now() - t} ms`);
}
console.log(external.size ? ["EXTERNAL REQUESTS:", ...external].join("\n") : "No external requests. Works offline.");
await b.close();
