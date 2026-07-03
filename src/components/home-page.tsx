"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
  WalletCards
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/use-reservations";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { financeSnapshot, formatDh } from "@/lib/finance";
import { formatReservationDate, getNextReservation, getPastReservations, getUpcomingReservations } from "@/lib/reservations";
import { getReservationOpenAt } from "@/lib/workflow-rules";
import { ReservationMapLink } from "@/components/reservation-map-link";

type StatusCardIcon = typeof WalletCards;

function PlayerDots({ count, tone = "green" }: { count: number; tone?: "green" | "orange" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: Math.max(count, 0) }).map((_, index) => (
        <span key={index} className={tone === "green" ? "h-3 w-3 rounded-full bg-lime-300" : "h-3 w-3 rounded-full bg-orange-400"} />
      ))}
    </div>
  );
}

function TeamPreview({ teamA, teamB }: { teamA: string[]; teamB: string[] }) {
  return (
    <Card className="min-h-[250px]">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Teams</SectionTitle>
        <Link href="/matches" className="text-sm font-extrabold text-[#247e24]">View on match</Link>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-black uppercase text-[#4f9f00]">Team A</p>
          <div className="mx-auto mt-4 jersey h-12 w-12 bg-[#a7ff1a] shadow-[inset_0_0_0_2px_rgba(0,0,0,.16),0_10px_22px_rgba(167,255,26,.24)]" />
          <p className="mt-3 text-xs font-bold text-slate-500">{teamA.length} players</p>
          <div className="mt-3 flex justify-center -space-x-2">
            {teamA.slice(0, 5).map((name) => <span key={name} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-slate-800 text-[10px] font-black text-white">{name[0]}</span>)}
          </div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/70 text-xs font-black text-slate-700">VS</div>
        <div className="text-center">
          <p className="text-sm font-black uppercase text-[#c65a00]">Team B</p>
          <div className="mx-auto mt-4 jersey h-12 w-12 bg-[#ff8a00] shadow-[inset_0_0_0_2px_rgba(0,0,0,.16),0_10px_22px_rgba(255,138,0,.22)]" />
          <p className="mt-3 text-xs font-bold text-slate-500">{teamB.length} players</p>
          <div className="mt-3 flex justify-center -space-x-2">
            {teamB.slice(0, 5).map((name) => <span key={name} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#234] text-[10px] font-black text-white">{name[0]}</span>)}
          </div>
        </div>
      </div>
      <Link href="/matches" className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 text-sm font-extrabold text-slate-800">
        Preview teams <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

function StatusCard({ icon: Icon, title, children, href, action }: { icon: StatusCardIcon; title: string; children: React.ReactNode; href: string; action: string }) {
  return (
    <Card className="min-h-[190px]">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-slate-900" />
        <SectionTitle>{title}</SectionTitle>
      </div>
      <div className="mt-5 min-h-[72px]">{children}</div>
      <Link href={href} className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 text-sm font-extrabold text-slate-800">
        {action} <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

export function HomePage() {
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const upcomingReservations = getUpcomingReservations(reservations);
  const lastReservation = getPastReservations(reservations)[0];
  const { summary, confirmedPlayers, currentStatus, reservationStatus } = useAttendance(nextReservation?.id, nextReservation);
  const { transactionTotal } = useFinanceTransactions();
  const currentBalance = financeSnapshot.balance + transactionTotal;
  const teamA = confirmedPlayers.slice(0, 5).map((player) => player.player);
  const teamB = confirmedPlayers.slice(5, 10).map((player) => player.player);
  const openAt = nextReservation ? getReservationOpenAt({ date: nextReservation.date }) : null;

  if (!nextReservation) {
    return (
      <Card>
        <SectionTitle>Next Match</SectionTitle>
        <p className="mt-4 text-sm font-semibold text-slate-600">No upcoming match is scheduled.</p>
        <Link href="/matches" className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#4fb332] px-5 font-extrabold text-white">Add match</Link>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_390px]">
        <section className="rounded-[22px] border border-white/10 bg-[#061827]/96 p-5 text-white shadow-[0_24px_54px_rgba(1,13,25,.24)] backdrop-blur-[18px]">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <p className="text-sm font-black uppercase tracking-[.06em] text-lime-300">Next Match</p>
              <div className="mt-6 space-y-4">
                <p className="flex flex-wrap items-center gap-2 text-xl font-black">
                  <CalendarDays className="h-5 w-5" />
                  {formatReservationDate(nextReservation.date)}
                  <span className="text-lime-300">•</span>
                  {nextReservation.time}
                </p>
                <p className="flex items-center gap-3 text-sm font-extrabold uppercase text-white/90">
                  <MapPin className="h-5 w-5" />
                  <ReservationMapLink reservation={nextReservation} className="text-white/90" />
                </p>
                <span className="inline-flex rounded-full bg-[#1f8d35]/70 px-3 py-1 text-xs font-bold text-lime-100">Indoor • Futsal</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-black text-[#061827]">
                  <Bell className="h-4 w-4" /> Notify me
                </button>
                <Link href="/matches" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/18 bg-white/10 px-5 text-sm font-black text-white">
                  Match details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="border-white/18 lg:border-l lg:pl-6">
              <div className="inline-flex rounded-xl bg-lime-300/18 px-3 py-2 text-xs font-bold text-lime-100">
                {reservationStatus === "open" ? "Booking open" : "Booking opens"}
                <span className="ml-2 text-white/80">{openAt?.toLocaleDateString("en-GB", { weekday: "short" })} 11:00</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase text-white/45">Spots</p>
              <p className="mt-1 text-3xl font-black">{summary.playing} / {playingLimit}</p>
              <p className="mt-1 text-sm font-bold text-lime-300">Confirmed</p>
              <div className="mt-3"><PlayerDots count={summary.playing} /></div>
              <div className="my-4 h-px bg-white/14" />
              <p className="text-2xl font-black text-orange-400">{summary.waiting}</p>
              <p className="text-sm font-bold text-orange-300">Waiting</p>
              <div className="mt-3"><PlayerDots count={summary.waiting} tone="orange" /></div>
            </div>
          </div>
        </section>

        <TeamPreview teamA={teamA} teamB={teamB} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard icon={WalletCards} title="Booking Status" href="/finances" action="View finances">
          <p className="text-sm font-black text-red-600">Not paid</p>
          <p className="mt-5 text-sm text-slate-500">Total</p>
          <p className="text-2xl font-black text-slate-950">400 <span className="text-sm">MAD</span></p>
        </StatusCard>
        <StatusCard icon={Trophy} title="Last Match" href="/matches" action="Match report">
          <p className="text-center text-sm text-slate-500">{lastReservation ? formatReservationDate(lastReservation.date) : "No past game"}</p>
          <p className="mt-2 text-center text-3xl font-black text-slate-950">{lastReservation?.matchReport ? `${lastReservation.matchReport.fluorescentScore} - ${lastReservation.matchReport.orangeScore}` : "—"}</p>
        </StatusCard>
        <StatusCard icon={WalletCards} title="Budget" href="/finances" action="View finances">
          <p className="text-sm text-slate-500">Current balance</p>
          <p className="mt-2 text-2xl font-black text-[#168332]">{formatDh(currentBalance)}</p>
        </StatusCard>
        <StatusCard icon={Users} title="Your Status" href="/members" action="View profile">
          <p className="flex items-center gap-2 text-sm font-black text-[#168332]"><CheckCircle2 className="h-5 w-5" /> {currentStatus === "playing" ? "Confirmed" : currentStatus === "waiting" ? "Waiting" : "Not set"}</p>
          <p className="mt-5 text-center font-black text-[#168332]">{currentStatus === "playing" ? "Team A" : "—"}</p>
        </StatusCard>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <SectionTitle>Upcoming Matches</SectionTitle>
          <Link href="/matches" className="text-sm font-extrabold text-[#247e24]">View all</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {upcomingReservations.slice(0, 4).map((reservation, index) => {
            const date = new Date(`${reservation.date}T00:00:00`);
            return (
              <Link key={reservation.id} href="/matches" className={index === 0 ? "grid grid-cols-[86px_1fr_auto] items-center overflow-hidden rounded-xl border border-lime-200 bg-lime-50/80" : "grid grid-cols-[86px_1fr_auto] items-center overflow-hidden rounded-xl border border-slate-200/80 bg-white/56"}>
                <div className={index === 0 ? "bg-lime-100 p-4 text-center" : "bg-white/60 p-4 text-center"}>
                  <p className="text-xs font-black uppercase">{date.toLocaleDateString("en-GB", { weekday: "short" })}</p>
                  <p className="text-2xl font-black">{date.getDate()}</p>
                  <p className="text-xs font-black uppercase">{date.toLocaleDateString("en-GB", { month: "short" })}</p>
                </div>
                <div className="min-w-0 px-4">
                  <p className="font-black text-slate-950">{reservation.time}</p>
                  <p className="truncate text-sm font-medium text-slate-600">{reservation.venue}</p>
                  <span className="mt-2 inline-flex rounded-full bg-lime-100 px-2 py-1 text-[11px] font-bold text-[#247e24]">Upcoming</span>
                </div>
                <ArrowRight className="mr-4 h-5 w-5 text-slate-800" />
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="grid gap-4 md:grid-cols-4">
        {[
          ["Game rule", "10 players • 2 teams", ShieldCheck],
          ["Fair play", "Respect and commitment", Users],
          ["Be on time", "Arrive 15 min before kick-off", Clock3],
          ["Have fun", "We play for friendship", Trophy]
        ].map(([title, text, Icon]) => (
          <div key={title as string} className="flex items-start gap-3 md:border-r md:border-slate-200/70 md:last:border-r-0">
            <Icon className="h-7 w-7 shrink-0 text-[#168332]" />
            <div>
              <p className="font-black text-slate-950">{title as string}</p>
              <p className="mt-1 text-sm text-slate-600">{text as string}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
