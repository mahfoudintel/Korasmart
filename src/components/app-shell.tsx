"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";
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
  const routeGroup =
    pathname === "/bookings" || pathname === "/calendar" || pathname === "/past-games"
      ? "/matches"
      : pathname === "/players" || pathname === "/games" || pathname === "/rankings"
        ? "/members"
        : pathname === "/analytics" || pathname === "/stats"
          ? "/insights"
          : pathname === "/settings"
            ? "/admin"
            : pathname;
  const pageCopy =
    pathname === "/"
      ? { title: "Home", subtitle: "Your next game and what matters today." }
      : routeGroup === "/insights"
        ? { title: "Insights", subtitle: "Reliability, attendance, payments, and player trends." }
      : pathname === "/finances"
        ? { title: "Finances", subtitle: "Balance, booking costs, contributions, and unpaid members." }
        : routeGroup === "/matches"
          ? { title: "Matches", subtitle: "Schedule, attendance, teams, and match history." }
          : routeGroup === "/members"
            ? { title: "Members", subtitle: "Roster, roles, availability, and peer assessment." }
            : routeGroup === "/admin"
              ? { title: "Admin", subtitle: "Roles, permissions, notifications, and app settings." }
              : { title: "KoraSmart", subtitle: "One team. One dream." };

  return (
    <div className="field-bg min-h-screen">
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(1,18,31,.74)_0,rgba(1,18,31,.2)_18%,rgba(255,255,255,.18)_52%,rgba(255,255,255,.05)_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1760px]">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col overflow-hidden bg-[#061827]/95 px-5 py-7 text-white shadow-[18px_0_48px_rgba(1,13,25,.25)] backdrop-blur-[22px] lg:flex">
          <FootballLogo inverse />
          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const active = routeGroup === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-14 items-center gap-4 rounded-xl px-4 text-[1.02rem] font-bold text-white/86 transition",
                    active ? "bg-gradient-to-r from-[#4fb332] to-[#82dd32] text-white shadow-[0_14px_28px_rgba(69,184,52,.28)]" : "hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="rounded-2xl border border-white/14 bg-white/[.06] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300/15 text-lime-300">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black">KoraSmart League</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-lime-300">We play together. We win together.</p>
              </div>
            </div>
          </div>
          <div className="hidden"><NextMatchAttendance /></div>
        </aside>

        <main className="min-w-0 w-full px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden">
              <FootballLogo compact />
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

          <footer className="mt-8 hidden text-center text-sm font-semibold text-white/90 lg:block">One team. One dream.</footer>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/50 bg-white/78 px-3 py-2 shadow-[0_-12px_34px_rgba(38,59,28,.13)] backdrop-blur-[18px] lg:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
            {mobileItems.map((item) => {
              const active = routeGroup === item.href;
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

