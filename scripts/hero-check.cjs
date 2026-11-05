// Screenshots the home hero after the background film has had time to start.
const { chromium } = require("playwright");
(async () => {
  const base = process.env.BASE || "http://localhost:3124";
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  for (const [w, h, tag] of [[390, 844, "m"], [1440, 900, "d"]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + "/", { waitUntil: "load" });
    await p.waitForTimeout(9000);
    const state = await p.evaluate(() => ({ iframe: !!document.querySelector("iframe"), src: document.querySelector("iframe")?.src?.slice(0, 60) }));
    console.log(tag, JSON.stringify(state));
    await p.screenshot({ path: `${process.argv[2]}/hero-${tag}.png` });
  }
  await b.close();
})();
