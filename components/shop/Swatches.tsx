import type { CardProduct as Product } from "@/lib/products";
import s from "./Swatches.module.css";

export default function Swatches({ colors }: { colors: Product["colors"] }) {
  return (
    <ul className={s.list} aria-label={`${colors.length} colors: ${colors.map((c) => c.name).join(", ")}`}>
      {colors.map((c) => (
        <li key={c.name} title={c.name} className={s.sw} style={{ background: c.hex ?? "transparent" }}>
          {!c.hex && <span className={s.unknown}>?</span>}
        </li>
      ))}
    </ul>
  );
}
