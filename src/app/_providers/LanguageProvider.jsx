"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import dictionary from "../_i18n/dictionary";

const LanguageContext = createContext({
  language: "EN",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => key,
  showToast: (msg) => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("EN");
  const [toast, setToast] = useState(null);

  // Load saved language
  useEffect(() => {
    try {
      const saved = localStorage.getItem("unishare_lang");
      if (saved === "HI" || saved === "EN") setLanguage(saved);
    } catch {}
  }, []);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem("unishare_lang", language);
    } catch {}
  }, [language]);

  const funnyLines = [
    "You just switched languages! Your brain did a backflip.",
    "Language toggled. Now you’re officially bilingual!",
    "Did you just switch? The dictionary is dizzy!",
    "Language changed. Your neurons are celebrating!",
    "You toggled! Somewhere, a translator is smiling.",
    "Language swapped. Your IQ just went up by 10 points!",
    "You pressed the magic button. Words are now in party mode!",
    "Language changed. The letters are dancing!",
    "You toggled. The app is now 200% cooler.",
    "Language switch: Achievement unlocked!"
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "HI" : "EN"));
    showToast(funnyLines[Math.floor(Math.random() * funnyLines.length)]);
  };

  const t = (key) => {
    const parts = key.split(".");
    let node = dictionary[language] || dictionary.EN;
    for (const p of parts) {
      if (node && typeof node === "object" && p in node) node = node[p];
      else return (dictionary.EN && parts.reduce((acc, cur) => (acc && acc[cur] != null ? acc[cur] : null), dictionary.EN)) || key;
    }
    return typeof node === "string" ? node : key;
  };

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t, showToast }), [language]);

  return <LanguageContext.Provider value={value}>
    {children}
    {toast && (
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: '2.5rem',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '1rem',
        fontSize: '1rem',
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        pointerEvents: 'none',
        maxWidth: '90vw',
        textAlign: 'center',
        animation: 'fadeInUp 0.3s',
      }}>
        {toast}
      </div>
    )}
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
      }
    `}</style>
  </LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
