"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, SmilePlus } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NextMatchAttendance } from "@/components/next-match-attendance";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mobileItems = navItems.slice(0, 5);
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
    <div className="field-bg min-h-screen">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(200,255,26,.04),transparent_36%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1520px]">
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-black/5 px-4 py-7 backdrop-blur-md lg:flex">
          <Logo />
          <nav className="mt-10 flex flex-1 flex-col gap-2">
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

        <main className="min-w-0 w-full px-4 pb-24 pt-6 sm:px-6 lg:px-7 lg:pb-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-black text-white xl:text-4xl">{pageCopy.title}</h1>
              <p className="mt-2 text-lg text-white/78">{pageCopy.subtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <LanguageSwitcher />
              <button className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-lime-300 text-xs font-black text-black">3</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-lime-300 bg-gradient-to-br from-white to-zinc-500 text-2xl">ðŸ‘¤</div>
                <ChevronDown className="hidden h-5 w-5 text-white/80 sm:block" />
              </div>
            </div>
          </header>

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

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#07100a]/70 px-3 py-2 backdrop-blur-lg lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
            {mobileItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={cn("grid h-14 place-items-center rounded-2xl text-xs font-bold text-white/70", active && "bg-lime-300 text-black")}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

