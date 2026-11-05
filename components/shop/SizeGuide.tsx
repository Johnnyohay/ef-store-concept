"use client";
import { useState } from "react";
import type { Product } from "@/lib/products";
import s from "./SizeGuide.module.css";

// Measurements come straight from the EF Store size chart (inches).
// Centimeters are converted (1 in = 2.54 cm), never estimated.
// If the store published no chart, we say so instead of inventing numbers.
const NICE: Record<string, string> = { SleeveLength: "Sleeve length", Length: "Length", Width: "Width (chest, flat)" };

export default function SizeGuide({ chart, garment }: { chart: Product["size_chart"]; garment: string }) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const cols = chart?.rows.length ? Object.keys(chart.rows[0]).filter((k) => k !== "size") : [];
  const fmt = (v: string | number) =>
    typeof v !== "number" ? v : unit === "in" ? String(+v.toFixed(2)) : String(Math.round(v * 2.54 * 10) / 10);

  return (
    <section id="size-guide" className={s.guide} aria-labelledby="sg-title">
      <div className={s.head}>
        <h2 id="sg-title" className={s.title}>Size guide: {garment}</h2>
        {chart && (
          <div className={s.toggle} role="group" aria-label="Units">
            <button aria-pressed={unit === "in"} className={unit === "in" ? s.on : ""} onClick={() => setUnit("in")}>Inches</button>
            <button aria-pressed={unit === "cm"} className={unit === "cm" ? s.on : ""} onClick={() => setUnit("cm")}>Centimeters</button>
          </div>
        )}
      </div>
      {chart && cols.length ? (
        <div className={s.scroll}>
          <table className={s.table}>
            <thead>
              <tr><th scope="col">Size</th>{cols.map((c) => <th key={c} scope="col">{NICE[c] ?? c} ({unit})</th>)}</tr>
            </thead>
            <tbody>
              {chart.rows.map((r) => (
                <tr key={r.size}>
                  <th scope="row">{r.size}</th>
                  {cols.map((c) => <td key={c}>{fmt(r[c])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">Garment measurements from the EF Store size chart. Centimeters converted from inches.</p>
        </div>
      ) : (
        <p className={s.gap}>The store hasn’t published measurements for this item yet. We won’t guess. This gap is logged in DATA_GAPS.md.</p>
      )}
    </section>
  );
}
