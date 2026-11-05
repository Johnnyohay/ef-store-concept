"use client";
import { useEffect, useState } from "react";
import { readCounts, resetCounts } from "@/lib/analytics";
import s from "./demo.module.css";

// Hidden KPI page for the live pitch. Not linked from anywhere.
// Reads local events only (this browser). Refreshes every second.
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "–");

export default function Demo() {
  const [c, setC] = useState<ReturnType<typeof readCounts> | null>(null);
  useEffect(() => {
    const tick = () => setC(readCounts());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!c) return null;
  const { session: se, totals: t } = c;
  return (
    <section className={`wrap ${s.page}`}>
      <p className="label muted">Live demo KPIs · this browser only</p>
      <div className={s.kpis}>
        <div className={s.kpi}>
          <h2 className="label">Add-to-bag rate</h2>
          <p className={s.big}>{pct(se.add_to_bag, se.product_view)}</p>
          <p className="muted">{se.add_to_bag} adds / {se.product_view} product views, this session</p>
          <p className="muted">All sessions on this device: {pct(t.add_to_bag, t.product_view)} ({t.add_to_bag} / {t.product_view})</p>
        </div>
        <div className={s.kpi}>
          <h2 className="label">Story engagement</h2>
          <p className={s.big}>{pct(t.rand_end, t.session_start)}</p>
          <p className="muted">{t.rand_end} of {t.session_start} sessions on this device reached the end of /rand</p>
          <p className="muted">This session: {se.rand_end ? "reached the end" : se.rand_start ? "started, not finished" : "not opened yet"}</p>
        </div>
      </div>
      <button className="btn btn--ghost" onClick={() => { resetCounts(); setC(readCounts()); }}>Reset counters</button>
    </section>
  );
}
