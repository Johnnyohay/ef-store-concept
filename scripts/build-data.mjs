// Builds data/products.json, data/price_map.csv and data/name_map.csv from the raw scrape.
// Inputs:  data/raw/products.raw.json (scrape.mjs)
//          data/naming.json           (hand-written design renames + draft story lines)
//          data/colors.json           (garment color name -> swatch hex)
// Run: node scripts/build-data.mjs
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const rd = async (p) => JSON.parse(await fs.readFile(path.join(ROOT, p), "utf8"));
const raw = await rd("data/raw/products.raw.json");
const naming = await rd("data/naming.json");
const colorHex = await rd("data/colors.json");

// Primary collection: the most story-specific collection a product belongs to.
const PRIORITY = ["paul-rand", "ef-academy", "argyle-the-crocodile", "the-fe-collection", "retro", "ef-logo", "concept"];
const SHORT = {
  "paul-rand": "Rand", "ef-academy": "Academy", "argyle-the-crocodile": "Argyle",
  "the-fe-collection": "FE", retro: "Retro", "ef-logo": "Logo", concept: "Concept",
};

function garmentOf(legacy) {
  const l = legacy.toLowerCase();
  if (l.includes("boxy")) return "Boxy Tee";
  if (l.includes("zip")) return "Zip Hoodie";
  if (l.includes("hoodie")) return "Hoodie";
  if (/\b(hat|cap|beanie|bucket)\b/.test(l)) return "Hat";
  if (l.includes("tee") || l.includes("t-shirt")) return "Tee";
  return "Tee";
}

// "Paul Rand Option 3 (Red/Blue) - Casual Tee" -> { design: "Paul Rand Option 3", print: "Red/Blue" }
function splitLegacy(legacy) {
  const base = legacy.replace(/\s+-\s+[^-]+$/, "").trim();
  const m = base.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { design: m[1].trim(), print: m[2].trim() } : { design: base, print: "" };
}

const round5 = (n) => Math.round(n / 5) * 5;
const csv = (rows) => rows.map((r) => r.map((v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}).join(",")).join("\n") + "\n";

const gaps = [];
const products = [];
const unknownColors = new Set();

for (const r of raw.products) {
  const garment = garmentOf(r.legacy_name);
  const { design: legacyDesign, print: legacyPrint } = splitLegacy(r.legacy_name);
  const collection = PRIORITY.find((c) => r.collections.includes(c)) || "concept";
  const override = naming.products[r.slug];
  const rule = override ? { name: override.design, print: override.print, story: override.story, note: override.note ?? "Numbered legacy name; named by what's printed." } : naming.designs[legacyDesign];
  if (!rule) gaps.push(`No naming rule for design "${legacyDesign}" (${r.slug}); kept legacy design name.`);
  const design = rule?.name ?? legacyDesign;
  const print = rule && "print" in rule ? rule.print : (naming.prints[legacyPrint] ?? legacyPrint);
  if (legacyPrint && !(legacyPrint in naming.prints) && !(rule && "print" in rule)) gaps.push(`Print "${legacyPrint}" (${r.slug}) has no mapping; kept as-is.`);
  const garmentLabel = naming.garments[garment];
  const new_name = `${SHORT[collection]} ${design} ${garmentLabel}${print ? `, ${print}` : ""}`.replace(/\s+/g, " ");

  const prices = [...new Set(r.prices_usd)].sort((a, b) => a - b);
  const legacy_price_usd = prices[0];
  const new_price_usd = round5(legacy_price_usd);

  const colors = r.colors.map((name) => {
    const hex = colorHex[name] ?? null;
    if (!hex) unknownColors.add(name);
    return { name, hex };
  });

  const details = (r.details["More details"] || []).filter(Boolean);
  const returns = r.details["Quality Guarantee & Returns"] || [];
  if (!details.length) gaps.push(`${r.slug}: no fabric/fit details published.`);
  if (!returns.length) gaps.push(`${r.slug}: no returns text published.`);
  if (!r.size_chart?.rows?.length) gaps.push(`${r.slug}: no size chart (measurements) published.`);
  if (prices.length > 1) gaps.push(`${r.slug}: multiple variant prices ${prices.join(" / ")}; new price uses the lowest.`);

  products.push({
    id: r.slug,
    legacy_name: r.legacy_name,
    new_name,
    design,
    print,
    collection,
    collections: r.collections.filter((c) => PRIORITY.includes(c)),
    garment,
    legacy_price_usd,
    new_price_usd,
    legacy_prices_all: prices,
    colors,
    sizes: r.sizes,
    images: r.images,
    story_line: rule?.story ?? "",
    story_line_status: "draft",
    naming_note: rule?.note ?? "",
    details,
    returns,
    size_chart: r.size_chart?.rows?.length ? { unit: "in", rows: r.size_chart.rows } : null,
    source_url: r.source_url,
  });
  if (!rule?.story) gaps.push(`${r.slug}: no story line drafted.`);
}

