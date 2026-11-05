// contact sheet: node sheet.mjs out.jpg cols cellW file1 file2 ...
import sharp from "sharp";
const [out, cols, cw, ...files] = process.argv.slice(2);
const C = +cols, W = +cw, H = Math.round(W * 1.25) + 24;
const rows = Math.ceil(files.length / C);
const comps = [];
for (let i = 0; i < files.length; i++) {
  const img = await sharp(files[i]).resize(W, Math.round(W * 1.25), { fit: "cover" }).toBuffer();
  const x = (i % C) * W, y = Math.floor(i / C) * H;
  comps.push({ input: img, left: x, top: y });
  const label = files[i].split("/").pop().replace(".jpg", "").slice(0, 34).replace(/&/g, "");
  comps.push({ input: Buffer.from(`<svg width="${W}" height="24"><rect width="100%" height="100%" fill="white"/><text x="3" y="16" font-size="11" font-family="Helvetica">${label}</text></svg>`), left: x, top: y + H - 24 });
}
await sharp({ create: { width: C * W, height: rows * H, channels: 3, background: "#fff" } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
