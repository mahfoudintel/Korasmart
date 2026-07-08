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
  UserX,
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
    <Card className="flex min-h-[190px] flex-col">
      <div className="flex min-h-7 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-slate-900" />
        <SectionTitle>{title}</SectionTitle>
      </div>
      <div className="mt-5 flex min-h-[78px] flex-1 flex-col justify-start">{children}</div>
      <Link href={href} className="mt-4 flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/74 text-sm font-extrabold text-slate-800">
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
  const {
    summary,
    confirmedPlayers,
    waitingPlayers,
    currentStatus,
    selectedPosition,
    reservationStatus,
    canSubmitAttendance,
    saveStatus,
    saveError,
    loadError,
    setStatus,
    dropOut
  } = useAttendance(nextReservation?.id, nextReservation);
  const { transactionTotal } = useFinanceTransactions();
  const currentBalance = financeSnapshot.balance + transactionTotal;
  const teamA = confirmedPlayers.slice(0, 5).map((player) => player.player);
  const teamB = confirmedPlayers.slice(5, 10).map((player) => player.player);
  const openAt = nextReservation ? getReservationOpenAt({ date: nextReservation.date }) : null;
  const attendanceIsOpen = reservationStatus === "open";

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
      {attendanceIsOpen && (
        <section className="overflow-hidden rounded-[20px] border border-lime-200 bg-white/82 text-slate-950 shadow-[0_18px_44px_rgba(47,158,47,.2)] backdrop-blur-[22px] sm:rounded-[28px] sm:shadow-[0_26px_70px_rgba(47,158,47,.22)]">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.15fr)_420px]">
            <div className="p-4 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-[#3dad3d] px-3 py-1.5 text-[11px] font-black uppercase tracking-[.06em] text-white sm:px-4 sm:py-2 sm:text-xs">
                  {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Attendance open"}
                </span>
                <span className="rounded-full bg-lime-100 px-3 py-1.5 text-[11px] font-black text-[#247e24] sm:px-4 sm:py-2 sm:text-xs">
                  {summary.playing}/{playingLimit} confirmed
                </span>
                {summary.waiting > 0 && (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700 sm:px-4 sm:py-2 sm:text-xs">
                    {summary.waiting} waiting
                  </span>
                )}
              </div>

              <h2 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950 sm:mt-5 sm:text-5xl">
                Are you playing this match?
              </h2>

              <div className="mt-4 grid gap-2 text-sm font-extrabold text-slate-800 sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3 sm:text-base">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <CalendarDays className="h-5 w-5 shrink-0 text-[#2f9e2f]" />
                  {formatReservationDate(nextReservation.date)}
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Clock3 className="h-5 w-5 shrink-0 text-[#2f9e2f]" />
                  {nextReservation.time}
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-[#2f9e2f]" />
                  <ReservationMapLink reservation={nextReservation} className="min-w-0 truncate text-slate-800" />
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2">
                <button
                  onClick={setStatus}
                  disabled={!canSubmitAttendance || saveStatus === "saving"}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#3dad3d] px-4 text-base font-black text-white shadow-[0_16px_30px_rgba(47,158,47,.24)] transition hover:bg-[#319c31] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-16 sm:px-5 sm:text-lg"
                >
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  {saveStatus === "saving" ? "Saving..." : summary.playing >= playingLimit && currentStatus !== "playing" ? "Join waiting list" : "Attending"}
                </button>
                <button
                  onClick={dropOut}
                  disabled={!canSubmitAttendance || saveStatus === "saving"}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 text-base font-black text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-16 sm:px-5 sm:text-lg"
                >
                  <UserX className="h-5 w-5 sm:h-6 sm:w-6" />
                  {saveStatus === "saving" ? "Saving..." : "Not attending"}
                </button>
              </div>

              <p className="mt-4 rounded-2xl border border-white/80 bg-white/65 p-3 text-sm font-semibold text-slate-600 sm:p-4">
                {currentStatus === "playing" && (
                  <span><b className="text-[#247e24]">You are confirmed</b> <span>as player</span> #{selectedPosition}.</span>
                )}
                {currentStatus === "waiting" && (
                  <span><b className="text-amber-700">You are on the waiting list</b> at position #{selectedPosition}.</span>
                )}
                {!currentStatus && <span>Choose one option now so the group can plan teams clearly.</span>}
              </p>
              {saveStatus === "saved" && !saveError && (
                <p className="mt-3 rounded-2xl border border-lime-200 bg-lime-50 p-3 text-sm font-black text-[#247e24] sm:p-4">
                  Saved. Your status is synced.
                </p>
              )}
              {(saveError || loadError) && (
                <p className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-700 sm:p-4">
                  {saveError || loadError}
                </p>
              )}
            </div>

            <div className="border-t border-white/65 bg-[#061827]/95 p-4 text-white sm:p-5 xl:border-l xl:border-t-0">
              <p className="text-xs font-black uppercase tracking-[.1em] text-lime-300">Live attendance</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:mt-5">
                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <p className="text-2xl font-black text-lime-300 sm:text-3xl">{summary.playing}</p>
                  <p className="mt-1 text-xs font-bold text-white/70">Attending</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <p className="text-2xl font-black text-orange-300 sm:text-3xl">{summary.waiting}</p>
                  <p className="mt-1 text-xs font-bold text-white/70">Waiting</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <p className="text-2xl font-black text-white sm:text-3xl">{summary.notAttending}</p>
                  <p className="mt-1 text-xs font-bold text-white/70">Out</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[.08em] text-white/55">Confirmed</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {confirmedPlayers.length ? (
                    confirmedPlayers.map((record, index) => (
                      <span key={record.player} className="rounded-full bg-lime-300 px-3 py-1 text-xs font-black text-[#061827]">
                        {index + 1}. {record.player}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-semibold text-white/55">No confirmed players yet.</span>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[.08em] text-white/55">Waiting list</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {waitingPlayers.length ? (
                    waitingPlayers.map((record, index) => (
                      <span key={record.player} className="rounded-full bg-orange-300 px-3 py-1 text-xs font-black text-[#061827]">
                        {index + 1}. {record.player}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-semibold text-white/55">Waiting list is empty.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className={attendanceIsOpen ? "hidden gap-5 md:grid xl:grid-cols-[minmax(0,1.35fr)_390px]" : "grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_390px]"}>
        <section className={attendanceIsOpen ? "rounded-[22px] border border-white/10 bg-[#061827]/88 p-5 text-white shadow-[0_16px_34px_rgba(1,13,25,.14)] backdrop-blur-[18px]" : "rounded-[22px] border border-white/10 bg-[#061827]/96 p-5 text-white shadow-[0_24px_54px_rgba(1,13,25,.24)] backdrop-blur-[18px]"}>
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
                <span className="inline-flex rounded-full bg-[#1f8d35]/70 px-3 py-1 text-xs font-bold text-lime-100">Outdoor football</span>
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

      <div className={attendanceIsOpen ? "hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-4"}>
        <StatusCard icon={WalletCards} title="Booking Status" href="/finances" action="View finances">
          <p className="text-sm font-black text-red-600">Not paid</p>
          <p className="mt-4 text-sm text-slate-500">Total</p>
          <p className="text-2xl font-black text-slate-950">400 <span className="text-sm">MAD</span></p>
        </StatusCard>
        <StatusCard icon={Trophy} title="Last Match" href="/matches" action="Match report">
          <p className="text-sm text-slate-500">{lastReservation ? formatReservationDate(lastReservation.date) : "No past game"}</p>
          <p className="mt-4 text-3xl font-black leading-none text-slate-950">{lastReservation?.matchReport ? `${lastReservation.matchReport.fluorescentScore} - ${lastReservation.matchReport.orangeScore}` : "—"}</p>
        </StatusCard>
        <StatusCard icon={WalletCards} title="Budget" href="/finances" action="View finances">
          <p className="text-sm text-slate-500">Current balance</p>
          <p className="mt-4 text-2xl font-black leading-none text-[#168332]">{formatDh(currentBalance)}</p>
        </StatusCard>
        <StatusCard icon={Users} title="Your Status" href="/players" action="View profile">
          <p className="flex items-center gap-2 text-sm font-black text-[#168332]"><CheckCircle2 className="h-5 w-5" /> {currentStatus === "playing" ? "Confirmed" : currentStatus === "waiting" ? "Waiting" : "Not set"}</p>
          <p className="mt-4 text-2xl font-black leading-none text-[#168332]">{currentStatus === "playing" ? "Team A" : "—"}</p>
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
