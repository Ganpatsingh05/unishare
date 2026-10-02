"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// CAMPUS ILLUSTRATIONS — Performance-Optimized
// All continuous animations use CSS keyframes (GPU-composited).
// Framer Motion removed entirely — only CSS transitions for hover states.
// ═══════════════════════════════════════════════════════════════════════════════

const P = {
  warmCream: "#f5ebe0", softPeach: "#fce8d5", paleLavender: "#ede9fe", softMint: "#ecfdf5",
  terracotta: "#c2775e", terracottaShadow: "#a3614a",
  slate: "#64748b", slateShadow: "#475569",
  deepTeal: "#0d9488", deepTealShadow: "#0f766e",
  windowBlue: "#bfdbfe", windowLit: "#fef08a", windowFrame: "#94a3b8", glassReflect: "#e0f2fe",
  woodDoor: "#92400e", woodDoorLight: "#a3541a",
  treeTrunk: "#78350f",
  sidewalk: "#e2e8f0",
  warmYellow: "#fde047",
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS KEYFRAMES — Injected once, all animations GPU-composited
// ═══════════════════════════════════════════════════════════════════════════════

export const CampusMapStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .bird-fly { animation: birdFly 18s linear infinite; }
    @keyframes birdFly { 0% { transform: translateX(-60px) translateY(0); } 25% { transform: translateX(200px) translateY(-20px); } 50% { transform: translateX(500px) translateY(10px); } 75% { transform: translateX(700px) translateY(-15px); } 100% { transform: translateX(900px) translateY(0); } }

    .star-twinkle { animation: starTwinkle var(--star-dur, 3s) ease-in-out infinite; animation-delay: var(--star-delay, 0s); }
    @keyframes starTwinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }

    .cloud-drift { animation: cloudDrift var(--cloud-dur, 70s) ease-in-out infinite; }
    @keyframes cloudDrift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(var(--cloud-dist, 80px)); } }
  `}} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. UNIVERSITY CAMPUS
// ═══════════════════════════════════════════════════════════════════════════════

export const UniversityCampus = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={80} cy={128} rx={80} ry={8} fill="rgba(0,0,0,0.08)" />

      {/* Gate */}
      <rect x={-10} y={100} width={8} height={28} rx={1} fill={w ? "#334155" : "#94a3b8"} />
      <rect x={165} y={100} width={8} height={28} rx={1} fill={w ? "#334155" : "#94a3b8"} />
      <rect x={-14} y={96} width={16} height={6} rx={1.5} fill={w ? "#475569" : "#64748b"} />
      <rect x={161} y={96} width={16} height={6} rx={1.5} fill={w ? "#475569" : "#64748b"} />
      <path d="M -6 100 Q 80 82 168 100" fill="none" stroke={w ? "#475569" : "#64748b"} strokeWidth={2} />
      <rect x={48} y={84} width={66} height={12} rx={2} fill={w ? "#1e40af" : "#2563eb"} />
      <text x={81} y={93} textAnchor="middle" fontSize="6.5" fontWeight="900" fill="white" fontFamily="system-ui">LPU CAMPUS</text>

      {/* Main Building */}
      <rect x={15} y={18} width={130} height={90} rx={3} fill={w ? "#1e293b" : "#f0e6d6"} />
      <polygon points="145,18 170,6 170,102 145,108" fill={w ? "#162032" : "#e6d9c6"} />
      <polygon points="12,18 148,18 173,6 37,6" fill={w ? "#475569" : P.terracotta} />
      <rect x={37} y={2} width={136} height={4} rx={1} fill={w ? "#334155" : P.terracottaShadow} />

      {/* Glass Entrance */}
      <rect x={55} y={72} width={50} height={36} rx={2} fill={w ? "#0f172a" : "#bfdbfe"} opacity={0.8} />
      <rect x={57} y={74} width={22} height={32} rx={1} fill={w ? "#1e3a5f" : P.glassReflect} opacity={0.5} />
      <rect x={81} y={74} width={22} height={32} rx={1} fill={w ? "#1e3a5f" : P.glassReflect} opacity={0.5} />
      <circle cx={78} cy={92} r={1.2} fill={w ? "#64748b" : "#78350f"} />
      <circle cx={82} cy={92} r={1.2} fill={w ? "#64748b" : "#78350f"} />
      <rect x={52} y={72} width={4} height={36} rx={1} fill={w ? "#334155" : "#d6cbb8"} />
      <rect x={104} y={72} width={4} height={36} rx={1} fill={w ? "#334155" : "#d6cbb8"} />

      {/* Windows */}
      {[22, 40, 58, 100, 118, 136].map((wx, i) => (
        <g key={`r1-${i}`}>
          <rect x={wx} y={28} width={12} height={16} rx={1.5} fill={w ? "#0f172a" : P.windowBlue} />
          <line x1={wx + 6} y1={28} x2={wx + 6} y2={44} stroke={w ? "#334155" : P.windowFrame} strokeWidth={0.5} />
          {!w && <rect x={wx + 7} y={29} width={3} height={4} rx={0.5} fill="#fef08a" opacity={0.1} />}
        </g>
      ))}
      {[22, 40, 114, 136].map((wx, i) => (
        <g key={`r2-${i}`}>
          <rect x={wx} y={50} width={12} height={16} rx={1.5} fill={w ? "#0f172a" : P.windowBlue} />
          <line x1={wx + 6} y1={50} x2={wx + 6} y2={66} stroke={w ? "#334155" : P.windowFrame} strokeWidth={0.5} />
        </g>
      ))}

      {/* Banner */}
      <rect x={45} y={10} width={70} height={10} rx={1} fill={w ? "#1e40af" : "#2563eb"} />
      <text x={80} y={18} textAnchor="middle" fontSize="6" fontWeight="900" fill="white" fontFamily="system-ui">UNIVERSITY</text>

      {/* Flagpoles with SMIL wave */}
      <line x1={20} y1={-4} x2={20} y2={18} stroke={w ? "#64748b" : "#94a3b8"} strokeWidth={1.5} />
      <polygon points="20,-4 20,4 28,0" fill="#f59e0b">
        <animate attributeName="points" values="20,-4 20,4 28,0; 20,-4 20,4 30,1; 20,-4 20,4 28,0" dur="3s" repeatCount="indefinite" />
      </polygon>
      <line x1={142} y1={-4} x2={142} y2={18} stroke={w ? "#64748b" : "#94a3b8"} strokeWidth={1.5} />
      <polygon points="142,-4 142,4 150,0" fill="#3b82f6">
        <animate attributeName="points" values="142,-4 142,4 150,0; 142,-4 142,4 152,1; 142,-4 142,4 150,0" dur="3.5s" repeatCount="indefinite" />
      </polygon>

      {/* Steps + path */}
      <rect x={48} y={108} width={65} height={3} rx={0.5} fill={w ? "#334155" : "#d6cbb8"} />
      <rect x={44} y={111} width={73} height={3} rx={0.5} fill={w ? "#475569" : "#e2d8c8"} />
      <rect x={65} y={114} width={30} height={14} rx={1} fill={w ? "#1e293b" : P.sidewalk} opacity={0.5} />

      {/* Campus trees */}
      <g transform="translate(-30, 85)">
        <rect x={4} y={4} width={3} height={10} rx={0.5} fill={w ? "#5c3d1e" : P.treeTrunk} />
        <circle cx={5.5} cy={-2} r={7} fill={w ? "#064e3b" : "#34d399"} />
      </g>
      <g transform="translate(-15, 90)">
        <rect x={4} y={4} width={2.5} height={8} rx={0.5} fill={w ? "#5c3d1e" : P.treeTrunk} />
        <circle cx={5} cy={0} r={5.5} fill={w ? "#065f46" : "#6ee7b7"} />
      </g>

      {/* Bike parking */}
      <g transform="translate(150, 100)">
        <rect x={0} y={10} width={18} height={1.5} rx={0.5} fill={w ? "#475569" : "#94a3b8"} />
        {[2, 7, 12].map((bx, i) => (
          <rect key={i} x={bx} y={4} width={1.5} height={6} rx={0.3} fill={w ? "#475569" : "#94a3b8"} />
        ))}
      </g>

      {/* Bench */}
      <g transform="translate(-20, 115)">
        <rect x={0} y={0} width={12} height={1.5} rx={0.5} fill={w ? "#78350f" : "#92400e"} />
        <rect x={0} y={-2.5} width={12} height={1.5} rx={0.5} fill={w ? "#5c3d1e" : "#78350f"} />
        <rect x={1} y={1.5} width={1.5} height={3} fill={w ? "#334155" : "#64748b"} />
        <rect x={9.5} y={1.5} width={1.5} height={3} fill={w ? "#334155" : "#64748b"} />
      </g>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. STUDENT APARTMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const StudentApartment = ({ x = 0, y = 0, scale = 1, darkMode = false, hovered = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={40} cy={120} rx={38} ry={5} fill="rgba(0,0,0,0.07)" />
      <rect x={8} y={16} width={64} height={102} rx={2} fill={w ? "#1e293b" : "#f5ebe0"} />
      <polygon points="72,16 88,8 88,110 72,118" fill={w ? "#162032" : "#e8dcc8"} />
      <polygon points="6,16 74,16 90,8 22,8" fill={w ? "#334155" : P.slate} />
      <rect x={22} y={5} width={68} height={3} rx={0.5} fill={w ? "#475569" : P.slateShadow} />

      {[0, 1, 2, 3].map((floor) => {
        const fy = 22 + floor * 24;
        return (
          <g key={floor}>
            <line x1={10} y1={fy + 22} x2={70} y2={fy + 22} stroke={w ? "#334155" : "#e2d8c8"} strokeWidth={0.5} />
            {[14, 32, 50].map((wx, wi) => (
              <g key={wi}>
                <rect x={wx} y={fy + 2} width={12} height={16} rx={1.5}
                  fill={w && hovered && (floor + wi) % 3 === 0 ? P.windowLit : w ? "#0f172a" : P.windowBlue}
                  style={{ transition: "fill 0.5s ease" }}
                />
                <line x1={wx + 6} y1={fy + 2} x2={wx + 6} y2={fy + 18} stroke={w ? "#334155" : P.windowFrame} strokeWidth={0.4} />
                {!w && <rect x={wx + 1} y={fy + 3} width={4} height={6} rx={0.5} fill="white" opacity={0.15} />}
                {w && hovered && (floor + wi) % 3 === 0 && (
                  <rect x={wx - 1} y={fy + 1} width={14} height={18} rx={2} fill={P.warmYellow} opacity={0.08} />
                )}
              </g>
            ))}
            {floor === 1 && (
              <g>
                <rect x={32} y={fy + 18} width={14} height={2} rx={0.5} fill={w ? "#475569" : "#cbd5e1"} />
                <circle cx={35} cy={fy + 14} r={2.5} fill={w ? "#064e3b" : "#34d399"} />
              </g>
            )}
          </g>
        );
      })}

      <rect x={28} y={98} width={24} height={20} rx={2} fill={w ? "#0f172a" : P.woodDoor} />
      <rect x={30} y={100} width={hovered && !w ? 7 : 9} height={16} rx={1}
        fill={w ? "#1e293b" : P.woodDoorLight} opacity={0.6} style={{ transition: "width 0.4s ease" }} />
      <rect x={41} y={100} width={9} height={16} rx={1} fill={w ? "#1e293b" : P.woodDoorLight} opacity={0.6} />
      <circle cx={39} cy={110} r={1} fill={P.warmYellow} />
      {w && hovered && <ellipse cx={40} cy={118} rx={16} ry={4} fill={P.warmYellow} opacity={0.06} />}
      <rect x={55} y={102} width={10} height={6} rx={1} fill={w ? "#334155" : "#e2e8f0"} />
      <text x={60} y={107} textAnchor="middle" fontSize="4" fontWeight="bold" fill={w ? "#94a3b8" : "#475569"} fontFamily="system-ui">42</text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PG / HOSTEL
// ═══════════════════════════════════════════════════════════════════════════════

export const PGHostel = ({ x = 0, y = 0, scale = 1, darkMode = false, hovered = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={42} cy={130} rx={40} ry={5} fill="rgba(0,0,0,0.07)" />
      <rect x={6} y={10} width={72} height={118} rx={2} fill={w ? "#1e293b" : "#ecfdf5"} />
      <polygon points="78,10 94,2 94,120 78,128" fill={w ? "#162032" : "#d1fae5"} />
      <polygon points="4,10 80,10 96,2 20,2" fill={w ? "#334155" : P.deepTeal} />

      {/* PG Sign */}
      <rect x={78} y={30} width={18} height={40} rx={3} fill={w ? "#0f172a" : "#1e293b"} stroke={w ? "#334155" : "#334155"} strokeWidth={1} />
      <text x={87} y={47} textAnchor="middle" fontSize="8" fontWeight="900"
        fill={hovered ? "#e879f9" : "#a855f7"} fontFamily="system-ui"
      >P{w && hovered && <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />}</text>
      <text x={87} y={60} textAnchor="middle" fontSize="8" fontWeight="900"
        fill={hovered ? "#e879f9" : "#a855f7"} fontFamily="system-ui"
      >G{w && hovered && <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" begin="0.3s" repeatCount="indefinite" />}</text>

      {/* Windows */}
      {[0, 1, 2, 3, 4].map((floor) => {
        const fy = 16 + floor * 22;
        return (
          <g key={floor}>
            {[12, 30, 54].map((wx, wi) => (
              <g key={wi}>
                <rect x={wx} y={fy} width={14} height={16} rx={1.5}
                  fill={w && hovered && (floor + wi) % 3 === 0 ? P.windowLit : w ? "#0f172a" : P.windowBlue}
                  style={{ transition: "fill 0.5s ease", transitionDelay: `${(floor * 3 + wi) * 0.05}s` }}
                />
                <line x1={wx + 7} y1={fy} x2={wx + 7} y2={fy + 16} stroke={w ? "#334155" : P.windowFrame} strokeWidth={0.4} />
                {!w && <rect x={wx + 1} y={fy + 1} width={5} height={6} rx={0.5} fill="white" opacity={0.12} />}
                {w && hovered && (floor + wi) % 3 === 0 && (
                  <rect x={wx - 1} y={fy - 1} width={16} height={18} rx={2} fill={P.warmYellow} opacity={0.06} />
                )}
              </g>
            ))}
          </g>
        );
      })}

      {/* Reception */}
      <rect x={24} y={108} width={36} height={20} rx={2} fill={w ? "#0f172a" : "#94a3b8"} />
      <rect x={26} y={110} width={15} height={16} rx={1} fill={w ? "#1e293b" : P.glassReflect} opacity={0.7} />
      <rect x={43} y={110} width={15} height={16} rx={1} fill={w ? "#1e293b" : P.glassReflect} opacity={0.7} />
      {w && hovered && <rect x={24} y={108} width={36} height={20} rx={2} fill={P.warmYellow} opacity={0.15} />}
      <rect x={28} y={100} width={28} height={8} rx={1} fill={w ? "#065f46" : "#d1fae5"} stroke={w ? "#10b981" : "#6ee7b7"} strokeWidth={0.5} />
      <text x={42} y={106} textAnchor="middle" fontSize="4" fontWeight="900" fill={w ? "#6ee7b7" : "#065f46"} fontFamily="system-ui">RECEPTION</text>

      {/* Bikes */}
      <g transform="translate(2, 118)">
        <circle cx={4} cy={6} r={3} fill="none" stroke={w ? "#64748b" : "#475569"} strokeWidth={0.8} />
        <circle cx={12} cy={6} r={3} fill="none" stroke={w ? "#64748b" : "#475569"} strokeWidth={0.8} />
        <line x1={4} y1={6} x2={8} y2={1} stroke={w ? "#64748b" : "#475569"} strokeWidth={0.8} />
        <line x1={8} y1={1} x2={12} y2={6} stroke={w ? "#64748b" : "#475569"} strokeWidth={0.8} />
      </g>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. INDEPENDENT HOUSE
// ═══════════════════════════════════════════════════════════════════════════════

export const IndependentHouse = ({ x = 0, y = 0, scale = 1, darkMode = false, hovered = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={38} cy={82} rx={36} ry={4} fill="rgba(0,0,0,0.06)" />
      <ellipse cx={38} cy={80} rx={42} ry={8} fill={w ? "#064e3b40" : "#d1fae540"} />

      {/* Fence */}
      {[4, 10, 16, 56, 62, 68].map((fx, i) => (
        <rect key={i} x={fx} y={68} width={2} height={12} rx={0.5} fill={w ? "#475569" : "#e2e8f0"} />
      ))}
      <line x1={4} y1={72} x2={18} y2={72} stroke={w ? "#475569" : "#e2e8f0"} strokeWidth={1} />
      <line x1={56} y1={72} x2={70} y2={72} stroke={w ? "#475569" : "#e2e8f0"} strokeWidth={1} />

      <rect x={14} y={32} width={48} height={46} rx={2} fill={w ? "#1e293b" : P.warmCream} />
      <polygon points="62,32 76,26 76,72 62,78" fill={w ? "#162032" : "#e8dcc8"} />
      <polygon points="10,32 38,8 66,32" fill={w ? "#475569" : P.terracotta} />
      <polygon points="66,32 38,8 52,2 80,26" fill={w ? "#334155" : P.terracottaShadow} />

      {/* Chimney + smoke (CSS animated) */}
      <rect x={52} y={10} width={6} height={16} rx={1} fill={w ? "#334155" : "#991b1b"} />
      {hovered && (
        <>
          <circle cx={55} cy={6} r={2} fill="white" opacity={0.4}>
            <animate attributeName="cy" values="6;-8" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;3.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={56} cy={3} r={1.5} fill="white" opacity={0.3}>
            <animate attributeName="cy" values="3;-10" dur="2s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="2s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="1.5;3" dur="2s" begin="0.8s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Windows */}
      <rect x={20} y={40} width={12} height={14} rx={1.5}
        fill={w && hovered ? P.windowLit : w ? "#0f172a" : P.windowBlue}
        style={{ transition: "fill 0.5s" }}
      />
      <line x1={26} y1={40} x2={26} y2={54} stroke={w ? "#334155" : P.windowFrame} strokeWidth={0.4} />
      {!w && <rect x={21} y={41} width={4} height={5} rx={0.5} fill="#fef08a" opacity={hovered ? 0.2 : 0.08} style={{ transition: "opacity 0.5s" }} />}
      {w && hovered && <rect x={19} y={39} width={14} height={16} rx={2} fill={P.warmYellow} opacity={0.08} />}

      <rect x={44} y={40} width={12} height={14} rx={1.5}
        fill={w && hovered ? P.windowLit : w ? "#0f172a" : P.windowBlue}
        style={{ transition: "fill 0.5s" }}
      />

      {/* Door */}
      <rect x={32} y={52} width={14} height={26} rx={2} fill={w ? "#0f172a" : P.woodDoor} />
      <rect x={33} y={53} width={hovered && !w ? 10 : 12} height={10} rx={1}
        fill={w ? "#1e293b" : P.woodDoorLight} opacity={0.6} style={{ transition: "width 0.4s ease" }} />
      <circle cx={43} cy={67} r={1.2} fill={P.warmYellow} />

      {/* Porch light */}
      <circle cx={30} cy={50} r={1.5} fill={P.warmYellow}
        opacity={w ? (hovered ? 1 : 0.3) : 0.2} style={{ transition: "opacity 0.5s" }} />
      {w && hovered && <circle cx={30} cy={50} r={5} fill={P.warmYellow} opacity={0.08} />}

      {/* Mailbox */}
      <g transform="translate(70, 64)">
        <rect x={0} y={0} width={3} height={14} rx={0.5} fill={w ? "#64748b" : "#78350f"} />
        <rect x={-2} y={-2} width={7} height={5} rx={1} fill={w ? "#475569" : "#d97706"} />
      </g>

      {/* Flowers */}
      <circle cx={10} cy={74} r={2} fill={w ? "#064e3b" : "#f472b6"} />
      <circle cx={6} cy={76} r={1.5} fill={w ? "#065f46" : "#a78bfa"} />
      <circle cx={66} cy={74} r={2} fill={w ? "#064e3b" : "#fbbf24"} />
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SHARED HOUSE
// ═══════════════════════════════════════════════════════════════════════════════

export const SharedHouse = ({ x = 0, y = 0, scale = 1, darkMode = false, hovered = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={48} cy={82} rx={44} ry={4} fill="rgba(0,0,0,0.06)" />
      <rect x={6} y={28} width={40} height={50} rx={2} fill={w ? "#1e293b" : "#fce8d5"} />
      <rect x={46} y={28} width={40} height={50} rx={2} fill={w ? "#1e293b" : P.paleLavender} />
      <polygon points="86,28 98,22 98,72 86,78" fill={w ? "#162032" : "#ddd6fe"} />
      <polygon points="2,28 48,6 94,28" fill={w ? "#475569" : "#8b5cf6"} />
      <polygon points="94,28 48,6 60,0 106,22" fill={w ? "#334155" : "#7c3aed"} />
      <line x1={46} y1={28} x2={46} y2={78} stroke={w ? "#334155" : "#d6d3cd"} strokeWidth={1} />

      <rect x={12} y={36} width={10} height={12} rx={1}
        fill={w && hovered ? P.windowLit : w ? "#0f172a" : P.windowBlue} style={{ transition: "fill 0.6s" }} />
      <rect x={28} y={36} width={10} height={12} rx={1} fill={w ? "#0f172a" : P.windowBlue} />
      <rect x={54} y={36} width={10} height={12} rx={1} fill={w ? "#0f172a" : P.windowBlue} />
      <rect x={70} y={36} width={10} height={12} rx={1}
        fill={w && hovered ? P.windowLit : w ? "#0f172a" : P.windowBlue} style={{ transition: "fill 0.6s" }} />
      {w && hovered && <rect x={11} y={35} width={12} height={14} rx={2} fill={P.warmYellow} opacity={0.06} />}
      {w && hovered && <rect x={69} y={35} width={12} height={14} rx={2} fill={P.warmYellow} opacity={0.06} />}

      <rect x={18} y={56} width={hovered && !w ? 10 : 12} height={22} rx={1.5}
        fill={w ? "#0f172a" : "#b45309"} style={{ transition: "width 0.4s ease" }} />
      <circle cx={28} cy={68} r={1} fill={P.warmYellow} />
      <rect x={62} y={56} width={12} height={22} rx={1.5} fill={w ? "#0f172a" : "#7c3aed"} />
      <circle cx={72} cy={68} r={1} fill={P.warmYellow} />
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. COFFEE SHOP
// ═══════════════════════════════════════════════════════════════════════════════

export const CoffeeShop = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={30} cy={58} rx={28} ry={3.5} fill="rgba(0,0,0,0.05)" />
      <rect x={4} y={16} width={52} height={40} rx={2} fill={w ? "#451a03" : "#fef3c7"} />
      <polygon points="56,16 68,10 68,50 56,56" fill={w ? "#3b1a00" : "#fde68a"} />
      <path d="M 0 16 Q 14 10 28 16 Q 42 10 56 16" fill={w ? "#991b1b" : "#ef4444"} />
      <rect x={8} y={22} width={22} height={18} rx={1} fill={w ? "#0f172a" : P.glassReflect} opacity={0.7} />
      <rect x={34} y={22} width={18} height={18} rx={1} fill={w ? "#0f172a" : P.glassReflect} opacity={0.7} />
      <rect x={34} y={36} width={10} height={20} rx={1} fill={w ? "#78350f" : P.woodDoor} />
      {w && <rect x={8} y={22} width={22} height={18} rx={1} fill={P.warmYellow} opacity={0.04} />}
      <rect x={40} y={18} width={12} height={8} rx={1.5} fill={w ? "#78350f" : "#92400e"} />
      <text x={46} y={24} textAnchor="middle" fontSize="4" fill="#fef3c7" fontWeight="bold" fontFamily="system-ui">☕</text>

      {/* Steam — SMIL animated */}
      <path d="M 20 18 Q 18 12 20 6" fill="none" stroke="white" strokeWidth={0.8} opacity={0.3}>
        <animate attributeName="d" values="M 20 18 Q 18 12 20 6;M 20 18 Q 22 12 20 4;M 20 18 Q 18 12 20 6" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M 24 18 Q 22 10 24 4" fill="none" stroke="white" strokeWidth={0.6} opacity={0.2}>
        <animate attributeName="d" values="M 24 18 Q 22 10 24 4;M 24 18 Q 26 10 24 2;M 24 18 Q 22 10 24 4" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
      </path>

      {/* Outdoor table */}
      <circle cx={-4} cy={52} r={4} fill={w ? "#334155" : "#e2e8f0"} />
      <rect x={-6} y={52} width={1} height={6} fill={w ? "#475569" : "#94a3b8"} />
      <rect x={-1} y={52} width={1} height={6} fill={w ? "#475569" : "#94a3b8"} />
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. GROCERY STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const GroceryStore = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={2} y={10} width={46} height={36} rx={2} fill={w ? "#1e293b" : "#f0fdf4"} />
      <polygon points="48,10 58,5 58,41 48,46" fill={w ? "#162032" : "#dcfce7"} />
      <rect x={0} y={8} width={50} height={4} rx={1} fill={w ? "#065f46" : "#10b981"} />
      <rect x={6} y={16} width={36} height={20} rx={1} fill={w ? "#0f172a" : P.glassReflect} opacity={0.6} />
      <rect x={28} y={26} width={12} height={20} rx={1} fill={w ? "#0f172a" : "#64748b"} />
      <rect x={12} y={12} width={24} height={5} rx={1} fill={w ? "#065f46" : "#059669"} />
      <text x={24} y={16} textAnchor="middle" fontSize="3.5" fill="white" fontWeight="bold" fontFamily="system-ui">GROCERY</text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. BUS STOP
// ═══════════════════════════════════════════════════════════════════════════════

export const BusStop = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={0} y={0} width={28} height={3} rx={1} fill={w ? "#334155" : "#3b82f6"} />
      <rect x={2} y={3} width={2} height={22} fill={w ? "#475569" : "#64748b"} />
      <rect x={24} y={3} width={2} height={22} fill={w ? "#475569" : "#64748b"} />
      <rect x={2} y={3} width={24} height={18} rx={1} fill={w ? "#1e293b" : "#dbeafe"} opacity={0.4} />
      <rect x={6} y={5} width={16} height={7} rx={1} fill={w ? "#1e293b" : "white"} stroke={w ? "#334155" : "#93c5fd"} strokeWidth={0.5} />
      <text x={14} y={10} textAnchor="middle" fontSize="3.5" fontWeight="bold" fill={w ? "#60a5fa" : "#2563eb"} fontFamily="system-ui">BUS 42</text>
      <rect x={6} y={19} width={16} height={2} rx={0.5} fill={w ? "#475569" : "#94a3b8"} />
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 9. HOUSING OFFICE — with plaza
// ═══════════════════════════════════════════════════════════════════════════════

export const HousingOffice = ({ x = 0, y = 0, scale = 1, darkMode = false, hovered = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={36} cy={72} rx={50} ry={10} fill={w ? "#1e293b40" : "#e2e8f0"} opacity={0.4} />
      <ellipse cx={36} cy={65} rx={34} ry={4} fill="rgba(0,0,0,0.06)" />

      <rect x={4} y={12} width={64} height={50} rx={3} fill={w ? "#1e293b" : "white"} stroke={w ? "#334155" : "#e2e8f0"} strokeWidth={1} />
      <polygon points="68,12 82,6 82,56 68,62" fill={w ? "#162032" : "#f8fafc"} />
      <polygon points="2,12 70,12 84,6 16,6" fill={w ? "#334155" : "#0284c7"} />

      <rect x={8} y={18} width={24} height={22} rx={1.5} fill={w ? "#0f172a" : "#e0f2fe"} />
      <rect x={40} y={18} width={24} height={22} rx={1.5} fill={w ? "#0f172a" : "#e0f2fe"} />
      {w && hovered && <rect x={8} y={18} width={24} height={22} rx={1.5} fill={P.warmYellow} opacity={0.06} />}
      {w && hovered && <rect x={40} y={18} width={24} height={22} rx={1.5} fill={P.warmYellow} opacity={0.06} />}

      <rect x={14} y={8} width={44} height={6} rx={1} fill={w ? "#0284c7" : "#0369a1"} />
      <text x={36} y={13} textAnchor="middle" fontSize="4.5" fontWeight="900" fill="white" fontFamily="system-ui">HOUSING</text>
      {w && <rect x={14} y={8} width={44} height={6} rx={1} fill="#38bdf8" opacity={0.08} />}

      <rect x={24} y={42} width={24} height={20} rx={2} fill={w ? "#0f172a" : "#0284c7"} />
      {w && hovered && <rect x={24} y={42} width={24} height={20} rx={2} fill={P.warmYellow} opacity={0.12} />}
      <rect x={28} y={62} width={16} height={3} rx={0.5} fill={w ? "#334155" : "#d97706"} />

      {/* Plants */}
      <g transform="translate(-4, 50)">
        <rect x={0} y={4} width={5} height={6} rx={1} fill={w ? "#334155" : "#a3a3a3"} />
        <circle cx={2.5} cy={2} r={3} fill={w ? "#064e3b" : "#34d399"} />
      </g>
      <g transform="translate(70, 50)">
        <rect x={0} y={4} width={5} height={6} rx={1} fill={w ? "#334155" : "#a3a3a3"} />
        <circle cx={2.5} cy={2} r={3} fill={w ? "#064e3b" : "#34d399"} />
      </g>

      {/* OPEN sign — SMIL swing */}
      <g>
        {hovered && <animateTransform attributeName="transform" type="rotate" values="-3,18,38; 3,18,38; -3,18,38" dur="1.5s" repeatCount="indefinite" />}
        <line x1={18} y1={36} x2={18} y2={40} stroke={w ? "#64748b" : "#94a3b8"} strokeWidth={0.4} />
        <rect x={12} y={40} width={12} height={5} rx={1} fill={w ? "#065f46" : "#d1fae5"} stroke={w ? "#10b981" : "#6ee7b7"} strokeWidth={0.4} />
        <text x={18} y={44} textAnchor="middle" fontSize="3" fontWeight="900" fill={w ? "#6ee7b7" : "#065f46"} fontFamily="system-ui">OPEN</text>
      </g>

      {/* Plaza bench */}
      <g transform="translate(-14, 62)">
        <rect x={0} y={0} width={12} height={1.5} rx={0.5} fill={w ? "#78350f" : "#92400e"} />
        <rect x={0} y={-2.5} width={12} height={1.5} rx={0.5} fill={w ? "#5c3d1e" : "#78350f"} />
        <rect x={1} y={1.5} width={1.5} height={3} fill={w ? "#334155" : "#64748b"} />
        <rect x={9.5} y={1.5} width={1.5} height={3} fill={w ? "#334155" : "#64748b"} />
      </g>

      <rect x={72} y={58} width={16} height={10} rx={1} fill={w ? "#0f172a" : "#cbd5e1"} opacity={0.4} />
      <text x={80} y={65} textAnchor="middle" fontSize="3" fontWeight="bold" fill={w ? "#475569" : "#94a3b8"} fontFamily="system-ui">P</text>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLES — CSS animated (no framer-motion)
// ═══════════════════════════════════════════════════════════════════════════════

export const Vehicle = ({ type = "scooter", y = 240, speed = 12, darkMode = false, delay = 0 }) => {
  const w = darkMode;

  const scooter = (
    <g>
      {w && <circle cx={18} cy={4} r={2} fill="#fef08a" opacity={0.3} />}
      <circle cx={4} cy={6} r={3} fill="none" stroke={w ? "#94a3b8" : "#475569"} strokeWidth={1} />
      <circle cx={16} cy={6} r={3} fill="none" stroke={w ? "#94a3b8" : "#475569"} strokeWidth={1} />
      <rect x={6} y={0} width={8} height={4} rx={1} fill={w ? "#334155" : "#ef4444"} />
      <rect x={8} y={-3} width={3} height={4} rx={0.5} fill={w ? "#64748b" : "#475569"} />
      {w && <circle cx={3} cy={4} r={1} fill="#ef4444" opacity={0.6} />}
      {!w && <ellipse cx={10} cy={10} rx={7} ry={1.5} fill="rgba(0,0,0,0.06)" />}
    </g>
  );

  const bicycle = (
    <g>
      <circle cx={4} cy={6} r={3} fill="none" stroke={w ? "#94a3b8" : "#475569"} strokeWidth={0.8} />
      <circle cx={16} cy={6} r={3} fill="none" stroke={w ? "#94a3b8" : "#475569"} strokeWidth={0.8} />
      <line x1={4} y1={6} x2={10} y2={0} stroke={w ? "#94a3b8" : "#475569"} strokeWidth={0.8} />
      <line x1={10} y1={0} x2={16} y2={6} stroke={w ? "#94a3b8" : "#475569"} strokeWidth={0.8} />
      <line x1={10} y1={0} x2={8} y2={-4} stroke={w ? "#94a3b8" : "#475569"} strokeWidth={0.8} />
      <circle cx={8} cy={-6} r={2} fill={w ? "#94a3b8" : "#f59e0b"} />
    </g>
  );

  const hatchback = (
    <g>
      {w && <circle cx={32} cy={6} r={1.5} fill="#fef08a" opacity={0.4} />}
      {w && <circle cx={0} cy={6} r={1} fill="#ef4444" opacity={0.5} />}
      <rect x={2} y={2} width={28} height={12} rx={2} fill={w ? "#334155" : "#3b82f6"} />
      {!w && <rect x={2} y={2} width={28} height={3} rx={1} fill="white" opacity={0.15} />}
      <rect x={8} y={-4} width={16} height={8} rx={2} fill={w ? "#1e293b" : "#60a5fa"} />
      <rect x={10} y={-3} width={5} height={6} rx={0.5} fill={w ? "#0f172a" : "#bfdbfe"} opacity={0.5} />
      <rect x={17} y={-3} width={5} height={6} rx={0.5} fill={w ? "#0f172a" : "#bfdbfe"} opacity={0.5} />
      <circle cx={8} cy={14} r={3} fill={w ? "#0f172a" : "#1e293b"} />
      <circle cx={24} cy={14} r={3} fill={w ? "#0f172a" : "#1e293b"} />
      <circle cx={8} cy={14} r={1.5} fill={w ? "#334155" : "#475569"} />
      <circle cx={24} cy={14} r={1.5} fill={w ? "#334155" : "#475569"} />
    </g>
  );

  const shuttle = (
    <g>
      {w && <rect x={38} y={4} width={4} height={3} rx={0.5} fill="#fef08a" opacity={0.4} />}
      {w && <rect x={0} y={5} width={2} height={2} rx={0.3} fill="#ef4444" opacity={0.5} />}
      <rect x={2} y={0} width={36} height={16} rx={3} fill={w ? "#334155" : "#f59e0b"} />
      {!w && <rect x={2} y={0} width={36} height={4} rx={2} fill="white" opacity={0.12} />}
      {[6, 14, 22, 30].map((wx, i) => (
        <rect key={i} x={wx} y={2} width={6} height={8} rx={1} fill={w ? "#0f172a" : "#fef3c7"} opacity={0.6} />
      ))}
      <circle cx={10} cy={16} r={3} fill={w ? "#0f172a" : "#1e293b"} />
      <circle cx={30} cy={16} r={3} fill={w ? "#0f172a" : "#1e293b"} />
      <circle cx={10} cy={16} r={1.5} fill={w ? "#334155" : "#475569"} />
      <circle cx={30} cy={16} r={1.5} fill={w ? "#334155" : "#475569"} />
    </g>
  );

  const vehicles = { scooter, bicycle, hatchback, shuttle };

  return (
    <g>
      <animateTransform attributeName="transform" type="translate" from={`-60 0`} to={`860 0`} dur={`${speed}s`} begin={`${delay}s`} repeatCount="indefinite" />
      <g transform={`translate(0, ${y})`}>
        {vehicles[type] || scooter}
      </g>
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT — Lightweight, no framer-motion
// ═══════════════════════════════════════════════════════════════════════════════

export const Tree = ({ x = 0, y = 0, scale = 1, darkMode = false, variant = 0 }) => {
  const w = darkMode;
  const colors = [
    { crown: w ? "#064e3b" : "#34d399", shadow: w ? "#065f46" : "#6ee7b7" },
    { crown: w ? "#065f46" : "#10b981", shadow: w ? "#047857" : "#4ade80" },
    { crown: w ? "#064e3b" : "#a3e635", shadow: w ? "#065f46" : "#bef264" },
  ];
  const c = colors[variant % colors.length];
  const dur = variant === 0 ? "4s" : variant === 1 ? "5.5s" : "3.5s";
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-2} y={0} width={4} height={14} rx={1} fill={w ? "#5c3d1e" : P.treeTrunk} />
      <circle cx={0} cy={-8} r={10} fill={c.crown}>
        <animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur={dur} repeatCount="indefinite" />
      </circle>
      <circle cx={-5} cy={-3} r={5} fill={c.shadow} opacity={0.6} />
      <circle cx={5} cy={-5} r={4} fill={c.shadow} opacity={0.4} />
    </g>
  );
};

export const Bush = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={8} ry={5} fill={w ? "#064e3b" : "#6ee7b7"} />
      <ellipse cx={5} cy={-1} rx={5} ry={3.5} fill={w ? "#065f46" : "#86efac"} />
    </g>
  );
};

export const StreetLamp = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-1} y={0} width={2} height={24} rx={0.5} fill={w ? "#475569" : "#64748b"} />
      <rect x={-4} y={-2} width={8} height={3} rx={1} fill={w ? "#475569" : "#64748b"} />
      <ellipse cx={0} cy={-1} rx={3} ry={1.5} fill={w ? "#fde68a60" : "#fef08a"} opacity={w ? 0.6 : 0.3} />
      {w && <ellipse cx={0} cy={24} rx={10} ry={4} fill="#fde68a" opacity={0.04} />}
    </g>
  );
};

export const Bench = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={0} y={0} width={16} height={2} rx={0.5} fill={w ? "#78350f" : "#92400e"} />
      <rect x={0} y={-3} width={16} height={2} rx={0.5} fill={w ? "#5c3d1e" : "#78350f"} />
      <rect x={1} y={2} width={2} height={4} fill={w ? "#334155" : "#64748b"} />
      <rect x={13} y={2} width={2} height={4} fill={w ? "#334155" : "#64748b"} />
    </g>
  );
};

export const BicycleRack = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={0} y={6} width={20} height={1.5} rx={0.5} fill={w ? "#475569" : "#94a3b8"} />
      {[2, 7, 12, 17].map((bx, i) => (
        <rect key={i} x={bx} y={0} width={1.5} height={6} rx={0.3} fill={w ? "#475569" : "#94a3b8"} />
      ))}
    </g>
  );
};

export const Crosswalk = ({ x = 0, y = 0, width = 40, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: Math.floor(width / 6) }).map((_, i) => (
        <rect key={i} x={i * 6} y={0} width={4} height={12} rx={0.5} fill={w ? "#334155" : "white"} opacity={w ? 0.3 : 0.7} />
      ))}
    </g>
  );
};

export const FlowerBed = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={0} y={2} width={18} height={4} rx={1} fill={w ? "#334155" : "#a3a3a3"} />
      <ellipse cx={9} cy={2} rx={10} ry={3} fill={w ? "#064e3b60" : "#bbf7d0"} />
      <circle cx={4} cy={0} r={2} fill={w ? "#4c1d95" : "#f472b6"} />
      <circle cx={9} cy={-1} r={2} fill={w ? "#1e40af" : "#fbbf24"} />
      <circle cx={14} cy={0} r={2} fill={w ? "#9f1239" : "#a78bfa"} />
    </g>
  );
};

export const TrashBin = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={0} y={0} width={6} height={8} rx={1} fill={w ? "#334155" : "#64748b"} />
      <rect x={-1} y={-1} width={8} height={2} rx={0.5} fill={w ? "#475569" : "#475569"} />
    </g>
  );
};

export const TrafficSignal = ({ x = 0, y = 0, scale = 1, darkMode = false }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-1} y={0} width={2} height={20} rx={0.5} fill={w ? "#475569" : "#64748b"} />
      <rect x={-4} y={-14} width={8} height={14} rx={1.5} fill={w ? "#1e293b" : "#334155"} />
      <circle cx={0} cy={-11} r={2} fill="#ef4444" opacity={0.8} />
      <circle cx={0} cy={-7} r={2} fill="#f59e0b" opacity={0.4} />
      <circle cx={0} cy={-3} r={2} fill="#22c55e" opacity={0.4} />
    </g>
  );
};

export const WalkingStudent = ({ x = 0, y = 0, direction = 1, darkMode = false, speed = 8 }) => {
  const w = darkMode;
  const dist = direction * 60;
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values={`0,0; ${dist},0; 0,0`} dur={`${speed}s`} repeatCount="indefinite" />
      <circle cx={x} cy={y - 8} r={2.5} fill={w ? "#94a3b8" : "#fbbf24"} />
      <rect x={x - 1.5} y={y - 5} width={3} height={6} rx={1} fill={w ? "#334155" : "#3b82f6"} />
      <line x1={x - 1} y1={y + 1} x2={x - 2} y2={y + 5} stroke={w ? "#64748b" : "#1e293b"} strokeWidth={1} strokeLinecap="round" />
      <line x1={x + 1} y1={y + 1} x2={x + 2} y2={y + 5} stroke={w ? "#64748b" : "#1e293b"} strokeWidth={1} strokeLinecap="round" />
    </g>
  );
};

export const RoadSign = ({ x = 0, y = 0, scale = 1, darkMode = false, text = "30" }) => {
  const w = darkMode;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-1} y={0} width={2} height={16} rx={0.5} fill={w ? "#475569" : "#64748b"} />
      <circle cx={0} cy={-4} r={6} fill="white" stroke={w ? "#334155" : "#ef4444"} strokeWidth={1.5} />
      <text x={0} y={-2} textAnchor="middle" fontSize="5" fontWeight="bold" fill={w ? "#334155" : "#1e293b"} fontFamily="system-ui">{text}</text>
    </g>
  );
};
