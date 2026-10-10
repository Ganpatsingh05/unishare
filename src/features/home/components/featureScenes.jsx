"use client";

import { motion } from "framer-motion";

// Small looping SVG scenes, one per feature, drawn for the orbit's centre.
// Each takes the feature colour `c`; everything is solid colour on purpose.
// `still` freezes them for reduced motion.

const NAVY = "#12233A";
const YELLOW = "#FFD24C";
const loop = (duration, extra = {}) => ({ duration, repeat: Infinity, ease: "easeInOut", ...extra });

function Svg({ children, label }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

// Rides: a car drives the dotted route between two pins.
function RideScene({ c, still }) {
  const route = "M38 128 C 70 70, 130 70, 162 128";
  return (
    <Svg label="A car driving between two pins">
      <motion.path d={route} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" animate={still ? undefined : { strokeDashoffset: [0, -28] }} transition={loop(0.9, { ease: "linear" })} />
      {[38, 162].map((x, i) => (
        <g key={x} transform={`translate(${x} 128)`}>
          <path d="M0 0 C -10 -12, -12 -18, -12 -24 A 12 12 0 1 1 12 -24 C 12 -18, 10 -12, 0 0 Z" fill={i ? YELLOW : c} />
          <circle cy="-24" r="4.5" fill={NAVY} />
        </g>
      ))}
      {/* Driven with a CSS keyframe: offset-distance is a style, not an SVG attribute. */}
      <style>{`@keyframes fsDrive { 0% { offset-distance: 8%; } 45%, 55% { offset-distance: 92%; } 100% { offset-distance: 8%; } }`}</style>
      <g style={{ offsetPath: `path("${route}")`, offsetRotate: "auto", offsetDistance: "8%", animation: still ? "none" : "fsDrive 4.2s ease-in-out infinite" }}>
        <g transform="translate(-17 -16)">
          <rect x="0" y="6" width="34" height="13" rx="5" fill="#FFFFFF" />
          <path d="M7 6 L11 0 H23 L28 6 Z" fill="#FFFFFF" />
          <rect x="12" y="1.5" width="10" height="4.5" rx="1" fill={c} />
          <circle cx="9" cy="20" r="4" fill={NAVY} />
          <circle cx="26" cy="20" r="4" fill={NAVY} />
        </g>
      </g>
      <motion.text x="100" y="164" textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFFFFF" animate={still ? undefined : { opacity: [0.4, 1, 0.4] }} transition={loop(2.4)}>
        ₹ ÷ 4
      </motion.text>
    </Svg>
  );
}

// Housing: the house draws itself, then its windows light up one by one.
function HouseScene({ c, still }) {
  const draw = (delay) => (still ? {} : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.1, delay, ease: "easeInOut" } });
  return (
    <Svg label="A house with its windows lighting up">
      <motion.path d="M46 96 L100 52 L154 96" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" {...draw(0)} />
      <motion.path d="M58 90 V150 H142 V90" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" {...draw(0.3)} />
      {[[72, 102], [110, 102], [72, 124]].map(([x, y], i) => (
        <motion.rect key={`${x}${y}`} x={x} y={y} width="18" height="15" rx="2.5" fill="#FFFFFF" fillOpacity="0.18" animate={still ? undefined : { fill: ["#FFFFFF", YELLOW, YELLOW, "#FFFFFF"], fillOpacity: [0.18, 1, 1, 0.18] }} transition={loop(3.6, { delay: 1 + i * 0.45, times: [0, 0.15, 0.7, 1] })} />
      ))}
      <rect x="108" y="122" width="22" height="28" rx="3" fill={c} />
      <circle cx="125" cy="137" r="2" fill={NAVY} />
      <motion.g animate={still ? undefined : { y: [0, -6, 0] }} transition={loop(2.6)}>
        <circle cx="152" cy="64" r="7" fill="none" stroke={YELLOW} strokeWidth="4" />
        <path d="M157 69 L170 82 M164 76 L168 72 M167 79 L171 75" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
    </Svg>
  );
}

