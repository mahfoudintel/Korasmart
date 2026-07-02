"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { languageLabels, type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

const languages: Language[] = ["en", "fr", "ar"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-11 items-center gap-1 rounded-full border border-white/60 bg-white/70 px-2 text-slate-800 shadow-[0_10px_24px_rgba(38,59,28,.1)] backdrop-blur-xl" aria-label="Language switcher">
      <Languages className="h-4 w-4 text-slate-700" />
      {languages.map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-black transition",
            language === item ? "bg-lime-100 text-[#247e24]" : "text-slate-600 hover:text-slate-950"
          )}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
