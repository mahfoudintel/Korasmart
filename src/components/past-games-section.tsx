"use client";

import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { canEditBookings } from "@/lib/access";
import { players } from "@/lib/data";
import { formatReservationDate, getPastReservations, type MatchReport, type Reservation } from "@/lib/reservations";

const emptyMatchReport: MatchReport = {
  fluorescentTeam: [],
  orangeTeam: [],
  fluorescentScore: 0,
  orangeScore: 0,
  winner: "draw",
  scorers: {},
  notes: ""
};

function parsePlayerList(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseScorers(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([player, goals]): [string, number] => [player, Number(goals) || 0])
        .filter(([, goals]) => goals > 0)
    );
  }

  if (typeof value !== "string") return {};

  return Object.fromEntries(
    value
      .split(",")
      .map((item) => item.trim())
      .map((item) => {
        const match = item.match(/^(.+?)\s+(\d+)$/);
        return match ? [match[1].trim(), Number(match[2])] : [item, 1];
      })
      .filter(([player]) => Boolean(player))
  );
}

function normalizeReport(report?: Partial<MatchReport>): MatchReport {
  return {
    ...emptyMatchReport,
    ...(report || {}),
    fluorescentTeam: parsePlayerList(report?.fluorescentTeam),
    orangeTeam: parsePlayerList(report?.orangeTeam),
    scorers: parseScorers(report?.scorers)
  };
}

function PlayerChecklist({
  disabled,
  selected,
  onChange
}: {
  disabled: boolean;
  selected: string[];
  onChange: (players: string[]) => void;
}) {
  return (
    <div className="mt-2 grid max-h-52 gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-white/[.05] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {players.map((player) => {
        const checked = selected.includes(player.name);

        return (
          <label key={player.name} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-white/78">
            <input
              type="checkbox"
              disabled={disabled}
              checked={checked}
              onChange={(event) => onChange(event.target.checked ? [...selected, player.name] : selected.filter((name) => name !== player.name))}
              className="accent-lime-300"
            />
            {player.name}
          </label>
        );
      })}
    </div>
  );
}

function PastGameEditor({ reservation, canEdit, onSubmit }: { reservation: Reservation; canEdit: boolean; onSubmit: (reservation: Reservation, report: MatchReport) => void }) {
  const [report, setReport] = useState<MatchReport>(() => normalizeReport(reservation.matchReport));
  const totalGoals = Object.values(report.scorers).reduce((sum, goals) => sum + Number(goals || 0), 0);

  useEffect(() => {
    setReport(normalizeReport(reservation.matchReport));
  }, [reservation.id, reservation.matchReport]);

  const updateScorer = (player: string, goals: number) => {
    setReport((current) => {
      const scorers = { ...current.scorers };
      if (goals > 0) scorers[player] = goals;
      else delete scorers[player];
      return { ...current, scorers };
    });
  };

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[.05] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xl font-black text-white">{formatReservationDate(reservation.date)} - {reservation.time}</p>
          <p className="mt-1 text-sm text-white/65"><ReservationMapLink reservation={reservation} className="font-bold" /> · {reservation.durationMinutes} min</p>
        </div>
        <span className="rounded-full bg-orange-300/15 px-3 py-1 text-xs font-black text-orange-200">Past game</span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-white/70">Fluorescent team</p>
          <PlayerChecklist disabled={!canEdit} selected={report.fluorescentTeam} onChange={(nextPlayers) => setReport((current) => ({ ...current, fluorescentTeam: nextPlayers }))} />
        </div>
        <div>
          <p className="text-sm font-bold text-white/70">Orange team</p>
          <PlayerChecklist disabled={!canEdit} selected={report.orangeTeam} onChange={(nextPlayers) => setReport((current) => ({ ...current, orangeTeam: nextPlayers }))} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm font-bold text-white/70">
          Fluorescent score
          <input disabled={!canEdit} type="number" min="0" value={report.fluorescentScore} onChange={(event) => setReport((current) => ({ ...current, fluorescentScore: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none focus:border-lime-300 disabled:opacity-60" />
        </label>
        <label className="text-sm font-bold text-white/70">
          Orange score
          <input disabled={!canEdit} type="number" min="0" value={report.orangeScore} onChange={(event) => setReport((current) => ({ ...current, orangeScore: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none focus:border-lime-300 disabled:opacity-60" />
        </label>
        <label className="text-sm font-bold text-white/70">
          Winning team
          <select disabled={!canEdit} value={report.winner} onChange={(event) => setReport((current) => ({ ...current, winner: event.target.value as MatchReport["winner"] }))} className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300 disabled:opacity-60">
            <option className="bg-[#08110b]" value="draw">Draw</option>
            <option className="bg-[#08110b]" value="fluorescent">Fluorescent</option>
            <option className="bg-[#08110b]" value="orange">Orange</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm font-bold text-white/70">Scorers</p>
          <span className="rounded-full bg-white/[.06] px-3 py-1 text-xs font-black text-white/55">{totalGoals} goals recorded</span>
        </div>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {players.map((player) => (
            <label key={player.name} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.05] p-2">
              <span className="min-w-0 flex-1 truncate text-sm font-black text-white/78">{player.name}</span>
              <input disabled={!canEdit} type="number" min="0" value={report.scorers[player.name] || 0} onChange={(event) => updateScorer(player.name, Number(event.target.value))} className="h-9 w-14 rounded-xl border border-white/15 bg-black/15 text-center font-black text-lime-300 outline-none disabled:opacity-60" />
            </label>
          ))}
        </div>
      </div>

      <label className="mt-4 block text-sm font-bold text-white/70">
        Notes
        <input disabled={!canEdit} value={report.notes} onChange={(event) => setReport((current) => ({ ...current, notes: event.target.value }))} placeholder="Injuries, comments, special events..." className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300 disabled:opacity-60" />
      </label>

      {canEdit && (
        <button onClick={() => onSubmit(reservation, { ...report, submittedAt: new Date().toISOString() })} className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black transition hover:bg-lime-200">
          <Save className="h-4 w-4" />
          Submit match report
        </button>
      )}
    </div>
  );
}

export function PastGamesSection() {
  const { role } = useRole();
  const canEdit = canEditBookings(role);
  const { reservations, upsertReservation } = useReservations();
  const pastReservations = useMemo(() => getPastReservations(reservations), [reservations]);

  const submitReport = (reservation: Reservation, report: MatchReport) => {
    upsertReservation({
      ...reservation,
      status: "past",
      matchReport: report
    });
  };

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionTitle>Past Games</SectionTitle>
          <p className="mt-2 text-sm text-white/65">Submit structured match reports after each game. Player selections and scorer counts will feed analytics later.</p>
        </div>
        <span className="rounded-full bg-white/[.07] px-3 py-1 text-xs font-black text-white/65">
          {pastReservations.length} games
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {pastReservations.length ? (
          pastReservations.map((reservation) => (
            <PastGameEditor key={reservation.id} reservation={reservation} canEdit={canEdit} onSubmit={submitReport} />
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[.05] p-5 text-sm text-white/60">No past games yet.</p>
        )}
      </div>
    </Card>
  );
}
