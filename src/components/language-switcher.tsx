"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { languageLabels, type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

const languages: Language[] = ["en", "fr", "ar"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-10 shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-1.5 backdrop-blur-xl sm:h-11 sm:gap-1 sm:px-2" aria-label="Language switcher">
      <Languages className="hidden h-4 w-4 text-white/70 min-[390px]:block" />
      {languages.map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={cn(
            "h-8 rounded-full px-2 text-[11px] font-black transition sm:px-3 sm:text-xs",
            language === item ? "bg-lime-300 text-black" : "text-white/72 hover:text-white"
          )}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
