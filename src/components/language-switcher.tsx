"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { languageLabels, type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

const languages: Language[] = ["en", "fr", "ar"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-10 items-center gap-0.5 rounded-full border border-white/60 bg-white/78 px-1.5 text-slate-800 shadow-[0_10px_24px_rgba(38,59,28,.1)] backdrop-blur-xl sm:h-11 sm:gap-1 sm:px-2" aria-label="Language switcher">
      <Languages className="h-4 w-4 text-slate-700 max-[430px]:hidden" />
      {languages.map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={cn(
            "h-7 rounded-full px-2 text-[11px] font-black transition sm:h-8 sm:px-3 sm:text-xs",
            language === item ? "bg-lime-100 text-[#247e24]" : "text-slate-600 hover:text-slate-950"
          )}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
