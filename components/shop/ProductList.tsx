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

export default function ProductList({ products, showGarment = true }: { products: Product[]; showGarment?: boolean }) {
  // Read ?q= after hydration instead of useSearchParams, so the full grid renders on the
  // server (no client-only bailout, no layout shift when it appears).
  const [q, setQ] = useState("");
  useEffect(() => {
    const read = () => setQ((new URLSearchParams(window.location.search).get("q") || "").trim().toLowerCase());
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const [f, setF] = useState<Filters>(EMPTY);
  const [open, setOpen] = useState(false);
  // Render 24 at a time with a "Show more" button. Keeps long lists fast on phones
  // (Baymard favors "Load more" over pagination or endless scroll).
  const [limit, setLimit] = useState(24);

  const searched = useMemo(
    () =>
      q
        ? products.filter((p) =>
            [p.new_name, p.legacy_name, p.collection, p.garment, ...p.colors.map((c) => c.name)]
              .join(" ").toLowerCase().includes(q))
        : products,
    [products, q],
  );

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
      <div className={s.toolbar}>
        <button className="btn btn--ghost" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="filters">
          {open ? "Hide filters" : "Filter"}{applied.length ? ` (${applied.length})` : ""}
        </button>
        <p className="muted" aria-live="polite">{shown.length} {shown.length === 1 ? "product" : "products"}{q && <> for “{q}”</>}</p>
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
