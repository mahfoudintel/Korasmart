"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, ShieldCheck, Trophy } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Card, SectionTitle } from "@/components/ui/card";
import { players } from "@/lib/data";
import { calculateQuantitativeScore, emptyRatingValues, ratingIndicators, type RatingValues } from "@/lib/ratings";
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
const anonymousRaterKey = "korasmart-anonymous-rater-id";

export function PlayersRatingsWorkspace() {
  const { reservations } = useReservations();
  const [anonymousRaterId, setAnonymousRaterId] = useState("anonymous-session");
  const [target, setTarget] = useState(players[0].name);
  const [draft, setDraft] = useState<RatingValues>(emptyRatingValues);
  const [ratings, setRatings] = useState<PeerRatings>({});
  const [matchStats, setMatchStats] = useState<MatchStats>({
    reservationId: reservations[0]?.id || "",
    fluorescentScore: 0,
    orangeScore: 0,
    winner: "draw",
    mvp: players[0].name,
    notes: "",
    scorers: Object.fromEntries(players.map((player) => [player.name, 0]))
  });

  useEffect(() => {
    const savedAnonymousId = window.localStorage.getItem(anonymousRaterKey);
    if (savedAnonymousId) {
      setAnonymousRaterId(savedAnonymousId);
    } else {
      const newAnonymousId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `anonymous-${crypto.randomUUID()}`
          : `anonymous-${Date.now()}`;
      window.localStorage.setItem(anonymousRaterKey, newAnonymousId);
      setAnonymousRaterId(newAnonymousId);
    }

    const savedRatings = window.localStorage.getItem(ratingsStorageKey);
    const savedStats = window.localStorage.getItem(matchStatsStorageKey);

    if (savedRatings) setRatings(JSON.parse(savedRatings) as PeerRatings);
    if (savedStats) setMatchStats(JSON.parse(savedStats) as MatchStats);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ratingsStorageKey, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    window.localStorage.setItem(matchStatsStorageKey, JSON.stringify(matchStats));
  }, [matchStats]);

  const playerScores = useMemo(
    () =>
      players.map((player) => {
        const receivedRatings = Object.values(ratings)
          .map((raterRatings) => raterRatings[player.name])
          .filter(Boolean);
        const quantitativeScore = calculateQuantitativeScore(receivedRatings);

        return {
          player: player.name,
          score: quantitativeScore,
          submissions: receivedRatings.length
        };
      }),
    [ratings]
  );

  const currentRaterSubmissions = Object.keys(ratings[anonymousRaterId] || {}).length;
  const existingRating = ratings[anonymousRaterId]?.[target];

  const saveRating = () => {
    setRatings((current) => ({
      ...current,
      [anonymousRaterId]: {
        ...(current[anonymousRaterId] || {}),
        [target]: draft
      }
    }));
  };

  const updateMatchScorer = (player: string, goals: number) => {
    setMatchStats((current) => ({
      ...current,
      scorers: {
        ...current.scorers,
        [player]: Math.max(0, goals)
      }
    }));
  };

  return (
    <>
      <PageHeading
        title="Players Details"
        subtitle="Peer ratings, quantitative player scores, and post-game stats for fair team generation."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionTitle>One-time peer ratings</SectionTitle>
              <p className="mt-2 text-sm text-white/65">Ratings are anonymous. Score each player from 1 to 5, where 5 is strongest and 1 is weakest.</p>
            </div>
            <div className="rounded-2xl bg-lime-300/10 px-4 py-3 text-sm font-black text-lime-300">
              {currentRaterSubmissions}/{players.length - 1} completed
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
              <p className="text-xs font-black uppercase text-lime-300">Anonymous rating</p>
              <p className="mt-2 text-sm text-white/70">Your identity is not shown in the app. One local anonymous session can update its own saved ratings.</p>
            </div>
            <label className="text-sm font-bold text-white/70">
              Player to rate
              <select value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none">
                {players.map((player) => <option key={player.name} className="bg-[#08110b]">{player.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {ratingIndicators.map((indicator) => (
              <label key={indicator.key} className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <div className="mb-3 flex justify-between text-sm font-black">
                  <span>{indicator.label}</span>
                  <span className="text-lime-300">{draft[indicator.key]}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={draft[indicator.key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [indicator.key]: Number(event.target.value) }))}
                  className="w-full accent-lime-300"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/65">
              {existingRating ? "This anonymous session already rated this player. Saving will update the same entry." : "No anonymous rating saved yet for this player."}
            </p>
            <button onClick={saveRating} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black">
              <Save className="h-4 w-4" />
              Save rating
            </button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Quantitative player scores</SectionTitle>
          <div className="mt-5 space-y-3">
            {playerScores.map((item) => (
              <div key={item.player} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-black">{item.player[0]}</span>
                <span className="flex-1 font-black">{item.player}</span>
                <span className="text-sm text-white/55">{item.submissions} votes</span>
                <span className="min-w-14 text-right text-2xl font-black text-lime-300">{item.score ?? "-"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-lime-300" />
          <div>
            <SectionTitle>Game stats entry</SectionTitle>
            <p className="mt-1 text-sm text-white/65">After each game, record winner, score, scorers, MVP, and notes.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px_220px_220px]">
          <label className="text-sm font-bold text-white/70">
            Game reservation
            <select value={matchStats.reservationId} onChange={(event) => setMatchStats((current) => ({ ...current, reservationId: event.target.value }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none">
              {reservations.map((reservation) => (
                <option key={reservation.id} value={reservation.id} className="bg-[#08110b]">
                  {formatReservationDate(reservation.date)} - {reservation.time}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-white/70">
            Fluorescent score
            <input type="number" min="0" value={matchStats.fluorescentScore} onChange={(event) => setMatchStats((current) => ({ ...current, fluorescentScore: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none" />
          </label>
          <label className="text-sm font-bold text-white/70">
            Orange score
            <input type="number" min="0" value={matchStats.orangeScore} onChange={(event) => setMatchStats((current) => ({ ...current, orangeScore: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none" />
          </label>
          <label className="text-sm font-bold text-white/70">
            Winner
            <select value={matchStats.winner} onChange={(event) => setMatchStats((current) => ({ ...current, winner: event.target.value as MatchStats["winner"] }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none">
              <option value="draw" className="bg-[#08110b]">Draw</option>
              <option value="fluorescent" className="bg-[#08110b]">Fluorescent</option>
              <option value="orange" className="bg-[#08110b]">Orange</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {players.map((player) => (
            <label key={player.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
              <span className="flex-1 font-black">{player.name}</span>
              <input type="number" min="0" value={matchStats.scorers[player.name] || 0} onChange={(event) => updateMatchScorer(player.name, Number(event.target.value))} className="h-10 w-16 rounded-2xl border border-white/15 bg-black/15 text-center font-black text-lime-300 outline-none" />
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[240px_1fr]">
          <label className="text-sm font-bold text-white/70">
            MVP
            <select value={matchStats.mvp} onChange={(event) => setMatchStats((current) => ({ ...current, mvp: event.target.value }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none">
              {players.map((player) => <option key={player.name} className="bg-[#08110b]">{player.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-white/70">
            Notes
            <input value={matchStats.notes} onChange={(event) => setMatchStats((current) => ({ ...current, notes: event.target.value }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none" placeholder="Injuries, comments, special events..." />
          </label>
        </div>
      </Card>
    </>
  );
}
