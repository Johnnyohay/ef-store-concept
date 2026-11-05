"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, isActive } from "@/lib/nav";
import { useBag } from "./Bag";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import s from "./Header.module.css";

export default function Header() {
  const pathname = usePathname() || "/";
  const { count, setOpen } = useBag();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Full navigation so /shop reads the new ?q= even when you are already on /shop.
    window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/shop/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className={s.header}>
      {/* Always visible: this is not the real store. */}
      <p className={s.concept}>Student concept for Hult MKT-6054 · Not the real EF Store · Not affiliated with EF</p>
      <div className={s.bar}>
        <button className={s.iconBtn} onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
          <MenuIcon />
        </button>

        <Link href="/" className={s.wordmark} aria-label="EF Store, home">
          <span className={s.mark}>EF</span> <span className={s.store}>Store</span>
        </Link>

        <nav className={s.desktopNav} aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.href} className={s.navItem}>
                <Link
                  href={item.href}
                  className={`label ${s.navLink} ${isActive(item, pathname) ? s.current : ""}`}
                  aria-current={isActive(item, pathname) ? "page" : undefined}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className={s.dropdown}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={pathname === c.href ? s.current : ""}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.tools}>
          <button className={s.iconBtn} onClick={() => setSearch((v) => !v)} aria-label="Search" aria-expanded={search}>
            <SearchIcon />
          </button>
          <button className={s.bagBtn} onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`}>
            <BagIcon />
            <span className={s.count}>{count}</span>
          </button>
        </div>
      </div>

      {search && (
        // Baymard: give the search field a visible submit button.
        <form className={s.search} role="search" onSubmit={submit}>
          <label htmlFor="q" className="visually-hidden">Search the store</label>
          <input id="q" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tees, hoodies, Rand..." />
          <button type="submit" className="btn">Search</button>
        </form>
      )}

      {menu && (
        <div className={s.drawer} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={s.drawerTop}>
            <span className="label">Menu</span>
            <button className={s.iconBtn} onClick={() => setMenu(false)} aria-label="Close menu"><CloseIcon /></button>
          </div>
          <nav aria-label="Main, mobile">
            {NAV.map((item) => (
              <div key={item.href} className={s.group}>
                <Link
                  href={item.href}
                  className={`${s.groupTitle} ${isActive(item, pathname) ? s.current : ""}`}
                  aria-current={isActive(item, pathname) ? "page" : undefined}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={pathname === c.href ? s.current : ""}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
