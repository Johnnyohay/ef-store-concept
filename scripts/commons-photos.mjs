// Downloads the story photos from Wikimedia Commons (free licenses only) and records
// author, license and source page for every file in data/photo_credits.json.
// Run: node scripts/commons-photos.mjs
import fs from "node:fs/promises";
const UA = { "User-Agent": "HultStudentConcept/1.0 (class project)" };
const PHOTOS = {
  bertil: "File:Bertil Hult.jpg",
  rand: "File:Paul rand loc.jpg",
  lund: "File:Lund, the main building of the university and fountain.JPG",
  "lund-street": "File:Stora Södergatan, Lund on a September evening.jpg",
  brighton: "File:Brighton Palace Pier 2023-07-09 174604.jpg",
  lucerne: "File:Luzern - Chapel Bridge - March 2019 (02).jpg",
  "cycling-tdf-2022": "File:EF Education-EasyPost TdF 2022.jpg",
  "cycling-tdf-2023": "File:EF Education EasyPost - Tour de France 2023 A.jpg",
  "cycling-team-2022": "File:Team presentation of Tour de France 2022 - EF Education-EasyPost 02.jpg",
  "cycling-uran": "File:Rigoberto Uran of EF Education First (48068773373).jpg",
  "charles-river": "File:Charles River - Boston towards Cambridge, MA - DSC03037.JPG",
  "charles-sail": "File:Sailboat on the Charles River with Boston Skyline (54960888829).jpg",
};
const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
let credits = {};
try { credits = JSON.parse(await fs.readFile("data/photo_credits.json", "utf8")); } catch {}
for (const [id, title] of Object.entries(PHOTOS)) {
  if (credits[id]) continue; // resumable: skip what we already have
  const u = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query", format: "json", titles: title, prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1800",
  });
  const page = Object.values((await (await fetch(u, { headers: UA })).json()).query.pages)[0];
  const ii = page.imageinfo[0], m = ii.extmetadata;
  const img = Buffer.from(await (await fetch(ii.thumburl, { headers: UA })).arrayBuffer());
  await fs.writeFile(`data/raw/images/story/${id}.jpg`, img);
  credits[id] = {
    file: `/images/story/${id}.jpg`, title, source: ii.descriptionurl,
    author: strip(m.Artist?.value), license: m.LicenseShortName?.value, license_url: m.LicenseUrl?.value || "",
  };
  await fs.writeFile("data/photo_credits.json", JSON.stringify(credits, null, 2));
  console.log(id, credits[id].license, "|", credits[id].author.slice(0, 50));
  await new Promise((r) => setTimeout(r, 6000));
}
await fs.writeFile("data/photo_credits.json", JSON.stringify(credits, null, 2));
