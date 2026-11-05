// Cut-paper collage: the user's own headshot placed on the EF Store's real tee mockup.
// Not a photo of the shirt being worn; every output is labeled "Collage" on the site.
// Usage: node scripts/collage-model.mjs <headshot> <product-id> <out.jpg>
import sharp from "sharp";
const [head, id, out] = process.argv.slice(2);
const TOP = 620; // white space added above the shirt for the head
const tee = `data/raw/images/products/${id}-1.jpg`;
const t = await sharp(tee).metadata();

// Head + neck cut with a soft-edged mask (ellipse for the head, a column for the neck,
// fading out at the bottom so it tucks into the collar).
const hm = await sharp(head).metadata();
const mask = Buffer.from(`<svg width="${hm.width}" height="${hm.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.64" stop-color="#fff"/><stop offset="0.68" stop-color="#000"/>
    </linearGradient>
    <filter id="b"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>
  <g filter="url(#b)">
    <rect width="100%" height="100%" fill="url(#g)"/>
  </g>
</svg>`);
const shape = Buffer.from(`<svg width="${hm.width}" height="${hm.height}" xmlns="http://www.w3.org/2000/svg">
  <filter id="b"><feGaussianBlur stdDeviation="2"/></filter>
  <g filter="url(#b)" fill="#fff">
    <ellipse cx="166" cy="168" rx="84" ry="126"/>
    <rect x="124" y="210" width="88" height="80" rx="24"/>
  </g>
</svg>`);
// Flatten both on black first, so "outside the shape" is 0 and not transparent-white.
const fade = await sharp(mask).flatten({ background: "#000" }).png().toBuffer();
const shapeMask = await sharp(shape).flatten({ background: "#000" })
  .composite([{ input: fade, blend: "multiply" }])
  .extractChannel(0).raw().toBuffer({ resolveWithObject: true });
// Two steps: in one pipeline sharp would drop the new alpha with removeAlpha().
const rgb = await sharp(head).removeAlpha().png().toBuffer();
const cut = await sharp(rgb)
  .joinChannel(shapeMask.data, { raw: { width: shapeMask.info.width, height: shapeMask.info.height, channels: 1 } })
  .png().toBuffer();

const scale = 2.15;
const hw = Math.round(hm.width * scale), hh = Math.round(hm.height * scale);
const headScaled = await sharp(cut).resize(hw, hh).toBuffer();
const neckX = 168 * scale; // neck centre in the scaled head
const collarX = 764, collarY = 292; // measured on the store mockup
const left = Math.round(collarX - neckX);
const top = Math.round(TOP + collarY - 268 * scale); // source y=268 (base of neck) sits just inside the collar

// sharp crops before compositing in one pipeline, so composite first, then crop.
const full = await sharp({ create: { width: t.width, height: t.height + TOP, channels: 3, background: "#ffffff" } })
  .composite([
    { input: tee, left: 0, top: TOP },
    { input: headScaled, left, top },
    // Lay the shirt's own collar back over the neck so the head sits inside the shirt.
    { input: await sharp(tee).extract({ left: 560, top: collarY + 18, width: 410, height: 70 }).toBuffer(), left: 560, top: TOP + collarY + 18 },
  ])
  .png().toBuffer();
await sharp(full)
  .extract({ left: 0, top: Math.max(0, top - 80), width: t.width, height: Math.min(t.height + TOP - Math.max(0, top - 80), 1900) })
  .jpeg({ quality: 88 })
  .toFile(out);
console.log("wrote", out);
