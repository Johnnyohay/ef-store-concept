"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";

export type BagLine = {
  slug: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  qty: number;
};

type BagCtx = {
  lines: BagLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (l: Omit<BagLine, "qty">) => void;
  remove: (i: number) => void;
  setQty: (i: number, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<BagCtx | null>(null);
const KEY = "efc.bag";

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add = useCallback((l: Omit<BagLine, "qty">) => {
    track("add_to_bag");
    setLines((prev) => {
      const i = prev.findIndex((p) => p.slug === l.slug && p.color === l.color && p.size === l.size);
      if (i >= 0) return prev.map((p, j) => (j === i ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...l, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const value = useMemo<BagCtx>(() => ({
    lines,
    open,
    setOpen,
    add,
    remove: (i) => setLines((p) => p.filter((_, j) => j !== i)),
    setQty: (i, qty) => setLines((p) => p.map((l, j) => (j === i ? { ...l, qty: Math.max(1, qty) } : l))),
    clear: () => setLines([]),
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((n, l) => n + l.qty * l.price, 0),
  }), [lines, open, add]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBag outside BagProvider");
  return c;
}