// Stable order: collection priority, then design, then garment.
const G = ["Tee", "Boxy Tee", "Hoodie", "Zip Hoodie", "Hat"];
products.sort((a, b) =>
  PRIORITY.indexOf(a.collection) - PRIORITY.indexOf(b.collection) ||
  a.design.localeCompare(b.design) || a.print.localeCompare(b.print) || G.indexOf(a.garment) - G.indexOf(b.garment));

// Name collisions would break "one name, one product".
const seen = new Map();
for (const p of products) {
  if (seen.has(p.new_name)) gaps.push(`Name collision: "${p.new_name}" used by ${seen.get(p.new_name)} and ${p.id}.`);
  seen.set(p.new_name, p.id);
}
for (const c of unknownColors) gaps.push(`Color "${c}" has no swatch hex in data/colors.json.`);

await fs.writeFile(path.join(ROOT, "data/products.json"),
  JSON.stringify({ built_at: new Date().toISOString(), scraped_at: raw.scraped_at, count: products.length, products }, null, 2));

// Price map: flag cases where rounding merges two old price points or moves a price by more than $2.
const byOld = new Map();
for (const p of products) byOld.set(p.legacy_price_usd, p.new_price_usd);
const mergedTargets = new Map();
for (const [o, n] of byOld) mergedTargets.set(n, [...(mergedTargets.get(n) || []), o]);
const priceRows = [["id", "garment", "legacy_name", "legacy_price_usd", "new_price_usd", "change_usd", "flag"]];
for (const p of products) {
  const flags = [];
  // Only flag merges that erase a real price gap (old prices more than $1.50 apart).
  const olds = mergedTargets.get(p.new_price_usd).filter((o) => Math.abs(o - p.legacy_price_usd) > 1.5);
  if (olds.length) {
    const others = [...new Set(products.filter((q) => olds.includes(q.legacy_price_usd)).map((q) => `${q.garment} $${q.legacy_price_usd.toFixed(2)}`))];
    flags.push(`REVIEW: now same $${p.new_price_usd} as ${others.join(", ")}`);
  }
  if (p.new_price_usd < 20 || p.new_price_usd > 40) flags.push("outside the $20-$40 tiers");
  if (p.legacy_prices_all.length > 1) {
    const up = p.legacy_prices_all.at(-1) - p.legacy_prices_all[0];
    flags.push(`one price for all sizes; old size upcharge up to +$${up.toFixed(2)} removed`);
  }
  priceRows.push([p.id, p.garment, p.legacy_name, p.legacy_price_usd.toFixed(2), p.new_price_usd, (p.new_price_usd - p.legacy_price_usd).toFixed(2), flags.join("; ")]);
}
await fs.writeFile(path.join(ROOT, "data/price_map.csv"), csv(priceRows));

const nameRows = [["id", "legacy_name", "new_name", "collection", "garment", "note", "approved"]];
for (const p of products) nameRows.push([p.id, p.legacy_name, p.new_name, p.collection, p.garment, p.naming_note, ""]);
await fs.writeFile(path.join(ROOT, "data/name_map.csv"), csv(nameRows));

await fs.writeFile(path.join(ROOT, "data/build_gaps.txt"), gaps.join("\n") + "\n");
console.log(`${products.length} products, ${gaps.length} gap lines, ${unknownColors.size} unknown colors`);
