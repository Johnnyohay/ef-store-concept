// Crops the chest print from EF Store product photos to use as "stickers" in the story.
// Crops of the store's own photos only; nothing is redrawn.
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = [
  "argyle-bros-casual-tee", "versargyle-casual-tee", "argyla-casual-tee", "pyxel-casual-tee", "polka-casual-tee",
  "teegar-casual-tee", "abracadabra-black-cats-casual-tee", "no-signal-casual-tee", "wtef-casual-tee", "3def-casual-tee",
  "london-bus-casual-tee", "retro-horizon-casual-tee", "evolution-dark-print-casual-tee", "stayin-alive-technicolor-casual-tee",
  "so-rainbow-casual-tee", "ilovefe-casual-tee", "smilef-pink-print-casual-tee", "first-born-filled-casual-tee",
];
await fs.mkdir("data/raw/images/stickers", { recursive: true });
for (const id of IDS) {
  const src = `data/raw/images/products/${id}-1.jpg`;
  const m = await sharp(src).metadata();
  const size = Math.round(m.width * 0.46);
  await sharp(src)
    .extract({ left: Math.round(m.width * 0.27), top: Math.round(m.height * 0.17), width: size, height: size })
    .jpeg({ quality: 88 }).toFile(`data/raw/images/stickers/${id}.jpg`);
}
console.log(IDS.length, "stickers");
