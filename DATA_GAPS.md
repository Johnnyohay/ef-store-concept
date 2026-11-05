# Data gaps

Everything the site needs but the sources don't give us. Nothing in this list was invented to fill the gap.
Scrape date: 2026-11-05 (store.ef.com, 172 products, 0 failures). Machine-generated detail: `data/build_gaps.txt`.

## Needs a source (shows as `[NEEDS SOURCE]` on the site)

| Gap | Where it shows | What would close it |
|---|---|---|
| Delivery time and shipping cost | Every product page, "Shipping" block | store.ef.com/pages/returns-faq covers returns, cancellations and duties but not delivery times or rates. Ask EF / Fourthwall, or read them off a real checkout. |

## Product data

| Gap | Products | Handling |
|---|---|---|
| No size chart (measurements) | 6 caps: `ef-academy-cap-1` to `-4`, `so-rainbow-hat`, `rings-of-color-hat` | Size guide says "The store hasn't published measurements". All caps are "One size". |
| Centimeters | All 166 charts | The store publishes inches only. Centimeters are converted (× 2.54) and labeled as converted. |
| Swatch colors | All 54 garment color names | The store gives names only ("Navy Blazer", "Crunchberry"). `data/colors.json` holds display approximations, labeled as such. The color *name* shown on the product page is the store's. |
| Size upcharges | 165 of 172 products | The store charges more for 2XL+ (+$2 to +$8). The concept uses one price for all sizes. Flagged on every row of `data/price_map.csv`. Team decision. |
| Product on a person | All products | Store photos are flat mockups. The Boston lookbook photos aren't in the project yet (see `data/lookbook.json`). |
| Story lines | All 172 products, 14 collections | Drafts. Each describes only what is visibly printed, or a section 3 fact. `story_line_status: "draft"` until the team approves. |

## Store data that looks wrong (please verify)

- `doodle-light-print-casual-tee-2` is listed on store.ef.com as **"Doodle (Light Print) - Casual Tee"**, the same name as `doodle-light-print-casual-tee`. It only comes in light garments (White, Ivory, Light Green…), like the Dark Print boxy tee. We named it **Dark Print**. Marked VERIFY in `data/name_map.csv`.
- Collection membership is uneven on the live store. For example, "EF Berger King (unfilled) - Boxy Tee" is in Concept while its siblings are in Retro, and the Argyle bike tee ("Polka") is in Concept, not Argyle. We kept the store's membership.

## Claims removed after checking sources (2026-11-05 rebuild)

- **Henry Steiner refined the logo and added the shadowed box and "Education First".** The brief cites careers.ef.com for this, but that page doesn't mention Steiner, the box or the words. Removed from the site until there's a source.
- **"Argyle the Crocodile" is the cycling team's mascot.** Not confirmed anywhere. The site only says the store has its own Argyle, and separately that the team's fans ran #SaveArgyle (Wikipedia, EF Education–EasyPost).
- **The "Japan Cup 2024" tee refers to a race the team rode.** Not confirmed. Not claimed.
- **Brighton *and* Hastings, 406/407 first students.** Only ef.com/about-us is solid: "In 1965 he brought Swedish students to Brighton, England." The site uses just that.

## Story facts we wanted but did not use

- When each Rand option was drawn (beyond "presented in the January 1994 booklet").
- What "Flag Face" was meant to show, and whether Rand named it.
- What "EF Japan", "Japan Cup 2024", "Lucerne" and the city-map tees refer to.
- Anything about EF Academy beyond the store's own collection.
- Hult merch of any kind (none exists in the store data, so the Hult capsule is a labeled concept).

## Images

- Product images are the EF Store's own (516 files). Originals stay in `data/raw/images/` (not in git). The public site serves small WebP versions from `public/v/`, labeled on /credits as the EF Store's, for a class project.
- Story photos: 12 Wikimedia Commons photos under CC0, CC BY, CC BY-SA or public domain. Every one is credited on the photo and on /credits (`data/photo_credits.json`).
- Still missing: our own Boston lookbook photos (`data/lookbook.json`). Product pages show flat mockups only.
- `/rand` uses crops of those same product photos (`public/images/rand/`). No Rand artwork or EF logo is redrawn anywhere.
