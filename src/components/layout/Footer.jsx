"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Coffee,
  Send,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import { useUI } from "@contexts/UniShareContext";
import { FEATURES } from "@components/layout/header/navConfig";

/* ─── brand tokens ───────────────────────────────────────────────────────── */
const B = {
  navy: "#12233A",
  blue: "#1565D8",
  sky: "#3CC3F2",
  yellow: "#FFD24C",
  yellowDeep: "#E0A800",
};

/* ─── link data ──────────────────────────────────────────────────────────── */
const platformLinks = FEATURES.filter((f) =>
  ["rides", "rooms", "market", "resources", "lostfound"].includes(f.key)
).map((f) => ({ name: f.label, href: f.href, Icon: f.icon }));

const supportLinks = [
  { name: "Help Centre", href: "/info/help" },
  { name: "Safety Guidelines", href: "/info/support-guidelines" },
  { name: "Report Issues", href: "/info/report" },
  { name: "FAQs", href: "/info/faqs" },
];

const companyLinks = [
  { name: "About UniShare", href: "/info/about" },
  { name: "Our Mission", href: "/info/mission" },
  { name: "Send Feedback", href: "/info/feedback" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/info/privacy" },
  { name: "Terms of Service", href: "/info/terms" },
  { name: "Cookie Policy", href: "/info/cookies" },
  { name: "Community Guidelines", href: "/info/guidelines" },
  { name: "Data Protection", href: "/info/data-protection" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/web.unishare", Icon: Instagram },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/unishare-community/", Icon: Linkedin },
  { name: "YouTube", href: "https://www.youtube.com/channel/UC12wrJ7qOgyu8xObo0ZKMFQ", Icon: Youtube },
];

/* ─── tiny helpers ───────────────────────────────────────────────────────── */
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* ─── sub-components ─────────────────────────────────────────────────────── */
function FooterCol({ title, links, dark, accent = "blue" }) {
  const hoverColor = accent === "yellow"
    ? dark ? "hover:text-[#FFD24C]" : "hover:text-[#E0A800]"
    : dark ? "hover:text-[#3CC3F2]" : "hover:text-[#1565D8]";

  return (
    <div>
      <h3
        className="mb-4 text-[13px] font-bold uppercase tracking-[0.14em]"
        style={{ color: accent === "yellow" ? B.yellow : dark ? B.sky : B.blue }}
      >
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.name}>
            <Link
              href={l.href}
              className={`group flex items-center gap-2 text-[14px] transition-all duration-200 ${hoverColor} ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {l.Icon && <l.Icon className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 group-hover:scale-110" />}
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">{l.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── main footer ────────────────────────────────────────────────────────── */
const Footer = React.memo(function Footer() {
  const { darkMode: dark } = useUI();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-[80] w-full"
      style={{ backgroundColor: dark ? B.navy : "#F7F9FC" }}
    >
      {/* ── wave divider ──────────────────────────────────────────────── */}
      <div className="pointer-events-none select-none" aria-hidden>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block h-[40px] w-full sm:h-[60px]"
        >
          <path
            d="M0,32 C360,56 720,8 1080,36 C1260,50 1380,28 1440,32 L1440,60 L0,60 Z"
            fill={dark ? B.navy : "#F7F9FC"}
          />
        </svg>
      </div>

      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 pb-8">
        {/* ── top: logo + description + newsletter ────────────────── */}
        <div className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-[1fr_1.4fr]">
          {/* left — brand block */}
          <div>
            <Link href="/" className="group mb-5 inline-flex items-center gap-3">
              <div className="relative h-11 w-11 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src="/images/logos/logounishare1.png"
                  alt="UniShare Logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-[-0.02em]">
                <span
                  style={
                    dark
                      ? { color: B.yellow }
                      : { color: B.yellow, WebkitTextStroke: "0.06em #12233A", paintOrder: "stroke fill" }
                  }
                >
                  Uni
                </span>
                <span style={{ color: dark ? B.sky : B.blue }}>Share</span>
              </span>
            </Link>

            <p className={`mb-6 max-w-sm text-[14px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Connect, share, and thrive with your university community. From rides to resources,
              UniShare makes student life easier and more collaborative.
            </p>

            {/* contact */}
            <a
              href="mailto:support.unisharelpu@gmail.com"
              className={`group inline-flex items-center gap-2.5 text-[13px] transition-colors duration-200 ${
                dark ? "text-slate-400 hover:text-[#FFD24C]" : "text-slate-500 hover:text-[#1565D8]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
                  dark ? "bg-white/5 group-hover:bg-[#FFD24C]/10" : "bg-slate-100 group-hover:bg-[#1565D8]/10"
                }`}
              >
                <Mail className="h-4 w-4" />
              </span>
              support.unisharelpu@gmail.com
            </a>
          </div>

          {/* right — newsletter */}
          <div className="flex flex-col justify-end">
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(18,35,58,0.08)",
                backgroundColor: dark ? "rgba(255,255,255,0.03)" : "rgba(18,35,58,0.02)",
              }}
            >
              <h3
                className="mb-1 text-lg font-bold"
                style={{ color: dark ? "#F1F5F9" : B.navy }}
              >
                Stay in the loop
              </h3>
              <p className={`mb-5 text-[13px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                New features, campus events & community highlights — straight to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your university email"
                  required
                  className={`flex-1 rounded-xl border-2 px-4 py-2.5 text-[14px] outline-none transition-all duration-200 ${
                    dark
                      ? "border-white/10 bg-white/5 text-white placeholder-slate-500 focus:border-[#3CC3F2] focus:ring-2 focus:ring-[#3CC3F2]/20"
                      : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/20"
                  }`}
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
                  style={
                    subscribed
                      ? { backgroundColor: "#16a34a", color: "#fff" }
                      : { backgroundColor: dark ? B.yellow : B.blue, color: dark ? B.navy : "#fff" }
                  }
                >
                  {subscribed ? (
                    "✓ Subscribed!"
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── link columns ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 gap-8 border-t py-10 sm:grid-cols-4"
          style={{ borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(18,35,58,0.07)" }}
        >
          <FooterCol title="Platform" links={platformLinks} dark={dark} accent="blue" />
          <FooterCol title="Support" links={supportLinks} dark={dark} accent="blue" />
          <FooterCol title="Company" links={companyLinks} dark={dark} accent="yellow" />
          <FooterCol title="Legal" links={legalLinks} dark={dark} accent="yellow" />
        </div>

        {/* ── social + coffee row ──────────────────────────────────── */}
        <div
          className="flex flex-col items-center justify-between gap-8 border-t py-8 sm:flex-row"
          style={{ borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(18,35,58,0.07)" }}
        >
          {/* socials */}
          <div className="flex items-center gap-3">
            <span className={`mr-1 text-[13px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Follow us
            </span>
            {socialLinks.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                  dark
                    ? "bg-white/5 text-slate-400 hover:bg-[#3CC3F2]/15 hover:text-[#3CC3F2]"
                    : "bg-slate-100 text-slate-500 hover:bg-[#1565D8]/10 hover:text-[#1565D8]"
                }`}
              >
                <s.Icon className="h-[18px] w-[18px]" />
              </Link>
            ))}
          </div>

          {/* buy us a coffee */}
          <Link
            href="https://buymeacoffee.com/unishare"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              backgroundColor: dark ? "rgba(255, 210, 76, 0.12)" : "rgba(21, 101, 216, 0.08)",
              color: dark ? B.yellow : B.blue,
            }}
          >
            <Coffee className="h-4 w-4" />
            Buy us a coffee
            <Heart className="h-3.5 w-3.5 animate-pulse opacity-70" />
          </Link>
        </div>

        {/* ── bottom bar ───────────────────────────────────────────── */}
        <div
          className="flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row"
          style={{ borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(18,35,58,0.07)" }}
        >
          <p className={`text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            © {year} UniShare. Made with{" "}
            <Heart className="inline h-3.5 w-3.5 text-red-500" /> for students, by students.
          </p>

          <button
            onClick={scrollToTop}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              dark
                ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            }`}
            title="Back to top"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
