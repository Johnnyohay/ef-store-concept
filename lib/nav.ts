// Main navigation. Product categories sit at the top level, and every level
// starts with a "View all" item.
// Baymard: "Main nav: product categories at the top level; a 'View all' item at
// each level; highlight the current section." (baymard.com/research-articles/mobile-ux-ecommerce)

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const NAV: NavItem[] = [
  {
    label: "Tees",
    href: "/shop/tees",
    children: [
      { label: "View all tees", href: "/shop/tees" },
      { label: "Classic tees", href: "/shop/classic-tees" },
      { label: "Boxy tees", href: "/shop/boxy-tees" },
    ],
  },
  {
    label: "Hoodies",
    href: "/shop/hoodies",
    children: [
      { label: "View all hoodies", href: "/shop/hoodies" },
      { label: "Pullover hoodies", href: "/shop/pullover-hoodies" },
      { label: "Zip hoodies", href: "/shop/zip-hoodies" },
    ],
  },
  { label: "Hats", href: "/shop/hats" },
  { label: "Make your own", href: "/custom" },
  {
    label: "Collections",
    href: "/shop",
    children: [
      { label: "View all", href: "/shop" },
      { label: "Paul Rand", href: "/shop/paul-rand" },
      { label: "EF Logo", href: "/shop/ef-logo" },
      { label: "Retro", href: "/shop/retro" },
      { label: "Concept", href: "/shop/concept" },
      { label: "Argyle the Crocodile", href: "/shop/argyle-the-crocodile" },
      { label: "The FE Collection", href: "/shop/the-fe-collection" },
    ],
  },
  {
    label: "Shop by EF Business",
    href: "/business",
    children: [
      { label: "View all", href: "/business" },
      { label: "EF Academy", href: "/shop/ef-academy" },
      { label: "Hult International Business School", href: "/business/hult" },
    ],
  },
  {
    label: "Story",
    href: "/story",
    children: [
      { label: "The EF story", href: "/story" },
      { label: "Paul Rand and EF", href: "/rand" },
    ],
  },
];

/** True when `pathname` is inside this nav item (used to highlight the current section). */
export function isActive(item: NavItem, pathname: string) {
  const hrefs = [item.href, ...(item.children?.map((c) => c.href) ?? [])];
  return hrefs.some((h) => (h === "/shop" ? pathname === "/shop" : pathname === h || pathname.startsWith(h + "/")));
}
