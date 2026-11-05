# EF Store, Rebuilt (student concept)

**Student concept for Hult MKT-6054. Not affiliated with or endorsed by EF.**

Live: https://johnnyohay.github.io/ef-store-concept/ (a concept banner sits on every page; noindex, so it never shows up in search).

## Run it
```bash
npm install
npm run build                   # static site in out/
npx serve out                   # http://localhost:3000, works with Wi-Fi off
npm run record                  # prints the backup-video recording notes
```
Every push to `main` deploys to GitHub Pages (`.github/workflows/pages.yml`, base path `/ef-store-concept`).
Hidden KPI page: `/demo`.

## Pages
| Route | What |
|---|---|
| `/` | "Wear where you went." Real photo, route ticker, the 9-chapter story, "Find your shirt" |
| `/story` | The same 9 chapters: the kid, London, the basement, the first trip, the ripple, the logo, the jersey, the rules, today |
| `/rand` | Paul Rand tribute, one idea per screen, options revealed one by one, then the collection |
| `/shop`, `/shop/[collection]` | 14 lists (garments + story collections), filters for garment/color/size/price, applied-filters bar |
| `/product/[slug]` | 172 product pages: gallery + thumbnails, round price, swatches, size buttons, size guide (in/cm), story line, shipping, returns |
| `/business`, `/business/hult` | Shop by EF Business: EF Academy + the labeled Hult x EF concept capsule |
| `/checkout` | No form fields. Ends at "This is a demo." |
| `/credits` | Photo licenses and fact sources |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Deliverables for team review
- `data/name_map.csv`: old name → new name, with a note on every rename. Fill the `approved` column.
- `data/price_map.csv`: old price → new round price. Rows marked `REVIEW` merge two old price points (for example, boxy tees $22.25 → $20, same as classic tees).
- `DATA_GAPS.md`: everything we couldn't source, plus one likely data error on the live store.
- `AUDIT.md`: the acceptance checklist and the anti-AI ban list, item by item.
- `data/lookbook.json`: drop the Boston photos into `public/lookbook/` and fill in `src`, `alt`, `caption` (first person). Empty slots show a labeled frame.

## Data pipeline
```bash
npm run scrape        # store.ef.com, 1 req / 1.2 s, HTML cached in data/raw/html
node scripts/rand-assets.mjs   # crops Rand options from product photos + samples accent inks
node scripts/stickers.mjs      # crops product prints used as stickers in the story
node scripts/commons-photos.mjs  # story photos from Wikimedia Commons + credits
node scripts/variants.mjs      # WebP sizes into public/v/ (the static build serves these)
npm run build:data    # -> data/products.json, name_map.csv, price_map.csv
```
Naming rules and draft story lines: `data/naming.json`. Swatch colors: `data/colors.json`. Collections: `data/collections.json`. All facts: `lib/facts.ts`.

## Checks
```bash
npm start &
node scripts/flow-test.mjs        # add to bag -> checkout -> /rand -> /demo, disclaimer on every page, no decimal prices
node scripts/offline-check.mjs    # blocks every non-localhost request
node scripts/screens.mjs screenshots/final   # 390 px and 1440 px
```
(The scripts default to port 3123: `python3 -m http.server 3123 --directory out`.)
