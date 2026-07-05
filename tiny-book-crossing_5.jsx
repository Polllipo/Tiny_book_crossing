import { useState, useMemo } from "react";

/* ============================================================
   TINY BOOK CROSSING — Design System
   ============================================================ */

const TODAY = new Date("2026-07-04");
const font =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const DS = {
  radius: { pill: 999, card: 26, input: 16, cover: 10, sheet: 32 },
  type: {
    display: { fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.12 },
    title:   { fontSize: 23, fontWeight: 800, letterSpacing: "-0.02em" },
    heading: { fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" },
    body:    { fontSize: 15, fontWeight: 400, lineHeight: 1.55 },
    label:   { fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" },
    chip:    { fontSize: 11, fontWeight: 600, letterSpacing: "0.01em" },
  },
  themes: {
    light: {
      bg: "#F2F1F5", card: "#FFFFFF", text: "#141519", secondary: "#6E7078", tertiary: "#9DA0A9",
      divider: "#E8E7EE", inputBg: "#F4F3F8", accentBg: "#141519", accentText: "#FFFFFF",
      overdue: "#D6453A", sheet: "#FFFFFF", scrim: "rgba(20,21,25,0.32)",
      segBg: "#E9E8EF", segActive: "#FFFFFF", segShadow: "0 1px 3px rgba(20,24,40,0.10)",
      chipNeutralBg: "#EDECF2", chipNeutralText: "#575B66",
      cardShadow: "0 12px 30px rgba(23,24,32,0.06)",
      fabShadow: "0 10px 26px rgba(20,24,40,0.28)",
      hero: "#8C9EF5", heroInk: "#15173A",
      pastels: ["#8C9EF5", "#EDA9EC", "#E8973D", "#141519"],
      pastelInks: ["#15173A", "#471243", "#3F2404", "#FFFFFF"],
    },
    dark: {
      bg: "#0E0F13", card: "#1A1C23", text: "#F3F4F6", secondary: "#9CA3AF", tertiary: "#6B7280",
      divider: "#262A34", inputBg: "#22252E", accentBg: "#F3F4F6", accentText: "#14161C",
      overdue: "#FF6B5E", sheet: "#1A1C23", scrim: "rgba(0,0,0,0.6)",
      segBg: "#22252E", segActive: "#333742", segShadow: "none",
      chipNeutralBg: "#262A34", chipNeutralText: "#B7BCC7",
      cardShadow: "0 10px 28px rgba(0,0,0,0.45)",
      fabShadow: "0 10px 26px rgba(0,0,0,0.6)",
      hero: "#5563C4", heroInk: "#E9ECFF",
      pastels: ["#4B57A8", "#8F4B8D", "#9C6420", "#F3F4F6"],
      pastelInks: ["#DDE2FF", "#F9D9F7", "#FFDFBA", "#14161C"],
    },
  },
};

/* ------------------------------------------------------------
   Chip color system — light transparent tints.
   Owners get identity colors; locations & dates stay neutral;
   red is reserved for overdue only.
   ------------------------------------------------------------ */
const CHIP_COLORS = {
  light: {
    Polina:   { bg: "#DDE3FE", text: "#3947B0" },
    Katarina: { bg: "#F9DCF8", text: "#9C3396" },
    Anna:     { bg: "#D5F0DE", text: "#1C6B44" },
    Alex:     { bg: "#FBE3C4", text: "#96570F" },
    Max:      { bg: "#F9EFC0", text: "#846A0B" },
  },
  dark: {
    Polina:   { bg: "rgba(140, 158, 245, 0.24)", text: "#AEBBFA" },
    Katarina: { bg: "rgba(237, 169, 236, 0.20)", text: "#F0BEEF" },
    Anna:     { bg: "rgba(74, 222, 128, 0.18)",  text: "#93DFB2" },
    Alex:     { bg: "rgba(232, 151, 61, 0.20)",  text: "#F0B678" },
    Max:      { bg: "rgba(240, 220, 90, 0.16)",  text: "#E8D98A" },
  },
};

/* Pool for people added later — assigned by name hash */
const EXTRA_COLORS = {
  light: [
    { bg: "rgba(219, 39, 119, 0.10)", text: "#B02268" },
    { bg: "rgba(79, 70, 229, 0.10)",  text: "#4740B3" },
    { bg: "rgba(120, 113, 108, 0.14)", text: "#57534E" },
  ],
  dark: [
    { bg: "rgba(244, 114, 182, 0.16)", text: "#F0A2C8" },
    { bg: "rgba(129, 140, 248, 0.16)", text: "#AEB5F5" },
    { bg: "rgba(168, 162, 158, 0.14)", text: "#C4C0BC" },
  ],
};

/* Identity palette — users pick their colour in Profile */
const IDENTITY_PALETTE = {
  light: [
    { bg: "#DDE3FE", text: "#3947B0" },
    { bg: "#F9DCF8", text: "#9C3396" },
    { bg: "#D5F0DE", text: "#1C6B44" },
    { bg: "#FBE3C4", text: "#96570F" },
    { bg: "#F9EFC0", text: "#846A0B" },
    { bg: "#D6EEF8", text: "#176B86" },
  ],
  dark: [
    { bg: "rgba(140, 158, 245, 0.24)", text: "#AEBBFA" },
    { bg: "rgba(237, 169, 236, 0.20)", text: "#F0BEEF" },
    { bg: "rgba(74, 222, 128, 0.18)",  text: "#93DFB2" },
    { bg: "rgba(232, 151, 61, 0.20)",  text: "#F0B678" },
    { bg: "rgba(240, 220, 90, 0.16)",  text: "#E8D98A" },
    { bg: "rgba(86, 197, 233, 0.18)",  text: "#8AD4EE" },
  ],
};
const COLOR_OVERRIDES = {}; // name -> palette index, chosen in Profile

const personColor = (name, theme) => {
  if (COLOR_OVERRIDES[name] != null) return IDENTITY_PALETTE[theme][COLOR_OVERRIDES[name]];
  if (CHIP_COLORS[theme][name]) return CHIP_COLORS[theme][name];
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return EXTRA_COLORS[theme][hash % EXTRA_COLORS[theme].length];
};

const OWNERS = ["Polina", "Katarina", "Anna", "Alex", "Max"];
const LOCATIONS = ["Polina's House", "Katarina's House", "Max's House", "Anna's House"];
const HOME = "Polina's House";

/* ------------------------------------------------------------
   Cover art system — each book gets a palette + motif,
   referencing the real edition's look. Content is colorful;
   the UI around it stays monochrome.
   motif: 'circle' | 'stripes' | 'arc' | 'dots' | 'band'
   ------------------------------------------------------------ */
const COVER_ART = {
  "Wash-'em-Clean":                    { bg: "#1D6FB8", ink: "#FFFFFF", accent: "#F4C542", motif: "circle" },
  "The Monster Cockroach":                  { bg: "#B8341D", ink: "#F8E9C9", accent: "#2B2B2B", motif: "stripes" },
  "Doctor Aibolit":                     { bg: "#F3F0E6", ink: "#1D3557", accent: "#E63946", motif: "arc" },
  "The Telephone":                     { bg: "#F4C542", ink: "#2B2B2B", accent: "#1D6FB8", motif: "dots" },
  "Buzzy-Wuzzy Busy Fly":               { bg: "#2E7D4F", ink: "#F8E9C9", accent: "#F4C542", motif: "circle" },
  "The Very Hungry Caterpillar": { bg: "#FFFFFF", ink: "#2E7D32", accent: "#E53935", motif: "dots" },
  "Where the Wild Things Are":   { bg: "#E8DFC8", ink: "#4E3B2A", accent: "#7A9E7E", motif: "arc" },
  "Goodnight Moon":              { bg: "#1B5E20", ink: "#FBC02D", accent: "#C62828", motif: "circle" },
  "The Gruffalo":                { bg: "#5D4037", ink: "#FFE0B2", accent: "#E65100", motif: "arc" },
  "Room on the Broom":           { bg: "#37246B", ink: "#FFD54F", accent: "#E57373", motif: "stripes" },
  "The Snail and the Whale":     { bg: "#1565C0", ink: "#E3F2FD", accent: "#FBC02D", motif: "arc" },
  "Winnie-the-Pooh":             { bg: "#F5E6C4", ink: "#8D5524", accent: "#E53935", motif: "band" },
  "The Tale of Peter Rabbit":    { bg: "#FDFBF3", ink: "#4E6E4E", accent: "#B07C4F", motif: "circle" },
  "Charlotte's Web":             { bg: "#BFD7EA", ink: "#2B2B2B", accent: "#D1495B", motif: "dots" },
  "Matilda":                     { bg: "#D93025", ink: "#FFF8E1", accent: "#1A1A1A", motif: "band" },
  "The BFG":                     { bg: "#0D2B52", ink: "#FFE082", accent: "#4FC3F7", motif: "circle" },
  "Press Here":                  { bg: "#FFFFFF", ink: "#2B2B2B", accent: "#FBC02D", motif: "dots" },
  "Journey":                     { bg: "#7B1E28", ink: "#F3E5AB", accent: "#C62828", motif: "arc" },
  "Du Iz Tak?":                  { bg: "#EDE7D9", ink: "#3E5641", accent: "#C97B63", motif: "stripes" },
  "The Snowy Day":               { bg: "#D64541", ink: "#FFFFFF", accent: "#2B4C7E", motif: "circle" },
};

/* ============================================================
   Data
   ============================================================ */

const seed = [
  ["Wash-'em-Clean", "Korney Chukovsky", 1923, "Polina", HOME, null],
  ["The Monster Cockroach", "Korney Chukovsky", 1921, "Polina", "Katarina's House", "2026-07-08"],
  ["Doctor Aibolit", "Korney Chukovsky", 1929, "Polina", "Anna's House", "2026-06-28"],
  ["The Telephone", "Korney Chukovsky", 1926, "Polina", HOME, null],
  ["Buzzy-Wuzzy Busy Fly", "Korney Chukovsky", 1924, "Polina", "Max's House", "2026-08-15"],
  ["The Very Hungry Caterpillar", "Eric Carle", 1969, "Polina", HOME, null],
  ["Where the Wild Things Are", "Maurice Sendak", 1963, "Katarina", HOME, "2026-07-06"],
  ["Goodnight Moon", "Margaret Wise Brown", 1947, "Polina", HOME, null],
  ["The Gruffalo", "Julia Donaldson", 1999, "Polina", "Katarina's House", "2026-07-20"],
  ["Room on the Broom", "Julia Donaldson", 2001, "Anna", HOME, "2026-06-30"],
  ["The Snail and the Whale", "Julia Donaldson", 2003, "Polina", HOME, null],
  ["Winnie-the-Pooh", "A. A. Milne", 1926, "Polina", "Anna's House", "2026-07-30"],
  ["The Tale of Peter Rabbit", "Beatrix Potter", 1902, "Polina", HOME, null],
  ["Charlotte's Web", "E. B. White", 1952, "Alex", HOME, "2026-08-02"],
  ["Matilda", "Roald Dahl", 1988, "Polina", "Max's House", "2026-07-05"],
  ["The BFG", "Roald Dahl", 1982, "Polina", HOME, null],
  ["Press Here", "Hervé Tullet", 2010, "Katarina", HOME, null],
  ["Journey", "Aaron Becker", 2013, "Polina", HOME, null],
  ["Du Iz Tak?", "Carson Ellis", 2016, "Polina", "Katarina's House", "2026-06-25"],
  ["The Snowy Day", "Ezra Jack Keats", 1962, "Polina", HOME, null],
];

const seedHistory = {
  1: [["Added to library", "2026-03-02"], ["Lent to Anna", "2026-04-10"], ["Returned", "2026-05-01"], ["Lent to Katarina", "2026-06-20"], ["Due", "2026-07-08"]],
  2: [["Added to library", "2026-02-14"], ["Lent to Anna", "2026-05-30"], ["Due", "2026-06-28"]],
  8: [["Added to library", "2026-01-22"], ["Lent to Alex", "2026-03-05"], ["Returned", "2026-04-12"], ["Lent to Katarina", "2026-06-15"], ["Due", "2026-07-20"]],
};

const seedNotes = {
  2: [{ author: "Anna", date: "2026-06-02", text: "Heads up — my son drew on the second page. Still perfectly readable, just a bit decorated now." }],
  8: [{ author: "Katarina", date: "2026-06-16", text: "The dust jacket has a small tear near the spine. It was like that when we borrowed it." }],
  14: [{ author: "Polina", date: "2026-05-20", text: "This one is a favourite — please keep it away from juice cups." }],
};

const initialBooks = seed.map((b, i) => ({
  id: i, title: b[0], author: b[1], year: b[2], owner: b[3],
  location: b[4], returnDate: b[5],
  history: seedHistory[i] || [["Added to library", "2026-01-15"]],
  notes: seedNotes[i] || [],
}));

/* ============================================================
   Helpers
   ============================================================ */

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : null;
const daysUntil = (iso) => (iso ? Math.ceil((new Date(iso) - TODAY) / 86400000) : null);
const returnTone = (iso) => {
  const d = daysUntil(iso);
  if (d === null) return "none";
  if (d < 0) return "overdue";
  if (d < 7) return "soon";
  return "neutral";
};

/* ============================================================
   Icons
   ============================================================ */

const Icon = ({ d, size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    {d}
  </svg>
);
const SunIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>} />;
const MoonIcon = (p) => <Icon {...p} d={<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />} />;
const GearIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01A1.7 1.7 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" /></>} />;
const BackIcon = (p) => <Icon {...p} d={<path d="M15 18l-6-6 6-6" />} />;
const SearchIcon = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} />;
const CloseIcon = (p) => <Icon {...p} d={<path d="M18 6L6 18M6 6l12 12" />} />;
const PlusIcon = (p) => <Icon {...p} d={<path d="M12 5v14M5 12h14" />} />;
const FilterIcon = (p) => <Icon {...p} d={<><path d="M4 6h16M7 12h10M10 18h4" /></>} />;
const SortIcon = (p) => <Icon {...p} d={<><path d="M7 4v13M7 17l-3-3M7 17l3-3" /><path d="M17 20V7M17 7l-3 3M17 7l3 3" /></>} />;
const CalendarIcon = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>} />;
const ChevronDownIcon = (p) => <Icon {...p} d={<path d="M6 9l6 6 6-6" />} />;
const PencilIcon = (p) => <Icon {...p} d={<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />} />;
const TrashIcon = (p) => <Icon {...p} d={<><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>} />;

