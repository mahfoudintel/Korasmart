"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, Menu, SmilePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { useAuth } from "@/components/auth-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSignedIn = Boolean(session);
  const pageCopy =
    pathname === "/"
      ? { title: "Home", subtitle: "Next game, attendance, highlights, and upcoming reservations." }
      : pathname === "/analytics"
        ? { title: "Analytics Hub", subtitle: "Ratings, attendance, team balance, and game stats." }
        : pathname === "/finances"
          ? { title: "Finances", subtitle: "Caisse, contributions, and finance updates." }
          : pathname === "/bookings" || pathname === "/calendar"
            ? { title: "Scheduling", subtitle: "Reservations, calendar updates, and booking timeline." }
            : pathname === "/players" || pathname === "/games"
              ? { title: "Players Details", subtitle: "Anonymous ratings, player scores, and match stats." }
              : { title: "KoraSmart", subtitle: "One team. One dream." };

  return (
    <div className="field-bg min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(200,255,26,.04),transparent_36%)]" />
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#07100a]/78 px-3 py-3 backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="mx-auto flex max-w-[1520px] items-center gap-3">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />

          <div className="hidden min-w-0 flex-1 lg:block">
            <h1 className="truncate text-2xl font-black text-white xl:text-3xl">{pageCopy.title}</h1>
            <p className="truncate text-sm text-white/72 xl:text-base">{pageCopy.subtitle}</p>
          </div>

          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl sm:h-11 sm:w-11" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 grid h-4 w-4 translate-x-1/4 -translate-y-1/4 place-items-center rounded-full bg-lime-300 text-[10px] font-black text-black sm:h-5 sm:w-5 sm:text-xs">3</span>
            </button>
            <button
              onClick={() => isSignedIn && signOut()}
              className={cn(
                "flex min-w-0 shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-left transition sm:gap-3 sm:pr-3",
                isSignedIn ? "hover:border-lime-300/60" : "cursor-default"
              )}
              aria-label={isSignedIn ? "Sign out" : "Local development mode"}
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-lime-300 bg-gradient-to-br from-white to-zinc-500 text-sm font-black text-black sm:h-10 sm:w-10 sm:text-lg">
                {(profile?.name || "K").slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-white">{profile?.name || "Local"}</p>
                <p className="text-xs font-bold text-white/55">{isSignedIn ? "Sign out" : "Local mode"}</p>
              </div>
              {isSignedIn && <ChevronDown className="hidden h-5 w-5 text-white/80 sm:block" />}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-[1520px] lg:hidden">
          <h1 className="truncate text-xl font-black text-white sm:text-2xl">{pageCopy.title}</h1>
          <p className="truncate text-sm text-white/70">{pageCopy.subtitle}</p>
        </div>

        {menuOpen && (
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-[#07100a]/95 px-3 py-3 shadow-2xl backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-[520px] gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold text-white/78 transition",
                      active ? "bg-lime-300 text-black" : "hover:bg-white/8 hover:text-lime-200"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <div className="relative mx-auto flex min-h-screen max-w-[1520px] pt-[118px] sm:pt-[126px] lg:pt-[86px]">
        <aside className="sticky top-[86px] hidden h-[calc(100vh-86px)] w-[240px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-black/5 px-4 py-7 backdrop-blur-md lg:flex">
          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-12 items-center gap-4 rounded-2xl px-4 text-[1.02rem] font-semibold text-white/86 transition",
                    active ? "bg-lime-300 text-black shadow-[0_0_30px_rgba(200,255,26,.28)]" : "hover:bg-white/8 hover:text-lime-200"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden"><NextMatchAttendance /></div>
        </aside>

        <main className="min-w-0 w-full max-w-full px-4 pb-8 sm:px-6 lg:px-7">

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {children}
          </motion.div>

          <footer className="mt-8 hidden items-center justify-center gap-5 text-sm font-semibold text-white/72 lg:flex">
            <span className="text-xl">âš½</span>
            <span className="text-lime-300">One team. One dream.</span>
            <span className="h-5 w-px bg-white/20" />
            <span>Play fair. Respect all. Enjoy the game.</span>
            <SmilePlus className="h-5 w-5 text-lime-300" />
          </footer>
        </main>
      </div>
    </div>
  );
}