// Marketplace: a price tag swings on its string, then gets stamped SOLD.
function MarketScene({ c, still }) {
  return (
    <Svg label="A price tag being stamped sold">
      <circle cx="100" cy="40" r="5" fill="#FFFFFF" />
      <motion.g style={{ originX: "100px", originY: "40px" }} animate={still ? undefined : { rotate: [-9, 9, -9] }} transition={loop(2.8)}>
        <line x1="100" y1="40" x2="100" y2="70" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M100 66 L134 92 V156 H66 V92 Z" fill={c} />
        <circle cx="100" cy="86" r="5" fill={NAVY} />
        <text x="100" y="132" textAnchor="middle" fontSize="34" fontWeight="900" fill={NAVY}>₹</text>
        <motion.g style={{ originX: "100px", originY: "130px" }} initial={{ scale: 0, opacity: 0 }} animate={still ? { scale: 1, opacity: 1 } : { scale: [2, 1, 1, 1], opacity: [0, 1, 1, 0] }} transition={loop(2.8, { times: [0, 0.12, 0.8, 1], repeatDelay: 0.6 })}>
          <rect x="70" y="116" width="60" height="24" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="3.5" transform="rotate(-14 100 128)" />
          <text x="100" y="135" textAnchor="middle" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="2" transform="rotate(-14 100 128)">SOLD</text>
        </motion.g>
      </motion.g>
    </Svg>
  );
}

// Tickets: the stub tears off along the perforation and drifts away.
function TicketScene({ c, still }) {
  return (
    <Svg label="A ticket with its stub tearing off">
      <g transform="rotate(-8 100 100)">
        <path d="M36 70 H122 V82 A 8 8 0 0 0 122 98 V130 H36 Z" fill={c} />
        <text x="79" y="108" textAnchor="middle" fontSize="15" fontWeight="900" fill={NAVY} letterSpacing="1">FEST</text>
        <rect x="52" y="116" width="54" height="5" rx="2.5" fill={NAVY} fillOpacity="0.35" />
        <motion.g style={{ originX: "124px", originY: "130px" }} animate={still ? undefined : { rotate: [0, 0, 16, 16, 0], x: [0, 0, 12, 12, 0], y: [0, 0, 10, 10, 0] }} transition={loop(3.2, { times: [0, 0.3, 0.5, 0.85, 1] })}>
          <path d="M126 70 H164 V130 H126 V98 A 8 8 0 0 0 126 82 Z" fill={c} />
          <text x="145" y="100" textAnchor="middle" fontSize="10" fontWeight="900" fill={NAVY} transform="rotate(90 145 100)" letterSpacing="2">ADMIT</text>
        </motion.g>
        <line x1="124" y1="70" x2="124" y2="130" stroke={NAVY} strokeWidth="2" strokeDasharray="3 4" />
      </g>
      {[[50, 54], [160, 150], [150, 48]].map(([x, y], i) => (
        <motion.path key={x} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`} fill={YELLOW} animate={still ? undefined : { scale: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }} style={{ originX: `${x}px`, originY: `${y}px` }} transition={loop(1.6, { delay: i * 0.5 })} />
      ))}
    </Svg>
  );
}

// Lost & Found: a magnifier sweeps the shelf and finds the key.
function LostScene({ c, still }) {
  const sweep = { x: [-52, 0, 0, 52, 52, -52] };
  const t = { times: [0, 0.3, 0.55, 0.75, 0.9, 1] };
  return (
    <Svg label="A magnifying glass finding a lost key">
      <rect x="30" y="134" width="140" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.3" />
      <rect x="44" y="110" width="22" height="24" rx="4" fill="#FFFFFF" fillOpacity="0.35" />
      <circle cx="146" cy="121" r="12" fill="#FFFFFF" fillOpacity="0.35" />
      <motion.g animate={still ? undefined : { scale: [1, 1, 1.25, 1, 1, 1] }} style={{ originX: "100px", originY: "120px" }} transition={loop(4, t)}>
        <motion.g animate={still ? undefined : { fill: ["#FFFFFF", "#FFFFFF", YELLOW, YELLOW, "#FFFFFF", "#FFFFFF"] }} transition={loop(4, t)} fill="#FFFFFF">
          <circle cx="92" cy="122" r="8" fill="none" stroke="currentColor" />
          <circle cx="92" cy="122" r="8" />
          <rect x="98" y="119" width="20" height="6" rx="2" />
          <rect x="110" y="125" width="4" height="6" rx="1" />
        </motion.g>
      </motion.g>
      <motion.g animate={still ? undefined : sweep} transition={loop(4, t)}>
        <circle cx="100" cy="88" r="24" fill={c} fillOpacity="0.22" stroke={c} strokeWidth="7" />
        <path d="M117 105 L136 124" stroke={c} strokeWidth="10" strokeLinecap="round" />
      </motion.g>
      <motion.path d="M84 162 L94 172 L116 150" fill="none" stroke={YELLOW} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" animate={still ? undefined : { pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }} transition={loop(4, { times: [0, 0.45, 0.6, 0.85, 1] })} />
    </Svg>
  );
}

// Announcements: a megaphone sends out waves and confetti.
function AnnounceScene({ c, still }) {
  return (
    <Svg label="A megaphone sending out sound waves">
      <motion.g animate={still ? undefined : { rotate: [-4, 4, -4] }} style={{ originX: "80px", originY: "110px" }} transition={loop(1.4)}>
        <path d="M48 96 L104 70 V150 L48 124 Z" fill={c} />
        <rect x="34" y="96" width="18" height="28" rx="5" fill="#FFFFFF" />
        <path d="M60 126 L66 150 H78 L74 130" fill="#FFFFFF" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${118 + i * 14} ${88 - i * 8} Q ${132 + i * 18} 110 ${118 + i * 14} ${132 + i * 8}`} fill="none" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" animate={still ? undefined : { opacity: [0, 1, 0], x: [0, 6, 12] }} transition={loop(1.5, { delay: i * 0.25, ease: "easeOut" })} />
      ))}
      {[[150, 56, c], [170, 150, "#FFFFFF"], [128, 162, YELLOW]].map(([x, y, f], i) => (
        <motion.rect key={x} x={x} y={y} width="8" height="8" rx="2" fill={f} animate={still ? undefined : { y: [0, -10, 0], rotate: [0, 90, 180] }} style={{ originX: `${x + 4}px`, originY: `${y + 4}px` }} transition={loop(2.2, { delay: i * 0.4 })} />
      ))}
    </Svg>
  );
}