/* ============================================================
   DS components
   ============================================================ */

const Button = ({ variant = "primary", t, children, style, ...rest }) => {
  const variants = {
    primary:   { background: t.accentBg, color: t.accentText, border: "none" },
    secondary: { background: "transparent", color: t.text, border: `1px solid ${t.text}` },
    ghost:     { background: "transparent", color: t.secondary, border: `1px solid ${t.divider}` },
    danger:    { background: "transparent", color: t.overdue, border: `1px solid ${t.divider}` },
  };
  return (
    <button {...rest} style={{
      padding: "13px 22px", borderRadius: DS.radius.pill, cursor: "pointer",
      fontFamily: font, fontSize: 15, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      ...variants[variant], ...style,
    }}>{children}</button>
  );
};

const Segmented = ({ options, value, onChange, t, compact }) => (
  <div style={{ display: "flex", background: t.segBg, borderRadius: DS.radius.pill, padding: 3 }}>
    {options.map((o) => {
      const on = value === o.value;
      return (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, padding: compact ? "6px 0" : "9px 0", borderRadius: DS.radius.pill, border: "none",
          cursor: "pointer", fontFamily: font, fontSize: compact ? 12 : 13, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: on ? t.segActive : "transparent",
          color: on ? t.text : t.secondary,
          boxShadow: on ? t.segShadow : "none",
          transition: "all .18s ease",
        }}>
          {o.icon && o.icon({ size: compact ? 13 : 15, color: on ? t.text : t.secondary })}
          {o.label}
        </button>
      );
    })}
  </div>
);

/* Chip — kind: 'owner' | 'neutral' | return tones */
const Chip = ({ children, t, theme, kind = "neutral", owner, tone }) => {
  let bg = t.chipNeutralBg, color = t.chipNeutralText, weight = 600, pad = "2.5px 9px";
  if (kind === "owner" && owner) {
    const pc = personColor(owner, theme);
    bg = pc.bg;
    color = pc.text;
  }
  if (tone === "soon") { color = t.text; }
  if (tone === "overdue") { bg = "transparent"; color = t.overdue; weight = 700; pad = "2.5px 0"; }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: pad,
      borderRadius: DS.radius.pill, ...DS.type.chip, fontWeight: weight,
      background: bg, color, whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

/* Colorful generated covers */
const Cover = ({ book, t, size = 44 }) => {
  const art = COVER_ART[book.title] || { bg: "#888", ink: "#FFF", accent: "#CCC", motif: "band" };
  const h = size * 1.42;
  const short = (book.title || "?").split(" ").slice(0, 3).join(" ");
  const motif = () => {
    const s = { position: "absolute", pointerEvents: "none" };
    switch (art.motif) {
      case "circle": return <div style={{ ...s, right: "-18%", bottom: "-14%", width: "62%", height: "44%", borderRadius: "50%", background: art.accent, opacity: 0.85 }} />;
      case "arc":    return <div style={{ ...s, left: "-25%", bottom: "-30%", width: "150%", height: "55%", borderRadius: "50% 50% 0 0", background: art.accent, opacity: 0.8 }} />;
      case "stripes":return <div style={{ ...s, left: 0, right: 0, bottom: 0, height: "26%", background: `repeating-linear-gradient(90deg, ${art.accent} 0 6px, transparent 6px 12px)`, opacity: 0.75 }} />;
      case "dots":   return <div style={{ ...s, left: 0, right: 0, bottom: "6%", height: "22%", background: `radial-gradient(circle, ${art.accent} 2.2px, transparent 2.6px)`, backgroundSize: "11px 11px", opacity: 0.85 }} />;
      case "band":   return <div style={{ ...s, left: 0, right: 0, bottom: "14%", height: 5, background: art.accent, opacity: 0.9 }} />;
      default: return null;
    }
  };
  return (
    <div style={{
      width: size, height: h, borderRadius: DS.radius.cover, flexShrink: 0,
      background: art.bg, border: `1px solid ${t.divider}`, overflow: "hidden",
      position: "relative", padding: size * 0.11, boxSizing: "border-box",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }}>
      {motif()}
      <div style={{
        fontFamily: font, fontWeight: 700, color: art.ink, position: "relative",
        fontSize: Math.max(7, size * 0.145), lineHeight: 1.2, letterSpacing: "-0.01em",
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
      }}>{short}</div>
    </div>
  );
};

const Field = ({ label, children, t }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const inputStyle = (t) => ({
  width: "100%", boxSizing: "border-box", padding: "12px 14px",
  borderRadius: DS.radius.input, border: `1px solid ${t.divider}`, background: t.card,
  color: t.text, fontSize: 15, fontFamily: font, outline: "none",
});

/* Dropdown with explicit chevron affordance */
const Select = ({ t, value, onChange, options }) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={onChange} style={{ ...inputStyle(t), appearance: "none", WebkitAppearance: "none", paddingRight: 38, cursor: "pointer" }}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
      <ChevronDownIcon size={15} color={t.secondary} />
    </div>
  </div>
);

/* Date input — native picker (iOS wheel / platform default), custom shell */
const DateInput = ({ t, value, onChange }) => (
  <div style={{ position: "relative" }}>
    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }}>
      <CalendarIcon size={15} color={t.secondary} />
    </div>
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={value ? "tbc-date" : "tbc-date tbc-date-empty"}
      style={{
        ...inputStyle(t), paddingLeft: 36, minHeight: 46,
        WebkitAppearance: "none", appearance: "none",
        colorScheme: t.bg === "#0E0F13" ? "dark" : "light",
      }}
    />
    {!value && (
      <span style={{ position: "absolute", left: 36, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 15, color: t.tertiary }}>
        Select a date
      </span>
    )}
  </div>
);

