// End-to-end check of the demo flow at 390px: product view -> pick color/size -> add to bag
// -> checkout -> "This is a demo" -> /rand to the end -> /demo KPIs. Also checks the
// footer disclaimer on every page and that no price on a list page has decimals.
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:3123";
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const fail = [];
const ok = (c, m) => { if (!c) fail.push(m); console.log(c ? "PASS" : "FAIL", m); };

await page.goto(BASE + "/product/paul-rand-option-1-casual-tee");
await page.getByRole("button", { name: /Add to bag/ }).click();
ok(await page.getByText(/^Pick /).isVisible(), "add without size shows a message");
await page.getByRole("button", { name: "White", exact: true }).click();
await page.getByRole("button", { name: "M", exact: true }).click();
await page.getByRole("button", { name: /Add to bag/ }).click();
ok(await page.getByRole("dialog", { name: "Your bag" }).isVisible(), "bag drawer opens after add");
ok((await page.getByRole("dialog", { name: "Your bag" }).innerText()).includes("$20"), "bag shows round price");
await page.getByRole("link", { name: "Checkout" }).click();
await page.getByRole("button", { name: "Place demo order" }).click();
ok(await page.getByText("This is a demo.").isVisible(), "checkout ends at demo screen");
ok((await page.locator("input, textarea, select").count()) === 0, "checkout has no form fields");

await page.goto(BASE + "/rand");
for (let y = 0; y < 30000; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(40); }
await page.waitForTimeout(500);
await page.goto(BASE + "/demo");
await page.waitForTimeout(1200);
const demo = await page.innerText("main");
ok(/Add-to-bag rate\s*\n?\s*\d+%/i.test(demo), "demo shows add-to-bag rate: " + demo.match(/(\d+%)/)?.[1]);
ok(demo.includes("reached the end"), "demo shows /rand completion");

for (const p of ["/", "/story", "/rand", "/shop", "/shop/hats", "/business", "/business/hult", "/checkout", "/product/classic-ef-hat"]) {
  await page.goto(BASE + p);
  ok((await page.locator("footer").innerText()).includes("Student concept for Hult MKT-6054. Not affiliated with or endorsed by EF."), "disclaimer on " + p);
}
await page.goto(BASE + "/shop");
const txt = await page.innerText("main");
ok(!/\$\d+\.\d\d/.test(txt), "no decimal prices on /shop");
await b.close();
console.log(fail.length ? `${fail.length} FAILED` : "ALL PASS");
process.exit(fail.length ? 1 : 0);
