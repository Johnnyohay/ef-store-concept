"use client";
import Link from "next/link";
import { useState } from "react";
import { useBag } from "@/components/Bag";
import { usd } from "@/lib/format";
import s from "./checkout.module.css";

// Fake checkout. Collects no data: there are no inputs at all.
// It shows the order summary, then stops at a "This is a demo" screen.
export default function Checkout() {
  const { lines, total, clear } = useBag();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <section className={`wrap ${s.demo}`}>
        <p className="label">Checkout</p>
        <h1 className={s.h1}>This is a demo.</h1>
        <p className={s.body}>Nothing was charged and nothing was sent anywhere. This store is a student concept for Hult MKT-6054.</p>
        <Link href="/" className="btn">Back to the store</Link>
      </section>
    );
  }

  return (
    <section className={`wrap ${s.page}`}>
      <h1 className={s.h1}>Checkout</h1>
      {lines.length === 0 ? (
        <p>Your bag is empty. <Link href="/shop" className="textlink">Shop all</Link></p>
      ) : (
        <>
          <ul className={s.lines}>
            {lines.map((l) => (
              <li key={`${l.slug}-${l.color}-${l.size}`}>
                <span>{l.qty} × {l.name}<br /><span className="muted">{l.color} · {l.size}</span></span>
                <span>{usd(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <p className={s.total}><span>Total</span><span>{usd(total)}</span></p>
          <p className="muted">Shipping would be added here. In this demo, the next button ends the flow. No payment form, no personal data.</p>
          <button className="btn btn--full" onClick={() => { setDone(true); clear(); }}>Place demo order</button>
        </>
      )}
    </section>
  );
}
