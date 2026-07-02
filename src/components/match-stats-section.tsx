"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Save } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { canEditBookings } from "@/lib/access";
import { useMembers } from "@/hooks/use-members";
import {
  formatReservationDate,
  getReservationStart,
  sortReservations,
  type MatchReport,
  type Reservation
} from "@/lib/reservations";

type AttendanceMap = Record<string, Record<string, { status: "playing" | "waiting"; joinedAt: string }>>;

const attendanceStorageKey = "korasmart-attendance-v1";
const updateWindowHours = 24;

const emptyReport: MatchReport = {
  fluorescentTeam: [],
  orangeTeam: [],
  fluorescentScore: 0,
  orangeScore: 0,
  winner: "draw",
  scorers: {},
  notes: ""
};

function getGameEnd(reservation: Reservation) {
  return new Date(getReservationStart(reservation).getTime() + reservation.durationMinutes * 60 * 1000);
}

function getUpdateDeadline(reservation: Reservation) {
  return new Date(getGameEnd(reservation).getTime() + updateWindowHours * 60 * 60 * 1000);
}

function formatShortDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function normalizeReport(report?: Partial<MatchReport>): MatchReport {
  return {
    ...emptyReport,
    ...(report || {}),
    scorers: report?.scorers || {}
  };
}

