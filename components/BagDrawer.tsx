"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useBag } from "./Bag";
import { CloseIcon } from "./Icons";
import { usd } from "@/lib/format";
import s from "./BagDrawer.module.css";

export default function BagDrawer() {
  const { lines, open, setOpen, remove, setQty, total } = useBag();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <>
      <div className={s.scrim} onClick={() => setOpen(false)} aria-hidden />
      <aside className={s.drawer} role="dialog" aria-modal="true" aria-label="Your bag">
        <div className={s.top}>
          <h2 className="label">Your bag</h2>
          <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close bag" className={s.close}><CloseIcon /></button>
        </div>
        {lines.length === 0 ? (
          <div className={s.empty}>
            <p>Nothing in here yet.</p>
            <Link href="/shop" className="textlink" onClick={() => setOpen(false)}>Shop all</Link>
          </div>
        ) : (
          <>
            <ul className={s.lines}>
              {lines.map((l, i) => (
                <li key={`${l.slug}-${l.color}-${l.size}`} className={s.line}>
                  <Image src={l.image} alt="" width={90} height={112} className={s.thumb} />
                  <div className={s.info}>
                    <p className={s.name}>{l.name}</p>
                    <p className="muted">{l.color} · {l.size}</p>
                    <div className={s.qty}>
                      <button onClick={() => setQty(i, l.qty - 1)} aria-label={`Fewer ${l.name}`}>−</button>
                      <span aria-live="polite">{l.qty}</span>
                      <button onClick={() => setQty(i, l.qty + 1)} aria-label={`More ${l.name}`}>+</button>
                      <button onClick={() => remove(i)} className={s.remove}>Remove</button>
                    </div>
                  </div>
                  <p className={s.price}>{usd(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <div className={s.foot}>
              <div className={s.total}><span className="label">Total</span><span>{usd(total)}</span></div>
              <p className="muted">Shipping is worked out at checkout.</p>
              <Link href="/checkout" className="btn btn--full" onClick={() => setOpen(false)}>Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
