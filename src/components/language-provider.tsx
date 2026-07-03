"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Language, translateText } from "@/lib/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "korasmart-language";

function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "SVG"].includes(parent.tagName)) continue;
    if (parent.closest("svg")) continue;
    const trimmed = node.nodeValue?.trim();
    if (!trimmed) continue;
    nodes.push(node);
  }

  for (const node of nodes) {
    const raw = node.nodeValue || "";
    const trimmed = raw.trim();
    const translated = translateText(trimmed, language);
    if (translated !== trimmed) {
      node.nodeValue = raw.replace(trimmed, translated);
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(storageKey, nextLanguage);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "en" || saved === "fr" || saved === "ar") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    translatePage(language);

    const observer = new MutationObserver(() => translatePage(language));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
