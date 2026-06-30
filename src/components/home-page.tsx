"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, ShieldCheck, Trophy, Users, type LucideIcon } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { UpcomingReservationsCard } from "@/components/reservation-dashboard-widgets";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useReservations } from "@/hooks/use-reservations";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { players } from "@/lib/data";

function HighlightCard({ icon: Icon, label, value, meta }: { icon: LucideIcon; label: string; value: string; meta: string }) {
  return (
    <Card className="min-h-[118px]">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-300/20 text-lime-300">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-white/70">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          <p className="mt-1 text-sm text-white/65">{meta}</p>
        </div>
      </div>
    </Card>
  );
}

export function HomePage() {
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const attendance = useAttendance(nextReservation?.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-lime-300">KoraSmart Home</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Next game, attendance, and club rhythm.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
                This is the simple member view: check the next reservation, put your name down, see who is confirmed, and follow the upcoming games.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/players" className="inline-flex h-11 items-center gap-2 rounded-full bg-lime-300 px-5 text-sm font-black text-black">
                  Player ratings <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/bookings" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-black text-white">
                  Full schedule <CalendarDays className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[.05] p-5">
              <p className="text-xs font-black uppercase tracking-[.1em] text-white/58">Incoming game details</p>
              {nextReservation ? (
                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-7 w-7 text-lime-300" />
                    <div>
                      <p className="font-black text-white">{formatReservationDate(nextReservation.date)}</p>
                      <p className="text-2xl font-black text-lime-300">{nextReservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-6 w-6 text-lime-300" />
                    <div>
                      <ReservationMapLink reservation={nextReservation} className="font-black" />
                      <p className="mt-1 text-sm text-white/60">
                        {nextReservation.durationMinutes} <span>min football reservation</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-orange-300">No upcoming game has been scheduled yet.</p>
              )}
            </div>
          </div>
        </Card>

        <NextMatchAttendance />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HighlightCard icon={CheckCircle2} label="Confirmed spots" value={`${attendance.summary.playing}/${playingLimit}`} meta="First come, first served" />
        <HighlightCard icon={Clock3} label="Waiting list" value={`${attendance.summary.waiting}`} meta="Promotes automatically" />
        <HighlightCard icon={Users} label="Members" value={`${players.length}`} meta="Registered group list" />
        <HighlightCard icon={ShieldCheck} label="Fair teams" value="Ratings" meta="Anonymous peer scores" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle>Attendance List</SectionTitle>
            <span className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-300">
              {attendance.summary.playing} <span>attending</span> - {attendance.summary.waiting} <span>waiting</span>
            </span>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.1em] text-white/58">Confirmed players</p>
              <div className="grid gap-2">
                {attendance.confirmedPlayers.length ? (
                  attendance.confirmedPlayers.map((record, index) => (
                    <div key={record.player} className="flex items-center justify-between rounded-2xl bg-lime-300/10 p-3">
                      <span className="font-black text-white">{record.player}</span>
                      <span className="text-sm font-black text-lime-300">#{index + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/[.05] p-4 text-sm text-white/55">No confirmed players yet.</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.1em] text-white/58">Waiting list</p>
              <div className="grid gap-2">
                {attendance.waitingPlayers.length ? (
                  attendance.waitingPlayers.map((record, index) => (
                    <div key={record.player} className="flex items-center justify-between rounded-2xl bg-amber-300/10 p-3">
                      <span className="font-black text-white">{record.player}</span>
                      <span className="text-sm font-black text-amber-300">#{index + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/[.05] p-4 text-sm text-white/55">Waiting list is empty.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <UpcomingReservationsCard />
          <Card>
            <SectionTitle>Quick Info</SectionTitle>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p><Trophy className="mr-2 inline h-4 w-4 text-lime-300" /> Match stats are entered after the game from Players Details.</p>
              <p><ShieldCheck className="mr-2 inline h-4 w-4 text-lime-300" /> Player ratings stay anonymous and feed future fair teams.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

