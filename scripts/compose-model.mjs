// usage: node scripts/compose-model.mjs cutout.png background.jpg out.jpg
// Places the cut-out (AI-generated) photo of Jonathan over a real, CC-licensed photo of an
// EF location: cover-crop to 1136x1408 with a soft lens blur behind him.
import sharp from "sharp";
const [cut, bgf, out] = process.argv.slice(2);
const W = 1136, H = 1408;
const bg = await sharp(bgf).resize(W, H, { fit: "cover", position: "centre" }).blur(3.5).toBuffer();
const person = await sharp(cut).resize(W, H, { fit: "cover" }).png().toBuffer();
await sharp(bg).composite([{ input: person }]).jpeg({ quality: 92 }).toFile(out);
console.log("ok", out);
