import { COLORS, cleanCity, shortYear, type Design } from "@/lib/custom";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Flat garment outlines (viewBox 400 x 440).
const TEE = "M128 30 L82 44 L18 92 L52 160 L92 138 L92 420 L308 420 L308 138 L348 160 L382 92 L318 44 L272 30 C262 58 236 72 200 72 C164 72 138 58 128 30 Z";
const BOXY = "M124 34 L70 46 L10 104 L48 168 L86 146 L80 400 L320 400 L314 146 L352 168 L390 104 L330 46 L276 34 C266 60 238 74 200 74 C162 74 134 60 124 34 Z";
const HOODIE = "M140 46 L84 60 L30 120 L20 380 L70 384 L80 190 L96 182 L96 424 L304 424 L304 182 L320 190 L330 384 L380 380 L370 120 L316 60 L260 46 C276 22 252 4 200 4 C148 4 124 22 140 46 Z";

/** Fits text to a width by shrinking the font size (Jost bold is about 0.62em per letter in caps). */
const fit = (text: string, width: number, max: number) => Math.min(max, width / Math.max(1, text.length * 0.64));

export default function TeePreview({ d }: { d: Design }) {
  const color = COLORS.find((c) => c.name === d.color) ?? COLORS[0];
  const ink = color.ink;
  const city = (cleanCity(d.city) || "Your city").toUpperCase();
  const year = shortYear(d.year.trim() || "’65");
  const program = (d.program || "EF").toUpperCase();
  const path = d.garment === "hoodie" ? HOODIE : d.garment === "boxy" ? BOXY : TEE;
  const cx = 200;
  const top = d.garment === "hoodie" ? 170 : 130;
  const logoFilter = ink === "#181818" ? undefined : "url(#invert)";

  return (
    <svg viewBox="0 0 400 440" role="img" aria-label={`${d.color} ${d.garment} printed ${city} ${year}, ${program}`}>
      <defs>
        <filter id="invert"><feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" /></filter>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d={path} fill={color.hex} stroke="rgba(0,0,0,.18)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={path} fill="url(#shade)" />
      {d.garment === "hoodie" && <path d="M160 48 C170 80 230 80 240 48" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="1.5" />}

      <g fill={ink} fontFamily="var(--font-display), Futura, sans-serif" textAnchor="middle">
        {d.style === "bold" && (
          <>
            <image href={`${BASE}/brand/ef-logo.png`} x={cx - 26} y={top} width="52" height="30" filter={logoFilter} />
            <text x={cx} y={top + 82} fontSize={fit(city, 190, 46)} fontWeight="700" letterSpacing="-0.5">{city}</text>
            <text x={cx} y={top + 128} fontSize="38" fontWeight="700">{year}</text>
            <text x={cx} y={top + 152} fontSize={fit(program, 200, 9.5)} fontWeight="500" letterSpacing="1.6">{program}</text>
          </>
        )}
        {d.style === "stamp" && (
          <g transform={`rotate(-8 ${cx} ${top + 80})`}>
            <circle cx={cx} cy={top + 80} r="72" fill="none" stroke={ink} strokeWidth="3" />
            <circle cx={cx} cy={top + 80} r="64" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 3" />
            <path id="arc" d={`M ${cx - 52} ${top + 80} A 52 52 0 0 1 ${cx + 52} ${top + 80}`} fill="none" />
            <text fontSize="9" fontWeight="600" letterSpacing="1.4"><textPath href="#arc" startOffset="50%">{program.slice(0, 30)}</textPath></text>
            <text x={cx} y={top + 90} fontSize={fit(city, 110, 26)} fontWeight="700">{city}</text>
            <text x={cx} y={top + 116} fontSize="18" fontWeight="600">{year}</text>
            <image href={`${BASE}/brand/ef-logo.png`} x={cx - 14} y={top + 38} width="28" height="16" filter={logoFilter} />
          </g>
        )}
        {d.style === "ticket" && (
          <>
            <rect x={cx - 92} y={top + 10} width="184" height="118" fill="none" stroke={ink} strokeWidth="2.5" />
            <line x1={cx - 92} x2={cx + 92} y1={top + 40} y2={top + 40} stroke={ink} strokeWidth="1" />
            <text x={cx - 82} y={top + 31} fontSize="10" fontWeight="600" letterSpacing="1.5" textAnchor="start">ADMIT ONE</text>
            <image href={`${BASE}/brand/ef-logo.png`} x={cx + 50} y={top + 16} width="34" height="20" filter={logoFilter} />
            <text x={cx} y={top + 82} fontSize={fit(city, 166, 34)} fontWeight="700">{city}</text>
            <text x={cx - 82} y={top + 116} fontSize={fit(program, 120, 8)} fontWeight="500" letterSpacing="1" textAnchor="start">{program}</text>
            <text x={cx + 82} y={top + 118} fontSize="20" fontWeight="700" textAnchor="end">{year}</text>
          </>
        )}
      </g>
    </svg>
  );
}
