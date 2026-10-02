"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRinging,
  ArrowRight,
  Article,
  Package,
  Car,
  House,
  Tag,
  Lightning,
  UserCircle,
  Sparkle,
  SmileyWink,
} from "@phosphor-icons/react";
import { useUI } from "@contexts/UniShareContext";
import { BRAND } from "@features/profile/lib/profileTokens";

// ─────────────────────────────────────────────
// Spring preset (project-wide: stiffness 260 / damping 26)
// ─────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 260, damping: 26 };

// ─────────────────────────────────────────────
// Stagger container variants
// ─────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

// ─────────────────────────────────────────────
// Activity type → icon map
// ─────────────────────────────────────────────
const ACTIVITY_ICON_MAP = {
  ride: { Icon: Car, color: BRAND.actionBlue, bg: "rgba(21,101,216,0.10)" },
  item: { Icon: Package, color: BRAND.yellow, bg: "rgba(255,200,30,0.12)" },
  housing: { Icon: House, color: "#16A34A", bg: "rgba(22,163,74,0.10)" },
  marketplace: { Icon: Tag, color: BRAND.skyBlue, bg: "rgba(43,181,245,0.10)" },
  announcement: { Icon: Article, color: BRAND.pinkMagenta, bg: "rgba(255,61,154,0.10)" },
  default: { Icon: Lightning, color: BRAND.actionBlue, bg: "rgba(21,101,216,0.08)" },
};

function activityMeta(type) {
  const key = (type || "").toLowerCase();
  return ACTIVITY_ICON_MAP[key] ?? ACTIVITY_ICON_MAP.default;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return raw;
  }
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Skeleton row for recent activity */
function ActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-border-default animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-surface-interactive shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-surface-interactive rounded w-3/5" />
        <div className="h-2.5 bg-surface-interactive rounded w-2/5" />
      </div>
      <div className="h-2.5 w-14 bg-surface-interactive rounded" />
    </div>
  );
}

/** Single recent-activity row */
function ActivityRow({ item }) {
  const { Icon, color, bg } = activityMeta(item.type);

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-3 p-3 rounded-2xl border border-border-default bg-surface-primary hover:border-border-strong transition-colors"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg }}
      >
        <Icon size={18} weight="duotone" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate leading-snug">
          {item.title || "Untitled"}
        </p>
        {item.type && (
          <p className="text-[11px] text-text-muted capitalize mt-0.5">
            {item.type}
          </p>
        )}
      </div>

      <time className="text-[11px] text-text-muted whitespace-nowrap shrink-0">
        {formatDate(item.date || item.created_at)}
      </time>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PROFILE COMPLETENESS RING
// ─────────────────────────────────────────────
const TOTAL_FIELDS = 5; // name, username/id, bio, avatar, campus/course

function countFilledFields(profile) {
  let filled = 0;
  if (profile?.name) filled++;
  if (profile?.custom_user_id || profile?.username) filled++;
  if (profile?.bio?.trim()) filled++;
  if (
    profile?.avatar &&
    (profile.avatar.startsWith("http") ||
      (profile.avatarKey && profile.avatarKey !== "brand"))
  )
    filled++;
  if (profile?.campus_name || profile?.course || profile?.program) filled++;
  return filled;
}

/**
 * Animated SVG ring showing completeness percentage.
 * Uses CSS stroke-dashoffset trick — no extra deps.
 */
function CompletenessRing({ pct }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  const dashOffset = C - (pct / 100) * C;

  return (
    <svg
      width={104}
      height={104}
      viewBox="0 0 100 100"
      className="shrink-0"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={50}
        cy={50}
        r={R}
        fill="none"
        stroke="var(--border-default)"
        strokeWidth={9}
      />
      {/* Progress arc */}
      <motion.circle
        cx={50}
        cy={50}
        r={R}
        fill="none"
        stroke={BRAND.actionBlue}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      />
      {/* Percentage label */}
      <text
        x={50}
        y={50}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
        fontWeight="900"
        fill={BRAND.actionBlue}
      >
        {pct}%
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// NEEDS-YOUR-ATTENTION CARD
// ─────────────────────────────────────────────
function AttentionCard({ count, onNavigate, darkMode }) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border"
      style={{
        background: darkMode ? "#0c1a2e" : "#f0f7ff",
        borderColor: darkMode ? "rgba(43,181,245,0.25)" : "rgba(21,101,216,0.18)",
      }}
      role="alert"
    >
      {/* Icon badge */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: darkMode ? "rgba(43,181,245,0.15)" : "rgba(21,101,216,0.10)" }}
      >
        <BellRinging size={22} weight="duotone" style={{ color: BRAND.skyBlue }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-black text-sm leading-snug"
          style={{ color: darkMode ? "#e2f3fd" : BRAND.inkNavy }}
        >
          Needs your attention&nbsp;👋
        </h3>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: darkMode ? "#94c8e8" : "#1e4976" }}
        >
          {count} ride/item request{count !== 1 ? "s" : ""} waiting for your response.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate("requests")}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-colors"
        style={{
          background: BRAND.actionBlue,
          color: "#fff",
        }}
        aria-label={`View ${count} pending requests`}
      >
        View Requests
        <ArrowRight size={13} weight="bold" />
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// QUICK SUMMARY CARD
// ─────────────────────────────────────────────
function QuickSummary({ activities, loading }) {
  return (
    <motion.section variants={itemVariants} className="space-y-3">
      <h2 className="text-base font-black text-text-primary tracking-tight">
        Quick summary
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2"
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <ActivitySkeleton key={i} />)
          : activities.map((item, i) => (
              <ActivityRow key={item.id ?? item._id ?? i} item={item} />
            ))}
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────
// PROFILE COMPLETENESS SECTION
// ─────────────────────────────────────────────
function ProfileCompleteness({ profile, pct, filled, onNavigate }) {
  const missingBio = !profile?.bio?.trim();
  const missingAvatar =
    !profile?.avatar ||
    (!profile.avatar.startsWith("http") &&
      (!profile.avatarKey || profile.avatarKey === "brand"));

  const hint = missingBio && missingAvatar
    ? "Add your bio and a photo to complete your pass."
    : missingBio
    ? "Add your bio to complete your campus pass."
    : "Set a profile photo to personalise your pass.";

  return (
    <motion.section
      variants={itemVariants}
      className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl border border-border-default bg-surface-primary"
    >
      <CompletenessRing pct={pct} />

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="text-base font-black text-text-primary leading-snug mb-1">
          Profile completeness
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-1">
          {filled} of {TOTAL_FIELDS} fields filled.
        </p>
        <p className="text-xs text-text-muted leading-relaxed mb-4">{hint}</p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("settings")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-colors"
          style={{ background: BRAND.yellow, color: BRAND.inkNavy }}
        >
          <UserCircle size={14} weight="bold" />
          Complete my profile
        </motion.button>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING, delay: 0.15 }}
        className="mb-5"
      >
        <SmileyWink
          size={56}
          weight="duotone"
          style={{ color: BRAND.yellow }}
        />
      </motion.div>

      <p className="text-text-primary font-black text-base mb-2">
        Your story begins here
      </p>

      <p className="text-text-muted text-sm max-w-[280px] leading-relaxed">
        Start sharing, exploring and connecting —{" "}
        <span className="font-semibold text-text-secondary">
          your story begins here.
        </span>
      </p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.3 }}
        className="flex items-center gap-1.5 mt-5 text-xs font-semibold"
        style={{ color: BRAND.skyBlue }}
      >
        <Sparkle size={14} weight="duotone" />
        Post a ride, list an item, or browse the campus market
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