function MatchStatsForm({
  reservation,
  playerNames,
  onSubmit
}: {
  reservation: Reservation;
  playerNames: string[];
  onSubmit: (report: MatchReport) => void;
}) {
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
    <div className="mt-5 rounded-[20px] border border-lime-200 bg-lime-50/75 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-600">
          Team A score
          <input
            type="number"
            min="0"
            value={report.fluorescentScore}
            onChange={(event) => setReport((current) => ({ ...current, fluorescentScore: Number(event.target.value) }))}
            className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-center font-extrabold text-slate-900 outline-none focus:border-lime-400"
          />
        </label>
        <label className="text-sm font-semibold text-slate-600">
          Team B score
          <input
            type="number"
            min="0"
            value={report.orangeScore}
            onChange={(event) => setReport((current) => ({ ...current, orangeScore: Number(event.target.value) }))}
            className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-center font-extrabold text-slate-900 outline-none focus:border-lime-400"
          />
        </label>
        <label className="text-sm font-semibold text-slate-600">
          Winner
          <select
            value={report.winner}
            onChange={(event) => setReport((current) => ({ ...current, winner: event.target.value as MatchReport["winner"] }))}
            className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 font-extrabold text-slate-900 outline-none focus:border-lime-400"
          >
            <option value="draw">Draw</option>
            <option value="fluorescent">Team A</option>
            <option value="orange">Team B</option>
          </select>
        </label>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-extrabold uppercase tracking-[.08em] text-slate-600">Scorers</p>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-slate-500">{totalGoals} goals</span>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {playerNames.map((player) => (
            <label key={player} className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/65 p-2">
              <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-slate-700">{player}</span>
              <input
                type="number"
                min="0"
                value={report.scorers[player] || 0}
                onChange={(event) => updateScorer(player, Number(event.target.value))}
                className="h-9 w-14 rounded-xl border border-white/80 bg-white text-center font-extrabold text-[#247e24] outline-none"
              />
            </label>
          ))}
        </div>
      </div>

      <label className="mt-4 block text-sm font-semibold text-slate-600">
        Notes
        <input
          value={report.notes}
          onChange={(event) => setReport((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Short note, injuries, MVP..."
          className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/80 px-4 font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>

      <button
        onClick={() => onSubmit({ ...report, submittedAt: new Date().toISOString() })}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#3dad3d] px-5 font-extrabold text-white transition hover:bg-[#319c31]"
      >
        <Save className="h-4 w-4" />
        Save stats
      </button>
    </div>
  );
}

function RecordedStatsCard({ reservation }: { reservation: Reservation }) {
  const report = normalizeReport(reservation.matchReport);
  const scorers = Object.entries(report.scorers).filter(([, goals]) => goals > 0);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/58 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-extrabold text-slate-900">{formatReservationDate(reservation.date)} - {reservation.time}</p>
          <ReservationMapLink reservation={reservation} className="mt-1 text-sm font-semibold text-[#247e24]" />
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-extrabold text-slate-700">
          {report.fluorescentScore} - {report.orangeScore}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-600">
        <p><span className="font-extrabold text-slate-800">Winner:</span> {report.winner === "draw" ? "Draw" : report.winner === "fluorescent" ? "Team A" : "Team B"}</p>
        <p className="mt-1"><span className="font-extrabold text-slate-800">Scorers:</span> {scorers.length ? scorers.map(([player, goals]) => `${player} ${goals}`).join(", ") : "No goals recorded"}</p>
        {report.notes && <p className="mt-1"><span className="font-extrabold text-slate-800">Notes:</span> {report.notes}</p>}
      </div>
    </div>
  );
}

export function MatchStatsSection() {
  const { role } = useRole();
  const canEdit = canEditBookings(role);
  const { members } = useMembers();
  const { reservations, upsertReservation } = useReservations();
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(attendanceStorageKey);
      if (saved) setAttendance(JSON.parse(saved) as AttendanceMap);
    } catch {
      setAttendance({});
    }
  }, []);

  const completedReservations = useMemo(
    () => sortReservations(reservations).filter((reservation) => getGameEnd(reservation).getTime() <= now.getTime()).reverse(),
    [reservations, now]
  );

  const openForUpdate = completedReservations.filter(
    (reservation) => getUpdateDeadline(reservation).getTime() > now.getTime()
  );
  const recordedReservations = completedReservations.filter(
    (reservation) => reservation.matchReport && getUpdateDeadline(reservation).getTime() <= now.getTime()
  );
  const recentlyRecorded = completedReservations.filter(
    (reservation) => reservation.matchReport && getUpdateDeadline(reservation).getTime() > now.getTime()
  );

  const submitReport = (reservation: Reservation, report: MatchReport) => {
    upsertReservation({
      ...reservation,
      status: "past",
      matchReport: report
    });
  };

  const playerPoolFor = (reservation: Reservation) => {
    const attendanceRecords = attendance[reservation.id] || {};
    const confirmed = Object.entries(attendanceRecords)
      .filter(([, record]) => record.status === "playing")
      .map(([player]) => player);

    return confirmed.length ? confirmed : members.map((member) => member.name);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
          <SectionTitle>Game Statistics Update</SectionTitle>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Game statistics open only after a scheduled game ends, then close after 24 hours.
            </p>
          </div>
          <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-extrabold text-[#247e24]">
            {openForUpdate.length} open
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {openForUpdate.length ? (
            openForUpdate.map((reservation) => {
              const deadline = getUpdateDeadline(reservation);
              const playerPool = playerPoolFor(reservation);

              return (
                <div key={reservation.id} className="rounded-[20px] border border-white/60 bg-white/62 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-extrabold text-slate-900">{formatReservationDate(reservation.date)} - {reservation.time}</p>
                      <ReservationMapLink reservation={reservation} className="mt-1 text-sm font-semibold text-[#247e24]" />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-extrabold text-[#247e24]">
                      <Clock3 className="h-3.5 w-3.5" />
                      Open until {formatShortDate(deadline)}
                    </span>
                  </div>
                  {canEdit ? (
                    <MatchStatsForm reservation={reservation} playerNames={playerPool} onSubmit={(report) => submitReport(reservation, report)} />
                  ) : (
                    <p className="mt-4 rounded-2xl bg-white/60 p-4 text-sm font-semibold text-slate-600">Budgeting & Booking officer access is required to update game statistics.</p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/60 bg-white/55 p-5 text-sm text-slate-600">
              No scheduled game is currently inside the 24-hour game statistics update window.
            </div>
          )}
        </div>
      </Card>

      {recentlyRecorded.length > 0 && (
        <Card>
          <SectionTitle>Saved During Open Window</SectionTitle>
          <div className="mt-4 grid gap-3">
            {recentlyRecorded.map((reservation) => (
              <RecordedStatsCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle>Recorded Game Statistics</SectionTitle>
          <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-extrabold text-slate-500">
            {recordedReservations.length} recorded
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {recordedReservations.length ? (
            recordedReservations.map((reservation) => (
              <RecordedStatsCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <div className="rounded-2xl border border-white/60 bg-white/55 p-5 text-sm text-slate-600">
              Recorded stats will appear here after the 24-hour update window closes.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
