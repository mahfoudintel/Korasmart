"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, PlusCircle, ShieldCheck, Trophy, Users, WalletCards, type LucideIcon } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { UpcomingReservationsCard } from "@/components/reservation-dashboard-widgets";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useReservations } from "@/hooks/use-reservations";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
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
  const attendance = useAttendance(nextReservation?.id, nextReservation);
  const { transactionTotal } = useFinanceTransactions();
  const members = attendance.members;
  const currentBalance = financeSnapshot.balance + transactionTotal;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,.95fr)_430px_330px]">
        <Card className="overflow-hidden p-0">
          <div className="p-5 md:p-7">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#238923]">KoraSmart Home</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.08] text-slate-900 md:text-[2.35rem] 2xl:text-[2.45rem]">Next game at a glance.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
                Check the next reservation, follow attendance, and keep the group organized without extra noise.
              </p>
            </div>

            <div className="mt-6 rounded-[20px] border border-white/70 bg-white/62 p-4 shadow-[0_12px_30px_rgba(48,73,34,.07)]">
              {nextReservation ? (
                <div className="grid gap-3 sm:grid-cols-[1fr_110px] sm:items-center">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#238923]">Next reservation</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-900">
                      <span className="inline-flex items-center gap-2 font-extrabold">
                        <CalendarDays className="h-5 w-5 text-[#2f9e2f]" />
                        {formatReservationDate(nextReservation.date)}
                      </span>
                      <span className="inline-flex items-center gap-2 font-extrabold">
                        <Clock3 className="h-5 w-5 text-[#2f9e2f]" />
                        {nextReservation.time}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MapPin className="h-4 w-4 shrink-0 text-[#2f9e2f]" />
                      <ReservationMapLink reservation={nextReservation} className="font-semibold text-slate-700" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-lime-100/80 px-4 py-3 text-center">
                    <p className="text-2xl font-extrabold text-[#238923]">{nextReservation.durationMinutes}</p>
                    <p className="text-xs font-extrabold uppercase tracking-[.08em] text-[#247e24]">minutes</p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-orange-300">No upcoming game has been scheduled yet.</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/bookings" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#3dad3d] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(47,158,47,.22)]">
                Full schedule <CalendarDays className="h-4 w-4" />
              </Link>
              <Link href="/players" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-5 text-sm font-extrabold text-slate-800">
                Player ratings <ArrowRight className="h-4 w-4" />
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
        <HighlightCard icon={CheckCircle2} label="Confirmed spots" value={`${attendance.summary.playing}/${playingLimit}`} meta="First come, first served" />
        <HighlightCard icon={Clock3} label="Waiting list" value={`${attendance.summary.waiting}`} meta="Promotes automatically" />
        <HighlightCard icon={Users} label="Members" value={`${members.length}`} meta="Registered group list" />
        <HighlightCard icon={WalletCards} label="Balance" value={formatDh(currentBalance)} meta="After booking costs" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle>Attendance List</SectionTitle>
            <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-extrabold text-[#247e24]">
              {attendance.summary.playing} <span>attending</span> - {attendance.summary.waiting} <span>waiting</span>
            </span>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.1em] text-slate-500">Confirmed players</p>
              <div className="grid gap-2">
                {attendance.confirmedPlayers.length ? (
                  attendance.confirmedPlayers.map((record, index) => (
                    <div key={record.player} className="flex items-center justify-between rounded-2xl bg-lime-100/80 p-3">
                      <span className="font-extrabold text-slate-900">{record.player}</span>
                      <span className="text-sm font-extrabold text-[#2f9e2f]">#{index + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/60 bg-white/45 p-4 text-sm text-slate-500">No confirmed players yet.</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.1em] text-slate-500">Waiting list</p>
              <div className="grid gap-2">
                {attendance.waitingPlayers.length ? (
                  attendance.waitingPlayers.map((record, index) => (
                    <div key={record.player} className="flex items-center justify-between rounded-2xl bg-amber-100/80 p-3">
                      <span className="font-extrabold text-slate-900">{record.player}</span>
                      <span className="text-sm font-extrabold text-amber-700">#{index + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/60 bg-white/45 p-4 text-sm text-slate-500">Waiting list is empty.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <UpcomingReservationsCard />
          <Card>
            <SectionTitle>Quick Info</SectionTitle>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><Trophy className="mr-2 inline h-4 w-4 text-[#2f9e2f]" /> Match stats are entered after the game from Players Details.</p>
              <p><ShieldCheck className="mr-2 inline h-4 w-4 text-[#2f9e2f]" /> Player ratings stay anonymous and feed future fair teams.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

