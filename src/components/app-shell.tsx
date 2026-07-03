"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SmilePlus } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { FootballLogo } from "@/components/football-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { AppNotifications } from "@/components/app-notifications";
import { ProfileMenu } from "@/components/profile-menu";
import { ChatDock } from "@/components/chat-dock";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mobileItems = navItems;
  const pageCopy =
    pathname === "/"
      ? { title: "Home", subtitle: "Next game, attendance, highlights, and upcoming reservations." }
      : pathname === "/analytics"
        ? { title: "Analytics Hub", subtitle: "Ratings, attendance, team balance, and game stats." }
        : pathname === "/finances"
          ? { title: "Finances", subtitle: "Caisse, contributions, and finance updates." }
          : pathname === "/bookings" || pathname === "/calendar"
            ? { title: "Schedule", subtitle: "Upcoming reservations, dates, times, and locations." }
            : pathname === "/past-games"
              ? { title: "Game Statistics", subtitle: "Update scores and scorers after scheduled games." }
            : pathname === "/players" || pathname === "/games"
              ? { title: "Players Details", subtitle: "Anonymous ratings, player scores, and match stats." }
              : { title: "KoraSmart", subtitle: "One team. One dream." };

  return (
    <div className="field-bg min-h-screen">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,.26),transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1760px]">
        <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col overflow-hidden rounded-r-[22px] border-r border-white/50 bg-white/72 px-5 py-7 shadow-[12px_0_42px_rgba(38,59,28,.12)] backdrop-blur-[22px] lg:flex">
          <FootballLogo />
          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-12 items-center gap-4 rounded-xl px-4 text-[1.01rem] font-semibold text-slate-700 transition",
                    active ? "bg-lime-100 text-[#247e24] shadow-[0_10px_24px_rgba(47,158,47,.12)]" : "hover:bg-white/70 hover:text-[#247e24]"
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

        <main className="min-w-0 w-full px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden">
              <FootballLogo />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-extrabold text-slate-900 xl:text-4xl">{pageCopy.title}</h1>
              <p className="mt-2 text-base font-medium text-slate-700">{pageCopy.subtitle}</p>
            </div>
            <div className="ml-auto flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
              <LanguageSwitcher />
              <AppNotifications />
              <ProfileMenu />
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {children}
          </motion.div>

          <footer className="mt-8 hidden items-center justify-center gap-5 text-sm font-semibold text-white lg:flex">
            <span className="text-xl">⚽</span>
            <span className="text-white">One team. One dream.</span>
            <span className="h-5 w-px bg-white/40" />
            <span>Play fair. Respect all. Enjoy the game.</span>
            <SmilePlus className="h-5 w-5 text-white" />
          </footer>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/50 bg-white/78 px-3 py-2 shadow-[0_-12px_34px_rgba(38,59,28,.13)] backdrop-blur-[18px] lg:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
            {mobileItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn("grid h-14 place-items-center rounded-xl px-1 text-[10px] font-bold text-slate-600", active && "bg-lime-100 text-[#247e24]")}>
                  <Icon className="h-5 w-5" />
                  <span className="max-w-full truncate">{item.mobileLabel ?? item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <ChatDock />
      </div>
    </div>
  );
}

