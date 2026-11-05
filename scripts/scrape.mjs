// Stage 1 scraper for the EF Store concept (Hult MKT-6054 student project).
// - Respects https://store.ef.com/robots.txt (collections/products are not disallowed).
// - Rate limited: one request every 1.2 s, sequential.
// - Writes raw product records to data/raw/products.raw.json and images to public/images/.
// Run: node scripts/scrape.mjs
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://store.ef.com";
const UA = "Mozilla/5.0 (Hult MKT-6054 student class project; local demo only)";
const DELAY_MS = 1200;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RAW_DIR = path.join(ROOT, "data", "raw");
const IMG_DIR = path.join(ROOT, "data", "raw", "images", "products");

const COLLECTIONS = [
  "casual-tshirts", "boxy-t-shirts", "pullover-hoodies", "zip-hoodies", "hats",
  "ef-logo", "concept", "paul-rand", "retro", "argyle-the-crocodile",
  "the-fe-collection", "ef-academy",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
const CACHE_DIR = path.join(RAW_DIR, "html");
async function get(url, binary = false) {
  // HTML is cached on disk so a re-run never hits the store twice for the same page.
  const key = !binary && path.join(CACHE_DIR, url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "_") + ".html");
  if (key) { try { return await fs.readFile(key, "utf8"); } catch {} }
  const wait = last + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  last = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  if (binary) return Buffer.from(await res.arrayBuffer());
  const text = await res.text();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(key, text);
  return text;
}

const decode = (s) =>
  s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
   .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function productLinks(html) {
  const set = new Set();
  for (const m of html.matchAll(/href="\/products\/([a-z0-9-]+)"/g)) {
    if (m[1] !== "gift-card" && m[1] !== "collections") set.add(m[1]);
  }
  return [...set];
}

function hasNextPage(html, slug, page) {
  return html.includes(`/collections/${slug}/${page + 1}"`);
}

function parseSizeChart(html) {
  const body = html.match(/size-chart__body">([\s\S]*?)<\/tbody>/);
  if (!body) return null;
  const headers = [...html.matchAll(/size-chart__cell--title">\s*([^<]+?)\s*</g)].map((m) => m[1].trim());
  const rows = [];
  for (const row of body[1].split("data-size-guide").slice(1)) {
    const label = row.match(/data-size-label="([^"]+)"/)?.[1];
    const vals = {};
    for (const v of row.matchAll(/data-size-type="([^"]+)">([\s\S]*?)<\/div>/g)) {
      const t = strip(v[2].replace(/<span class="size-chart__value-slash">\/<\/span>/g, "/"));
      // "20 1/2" -> 20.5 ; "26.62" -> 26.62
      const m = t.match(/^(\d+(?:\.\d+)?)(?:\s+(\d+)\s*\/\s*(\d+))?$/);
      vals[v[1]] = m ? +(+m[1] + (m[2] ? +m[2] / +m[3] : 0)).toFixed(2) : t;
    }
    if (label) rows.push({ size: label, ...vals });
  }
  return { unit: "in", headers, rows };
}

function parseAccordions(html) {
  const out = {};
  for (const m of html.matchAll(/accordion__title">([^<]+)<\/h2>[\s\S]*?html-formatter">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)) {
    const items = [...m[2].replace(/<div class='hidden'[\s\S]*$/, "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((x) => strip(x[1]));
    out[m[1].trim()] = items.length ? items : [strip(m[2])];
  }
  return out;
}

function parseProduct(html, slug) {
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  let product = null;
  for (const block of ld) {
    try {
      const j = JSON.parse(block.replace(/^<script[^>]*>|<\/script>$/g, ""));
      if (j["@type"] === "Product") product = j;
    } catch {}
  }
  if (!product) throw new Error("no Product JSON-LD for " + slug);
  const offers = product.offers || [];
  const colors = [], sizes = [], prices = new Set();
  for (const o of offers) {
    const [c, s] = String(o.name).split(",").map((x) => x.trim());
    if (c && !colors.includes(c)) colors.push(c);
    if (s && !sizes.includes(s)) sizes.push(s);
    prices.add(o.price);
  }
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  return {
    slug,
    legacy_name: decode(product.name),
    source_url: `${BASE}/products/${slug}`,
    prices_usd: [...prices].map(Number),
    colors, sizes,
    offers: offers.map((o) => ({ name: o.name, price: Number(o.price), availability: o.availability?.split("/").pop() })),
    image_urls: product.image || [],
    description_meta: desc ? decode(desc) : "",
    details: parseAccordions(html),
    size_chart: parseSizeChart(html),
  };
}

async function main() {
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(IMG_DIR, { recursive: true });

  const robots = await get(`${BASE}/robots.txt`);
  await fs.writeFile(path.join(RAW_DIR, "robots.txt"), robots);

  const membership = {}; // slug -> [collections]
  for (const c of COLLECTIONS) {
    for (let page = 1; page < 20; page++) {
      const url = page === 1 ? `${BASE}/collections/${c}` : `${BASE}/collections/${c}/${page}`;
      let html;
      try { html = await get(url); } catch (e) { console.warn("skip", e.message); break; }
      const links = productLinks(html);
      for (const s of links) (membership[s] ||= []).includes(c) || membership[s].push(c);
      console.log(`${url} -> ${links.length} products`);
      if (!hasNextPage(html, c, page) || links.length === 0) break;
    }
  }

  const slugs = Object.keys(membership);
  console.log(`${slugs.length} unique products`);
  const products = [];
  const gaps = [];
  for (const slug of slugs) {
    try {
      const p = parseProduct(await get(`${BASE}/products/${slug}`), slug);
      p.collections = membership[slug];
      p.images = [];
      for (let i = 0; i < p.image_urls.length && i < 6; i++) {
        const file = `${slug}-${i + 1}.jpg`;
        const dest = path.join(IMG_DIR, file);
        try {
          await fs.access(dest);
        } catch {
          // imgproxy URLs are signed, so they are fetched exactly as published.
          await fs.writeFile(dest, await get(p.image_urls[i], true));
        }
        p.images.push(`/images/products/${file}`);
      }
      products.push(p);
      console.log("ok", slug, p.colors.length, "colors", p.images.length, "imgs");
    } catch (e) {
      gaps.push({ slug, error: e.message });
      console.warn("fail", slug, e.message);
    }
  }
  await fs.writeFile(path.join(RAW_DIR, "products.raw.json"), JSON.stringify({ scraped_at: new Date().toISOString(), products, gaps }, null, 2));
  console.log("done", products.length, "products,", gaps.length, "failures");
}

main().catch((e) => { console.error(e); process.exit(1); });
