"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Trophy, UsersRound } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useAttendance } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { useLanguage } from "@/components/language-provider";
import { formatReservationDate, type MatchReport } from "@/lib/reservations";
import { translateText } from "@/lib/translations";

function topScorers(report?: MatchReport) {
  if (!report) return [];
  const scorers = Object.entries(report.scorers).filter(([, goals]) => goals > 0);
  const max = Math.max(0, ...scorers.map(([, goals]) => goals));
  return scorers.filter(([, goals]) => goals === max);
}

export function MatchDetail({ matchId }: { matchId: string }) {
  const { language } = useLanguage();
  const { reservations } = useReservations();
  const t = (text: string) => translateText(text, language);
  const reservation = reservations.find((item) => item.id === matchId);
  const attendance = useAttendance(reservation?.id, reservation);

  if (!reservation) {
    return (
      <Card>
        <SectionTitle>{t("Match not found")}</SectionTitle>
        <Link href="/matches" className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white">
          <ArrowLeft className="h-4 w-4" />
          {t("Back to Matches")}
        </Link>
      </Card>
    );
  }

  const report = reservation.matchReport;
  const scorers = topScorers(report);

  return (
    <div className="space-y-5">
      <Link href="/matches" className="inline-flex items-center gap-2 text-sm font-black text-[#247e24]">
        <ArrowLeft className="h-4 w-4" />
        {t("Back to Matches")}
      </Link>

      <section className="rounded-[26px] border border-white/25 bg-[#0d2132] p-5 text-white shadow-[0_24px_60px_rgba(2,20,28,.28)]">
        <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">{t("Match Details")}</p>
        <h1 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">{formatReservationDate(reservation.date)}</h1>
        <div className="mt-5 grid gap-3 text-base font-black text-white/92 sm:grid-cols-3">
          <span className="inline-flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-lime-300" />
            {reservation.time}
          </span>
          <span className="inline-flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-lime-300" />
            {reservation.durationMinutes} min
          </span>
          <span className="inline-flex min-w-0 items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-lime-300" />
            <ReservationMapLink reservation={reservation} className="truncate text-white" />
          </span>
        </div>
        {report && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-black uppercase tracking-[.12em] text-white/60">{t("Final Score")}</p>
            <p className="mt-2 text-4xl font-black">
              {t("Team A")} {report.fluorescentScore} - {report.orangeScore} {t("Team B")}
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <SectionTitle>{t("Attendance")}</SectionTitle>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-lime-50 p-3">
              <p className="text-2xl font-black text-[#247e24]">{attendance.summary.playing}</p>
              <p className="text-xs font-bold text-slate-500">{t("Confirmed")}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-2xl font-black text-amber-700">{attendance.summary.waiting}</p>
              <p className="text-xs font-bold text-slate-500">{t("Waiting")}</p>
            </div>
            <div className="rounded-2xl bg-white/55 p-3">
              <p className="text-2xl font-black text-slate-950">{attendance.summary.notAttending}</p>
              <p className="text-xs font-bold text-slate-500">{t("No response")}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {attendance.confirmedPlayers.length ? attendance.confirmedPlayers.map((player) => (
              <p key={player.player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black text-slate-800">{player.player}</p>
            )) : <p className="text-sm font-bold text-slate-500">{t("No confirmed players yet.")}</p>}
          </div>
        </Card>

        <Card>
          <SectionTitle>{t("Teams")}</SectionTitle>
          {report ? (
            <div className="mt-4 grid gap-4">
              <div>
                <p className="font-black text-[#247e24]">{t("Team A")}</p>
                <div className="mt-2 space-y-2">{report.fluorescentTeam.length ? report.fluorescentTeam.map((player) => <p key={player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black">{player}</p>) : <p className="text-sm font-bold text-slate-500">{t("Not recorded")}</p>}</div>
              </div>
              <div>
                <p className="font-black text-orange-600">{t("Team B")}</p>
                <div className="mt-2 space-y-2">{report.orangeTeam.length ? report.orangeTeam.map((player) => <p key={player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black">{player}</p>) : <p className="text-sm font-bold text-slate-500">{t("Not recorded")}</p>}</div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-bold text-slate-500">{t("Teams not recorded yet.")}</p>
          )}
        </Card>

        <Card>
          <SectionTitle>{t("Key Stats")}</SectionTitle>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white/55 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                <Trophy className="h-4 w-4 text-[#247e24]" />
                {t("Top scorer")}
              </div>
              <p className="mt-2 text-lg font-black text-slate-950">
                {scorers.length ? scorers.map(([player, goals]) => `${player} x${goals}`).join(", ") : t("Not recorded")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                <UsersRound className="h-4 w-4 text-[#247e24]" />
                {t("MVP")}
              </div>
              <p className="mt-2 text-lg font-black text-slate-950">{t("Not recorded")}</p>
            </div>
            {report?.notes && <p className="rounded-2xl bg-white/55 p-4 text-sm font-bold text-slate-700">{report.notes}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
