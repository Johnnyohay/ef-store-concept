// The only icon set on the site: bag, menu, close, search.
// Drawn on a 20px grid, 1.5px stroke, square caps, to match the sharp chrome.
type P = { size?: number; title?: string };
const base = (size: number) => ({
  width: size, height: size, viewBox: "0 0 20 20", fill: "none",
  stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "square" as const,
  "aria-hidden": true,
});

export const BagIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M3.5 6.5h13l-1 11h-11z" /><path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" /></svg>
);
export const MenuIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M2.5 6h15M2.5 14h15" /></svg>
);
export const CloseIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M4 4l12 12M16 4L4 16" /></svg>
);
export const SearchIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><circle cx="8.5" cy="8.5" r="5.5" /><path d="M13 13l4.5 4.5" /></svg>
);
