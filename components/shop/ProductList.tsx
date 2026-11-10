"use client";
import { useEffect, useMemo, useState } from "react";
import type { CardProduct as Product } from "@/lib/products";
import { usd } from "@/lib/format";
import ProductCard from "./ProductCard";
import s from "./ProductList.module.css";

type Filters = { garment: string[]; color: string[]; size: string[]; price: number[] };
const EMPTY: Filters = { garment: [], color: [], size: [], price: [] };
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "One size"];

const LABELS: Record<keyof Filters, string> = { garment: "Garment", color: "Color", size: "Size", price: "Price" };

/** "Who's it for?": the same doors as the home page's Find your shirt, as one-tap filters. */
export const PERSONAS = [
  { id: "trip", label: "I went on an EF trip", collection: "concept" },
  { id: "studied", label: "I studied with EF", collection: "ef-logo" },
  { id: "academy", label: "I'm at EF Academy", collection: "ef-academy" },
  { id: "cycling", label: "I follow the pink jerseys", collection: "argyle-the-crocodile" },
  { id: "design", label: "I like good design", collection: "paul-rand" },
  { id: "retro", label: "I like the old stuff", collection: "retro" },
  { id: "fe", label: "I like a joke", collection: "the-fe-collection" },
] as const;

export default function ProductList({ products, showGarment = true, personas = false }: { products: Product[]; showGarment?: boolean; personas?: boolean }) {
  // Read ?q= after hydration instead of useSearchParams, so the full grid renders on the
  // server (no client-only bailout, no layout shift when it appears).
  const [q, setQ] = useState("");
  const [who, setWho] = useState<string>("");
  // One card per design: a boxy tee folds into its regular tee ("Also in boxy fit").
  const [fold, setFold] = useState(true);
  useEffect(() => {
    const read = () => {
      const sp = new URLSearchParams(window.location.search);
      setQ((sp.get("q") || "").trim().toLowerCase());
      setWho(sp.get("for") || "");
      setFold(sp.get("all") !== "1");
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const [f, setF] = useState<Filters>(EMPTY);
  const [open, setOpen] = useState(false);
  // Render 24 at a time with a "Show more" button. Keeps long lists fast on phones
  // (Baymard favors "Load more" over pagination or endless scroll).
  const [limit, setLimit] = useState(24);

  const setUrl = (k: string, v: string | null) => {
    const u = new URL(window.location.href);
    if (v) u.searchParams.set(k, v); else u.searchParams.delete(k);
    window.history.replaceState(null, "", u);
  };
  const pickWho = (id: string) => { const v = who === id ? "" : id; setWho(v); setLimit(24); setUrl("for", v || null); };
  const toggleFold = () => { setFold(!fold); setLimit(24); setUrl("all", fold ? "1" : null); };
  const persona = PERSONAS.find((x) => x.id === who);
  // A boxy tee folds only when its regular tee is in this same list (not on /shop/boxy-tees).
  const folds = useMemo(() => {
    const ids = new Set(products.map((p) => p.id));
    return new Set(products.filter((p) => p.teeTwin && ids.has(p.teeTwin)).map((p) => p.id));
  }, [products]);
  const hasTwins = folds.size > 0;

  const searched = useMemo(() => {
    let list = persona ? products.filter((p) => p.collection === persona.collection) : products;
    // Fold boxy tees into their regular tee, unless the shopper filters by garment (then show what they asked for).
    if (fold && !f.garment.includes("Boxy Tee")) list = list.filter((p) => !folds.has(p.id));
    if (q)
      list = list.filter((p) =>
        [p.new_name, p.legacy_name, p.collection, p.garment, ...p.colors.map((c) => c.name)].join(" ").toLowerCase().includes(q));
    return list;
  }, [products, q, persona, fold, f.garment, folds]);

  const options = useMemo(() => {
    const garment = [...new Set(searched.map((p) => p.garment))];
    const color = [...new Set(searched.flatMap((p) => p.colors.map((c) => c.name)))].sort();
    const size = [...new Set(searched.flatMap((p) => p.sizes))].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
    const price = [...new Set(searched.map((p) => p.new_price_usd))].sort((a, b) => a - b);
    return { garment, color, size, price };
  }, [searched]);

  const shown = searched.filter(
    (p) =>
      (!f.garment.length || f.garment.includes(p.garment)) &&
      (!f.color.length || p.colors.some((c) => f.color.includes(c.name))) &&
      (!f.size.length || p.sizes.some((z) => f.size.includes(z))) &&
      (!f.price.length || f.price.includes(p.new_price_usd)),
  );

  const toggleRaw = <K extends keyof Filters>(k: K, v: Filters[K][number]) =>
    setF((prev) => {
      const arr = prev[k] as (string | number)[];
      return { ...prev, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });

  const toggle: typeof toggleRaw = (k, v) => { setLimit(24); toggleRaw(k, v); };
  const applied = (Object.keys(f) as (keyof Filters)[]).flatMap((k) => (f[k] as (string | number)[]).map((v) => ({ k, v })));
  const groups = (Object.keys(options) as (keyof Filters)[]).filter((k) => (k !== "garment" || showGarment) && options[k].length > 1);

  return (
    <div>
      {personas && (
        <nav className={s.who} aria-label="Who's it for?">
          <span className="label">Who's it for?</span>
          <div className={s.whoRow}>
            {PERSONAS.map((x) => (
              <button key={x.id} className={`${s.whoBtn} ${who === x.id ? s.on : ""}`} aria-pressed={who === x.id} onClick={() => pickWho(x.id)}>
                {x.label}
              </button>
            ))}
            <a className={s.whoBtn} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/business/hult/`}>I'm at Hult →</a>
          </div>
        </nav>
      )}
      <div className={s.toolbar}>
        <button className="btn btn--ghost" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="filters">
          {open ? "Hide filters" : "Filter"}{applied.length ? ` (${applied.length})` : ""}
        </button>
        <div className={s.right}>
          {hasTwins && (
            <label className={s.fold}>
              <input type="checkbox" checked={fold} onChange={toggleFold} /> One per design
            </label>
          )}
          <p className="muted" aria-live="polite">{shown.length} {fold && hasTwins ? (shown.length === 1 ? "design" : "designs") : shown.length === 1 ? "product" : "products"}{q && <> for “{q}”</>}{persona && <> · “{persona.label}”</>}</p>
        </div>
      </div>

      {open && (
        <div id="filters" className={s.panel}>
          {groups.map((k) => (
            <fieldset key={k} className={s.group}>
              <legend className="label">{LABELS[k]}</legend>
              <div className={s.opts}>
                {(options[k] as (string | number)[]).map((v) => {
                  const on = (f[k] as (string | number)[]).includes(v);
                  return (
                    <button key={String(v)} className={`${s.opt} ${on ? s.on : ""}`} aria-pressed={on} onClick={() => toggle(k, v as never)}>
                      {k === "price" ? usd(v as number) : String(v)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {applied.length > 0 && (
        // Applied-filters bar: every active filter is visible and removable in one tap.
        <div className={s.applied} aria-label="Applied filters">
          {applied.map(({ k, v }) => (
            <button key={`${k}-${v}`} className={s.chip} onClick={() => toggle(k, v as never)}>
              {k === "price" ? usd(v as number) : String(v)} <span aria-hidden>×</span>
              <span className="visually-hidden">, remove {LABELS[k]} filter</span>
            </button>
          ))}
          <button className={s.clear} onClick={() => setF(EMPTY)}>Clear all</button>
        </div>
      )}

      {shown.length === 0 ? (
        <p className={s.none}>Nothing matches that. Try removing a filter.</p>
      ) : (
        <div className={s.grid}>
          <h2 className="visually-hidden">Products</h2>
          {shown.slice(0, limit).map((p, i) => <ProductCard key={p.id} p={p} priority={i < 2} />)}
        </div>
      )}
      {shown.length > limit && (
        <div className={s.more}>
          <p className="muted">Showing {limit} of {shown.length}</p>
          <button className="btn btn--ghost" onClick={() => setLimit((l) => l + 24)}>Show more</button>
        </div>
      )}
    </div>
  );
}
