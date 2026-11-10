// Pre-builds responsive WebP variants for the static (GitHub Pages) build, since
// next/image can't resize at request time there. lib/imageLoader.ts picks a width.
//   public/images/<dir>/<name>.jpg  ->  public/v/<w>/<dir>/<name>.webp
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
const SETS = { products: [480, 960], rand: [480, 960], story: [800, 1600], stickers: [480], models: [480, 960] };
const QUALITY = { models: 88 }; // faces need more detail than flat product shots
let n = 0;
for (const [dir, widths] of Object.entries(SETS)) {
  const src = `data/raw/images/${dir}`; // originals live outside public/
  for (const f of await fs.readdir(src)) {
    if (!/\.jpe?g$/i.test(f)) continue;
    for (const w of widths) {
      const out = `public/v/${w}/${dir}/${f.replace(/\.jpe?g$/i, ".webp")}`;
      try { await fs.access(out); continue; } catch {}
      await fs.mkdir(path.dirname(out), { recursive: true });
      await sharp(`${src}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY[dir] ?? 74 }).toFile(out);
      n++;
    }
  }
}
console.log("wrote", n, "variants");
