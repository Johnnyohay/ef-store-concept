"use client";
import { useEffect, useRef } from "react";
import { track, type EventName } from "@/lib/analytics";

/** Fires an analytics event once when this marker scrolls into view (or on mount if `onMount`). */
export default function Track({ event, onMount = false }: { event: EventName; onMount?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (onMount) return track(event);
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { track(event); io.disconnect(); } });
    io.observe(el);
    return () => io.disconnect();
  }, [event, onMount]);
  return <span ref={ref} aria-hidden style={{ display: "block", height: 1 }} />;
}
