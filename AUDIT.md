# Self-audit (2026-11-05, after the story rebuild)

How it was checked: `scripts/flow-test.mjs` (browser test, 17 checks, all pass), `scripts/offline-check.mjs`, Lighthouse 12.8.2 mobile, grep over `app/`, `components/`, `lib/`, `data/`, and screenshots at 390 px and 1440 px in `screenshots/final/`.

## Acceptance checklist (brief section 8)

| Item | Result | Evidence |
|---|---|---|
| Stranger gets what/who in 5 s | Pass (to be confirmed by the class 5-second test) | First screen H1: "EF merch for travelers, alumni, students and the Hult community." `screenshots/final/m-home-fold.png` |
| Every price round, no decimals | Pass | `lib/format.ts` (`usd()` rounds). `data/price_map.csv`. flow-test: "no decimal prices on /shop" |
| Names follow `[Collection] [Design] [Garment]` | Pass | `data/name_map.csv`. `legacy_name` kept only in `data/products.json` (and used for search matching, never displayed) |
| Rand page: cites EF history, links 1994 booklet, redraws nothing (Steiner line removed: not in the cited source) | Pass | `/rand` source note + paulrand.design link. Images are crops of store photos (`scripts/rand-assets.mjs`). No SVG/CSS logo anywhere |
| Hult under Shop by EF Business, "associated with EF", labeled concept | Pass | Nav → Shop by EF Business → Hult. `/business/hult` uses EF's wording verbatim. "Concept · not in stock" tag, cards can't be bought |
| Every fact traces to section 3; unknowns logged | Pass | All facts in `lib/facts.ts`. One `[NEEDS SOURCE]` (delivery time and cost). `DATA_GAPS.md` |
| Disclaimer in footer on every page | Pass | `components/Footer.tsx`. flow-test checks 9 page types |
| Offline, phone, < 2 s per page | Pass | offline-check: 0 external requests, every page < 40 ms locally. Lighthouse mobile LCP 2.2–2.8 s (that's Lighthouse's throttled slow-4G simulation, not real load time) |

## Lighthouse (mobile)

| Page | Performance | Accessibility |
|---|---|---|
| `/` | 99 | 100 |
| `/story` | 99 | 100 |
| `/rand` | 99 | 100 |
| `/shop` | 96 | 100 |
| `/shop/paul-rand` | 96 | 100 |
| `/shop/retro` | 97 | 100 |
| `/product/paul-rand-option-1-casual-tee` | 97 | 100 |
| `/business/hult` | 99 | 100 |
| `/checkout` | 98 | 100 |

## Anti-AI ban list (brief section 4.4)

| Ban | Result | Where checked |
|---|---|---|
| Purple/blue/indigo gradients, gradient buttons, gradient text | Pass | grep `gradient`: only hit is a comment in `globals.css`. All 14 hex values in CSS listed and checked: the only blue is `#2b3f8f` (hue 228°, sampled from the Option 1 print), used as flat color |
| Inter or default system stack as brand face | Pass | Jost (display) + Schibsted Grotesk (body), bundled locally. grep for Inter/Roboto/Arial/Geist/Space Grotesk/system-ui: none |
| Centered hero + headline + subhead + two buttons | Pass | Home is a split spread, left-aligned panel, one button + one text link. `app/home.module.css` |
| Row of three rounded cards with icons on top | Pass | "Three dates" and "Who this is for" are typographic rows with hairlines. No cards, no icons |
| Glassmorphism, soft shadows, big radii, pill buttons | Pass | `* { border-radius: 0 }` in `globals.css`. grep shadow/backdrop-filter/blur: none |
| Emoji as icons; mixed icon sets | Pass | One 4-icon set: `components/Icons.tsx` (bag, menu, close, search). grep emoji ranges in code: none. (The "I ♥" text on one story line quotes the print itself) |
| Banned copy words | Pass | grep Unlock/Elevate/Seamless/Discover the magic/Curated just for you/Experience/Journey over all copy and data: none |
| Colored left border on callouts | Pass | Only `border-left` is the bag drawer's 1px ink edge (`BagDrawer.module.css`), not a callout |
| Italic serif accent word in a sans headline | Pass | No serif loaded, no italic styling. The word "italics" appears once in the booklet copy |
| Generic fade-up on every section | Pass | Motion files: `Reveal` (used only on `/rand` options), product card hover swap, global reduced-motion rule. No scroll animation elsewhere |
| Stock photos or AI-generated people | Changed by the client (2026-11-05) | Six AI-generated images (Canva) of Jonathan, at his request and with his consent, wearing six designs. Each is labeled 'AI image' on cards and 'AI-generated image of a real person' on product pages. Everything else: 13 credited Wikimedia Commons photos (Bertil Hult, Paul Rand, EF's riders, Lund, Brighton, Boston), plus the EF Store's product photos |

## Open items for the team
1. Approve names in `data/name_map.csv` (column `approved`).
2. Decide the price merges marked `REVIEW` in `data/price_map.csv`, and whether to drop size upcharges.
3. Add the Boston lookbook photos (`data/lookbook.json`, 6 slots).
4. Approve or rewrite the draft story lines (`data/naming.json`, `data/collections.json`).
5. Verify the likely mislabeled Doodle product (see `DATA_GAPS.md`).
6. Source delivery times and costs, or remove that line.