/**
 * OverviewSection — default landing section for /profile.
 *
 * @param {object}   props.profile               - User profile object
 * @param {object}   props.stats                 - { posts, items, handshakes, requests }
 * @param {object}   props.dashboard             - { recentActivity: [...] }
 * @param {number}   props.pendingReceivedCount  - Pending received requests count
 * @param {Function} props.onNavigate            - (sectionId: string) => void
 */
export default function OverviewSection({
  profile,
  stats,
  dashboard,
  pendingReceivedCount = 0,
  onNavigate,
}) {
  const { darkMode } = useUI();

  // Derive recent activity — last 3 items
  const activities = useMemo(() => {
    const raw = dashboard?.recentActivity ?? [];
    return raw.slice(0, 3);
  }, [dashboard]);

  const activitiesLoading = dashboard === null || dashboard === undefined;
  const hasActivity = activities.length > 0;

  // Profile completeness
  const filled = useMemo(() => countFilledFields(profile), [profile]);
  const pct = Math.round((filled / TOTAL_FIELDS) * 100);
  const profileIncomplete =
    !profile?.bio?.trim() ||
    !profile?.avatar ||
    (!profile.avatar.startsWith("http") &&
      (!profile.avatarKey || profile.avatarKey === "brand"));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* ── 1. Attention card (conditional) ── */}
      <AnimatePresence mode="popLayout">
        {pendingReceivedCount > 0 && (
          <AttentionCard
            key="attention"
            count={pendingReceivedCount}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* ── 2. Quick summary OR empty state ── */}
      {!activitiesLoading && !hasActivity ? (
        <EmptyState />
      ) : (
        <QuickSummary activities={activities} loading={activitiesLoading} />
      )}

      {/* ── 3. Profile completeness ring (only if incomplete) ── */}
      <AnimatePresence mode="popLayout">
        {profileIncomplete && (
          <ProfileCompleteness
            key="completeness"
            profile={profile}
            pct={pct}
            filled={filled}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
