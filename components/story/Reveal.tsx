"use client";
import { useEffect, useRef, useState } from "react";
import s from "./Reveal.module.css";

// Story motion, used on /rand only: each logo option slides in like a sheet of
// cut paper laid on the table, alternating sides. It's the one place motion tells
// the story ("he drew several"), so it isn't a generic fade-up on every section.
export default function Reveal({ children, from = "left", className = "" }: { children: React.ReactNode; from?: "left" | "right"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // The observed wrapper never moves; only the inner sheet slides. Observing the
    // moved element would never fire, because it starts off-screen.
    <div ref={ref} className={className}>
      <div className={`${s.r} ${s[from]} ${shown ? s.in : ""}`}>{children}</div>
    </div>
  );
}
