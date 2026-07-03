"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, PlusCircle, Trophy, Users, WalletCards, type LucideIcon } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { useAttendance } from "@/hooks/use-attendance";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { getNextReservation, getUpcomingReservations } from "@/lib/reservations";
import { financeSnapshot, formatDh } from "@/lib/finance";

function HighlightCard({ icon: Icon, label, value, meta }: { icon: LucideIcon; label: string; value: string; meta: string }) {
  return (
    <Card className="min-h-[118px]">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-lime-100 text-[#2f9e2f]">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{meta}</p>
        </div>
      </div>
    </Card>
  );
}

export function HomePage() {
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const { members } = useAttendance(nextReservation?.id, nextReservation);
  const { transactionTotal } = useFinanceTransactions();
  const currentBalance = financeSnapshot.balance + transactionTotal;
  const upcomingCount = getUpcomingReservations(reservations).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,.95fr)_430px_330px]">
        <Card className="overflow-hidden p-0">
          <div className="p-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#238923]">KoraSmart Home</p>
              <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-[1.08] text-slate-900 md:text-[2.15rem] 2xl:text-[2.25rem]">Organize. Confirm. Play.</h2>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/bookings" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#3dad3d] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(47,158,47,.22)]">
                Schedule <CalendarDays className="h-4 w-4" />
              </Link>
              <Link href="/players" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-5 text-sm font-extrabold text-slate-800">
                Players <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>

        <NextMatchAttendance />

        <Card>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="mt-5 grid gap-3">
            {[
              { href: "/bookings", label: "New reservation", icon: PlusCircle },
              { href: "/players", label: "Manage members", icon: Users },
              { href: "/finances", label: "View finances", icon: WalletCards },
              { href: "/analytics", label: "Analytics report", icon: Trophy }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="flex h-12 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/70 px-4 text-sm font-extrabold text-slate-700 transition hover:border-lime-400 hover:text-[#247e24]">
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-lime-100 text-[#2f9e2f]"><Icon className="h-4 w-4" /></span>
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HighlightCard icon={Users} label="Members" value={`${members.length}`} meta="Active roster" />
        <HighlightCard icon={CalendarDays} label="Upcoming" value={`${upcomingCount}`} meta="Scheduled games" />
        <HighlightCard icon={WalletCards} label="Balance" value={formatDh(currentBalance)} meta="Current caisse" />
        <HighlightCard icon={Trophy} label="Game stats" value="Ready" meta="After match" />
      </div>
    </div>
  );
}