// Resources: a book with its pages flipping.
function BookScene({ c, still }) {
  return (
    <Svg label="A book with pages flipping">
      <path d="M100 66 C 80 56, 52 56, 34 62 V146 C 52 140, 80 140, 100 150 Z" fill="#FFFFFF" />
      <path d="M100 66 C 120 56, 148 56, 166 62 V146 C 148 140, 120 140, 100 150 Z" fill="#FFFFFF" />
      {[78, 90, 102].map((y) => <rect key={y} x="48" y={y} width="38" height="4" rx="2" fill={c} fillOpacity="0.5" />)}
      {[0, 1].map((i) => (
        <motion.path key={i} d="M100 66 C 120 56, 148 56, 166 62 V146 C 148 140, 120 140, 100 150 Z" fill={i ? c : "#E8EEF6"} style={{ originX: "100px", originY: "100px" }} animate={still ? undefined : { scaleX: [1, 1, -1, -1] }} transition={loop(3, { delay: i * 1.5, times: [0, 0.2, 0.55, 1], repeatDelay: 0 })} />
      ))}
      <path d="M34 146 C 52 140, 80 140, 100 150 C 120 140, 148 140, 166 146 V156 C 148 150, 120 150, 100 160 C 80 150, 52 150, 34 156 Z" fill={c} />
      <motion.g animate={still ? undefined : { y: [0, -8, 0], rotate: [0, 8, 0] }} transition={loop(2.4)} style={{ originX: "150px", originY: "40px" }}>
        <path d="M140 46 L156 30 L162 36 L146 52 Z" fill={YELLOW} />
        <path d="M140 46 L137 55 L146 52 Z" fill="#FFFFFF" />
      </motion.g>
    </Svg>
  );
}

// Contacts: a phone rings, with signal arcs on both sides.
function ContactScene({ c, still }) {
  return (
    <Svg label="A ringing phone">
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(200 0) scale(-1 1)" : undefined}>
          {[0, 1].map((i) => (
            <motion.path key={i} d={`M${56 - i * 14} ${80 - i * 10} Q ${46 - i * 16} 100 ${56 - i * 14} ${120 + i * 10}`} fill="none" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" animate={still ? undefined : { opacity: [0.15, 1, 0.15] }} transition={loop(1.2, { delay: i * 0.2 })} />
          ))}
        </g>
      ))}
      <motion.g style={{ originX: "100px", originY: "100px" }} animate={still ? undefined : { rotate: [0, -10, 10, -10, 10, 0, 0] }} transition={loop(1.8, { times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 1] })}>
        <rect x="74" y="48" width="52" height="104" rx="12" fill="#FFFFFF" />
        <rect x="80" y="60" width="40" height="70" rx="5" fill={c} />
        <circle cx="100" cy="141" r="4" fill={NAVY} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((k) => <circle key={`${r}${k}`} cx={88 + k * 12} cy={76 + r * 14} r="3.5" fill={NAVY} fillOpacity="0.55" />))}
      </motion.g>
    </Svg>
  );
}

export const SCENES = { rides: RideScene, rooms: HouseScene, market: MarketScene, tickets: TicketScene, lostfound: LostScene, announcements: AnnounceScene, resources: BookScene, contacts: ContactScene };
