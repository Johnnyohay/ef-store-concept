// Crops each logo option from the EF Store's own product photo (no redrawing),
// and samples the story accent colors from the printed inks.
// Run: node scripts/rand-assets.mjs
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "data/raw/images/products";
const OUT = "data/raw/images/rand";
await fs.mkdir(OUT, { recursive: true });

const CROPS = [
  { out: "option-1", src: "paul-rand-option-1-casual-tee-1", box: { left: 512, top: 440, width: 512, height: 512 } },
  { out: "option-2", src: "paul-rand-option-2-multicolor-casual-tee-1", box: { left: 512, top: 440, width: 512, height: 512 } },
  { out: "option-3", src: "paul-rand-option-3-red-blue-casual-tee-1", box: { left: 512, top: 440, width: 512, height: 512 } },
  { out: "flag-face", src: "flag-face-dark-print-casual-tee-1", box: { left: 470, top: 380, width: 620, height: 775 } },
];
for (const c of CROPS) {
  await sharp(`${SRC}/${c.src}.jpg`).extract(c.box).jpeg({ quality: 88 }).toFile(`${OUT}/${c.out}.jpg`);
}

// Sample inks: saturated pixels from the Option 1 (red/blue) and Option 2 (multicolor) prints.
async function inks(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const buckets = {};
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max - min < 90) continue; // skip whites, blacks, grays
    let h;
    if (max === r) h = ((g - b) / (max - min)) % 6;
    else if (max === g) h = (b - r) / (max - min) + 2;
    else h = (r - g) / (max - min) + 4;
    h = (h * 60 + 360) % 360;
    const name = h < 20 || h >= 340 ? "red" : h < 70 ? "yellow" : h < 170 ? "green" : h < 260 ? "blue" : "purple";
    (buckets[name] ||= []).push([r, g, b]);
  }
  const out = {};
  for (const [k, px] of Object.entries(buckets)) {
    if (px.length < 200) continue;
    // median per channel, robust to anti-aliased edges
    const med = [0, 1, 2].map((ch) => px.map((p) => p[ch]).sort((a, b) => a - b)[px.length >> 1]);
    out[k] = { hex: "#" + med.map((v) => v.toString(16).padStart(2, "0")).join(""), n: px.length };
  }
  return out;
}
const report = {
  "option-1": await inks(`${OUT}/option-1.jpg`),
  "option-2": await inks(`${OUT}/option-2.jpg`),
  "option-3": await inks(`${OUT}/option-3.jpg`),
};
await fs.writeFile("data/sampled_colors.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
