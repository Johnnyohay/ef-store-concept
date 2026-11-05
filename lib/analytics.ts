"use client";
// Local-only demo analytics. Events live in this browser's sessionStorage and
// never leave the device. /demo reads them to show two live KPIs:
//   add-to-bag rate  = add_to_bag clicks / product page views
//   story engagement = sessions that reached the end of /rand / sessions
// A "session" here is one browser tab session (sessionStorage lifetime).
// Totals across sessions are kept in localStorage so the class can see
// several phones' worth of runs on the presenter's machine.

export type EventName = "product_view" | "add_to_bag" | "rand_start" | "rand_end" | "session_start";

const SESSION_KEY = "efc.session";
const TOTALS_KEY = "efc.totals";

type Counts = Record<EventName, number>;
const zero = (): Counts => ({ product_view: 0, add_to_bag: 0, rand_start: 0, rand_end: 0, session_start: 0 });

function read(storage: Storage | undefined, key: string): Counts {
  try {
    const raw = storage?.getItem(key);
    return raw ? { ...zero(), ...JSON.parse(raw) } : zero();
  } catch {
    return zero();
  }
}
function write(storage: Storage | undefined, key: string, c: Counts) {
  try { storage?.setItem(key, JSON.stringify(c)); } catch {}
}

function stores() {
  if (typeof window === "undefined") return { s: undefined, l: undefined };
  let s: Storage | undefined, l: Storage | undefined;
  try { s = window.sessionStorage; } catch {}
  try { l = window.localStorage; } catch {}
  return { s, l };
}

function ensureSession() {
  const { s, l } = stores();
  const sess = read(s, SESSION_KEY);
  if (sess.session_start === 0) {
    sess.session_start = 1;
    write(s, SESSION_KEY, sess);
    const tot = read(l, TOTALS_KEY);
    tot.session_start += 1;
    write(l, TOTALS_KEY, tot);
  }
}

/** Record an event. "rand_end" and "rand_start" count once per session. */
export function track(name: EventName) {
  ensureSession();
  const { s, l } = stores();
  const sess = read(s, SESSION_KEY);
  const once = name === "rand_end" || name === "rand_start";
  if (once && sess[name] > 0) return;
  sess[name] += 1;
  write(s, SESSION_KEY, sess);
  const tot = read(l, TOTALS_KEY);
  tot[name] += 1;
  write(l, TOTALS_KEY, tot);
}

export function readCounts() {
  ensureSession();
  const { s, l } = stores();
  return { session: read(s, SESSION_KEY), totals: read(l, TOTALS_KEY) };
}

export function resetCounts() {
  const { s, l } = stores();
  try { s?.removeItem(SESSION_KEY); l?.removeItem(TOTALS_KEY); } catch {}
}
