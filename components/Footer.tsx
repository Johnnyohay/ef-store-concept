import Link from "next/link";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.grid}`}>
        <div>
          <p className={s.big}>For everyone the ripple reached. Since 1965.</p>
        </div>
        <nav aria-label="Footer" className={s.cols}>
          <ul>
            <li className="label muted">Shop</li>
            <li><Link href="/shop">View all</Link></li>
            <li><Link href="/shop/tees">Tees</Link></li>
            <li><Link href="/shop/hoodies">Hoodies</Link></li>
            <li><Link href="/shop/hats">Hats</Link></li>
            <li><Link href="/custom">Make your own</Link></li>
          </ul>
          <ul>
            <li className="label muted">Story</li>
            <li><Link href="/story">The EF story</Link></li>
            <li><Link href="/rand">Paul Rand and EF</Link></li>
            <li><Link href="/business">Shop by EF Business</Link></li>
            <li><Link href="/credits">Credits and sources</Link></li>
          </ul>
        </nav>
      </div>
      {/* Required on every page by the brief. */}
      <p className={`wrap ${s.disclaimer}`}>
        Student concept for Hult MKT-6054. Not affiliated with or endorsed by EF.
      </p>
    </footer>
  );
}