/* Centered empty-state block used for both "no books" and "no results" */
const EmptyState = ({ icon, title, subtitle, action, t }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", textAlign: "center" }}>
    <div style={{
      width: 52, height: 52, borderRadius: "50%", background: t.card, boxShadow: t.cardShadow,
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
    }}>{icon}</div>
    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 14, color: t.secondary, lineHeight: 1.5, marginBottom: action ? 22 : 0 }}>{subtitle}</div>
    {action}
  </div>
);

/* ============================================================
   App
   ============================================================ */

export default function TinyBookCrossing() {
  const [theme, setTheme] = useState("light");
  const [screen, setScreen] = useState("welcome");
  const [books, setBooks] = useState(initialBooks);
  const [activeId, setActiveId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [households, setHouseholds] = useState(LOCATIONS);
  const [members, setMembers] = useState(OWNERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [emails, setEmails] = useState({});
  const [viewedMember, setViewedMember] = useState(null);
  const [cameFrom, setCameFrom] = useState(null);
  const [toast, setToast] = useState(null);
  const [remindersOn, setRemindersOn] = useState(true);
  const home = currentUser ? `${currentUser}'s House` : HOME;

  const [query, setQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [sortBy, setSortBy] = useState("mine");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterReturn, setFilterReturn] = useState("All");
  const [sheet, setSheet] = useState(null);
  const [newHousehold, setNewHousehold] = useState(false);
  const [householdName, setHouseholdName] = useState("");

  const t = DS.themes[theme];
  const active = books.find((b) => b.id === activeId);

  const filtered = useMemo(() => {
    let list = books.filter((b) => {
      const q = query.toLowerCase();
      if (q && ![b.title, b.author, b.owner, b.location].some((v) => v.toLowerCase().includes(q))) return false;
      if (filterOwner !== "All" && b.owner !== filterOwner) return false;
      if (filterLocation !== "All" && b.location !== filterLocation) return false;
      if (filterReturn !== "All") {
        const tone = returnTone(b.returnDate);
        if (filterReturn === "Due soon" && tone !== "soon") return false;
        if (filterReturn === "Overdue" && tone !== "overdue") return false;
        if (filterReturn === "No return date" && b.returnDate) return false;
      }
      return true;
    });
    const s = [...list];
    if (sortBy === "mine") s.sort((a, b) => ((a.owner === currentUser ? 0 : 1) - (b.owner === currentUser ? 0 : 1)) || a.title.localeCompare(b.title));
    if (sortBy === "az") s.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "za") s.sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "return") s.sort((a, b) => (daysUntil(a.returnDate) ?? 9999) - (daysUntil(b.returnDate) ?? 9999));
    if (sortBy === "recent") s.sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") s.sort((a, b) => a.id - b.id);
    return s;
  }, [books, query, sortBy, filterOwner, filterLocation, filterReturn, currentUser]);

  const filtersActive = filterOwner !== "All" || filterLocation !== "All" || filterReturn !== "All";

  const shell = {
    minHeight: "100vh", background: theme === "light" ? "#E7E6EB" : "#08090C",
    display: "flex", justifyContent: "center", alignItems: "flex-start",
    padding: "24px 12px", fontFamily: font,
  };
  const phone = {
    width: 390, maxWidth: "100%", height: 780, background: t.bg,
    borderRadius: 28, overflow: "hidden", position: "relative",
    display: "flex", flexDirection: "column",
    boxShadow: theme === "light" ? "0 12px 40px rgba(0,0,0,0.15)" : "0 12px 40px rgba(0,0,0,0.6)",
    border: `1px solid ${theme === "light" ? "#DFE1EA" : "#23262F"}`,
    color: t.text,
  };

  /* ---------- Welcome ---------- */

  const Welcome = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", textAlign: "center" }}>
      <div style={{
        background: t.hero, borderRadius: 36, padding: "38px 0 32px",
        marginBottom: 32, boxShadow: t.cardShadow,
      }}>
        <svg width="180" height="140" viewBox="0 0 180 140" style={{ display: "block", margin: "0 auto" }}>
          {/* scattered doodles, ref-style */}
          <path d="M26 26l3.2 8 8 3.2-8 3.2-3.2 8-3.2-8-8-3.2 8-3.2z" fill={t.heroInk} opacity="0.9" />
          <path d="M150 20v16M142 28h16" stroke={t.heroInk} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 106q7-9 14 0t14 0" fill="none" stroke={t.heroInk} strokeWidth="3" strokeLinecap="round" />
          <circle cx="154" cy="102" r="6" fill="none" stroke={t.heroInk} strokeWidth="3" />
          <path d="M132 60c-1.6-3.4-6.8-2.6-6.8 1.6 0 3.2 6.8 6.8 6.8 6.8s6.8-3.6 6.8-6.8c0-4.2-5.2-5-6.8-1.6z" fill={t.heroInk} />
          <path d="M44 66l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={t.heroInk} opacity="0.7" />
          {/* open-book face */}
          <circle cx="74" cy="38" r="3.5" fill={t.heroInk} />
          <circle cx="106" cy="38" r="3.5" fill={t.heroInk} />
          <rect x="58" y="52" width="30" height="40" rx="7" fill={theme === "light" ? "#FFFFFF" : "#EDEFFC"} stroke={t.heroInk} strokeWidth="3" />
          <rect x="92" y="52" width="30" height="40" rx="7" fill={theme === "light" ? "#FFFFFF" : "#EDEFFC"} stroke={t.heroInk} strokeWidth="3" />
          <line x1="90" y1="52" x2="90" y2="92" stroke={t.heroInk} strokeWidth="3" />
          <path d="M66 62h14M66 70h14M100 62h14M100 70h14" stroke={t.heroInk} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <path d="M76 106 Q90 118 104 106" fill="none" stroke={t.heroInk} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h1 style={{ ...DS.type.display, margin: "0 0 14px" }}>Tiny Book Crossing</h1>
      <p style={{ ...DS.type.body, color: t.secondary, margin: "0 0 6px" }}>
        A minimal system for tracking children's books shared between families.
      </p>
      <p style={{ ...DS.type.body, color: t.secondary, margin: "0 0 44px" }}>
        Nothing should be lost. Nothing should be forgotten.
      </p>
      <Button t={t} onClick={() => setScreen("auth")} style={{ width: "100%", padding: "15px 0", fontSize: 16 }}>
        Get Started
      </Button>
    </div>
  );

  /* ---------- Auth (sign up / log in) ---------- */

  const Avatar = ({ name, size = 84, onClick, selected }) => {
    const c = personColor(name, theme);
    return (
      <button onClick={onClick} style={{
        border: "none", background: "transparent", cursor: "pointer", fontFamily: font,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 0,
      }}>
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: c.bg, color: c.text,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.38, fontWeight: 700,
          border: selected ? `2px solid ${t.text}` : `2px solid transparent`,
          boxSizing: "border-box",
        }}>
          {name[0]}
        </div>
        <span style={{ fontSize: size > 40 ? 15 : 12, fontWeight: 600, color: t.text }}>{name}</span>
      </button>
    );
  };

  const Auth = () => {
    const [mode, setMode] = useState("signup");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [remember, setRemember] = useState(true);
    const link = theme === "light" ? "#4A59C7" : "#AEBBFA";

    const enter = (name) => {
      const n = name.trim();
      if (!n) return;
      if (!members.includes(n)) {
        setMembers((m) => [...m, n]);
        setHouseholds((h) => (h.includes(`${n}'s House`) ? h : [...h, `${n}'s House`]));
      }
      if (email.trim()) setEmails((prev) => ({ ...prev, [n]: email.trim() }));
      setCurrentUser(n);
      setScreen("list");
    };
    const signUp = () => enter(first);
    const logIn = () => {
      const prefix = email.split("@")[0].replace(/[^a-zA-Z]/g, "").toLowerCase();
      const match = members.find((m) => prefix && (m.toLowerCase() === prefix || prefix.startsWith(m.toLowerCase())));
      enter(match || "Polina");
    };

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px", overflowY: "auto" }}>
        <div style={{ ...DS.type.label, color: t.tertiary, letterSpacing: "0.14em", textAlign: "center", marginTop: 28 }}>
          TINY BOOK CROSSING
        </div>
        <div style={{ textAlign: "center", marginTop: 26, marginBottom: 24 }}>
          <h1 style={{ ...DS.type.title, margin: "0 0 8px" }}>
            {mode === "signup" ? "Get Started Now" : "Welcome Back"}
          </h1>
          <p style={{ fontSize: 14, color: t.secondary, margin: 0, lineHeight: 1.5 }}>
            {mode === "signup"
              ? "Create an account to share books between families."
              : "Log in to access your shared library."}
          </p>
        </div>

        <div style={{ display: "flex", background: t.segBg, borderRadius: DS.radius.pill, padding: 4, marginBottom: 24 }}>
          {[["signup", "Sign Up"], ["login", "Log In"]].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              flex: 1, padding: "11px 0", borderRadius: DS.radius.pill, border: "none", cursor: "pointer",
              fontFamily: font, fontSize: 14, fontWeight: 700,
              background: mode === k ? t.hero : "transparent",
              color: mode === k ? t.heroInk : t.secondary,
              transition: "all .18s ease",
            }}>{l}</button>
          ))}
        </div>

        {mode === "signup" ? (
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Field label="FIRST NAME" t={t}>
                  <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Alex" style={inputStyle(t)} />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="LAST NAME" t={t}>
                  <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Green" style={inputStyle(t)} />
                </Field>
              </div>
            </div>
            <Field label="EMAIL" t={t}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex.green@yourdomain.com" style={inputStyle(t)} />
            </Field>
            <Field label="SET PASSWORD" t={t}>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" style={inputStyle(t)} />
            </Field>
            <Button t={t} onClick={signUp} style={{ width: "100%", padding: "15px 0", fontSize: 16, marginTop: 6, opacity: first.trim() ? 1 : 0.4 }}>
              Sign Up
            </Button>
            <div style={{ textAlign: "center", fontSize: 13, color: t.secondary, margin: "18px 0 24px" }}>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} style={{ border: "none", background: "transparent", color: link, fontWeight: 700, cursor: "pointer", fontFamily: font, fontSize: 13, padding: 0 }}>Log In</button>
            </div>
          </>
        ) : (
          <>
            <Field label="EMAIL" t={t}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex.green@yourdomain.com" style={inputStyle(t)} />
            </Field>
            <Field label="PASSWORD" t={t}>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" style={inputStyle(t)} />
            </Field>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <button onClick={() => setRemember(!remember)} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: font, fontSize: 13, color: t.text, padding: 0 }}>
                <span style={{
                  width: 17, height: 17, borderRadius: 5, boxSizing: "border-box",
                  border: remember ? "none" : `1.5px solid ${t.tertiary}`,
                  background: remember ? t.accentBg : "transparent",
                  color: t.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                }}>{remember ? "✓" : ""}</span>
                Remember me
              </button>
              <button style={{ border: "none", background: "transparent", color: link, fontWeight: 600, cursor: "pointer", fontFamily: font, fontSize: 13, padding: 0 }}>Forgot password?</button>
            </div>
            <Button t={t} onClick={logIn} style={{ width: "100%", padding: "15px 0", fontSize: 16 }}>Log In</Button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: t.divider }} />
              <span style={{ fontSize: 12, color: t.tertiary, fontWeight: 600 }}>Or sign in with</span>
              <div style={{ flex: 1, height: 1, background: t.divider }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                ["Google", (
                  <svg width="17" height="17" viewBox="0 0 48 48" style={{ display: "block", flexShrink: 0 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )],
                ["Facebook", (
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
                    <path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z" />
                  </svg>
                )],
              ].map(([label, icon]) => (
                <button key={label} style={{
                  flex: 1, padding: "12px 0", borderRadius: DS.radius.pill, border: "none", cursor: "pointer",
                  background: t.card, boxShadow: t.cardShadow, fontFamily: font, fontSize: 14, fontWeight: 600, color: t.text,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {icon}{label}
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: t.secondary, margin: "20px 0 24px" }}>
              Don't have an account?{" "}
              <button onClick={() => setMode("signup")} style={{ border: "none", background: "transparent", color: link, fontWeight: 700, cursor: "pointer", fontFamily: font, fontSize: 13, padding: 0 }}>Sign Up</button>
            </div>
          </>
        )}
      </div>
    );
  };

  /* ---------- Header ---------- */

  const Header = ({ title, back, right, leading }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 12px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {leading}
        {back && (
          <button onClick={back} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "2px 6px 2px 0" }}>
            <BackIcon color={t.text} size={20} />
          </button>
        )}
        <h2 style={{ ...DS.type.title, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h2>
      </div>
      {right}
    </div>
  );

  /* ---------- List ---------- */

  const BookRow = ({ b }) => {
    const tone = returnTone(b.returnDate);
    return (
      <button onClick={() => { setActiveId(b.id); setCameFrom(screen); setScreen("details"); }} style={{
        display: "flex", gap: 12, alignItems: "flex-start",
        width: "calc(100% - 40px)", margin: "0 20px 12px", boxSizing: "border-box",
        padding: "12px", border: "none", background: t.card,
        borderRadius: DS.radius.card, boxShadow: t.cardShadow,
        cursor: "pointer", textAlign: "left", fontFamily: font,
      }}>
        <Cover book={b} t={t} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
            {tone === "overdue" && (
              <span style={{ flexShrink: 0, padding: "3px 9px", borderRadius: DS.radius.pill, fontSize: 11, fontWeight: 700, background: t.overdue, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                {Math.abs(daysUntil(b.returnDate))}d overdue
              </span>
            )}
            {tone === "soon" && (
              <span style={{ flexShrink: 0, padding: "3px 9px", borderRadius: DS.radius.pill, fontSize: 11, fontWeight: 700, background: t.chipNeutralBg, color: t.text, whiteSpace: "nowrap" }}>
                {daysUntil(b.returnDate) === 0 ? "Due today" : `Due in ${daysUntil(b.returnDate)}d`}
              </span>
            )}
            {tone === "neutral" && (
              <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: t.tertiary, whiteSpace: "nowrap" }}>
                Due in {daysUntil(b.returnDate)}d
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: t.secondary, marginBottom: 1 }}>{b.author}</div>
          <div style={{ fontSize: 11, color: t.tertiary, marginBottom: 7 }}>{b.year}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <Chip t={t} theme={theme} kind="owner" owner={b.owner}>{b.owner}</Chip>
            <Chip t={t} theme={theme}>{b.location}</Chip>
          </div>
        </div>
      </button>
    );
  };

  const Sheet = ({ children, title }) => (
    <div onClick={() => { setSheet(null); setNewHousehold(false); }} style={{ position: "absolute", inset: 0, background: t.scrim, zIndex: 20, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", background: t.sheet, borderRadius: `${DS.radius.sheet}px ${DS.radius.sheet}px 0 0`,
        padding: "10px 20px 26px", maxHeight: "72%", overflowY: "auto",
      }}>
        <div style={{ width: 34, height: 4, borderRadius: 2, background: t.divider, margin: "0 auto 14px" }} />
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
    </div>
  );

  const OptionRow = ({ label, selected, onClick }) => (
    <button onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
      padding: "12px 0", border: "none", background: "transparent",
      borderBottom: `1px solid ${t.divider}`, cursor: "pointer", fontFamily: font,
      fontSize: 15, color: t.text, fontWeight: selected ? 600 : 400, textAlign: "left",
    }}>
      {label}{selected && <span style={{ fontSize: 15 }}>✓</span>}
    </button>
  );

  const FilterGroup = ({ label, options, value, set }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 8 }}>{label.toUpperCase()}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button key={o} onClick={() => set(o)} style={{
            padding: "7px 14px", borderRadius: DS.radius.pill, cursor: "pointer", fontFamily: font,
            fontSize: 13, fontWeight: 500,
            border: `1px solid ${value === o ? t.text : t.divider}`,
            background: value === o ? t.accentBg : "transparent",
            color: value === o ? t.accentText : t.text,
          }}>{o}</button>
        ))}
      </div>
    </div>
  );

  const List = () => (
    <>
      <Header
        leading={currentUser && (
          <button onClick={() => setScreen("profile")} aria-label="Open profile" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: personColor(currentUser, theme).bg,
              color: personColor(currentUser, theme).text,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, fontFamily: font,
            }}>{currentUser[0]}</div>
          </button>
        )}
        title={currentUser ? `Hello, ${currentUser} 👋` : "My Books"}
      />
      <button onClick={() => setScreen("analytics")} aria-label="View insights" style={{
        margin: "0 20px 14px", flexShrink: 0, background: t.hero, border: "none",
        width: "calc(100% - 40px)", boxSizing: "border-box", cursor: "pointer",
        borderRadius: DS.radius.card, padding: "15px 18px", textAlign: "left", fontFamily: font,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: t.heroInk, position: "relative", overflow: "hidden",
      }}>
        <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: "absolute", right: 62, top: -8, opacity: 0.35 }}>
          <path d="M12 40l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill={t.heroInk} />
          <path d="M44 8v12M38 14h12" stroke={t.heroInk} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {books.length} books in the library
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.72, marginTop: 3 }}>
            {books.filter((b) => b.owner === currentUser && b.location !== home).length} of yours away from home
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, position: "relative" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: t.accentBg, color: t.accentText,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 800,
          }}>
            {books.filter((b) => b.owner === currentUser && b.location !== home).length}
          </div>
          <div style={{ transform: "rotate(180deg)", opacity: 0.65 }}>
            <BackIcon size={17} color={t.heroInk} />
          </div>
        </div>
      </button>
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px", flexShrink: 0 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          padding: "0 14px", borderRadius: DS.radius.pill,
          background: t.card, boxShadow: searchFocus ? t.cardShadow : "none",
          border: `1px solid ${searchFocus ? "transparent" : t.divider}`,
          transition: "box-shadow .15s ease",
        }}>
          <SearchIcon size={15} color={searchFocus ? t.text : t.tertiary} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Search title, author, owner…"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "9px 0", fontSize: 14, fontFamily: font, color: t.text, minWidth: 0 }}
          />
          {query && (
            <button onMouseDown={(e) => e.preventDefault()} onClick={() => setQuery("")} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, display: "flex" }}>
              <CloseIcon size={14} color={t.tertiary} />
            </button>
          )}
        </div>
        <button onClick={() => setSheet("filter")} aria-label="Filter" style={{
          width: 38, height: 38, borderRadius: DS.radius.pill, flexShrink: 0,
          border: `1px solid ${filtersActive ? "transparent" : t.divider}`, cursor: "pointer",
          background: filtersActive ? t.card : "transparent", boxShadow: filtersActive ? t.cardShadow : "none",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          <FilterIcon size={16} color={filtersActive ? t.text : t.secondary} />
          {filtersActive && <span style={{ position: "absolute", top: 7, right: 8, width: 5, height: 5, borderRadius: "50%", background: t.text }} />}
        </button>
        <button onClick={() => setSheet("sort")} aria-label="Sort" style={{
          width: 38, height: 38, borderRadius: DS.radius.pill, flexShrink: 0,
          border: `1px solid ${t.divider}`, cursor: "pointer", background: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SortIcon size={16} color={t.secondary} />
        </button>
      </div>

      {filtersActive && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", padding: "0 20px 12px", flexShrink: 0 }}>
          {[
            ["owner", filterOwner, setFilterOwner],
            ["location", filterLocation, setFilterLocation],
            ["return", filterReturn, setFilterReturn],
          ].filter(([, v]) => v !== "All").map(([key, v, set]) => (
            <button key={key} onClick={() => set("All")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 8px 5px 12px", borderRadius: DS.radius.pill,
              border: "none", background: t.accentBg, color: t.accentText,
              cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: 600,
            }}>
              {v}
              <CloseIcon size={11} color={t.accentText} />
            </button>
          ))}
          <button onClick={() => { setFilterOwner("All"); setFilterLocation("All"); setFilterReturn("All"); }} style={{
            border: "none", background: "transparent", color: t.secondary, cursor: "pointer",
            fontFamily: font, fontSize: 12, fontWeight: 600, padding: "5px 6px",
            textDecoration: "underline", textUnderlineOffset: 3,
          }}>Reset</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {books.length === 0 ? (
          <EmptyState t={t}
            icon={<PlusIcon size={22} color={t.secondary} />}
            title="No books yet"
            subtitle="Add your first children's book to start tracking sharing."
            action={<Button t={t} onClick={() => { setEditing(false); setScreen("add"); }}>Add Book</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState t={t}
            icon={<SearchIcon size={22} color={t.secondary} />}
            title="No results found"
            subtitle={query ? `Nothing matches “${query}”. Check the spelling or try the author's name.` : "No books match the current filters."}
            action={filtersActive ? (
              <Button t={t} variant="ghost" style={{ fontSize: 13, padding: "9px 18px" }}
                onClick={() => { setFilterOwner("All"); setFilterLocation("All"); setFilterReturn("All"); }}>
                Clear filters
              </Button>
            ) : null}
          />
        ) : sortBy === "mine" && currentUser ? (
          <>
            {filtered.some((b) => b.owner === currentUser) && (
              <div style={{ ...DS.type.label, color: t.tertiary, padding: "4px 24px 10px" }}>YOUR BOOKS</div>
            )}
            {filtered.filter((b) => b.owner === currentUser).map((b) => <BookRow key={b.id} b={b} />)}
            {filtered.some((b) => b.owner !== currentUser) && (
              <div style={{ ...DS.type.label, color: t.tertiary, padding: "12px 24px 10px" }}>FROM FRIENDS</div>
            )}
            {filtered.filter((b) => b.owner !== currentUser).map((b) => <BookRow key={b.id} b={b} />)}
            <div style={{ height: 90, flexShrink: 0 }} />
          </>
        ) : (
          <>
            {filtered.map((b) => <BookRow key={b.id} b={b} />)}
            <div style={{ height: 90, flexShrink: 0 }} />
          </>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 20, right: 20 }}>
        <Button t={t} onClick={() => { setEditing(false); setScreen("add"); }} style={{ fontSize: 14, padding: "13px 22px", boxShadow: t.fabShadow }}>
          + Add Book
        </Button>
      </div>

      {sheet === "sort" && (
        <Sheet title="Sort by">
          {[["mine", "Mine first"], ["az", "A → Z"], ["za", "Z → A"], ["return", "Return date (nearest)"], ["recent", "Recently added"], ["oldest", "Oldest added"]].map(([k, l]) => (
            <OptionRow key={k} label={l} selected={sortBy === k} onClick={() => { setSortBy(k); setSheet(null); }} />
          ))}
        </Sheet>
      )}
      {sheet === "filter" && (
        <Sheet title="Filters">
          <FilterGroup label="Owner" options={["All", ...members]} value={filterOwner} set={setFilterOwner} />
          <FilterGroup label="Location" options={["All", ...households]} value={filterLocation} set={setFilterLocation} />
          <FilterGroup label="Return status" options={["All", "Due soon", "Overdue", "No return date"]} value={filterReturn} set={setFilterReturn} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button t={t} variant="secondary" style={{ flex: 1 }} onClick={() => { setFilterOwner("All"); setFilterLocation("All"); setFilterReturn("All"); }}>Reset</Button>
            <Button t={t} style={{ flex: 1 }} onClick={() => setSheet(null)}>Apply</Button>
          </div>
        </Sheet>
      )}
    </>
  );

  /* ---------- Add / Edit ---------- */

  const AddBook = () => {
    const base = editing && active ? active : { title: "", author: "", year: "", owner: currentUser || "Polina", location: home, returnDate: "" };
    const [form, setForm] = useState({ ...base, year: String(base.year || ""), returnDate: base.returnDate || "" });
    const [tab, setTab] = useState("file");
    const [fileName, setFileName] = useState(null);
    const [url, setUrl] = useState("");
    const [scanState, setScanState] = useState("idle");
    const [confirmDel, setConfirmDel] = useState(false);
    const [addingHouse, setAddingHouse] = useState(false);
    const [houseDraft, setHouseDraft] = useState("");
    const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const simulateImport = (title, author, year) => setForm((f) => ({ ...f, title, author, year: String(year) }));
    const awayFromHome = form.location !== home;

    const save = () => {
      if (!form.title.trim()) return;
      if (editing && active) {
        setBooks((bs) => bs.map((b) => b.id === active.id ? { ...b, ...form, year: Number(form.year) || b.year, returnDate: form.returnDate || null } : b));
        setScreen("details");
      } else {
        const id = Math.max(...books.map((b) => b.id), -1) + 1;
        setBooks((bs) => [...bs, {
          id, title: form.title.trim(), author: form.author.trim() || "Unknown",
          year: Number(form.year) || new Date().getFullYear(),
          owner: form.owner, location: form.location, returnDate: form.returnDate || null,
          history: [["Added to library", TODAY.toISOString().slice(0, 10)]],
          notes: [],
        }]);
        setScreen("list");
      }
    };

    return (
      <>
        <Header title={editing ? "Edit Book" : "Add New Book"} back={() => setScreen(editing ? "details" : "list")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 20px" }}>
          {!editing && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Segmented t={t} value={tab} onChange={setTab} options={[
                  { value: "file", label: "Upload File" },
                  { value: "link", label: "Import from Link" },
                  { value: "isbn", label: "Scan ISBN" },
                ]} />
              </div>
              <div style={{ background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: 16, marginBottom: 24 }}>
                {tab === "file" && (
                  <>
                    <div style={{ fontSize: 13, color: t.secondary, marginBottom: 12 }}>PDF, EPUB, JPG, PNG or HEIC</div>
                    <Button t={t} variant="secondary" style={{ padding: "10px 18px", fontSize: 14 }} onClick={() => setFileName("moydodyr_cover.heic")}>Choose File</Button>
                    {fileName && <div style={{ fontSize: 13, color: t.secondary, marginTop: 10 }}>Selected: {fileName}</div>}
                  </>
                )}
                {tab === "link" && (
                  <>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={{ ...inputStyle(t), marginBottom: 10 }} />
                    <Button t={t} style={{ padding: "10px 18px", fontSize: 14 }} onClick={() => simulateImport("The Gruffalo's Child", "Julia Donaldson", 2004)}>Import</Button>
                    <div style={{ fontSize: 12, color: t.tertiary, marginTop: 10 }}>Imported metadata can be edited below.</div>
                  </>
                )}
                {tab === "isbn" && (
                  <>
                    {scanState === "idle" && (
                      <Button t={t} style={{ padding: "10px 18px", fontSize: 14 }} onClick={() => {
                        setScanState("scanning");
                        setTimeout(() => { simulateImport("Fedora's Misery", "Korney Chukovsky", 1926); setScanState("done"); }, 1200);
                      }}>Open Camera & Scan</Button>
                    )}
                    {scanState === "scanning" && <div style={{ fontSize: 14, color: t.secondary }}>Fetching book details…</div>}
                    {scanState === "done" && <div style={{ fontSize: 13, color: t.secondary }}>ISBN 978-5-17-098765 matched. Details filled below — review and save.</div>}
                  </>
                )}
              </div>
            </>
          )}

          <Field label="COVER" t={t}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Cover book={{ title: form.title || "?" }} t={t} size={48} />
              <span style={{ fontSize: 12, color: t.tertiary }}>From ISBN, link, or attached file</span>
            </div>
          </Field>
          <Field label="TITLE" t={t}>
            <input value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="Book title" style={inputStyle(t)} />
          </Field>
          <Field label="AUTHOR" t={t}>
            <input value={form.author} onChange={(e) => upd("author", e.target.value)} placeholder="Author" style={inputStyle(t)} />
          </Field>
          <Field label="PUBLICATION YEAR" t={t}>
            <input value={form.year} onChange={(e) => upd("year", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 1926" style={inputStyle(t)} />
          </Field>
          <Field label="OWNER" t={t}>
            <Select t={t} value={form.owner} onChange={(e) => upd("owner", e.target.value)} options={members} />
          </Field>
          <Field label="LOCATION" t={t}>
            <Select t={t} value={form.location} onChange={(e) => {
              if (e.target.value === "+ Add household…") setAddingHouse(true);
              else upd("location", e.target.value);
            }} options={[...households, "+ Add household…"]} />
            {addingHouse && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input autoFocus value={houseDraft} onChange={(e) => setHouseDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && houseDraft.trim()) {
                      const n = houseDraft.trim();
                      setHouseholds((h) => (h.includes(n) ? h : [...h, n]));
                      upd("location", n);
                      setHouseDraft(""); setAddingHouse(false);
                    }
                  }}
                  placeholder="e.g. Grandma's House" style={{ ...inputStyle(t), flex: 1, padding: "9px 12px", fontSize: 14 }} />
                <Button t={t} style={{ padding: "9px 16px", fontSize: 13, opacity: houseDraft.trim() ? 1 : 0.4 }} onClick={() => {
                  const n = houseDraft.trim();
                  if (!n) return;
                  setHouseholds((h) => (h.includes(n) ? h : [...h, n]));
                  upd("location", n);
                  setHouseDraft(""); setAddingHouse(false);
                }}>Add</Button>
              </div>
            )}
          </Field>
          {awayFromHome || form.returnDate ? (
            <Field label="RETURN DATE (OPTIONAL)" t={t}>
              <DateInput t={t} value={form.returnDate} onChange={(e) => upd("returnDate", e.target.value)} />
              {awayFromHome && !form.returnDate && (
                <div style={{ fontSize: 12, color: t.tertiary, marginTop: 6 }}>
                  This book is at another house — a return date keeps it from being forgotten.
                </div>
              )}
            </Field>
          ) : (
            <button onClick={() => upd("returnDate", "2026-08-01")} style={{
              border: "none", background: "transparent", color: t.secondary, cursor: "pointer",
              fontSize: 13, fontFamily: font, padding: 0, textDecoration: "underline",
              textUnderlineOffset: 3, marginBottom: 20, display: "block",
            }}>+ Add return date</button>
          )}

          <Button t={t} onClick={save} disabled={!form.title.trim()}
            style={{ width: "100%", padding: "15px 0", fontSize: 16, marginTop: 8, opacity: form.title.trim() ? 1 : 0.4 }}>
            {editing ? "Save Changes" : "Save Book"}
          </Button>

          {editing && active && (
            !confirmDel ? (
              <Button t={t} variant="danger" style={{ width: "100%", marginTop: 12 }} onClick={() => setConfirmDel(true)}>
                Delete this book
              </Button>
            ) : (
              <div style={{ background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: 16, marginTop: 12 }}>
                <div style={{ fontSize: 14, color: t.secondary, lineHeight: 1.55, marginBottom: 14 }}>
                  This removes “{active.title}” along with its history and notes. It can't be undone.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Button t={t} variant="secondary" style={{ flex: 1 }} onClick={() => setConfirmDel(false)}>Cancel</Button>
                  <Button t={t} style={{ flex: 1, background: t.overdue, color: "#FFFFFF" }} onClick={() => {
                    setBooks((bs) => bs.filter((b) => b.id !== active.id));
                    setScreen("list");
                  }}>Delete</Button>
                </div>
              </div>
            )
          )}
        </div>
      </>
    );
  };

  /* ---------- Details ---------- */

  const Details = () => {
    if (!active) return null;
    const tone = returnTone(active.returnDate);
    const ownerHome = `${active.owner}'s House`;
    const isAway = active.location !== ownerHome;
    const [noteDraft, setNoteDraft] = useState("");
    const [overlay, setOverlay] = useState(null); // 'lend' | 'delete'
    const [borrower, setBorrower] = useState(null);
    const [lendDate, setLendDate] = useState("");
    const today = TODAY.toISOString().slice(0, 10);

    const addNote = () => {
      if (!noteDraft.trim()) return;
      setBooks((bs) => bs.map((b) => b.id === active.id ? {
        ...b, notes: [...(b.notes || []), { author: currentUser || "Polina", date: today, text: noteDraft.trim() }],
      } : b));
      setNoteDraft("");
    };

    const doLend = () => {
      if (!borrower) return;
      const house = `${borrower}'s House`;
      setHouseholds((h) => h.includes(house) ? h : [...h, house]);
      setBooks((bs) => bs.map((b) => b.id === active.id ? {
        ...b, location: house, returnDate: lendDate || null,
        history: [...b.history, [`Lent to ${borrower}`, today], ...(lendDate ? [["Due", lendDate]] : [])],
      } : b));
      setOverlay(null); setBorrower(null); setLendDate("");
    };

    const doReturn = () => {
      const id = active.id;
      const prev = { location: active.location, returnDate: active.returnDate, history: active.history };
      setHouseholds((h) => h.includes(ownerHome) ? h : [...h, ownerHome]);
      setBooks((bs) => bs.map((b) => b.id === id ? {
        ...b, location: ownerHome, returnDate: null,
        history: [...b.history, ["Returned", today]],
      } : b));
      setToast({
        msg: `“${active.title}” marked returned`,
        undo: () => { setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, ...prev } : b))); setToast(null); },
      });
      setTimeout(() => setToast(null), 5000);
    };

    const row = (label, value, valueStyle = {}) => (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: `1px solid ${t.divider}`, fontSize: 14 }}>
        <span style={{ color: t.secondary }}>{label}</span>
        <span style={{ fontWeight: 600, ...valueStyle }}>{value}</span>
      </div>
    );

    const Overlay = ({ title, children }) => (
      <div onClick={() => setOverlay(null)} style={{ position: "absolute", inset: 0, background: t.scrim, zIndex: 30, display: "flex", alignItems: "flex-end" }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          width: "100%", background: t.sheet, borderRadius: `${DS.radius.sheet}px ${DS.radius.sheet}px 0 0`,
          padding: "10px 20px 26px", maxHeight: "72%", overflowY: "auto",
        }}>
          <div style={{ width: 34, height: 4, borderRadius: 2, background: t.divider, margin: "0 auto 14px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{title}</div>
          {children}
        </div>
      </div>
    );

    return (
      <>
        <Header title="Book Details" back={() => setScreen(cameFrom || "list")}
          right={
            <button onClick={() => { setEditing(true); setScreen("add"); }} aria-label="Edit book" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
              <PencilIcon color={t.secondary} size={17} />
            </button>
          }
        />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <Cover book={active} t={t} size={72} />
            <div>
              <div style={{ ...DS.type.heading, marginBottom: 3 }}>{active.title}</div>
              <div style={{ fontSize: 14, color: t.secondary, marginBottom: 6 }}>{active.author}</div>
              <div style={{ fontSize: 12, color: t.tertiary, marginBottom: 8 }}>{active.year}</div>
              <Chip t={t} theme={theme} kind="owner" owner={active.owner}>{active.owner}</Chip>
            </div>
          </div>

          {row("Location", active.location)}
          {row("Return date",
            active.returnDate ? `${fmtDate(active.returnDate)}${tone === "overdue" ? " · Overdue" : ""}` : "—",
            tone === "overdue" ? { color: t.overdue } : {}
          )}

          <button onClick={() => setScreen("history")} style={{
            display: "flex", justifyContent: "space-between", width: "100%",
            padding: "13px 0", border: "none", background: "transparent",
            borderBottom: `1px solid ${t.divider}`, cursor: "pointer", fontFamily: font,
            fontSize: 14, color: t.text,
          }}>
            <span style={{ color: t.secondary }}>History</span>
            <span style={{ fontWeight: 600 }}>{active.history.length} events ›</span>
          </button>

          <div style={{ ...DS.type.label, color: t.secondary, margin: "24px 0 10px" }}>NOTES</div>
          {(active.notes || []).length === 0 && (
            <div style={{ fontSize: 13, color: t.tertiary, marginBottom: 12 }}>
              No notes yet. Mention damage, missing pages, or anything the next family should know.
            </div>
          )}
          {(active.notes || []).map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "12px 14px", borderRadius: DS.radius.input, background: t.card, boxShadow: t.cardShadow, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 5 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: t.tertiary }}>{n.author} · {fmtDate(n.date)}</div>
              </div>
              {n.author === (currentUser || "Polina") && (
                <button
                  onClick={() => setBooks((bs) => bs.map((b) => b.id === active.id ? { ...b, notes: b.notes.filter((_, j) => j !== i) } : b))}
                  aria-label="Delete note"
                  style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, flexShrink: 0 }}>
                  <CloseIcon size={13} color={t.tertiary} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              placeholder="Add a note…" style={{ ...inputStyle(t), flex: 1, padding: "9px 12px", fontSize: 13 }} />
            <Button t={t} variant="ghost" style={{ padding: "9px 16px", fontSize: 13, opacity: noteDraft.trim() ? 1 : 0.5 }} onClick={addNote}>Add</Button>
          </div>

        </div>

        <div style={{ display: "flex", gap: 10, padding: "14px 20px 20px", borderTop: `1px solid ${t.divider}`, flexShrink: 0, background: t.bg }}>
          {isAway ? (
            <Button t={t} style={{ flex: 1.4 }} onClick={doReturn}>Mark returned</Button>
          ) : (
            <Button t={t} style={{ flex: 1.4 }} onClick={() => {
              setLendDate(new Date(TODAY.getTime() + 21 * 86400000).toISOString().slice(0, 10));
              setOverlay("lend");
            }}>Lend</Button>
          )}
          <Button t={t} variant="secondary" style={{ flex: 1 }} onClick={() => { setEditing(true); setScreen("add"); }}>Edit</Button>
        </div>

        {overlay === "lend" && (
          <Overlay title={`Lend “${active.title}”`}>
            <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 10 }}>TO</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {members.filter((m) => m !== active.owner).map((m) => (
                <Avatar key={m} name={m} size={54} selected={borrower === m} onClick={() => setBorrower(m)} />
              ))}
            </div>
            <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 6 }}>RETURN BY (OPTIONAL)</div>
            <div style={{ marginBottom: 20 }}>
              <DateInput t={t} value={lendDate} onChange={(e) => setLendDate(e.target.value)} />
              <div style={{ fontSize: 11, color: t.tertiary, marginTop: 6 }}>Suggested: 3 weeks. Adjust or clear it.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button t={t} variant="secondary" style={{ flex: 1 }} onClick={() => setOverlay(null)}>Cancel</Button>
              <Button t={t} style={{ flex: 1, opacity: borrower ? 1 : 0.4 }} onClick={doLend}>Lend book</Button>
            </div>
          </Overlay>
        )}

      </>
    );
  };

  /* ---------- History ---------- */

  const History = () => {
    if (!active) return null;
    return (
      <>
        <Header title={active.title} back={() => setScreen("details")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
          <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 18 }}>OWNERSHIP TIMELINE</div>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div style={{ position: "absolute", left: 4, top: 6, bottom: 6, width: 1, background: t.divider }} />
            {active.history.map(([event, date], i) => {
              const overdue = event === "Due" && daysUntil(date) < 0;
              return (
                <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                  <div style={{
                    position: "absolute", left: -18, top: 4, width: 9, height: 9, borderRadius: "50%",
                    background: overdue ? t.overdue : i === active.history.length - 1 ? t.text : t.tertiary,
                  }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: overdue ? t.overdue : t.text }}>
                    {event}{overdue ? " · Overdue" : ""}
                  </div>
                  <div style={{ fontSize: 12, color: t.tertiary, marginTop: 2 }}>{fmtDate(date)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  /* ---------- Analytics ---------- */

  const Analytics = () => {
    const me = currentUser || "Polina";
    const outside = books.filter((b) => b.owner === me && b.location !== home);
    const overdue = books.filter((b) => returnTone(b.returnDate) === "overdue");
    const borrowerCount = {};
    books.forEach((b) => b.history.forEach(([e]) => {
      const m = e.match(/^Lent to (\w+)/);
      if (m) borrowerCount[m[1]] = (borrowerCount[m[1]] || 0) + 1;
    }));
    const topBorrower = Object.entries(borrowerCount).sort((a, b) => b[1] - a[1])[0];
    const borrowedNow = topBorrower
      ? books.filter((b) => b.location === `${topBorrower[0]}'s House` && b.owner !== topBorrower[0])
      : [];
    const mostShared = [...books].sort((a, b) =>
      b.history.filter(([e]) => e.startsWith("Lent")).length - a.history.filter(([e]) => e.startsWith("Lent")).length
    )[0];
    const [open, setOpen] = useState(null);

    const MiniRow = ({ b, ink, detail }) => (
      <button onClick={() => { setActiveId(b.id); setCameFrom(screen); setScreen("details"); }} style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "9px 0", border: "none", borderTop: `1px solid ${ink}26`,
        background: "transparent", cursor: "pointer", fontFamily: font, textAlign: "left",
      }}>
        <Cover book={b} t={t} size={26} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
          <div style={{ fontSize: 11, color: ink, opacity: 0.7, marginTop: 1 }}>{detail}</div>
        </div>
        <span style={{ color: ink, opacity: 0.6, fontWeight: 700, fontSize: 15 }}>›</span>
      </button>
    );

    let pi = 0;
    const stat = (label, value, sub, danger, book, list, detailFn) => {
      const bg = t.pastels[pi % t.pastels.length];
      const ink = t.pastelInks[pi % t.pastelInks.length];
      pi += 1;
      const isOpen = open === label;
      return (
        <div key={label} style={{
          padding: "18px 20px", borderRadius: DS.radius.card, background: bg, marginBottom: 12,
          boxShadow: t.cardShadow,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...DS.type.label, color: ink, opacity: 0.75, marginBottom: 6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: danger ? (theme === "light" ? "#8E1F16" : "#FFD2CC") : ink }}>{value}</div>
              {sub && <div style={{ fontSize: 13, color: ink, opacity: 0.75, marginTop: 3 }}>{sub}</div>}
            </div>
            {book && <Cover book={book} t={t} size={52} />}
          </div>
          {list && list.length > 0 && (
            <>
              <button onClick={() => setOpen(isOpen ? null : label)} style={{
                marginTop: 12, padding: "7px 15px", borderRadius: DS.radius.pill,
                border: `1.5px solid ${ink}59`, background: "transparent", color: ink,
                fontFamily: font, fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                {isOpen ? "Hide" : `Show ${list.length} book${list.length > 1 ? "s" : ""}`}
              </button>
              {isOpen && (
                <div style={{ marginTop: 10 }}>
                  {list.map((b) => <MiniRow key={b.id} b={b} ink={ink} detail={detailFn(b)} />)}
                </div>
              )}
            </>
          )}
        </div>
      );
    };

    return (
      <>
        <Header title="Insights" back={() => setScreen("list")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
          {stat(
            "Most frequent borrower",
            topBorrower ? topBorrower[0] : "—",
            topBorrower ? `${topBorrower[1]} loans · ${borrowedNow.length} book${borrowedNow.length === 1 ? "" : "s"} right now` : null,
            false, null, borrowedNow,
            (b) => `owned by ${b.owner}${b.returnDate ? ` · due ${fmtDate(b.returnDate)}` : ""}`
          )}
          {stat(
            "Books currently outside home",
            outside.length,
            outside.length ? `across ${new Set(outside.map((b) => b.location)).size} household${new Set(outside.map((b) => b.location)).size === 1 ? "" : "s"}` : "All your books are home",
            false, null, outside,
            (b) => `${b.location}${b.returnDate ? ` · due ${fmtDate(b.returnDate)}` : " · no return date"}`
          )}
          {stat(
            "Overdue",
            overdue.length,
            overdue.length ? "These need a friendly nudge" : "Everything is on time",
            overdue.length > 0, null, overdue,
            (b) => `${b.location} · was due ${fmtDate(b.returnDate)}`
          )}
          {stat("Most shared book", mostShared ? mostShared.title : "—", mostShared ? `${mostShared.history.filter(([e]) => e.startsWith("Lent")).length} times lent` : null, false, mostShared)}
        </div>
      </>
    );
  };

  /* ---------- Profile ---------- */

  const Profile = () => {
    const me = currentUser || "Polina";
    const c = personColor(me, theme);
    const owned = books.filter((b) => b.owner === me).length;
    const lentOut = books.filter((b) => b.owner === me && b.location !== home).length;
    const borrowed = books.filter((b) => b.owner !== me && b.location === home).length;
    const [nameDraft, setNameDraft] = useState(me);
    const [emailDraft, setEmailDraft] = useState(emails[me] || "");
    const [addingMember, setAddingMember] = useState(false);
    const [memberDraft, setMemberDraft] = useState("");
    const [, bump] = useState(0);
    const nameTaken = nameDraft.trim() !== me && members.includes(nameDraft.trim());
    const nameDirty = nameDraft.trim() !== me;
    const emailDirty = (emailDraft.trim() || "") !== (emails[me] || "");

    const renameUser = () => {
      const newN = nameDraft.trim();
      if (!newN || newN === me) return;
      if (members.includes(newN)) return;
      setMembers((m) => m.map((x) => (x === me ? newN : x)));
      setHouseholds((h) => h.map((x) => (x === `${me}'s House` ? `${newN}'s House` : x)));
      setBooks((bs) => bs.map((b) => ({
        ...b,
        owner: b.owner === me ? newN : b.owner,
        location: b.location === `${me}'s House` ? `${newN}'s House` : b.location,
        history: b.history.map(([e, d]) => [e.split(`Lent to ${me}`).join(`Lent to ${newN}`), d]),
        notes: (b.notes || []).map((n) => (n.author === me ? { ...n, author: newN } : n)),
      })));
      setEmails((prev) => { const p = { ...prev }; if (p[me]) { p[newN] = p[me]; delete p[me]; } return p; });
      if (COLOR_OVERRIDES[me] != null) { COLOR_OVERRIDES[newN] = COLOR_OVERRIDES[me]; delete COLOR_OVERRIDES[me]; }
      setCurrentUser(newN);
    };

    const saveAccount = () => {
      if (emailDirty) setEmails((p) => ({ ...p, [me]: emailDraft.trim() }));
      if (nameDirty && !nameTaken) renameUser();
    };

    const canRemove = (m) => m !== me && !books.some((b) => b.owner === m || b.location === `${m}'s House`);
    const removeMember = (m) => {
      setMembers((ms) => ms.filter((x) => x !== m));
      setHouseholds((h) => h.filter((x) => x !== `${m}'s House`));
    };
    const addMember = () => {
      const n = memberDraft.trim();
      if (!n || members.includes(n)) return;
      setMembers((ms) => [...ms, n]);
      setHouseholds((h) => (h.includes(`${n}'s House`) ? h : [...h, `${n}'s House`]));
      setMemberDraft(""); setAddingMember(false);
    };

    const statCard = (n, label) => (
      <div key={label} style={{ flex: 1, background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: "14px 0", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{n}</div>
        <div style={{ fontSize: 11, color: t.secondary, fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    );
    return (
      <>
        <Header title="Profile" back={() => setScreen("list")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: c.bg, color: c.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, marginBottom: 10 }}>{me[0]}</div>
            <div style={{ ...DS.type.heading }}>{me}</div>
            <div style={{ fontSize: 13, color: t.secondary, marginTop: 3 }}>{home}</div>
          </div>

          <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 8 }}>ACCOUNT</div>
          <div style={{ background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: "16px 16px 14px", marginBottom: 24 }}>
            <Field label="NAME" t={t}>
              <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="Alex" style={inputStyle(t)} />
            </Field>
            <Field label="EMAIL" t={t}>
              <input value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} placeholder="alex.green@yourdomain.com" style={inputStyle(t)} />
            </Field>
            <div style={{ fontSize: 11, color: nameTaken ? t.overdue : t.tertiary, margin: "-8px 0 12px", lineHeight: 1.5 }}>
              {nameTaken ? "This name is already taken." : "Renaming updates your books, loans, history and notes."}
            </div>
            <Button t={t} onClick={saveAccount} style={{
              width: "100%", padding: "12px 0", fontSize: 14,
              opacity: (nameDirty || emailDirty) && nameDraft.trim() && !nameTaken ? 1 : 0.4,
            }}>
              Save changes
            </Button>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
            {statCard(owned, "Owned")}
            {statCard(lentOut, "Lent out")}
            {statCard(borrowed, "Borrowed")}
          </div>

          <div style={{ ...DS.type.label, color: t.secondary, marginBottom: 8 }}>PREFERENCES</div>
          <div style={{ background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: "16px 16px 6px", marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.secondary, marginBottom: 10 }}>Identity color</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              {IDENTITY_PALETTE[theme].map((p, i) => {
                const isCurrent = personColor(me, theme).bg === p.bg;
                return (
                  <button key={i} onClick={() => { COLOR_OVERRIDES[me] = i; bump((x) => x + 1); }}
                    aria-label={`Identity colour ${i + 1}`} style={{
                      width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
                      background: p.text,
                      border: isCurrent ? `3px solid ${t.text}` : `3px solid ${t.divider}`,
                      boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
                      color: theme === "light" ? "#FFFFFF" : "#14161C", fontSize: 15, fontWeight: 800, fontFamily: font,
                    }}>
                    {isCurrent ? "✓" : ""}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: t.secondary, marginBottom: 10 }}>Appearance</div>
            <div style={{ marginBottom: 16, maxWidth: 200 }}>
              <Segmented t={t} compact value={theme} onChange={setTheme} options={[
                { value: "light", label: "Light", icon: (p) => <SunIcon {...p} /> },
                { value: "dark", label: "Dark", icon: (p) => <MoonIcon {...p} /> },
              ]} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 14px", borderTop: `1px solid ${t.divider}` }}>
              <div>
                <div style={{ fontSize: 14 }}>Due-date reminders</div>
                <div style={{ fontSize: 12, color: t.tertiary, marginTop: 2 }}>Notify 2 days before a return date</div>
              </div>
              <button onClick={() => setRemindersOn(!remindersOn)} aria-label="Toggle reminders" style={{
                width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                background: remindersOn ? t.accentBg : t.segBg, position: "relative", transition: "background .18s ease", flexShrink: 0,
              }}>
                <span style={{
                  position: "absolute", top: 3, left: remindersOn ? 21 : 3, width: 20, height: 20,
                  borderRadius: "50%", background: remindersOn ? t.accentText : t.tertiary, transition: "left .18s ease",
                }} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ ...DS.type.label, color: t.secondary }}>MEMBERS</div>
            <Button t={t} variant="ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setAddingMember(true)}>
              <PlusIcon size={12} color={t.secondary} /> Add member
            </Button>
          </div>
          <div style={{ background: t.card, borderRadius: DS.radius.card, boxShadow: t.cardShadow, padding: "4px 16px", marginBottom: 8 }}>
            {members.map((m, idx) => {
              const mc = personColor(m, theme);
              const count = books.filter((b) => b.owner === m).length;
              return (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: idx < members.length - 1 || addingMember ? `1px solid ${t.divider}` : "none" }}>
                  <button onClick={() => { setViewedMember(m); setScreen("member"); }} style={{
                    display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0,
                    border: "none", background: "transparent", cursor: "pointer", fontFamily: font, textAlign: "left", padding: 0,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: mc.bg, color: mc.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{m[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{m}{m === me ? " (you)" : ""}</div>
                      <div style={{ fontSize: 11, color: t.tertiary, marginTop: 1 }}>{count} book{count === 1 ? "" : "s"}</div>
                    </div>
                    <span style={{ color: t.tertiary, fontWeight: 700 }}>›</span>
                  </button>
                  {canRemove(m) && (
                    <button onClick={() => removeMember(m)} aria-label={`Remove ${m}`} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                      <TrashIcon size={15} color={t.tertiary} />
                    </button>
                  )}
                </div>
              );
            })}
            {addingMember && (
              <div style={{ display: "flex", gap: 8, padding: "12px 0 14px" }}>
                <input autoFocus value={memberDraft} onChange={(e) => setMemberDraft(e.target.value)} placeholder="Name"
                  onKeyDown={(e) => { if (e.key === "Enter") addMember(); }}
                  style={{ ...inputStyle(t), flex: 1, padding: "9px 12px", fontSize: 13 }} />
                <Button t={t} style={{ padding: "9px 14px", fontSize: 13, opacity: memberDraft.trim() ? 1 : 0.4 }} onClick={addMember}>Add</Button>
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: t.tertiary, lineHeight: 1.5 }}>
            Members who own or hold books can't be removed. Households appear automatically when someone joins or borrows.
          </div>

          <Button t={t} variant="secondary" style={{ width: "100%", marginTop: 28 }} onClick={() => setScreen("auth")}>
            Switch account
          </Button>
          <button onClick={() => { setCurrentUser(null); setScreen("welcome"); }} style={{
            display: "block", margin: "16px auto 0", border: "none", background: "transparent",
            color: t.secondary, cursor: "pointer", fontFamily: font, fontSize: 13, fontWeight: 600,
            textDecoration: "underline", textUnderlineOffset: 3,
          }}>Log out</button>
          <div style={{ fontSize: 12, color: t.tertiary, marginTop: 14, textAlign: "center" }}>Tiny Book Crossing · Prototype</div>
        </div>
      </>
    );
  };

  /* ---------- Member shelf ---------- */

  const Member = () => {
    const m = viewedMember;
    if (!m) return null;
    const c = personColor(m, theme);
    const mHome = `${m}'s House`;
    const owns = books.filter((b) => b.owner === m);
    const holding = books.filter((b) => b.location === mHome && b.owner !== m);
    return (
      <>
        <Header title={m === currentUser ? "You" : m} back={() => setScreen("profile")} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 20px 18px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.bg, color: c.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>{m[0]}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{m}</div>
              <div style={{ fontSize: 12, color: t.secondary, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {mHome}{emails[m] ? ` · ${emails[m]}` : ""}
              </div>
              <div style={{ fontSize: 12, color: t.tertiary, marginTop: 2 }}>
                {owns.length} owned · {owns.filter((b) => b.location !== mHome).length} lent out · {holding.length} borrowed
              </div>
            </div>
          </div>
          {owns.length > 0 && <div style={{ ...DS.type.label, color: t.tertiary, padding: "0 24px 10px" }}>THEIR BOOKS</div>}
          {owns.map((b) => <BookRow key={b.id} b={b} />)}
          {holding.length > 0 && <div style={{ ...DS.type.label, color: t.tertiary, padding: "10px 24px 10px" }}>CURRENTLY HOLDING</div>}
          {holding.map((b) => <BookRow key={b.id} b={b} />)}
          {owns.length === 0 && holding.length === 0 && (
            <div style={{ fontSize: 13, color: t.tertiary, padding: "8px 24px" }}>No books yet.</div>
          )}
          <div style={{ height: 24, flexShrink: 0 }} />
        </div>
      </>
    );
  };

  return (
    <div style={shell}>
      <style>{`
        .tbc, .tbc * { scrollbar-width: none; -ms-overflow-style: none; }
        .tbc::-webkit-scrollbar, .tbc *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .tbc input[type="date"] { -webkit-appearance: none; appearance: none; }
        .tbc input[type="date"]::-webkit-date-and-time-value { text-align: left; margin: 0; }
        .tbc input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; }
        .tbc .tbc-date-empty::-webkit-datetime-edit { color: transparent; }
      `}</style>
      <div style={phone} className="tbc">
        {screen === "welcome" && Welcome()}
        {screen === "auth" && <Auth />}
        {screen === "list" && List()}
        {screen === "add" && <AddBook />}
        {screen === "details" && <Details />}
        {screen === "history" && History()}
        {screen === "analytics" && <Analytics />}
        {screen === "profile" && <Profile />}
        {screen === "member" && Member()}
        {toast && (
          <div style={{
            position: "absolute", left: 20, right: 20, bottom: 78, zIndex: 40,
            background: t.accentBg, color: t.accentText, borderRadius: DS.radius.card,
            padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            boxShadow: t.fabShadow,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{toast.msg}</span>
            {toast.undo && (
              <button onClick={toast.undo} style={{
                border: "none", background: "transparent", color: t.accentText, fontFamily: font,
                fontSize: 13, fontWeight: 800, cursor: "pointer", textDecoration: "underline",
                textUnderlineOffset: 3, flexShrink: 0, padding: 0,
              }}>Undo</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
