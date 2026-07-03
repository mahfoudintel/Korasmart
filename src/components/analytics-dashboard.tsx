"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, ShieldCheck, Target, Trophy, Users } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { NextReservationTopCard, UpcomingReservationsCard } from "@/components/reservation-dashboard-widgets";
import { players } from "@/lib/data";
import { calculateQuantitativeScore, ratingIndicators, type RatingValues } from "@/lib/ratings";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";

type PeerRatings = Record<string, Record<string, RatingValues>>;
type MatchStats = {
  reservationId: string;
  fluorescentScore: number;
  orangeScore: number;
  winner: "fluorescent" | "orange" | "draw";
  mvp: string;
  notes: string;
  scorers: Record<string, number>;
};

const ratingsStorageKey = "korasmart-peer-ratings-v1";
const matchStatsStorageKey = "korasmart-match-stats-v1";

function StatCard({ icon: Icon, label, value, meta }: { icon: typeof BarChart3; label: string; value: string; meta: string }) {
  return (
    <Card className="glass-line min-h-[118px]">
      <div className="relative flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-300/20 text-lime-300">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-white/75">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          <p className="mt-1 text-sm text-white/65">{meta}</p>
        </div>
      </div>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const { reservations } = useReservations();
  const [ratings, setRatings] = useState<PeerRatings>({});
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);

  useEffect(() => {
    const savedRatings = window.localStorage.getItem(ratingsStorageKey);
    const savedStats = window.localStorage.getItem(matchStatsStorageKey);

    if (savedRatings) setRatings(JSON.parse(savedRatings) as PeerRatings);
    if (savedStats) setMatchStats(JSON.parse(savedStats) as MatchStats);
  }, []);

  const playerScores = useMemo(
    () =>
      players
        .map((player) => {
          const receivedRatings = Object.values(ratings)
            .map((raterRatings) => raterRatings[player.name])
            .filter(Boolean);

          return {
            player: player.name,
            score: calculateQuantitativeScore(receivedRatings),
            submissions: receivedRatings.length
          };
        })
        .sort((a, b) => (b.score ?? -1) - (a.score ?? -1)),
    [ratings]
  );

  const totalPossibleRatings = players.length * (players.length - 1);
  const submittedRatings = Object.values(ratings).reduce((sum, raterRatings) => sum + Object.keys(raterRatings).length, 0);
  const ratingsPercent = totalPossibleRatings ? Math.round((submittedRatings / totalPossibleRatings) * 100) : 0;
  const ratedPlayers = playerScores.filter((item) => item.score !== null).length;
  const selectedReservation = reservations.find((reservation) => reservation.id === matchStats?.reservationId);
  const totalGoals = matchStats
    ? Object.values(matchStats.scorers || {}).reduce((sum, goals) => sum + Number(goals || 0), 0)
    : 0;
  const hasOfficialStats = Boolean(matchStats && (matchStats.fluorescentScore > 0 || matchStats.orangeScore > 0 || totalGoals > 0));

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <h1 className="text-3xl font-black text-white">Insights</h1>
        <p className="mt-2 text-white/76">Useful trends for attendance, ratings, and match rhythm.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <NextReservationTopCard />
        <StatCard icon={ShieldCheck} label="Ratings progress" value={`${ratingsPercent}%`} meta={`${submittedRatings}/${totalPossibleRatings} peer scores`} />
        <StatCard icon={Users} label="Rated players" value={`${ratedPlayers}/${players.length}`} meta="Quantitative scores ready" />
        <StatCard icon={Trophy} label="Official games" value={hasOfficialStats ? "1" : "0"} meta="Recorded match stat sheets" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <SectionTitle>Player Quantitative Scores</SectionTitle>
            <Link href="/players" className="text-sm font-black text-lime-300">Open ratings</Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {playerScores.slice(0, 8).map((item, index) => (
              <div key={item.player} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
                <span className="w-6 text-sm font-black text-lime-300">{index + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-black">{item.player[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{item.player}</p>
                  <p className="text-xs text-white/55">{item.submissions} player ratings</p>
                </div>
                <span className="text-2xl font-black text-lime-300">{item.score ?? "-"}</span>
              </div>
            ))}
          </div>
          {submittedRatings === 0 && (
            <div className="mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm text-white/72">
              Scores are empty until players rate each other. This is intentional: no fake player strength data on the insights dashboard.
            </div>
          )}
        </Card>

        <div className="min-w-0 space-y-5">
          <NextMatchAttendance />
          <UpcomingReservationsCard />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <Target className="h-7 w-7 text-lime-300" />
            <SectionTitle>Game Stats</SectionTitle>
          </div>
          {hasOfficialStats ? (
            <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="rounded-2xl bg-white/[.06] p-4 text-center">
                <p className="text-sm text-white/60">{selectedReservation ? formatReservationDate(selectedReservation.date) : "Recorded game"}</p>
                <p className="mt-2 text-5xl font-black text-white">{matchStats?.fluorescentScore} - {matchStats?.orangeScore}</p>
                <p className="mt-2 text-sm text-lime-300">{matchStats?.winner === "draw" ? "Draw" : `${matchStats?.winner} won`}</p>
              </div>
              <div className="space-y-3">
                <p className="rounded-2xl bg-white/[.06] p-4"><span className="text-white/55">MVP</span><b className="ml-3 text-lime-300">{matchStats?.mvp}</b></p>
                <p className="rounded-2xl bg-white/[.06] p-4"><span className="text-white/55">Total goals</span><b className="ml-3 text-white">{totalGoals}</b></p>
                <p className="rounded-2xl bg-white/[.06] p-4 text-white/70">{matchStats?.notes || "No notes entered."}</p>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.06] p-5">
              <p className="text-3xl font-black text-white">No game stats yet</p>
              <p className="mt-2 text-sm text-white/65">After a match, enter score, winner, scorers, MVP, and notes from Players Ratings.</p>
              <Link href="/players" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-lime-300/40 px-5 text-sm font-black text-lime-300">
                Enter game stats <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-lime-300" />
            <SectionTitle>Fair Team Readiness</SectionTitle>
          </div>
          <div className="mt-5 space-y-4">
            {ratingIndicators.map((indicator) => (
              <div key={indicator.key}>
                <div className="mb-2 flex justify-between text-sm text-white/65">
                  <span>{indicator.label}</span>
                  <span>{submittedRatings ? "collecting" : "pending"}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-lime-300" style={{ width: `${ratingsPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
