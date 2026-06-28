"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { languageLabels, type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

const languages: Language[] = ["en", "fr", "ar"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-11 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 backdrop-blur-xl" aria-label="Language switcher">
      <Languages className="h-4 w-4 text-white/70" />
      {languages.map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-black transition",
            language === item ? "bg-lime-300 text-black" : "text-white/72 hover:text-white"
          )}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
