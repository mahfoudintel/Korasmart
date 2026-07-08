"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useOutsideDismiss } from "@/hooks/use-outside-dismiss";
import { translateText } from "@/lib/translations";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

function isAppleMobile() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppButton() {
  const { language } = useLanguage();
  const t = useCallback((text: string) => translateText(text, language), [language]);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const guideRef = useRef<HTMLDivElement | null>(null);

  useOutsideDismiss(guideRef, showGuide, () => setShowGuide(false));

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowGuide(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (isInstalled) return;

    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice.catch(() => null);
      setInstallPrompt(null);
      return;
    }

    setShowGuide(true);
  };

  if (isInstalled) return null;

  const appleMobile = isAppleMobile();

  return (
    <>
      <button
        type="button"
        onClick={installApp}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/70 bg-white/78 text-slate-900 shadow-[0_10px_28px_rgba(20,35,18,.12)] backdrop-blur-[16px] transition hover:bg-white sm:h-12 sm:w-auto sm:grid-flow-col sm:gap-2 sm:px-4"
        aria-label={t("Install app")}
        title={t("Install app")}
      >
        <Download className="h-5 w-5" />
        <span className="hidden text-sm font-black sm:inline">{t("Install")}</span>
      </button>

      {showGuide ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
          <div ref={guideRef} className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(7,17,10,.28)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-[#247e24]">
                  {appleMobile ? <Share2 className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-[#247e24]">{t("Download app")}</p>
                  <h2 className="text-2xl font-black">{t("Install KoraSmart")}</h2>
                </div>
              </div>
              <button type="button" onClick={() => setShowGuide(false)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm font-semibold leading-6 text-slate-600">
              {appleMobile ? (
                <>
                  <p>{t("On iPhone, open this site in Safari.")}</p>
                  <p>{t("Tap Share, then Add to Home Screen.")}</p>
                </>
              ) : (
                <>
                  <p>{t("Open your browser menu and choose Install app.")}</p>
                  <p>{t("KoraSmart will appear on your home screen like a normal app.")}</p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
