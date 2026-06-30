"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { canEditBookings } from "@/lib/access";
import {
  formatReservationDate,
  getEffectiveReservationStatus,
  getNextReservation,
  getPastReservations,
  type MatchReport,
  type Reservation,
  type ReservationStatus
} from "@/lib/reservations";
import { ReservationMapLink } from "@/components/reservation-map-link";

const emptyMatchReport: MatchReport = {
  fluorescentTeam: "",
  orangeTeam: "",
  fluorescentScore: 0,
  orangeScore: 0,
  winner: "draw",
  scorers: "",
  notes: ""
};

const emptyReservation: Reservation = {
  id: "",
  date: "2026-07-27",
  time: "20:00",
  venue: "LYCEE IBN ROCHD",
  field: "F6-10",
  durationMinutes: 60,
  sport: "Football",
  status: "upcoming"
};

export function ReservationAdmin() {
  const { role } = useRole();
  const canEdit = canEditBookings(role);
  const { reservations, upsertReservation, removeReservation, resetReservations } = useReservations();
  const [draft, setDraft] = useState<Reservation>(emptyReservation);

  const nextReservation = useMemo(() => getNextReservation(reservations), [reservations]);
  const pastReservations = useMemo(() => getPastReservations(reservations), [reservations]);

  const updateDraft = <Key extends keyof Reservation>(key: Key, value: Reservation[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => {
    const id = draft.id || `res-${draft.date}-${draft.time.replace(":", "")}`;
    upsertReservation({ ...draft, id });
    setDraft({ ...emptyReservation, date: draft.date, time: draft.time, venue: draft.venue, field: draft.field });
  };

  const updateMatchReport = <Key extends keyof MatchReport>(reservation: Reservation, key: Key, value: MatchReport[Key]) => {
    upsertReservation({
      ...reservation,
      status: "past",
      matchReport: {
        ...emptyMatchReport,
        ...(reservation.matchReport || {}),
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          <SectionTitle>Reservation Admin</SectionTitle>
          <p className="mt-2 text-sm text-white/65">
            {canEdit
              ? "Add or update bookings here. Calendar uses this same list and changes are saved locally until Supabase is connected."
              : "Read-only view. Booking or admin access is required to change reservations."}
          </p>

          {canEdit && <div className="mt-5 grid gap-3">
            <label className="text-sm font-bold text-white/70">
              Date
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-white/70">
              Time
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-white/70">
              Venue
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" value={draft.venue} onChange={(event) => updateDraft("venue", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-white/70">
              Field
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" value={draft.field} onChange={(event) => updateDraft("field", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-white/70">
              Duration
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" type="number" min="30" step="15" value={draft.durationMinutes} onChange={(event) => updateDraft("durationMinutes", Number(event.target.value))} />
            </label>
            <label className="text-sm font-bold text-white/70">
              Status
              <select className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as ReservationStatus)}>
                <option className="bg-[#08110b]" value="upcoming">Upcoming</option>
                <option className="bg-[#08110b]" value="past">Past</option>
                <option className="bg-[#08110b]" value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>}

          {canEdit && <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={saveDraft} className="inline-flex h-11 items-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black transition hover:bg-lime-200">
              <Save className="h-4 w-4" />
              Save reservation
            </button>
            <button onClick={resetReservations} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 font-black text-white/82 transition hover:border-orange-400 hover:text-orange-300">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>}
        </Card>

        <div className="space-y-5">
          <Card>
            <SectionTitle>Next Reservation</SectionTitle>
            {nextReservation ? (
              <div className="mt-5 rounded-2xl bg-lime-300/10 p-5">
                <p className="text-2xl font-black text-white">{formatReservationDate(nextReservation.date)} - {nextReservation.time}</p>
                <ReservationMapLink reservation={nextReservation} className="mt-2 font-black" />
                <p className="mt-1 text-sm text-white/65">{nextReservation.durationMinutes} min - {nextReservation.sport}</p>
              </div>
            ) : (
              <p className="mt-5 text-orange-300">No upcoming reservations.</p>
            )}
          </Card>

          <Card>
            <SectionTitle>All Reservations</SectionTitle>
            <div className="mt-5 space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div className={canEdit ? "cursor-pointer text-left" : "text-left"} onClick={() => canEdit && setDraft(reservation)}>
                    <p className="font-black">{formatReservationDate(reservation.date)} - {reservation.time}</p>
                    <p className="text-sm text-white/65"><ReservationMapLink reservation={reservation} className="font-bold" /> · {reservation.durationMinutes} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-300">{getEffectiveReservationStatus(reservation)}</span>
                    {canEdit && (
                      <button onClick={() => removeReservation(reservation.id)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-orange-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionTitle>Past Games</SectionTitle>
            <p className="mt-2 text-sm text-white/65">Finished reservations move here automatically after their date and time pass. Update team compositions, score, winner, scorers, and notes.</p>
          </div>
          <span className="rounded-full bg-white/[.07] px-3 py-1 text-xs font-black text-white/65">
            {pastReservations.length} games
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {pastReservations.length ? (
            pastReservations.map((reservation) => {
              const report = { ...emptyMatchReport, ...(reservation.matchReport || {}) };

              return (
                <div key={reservation.id} className="rounded-[20px] border border-white/10 bg-white/[.05] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-black text-white">{formatReservationDate(reservation.date)} - {reservation.time}</p>
                      <p className="mt-1 text-sm text-white/65"><ReservationMapLink reservation={reservation} className="font-bold" /> · {reservation.durationMinutes} min</p>
                    </div>
                    <span className="rounded-full bg-orange-300/15 px-3 py-1 text-xs font-black text-orange-200">Past game</span>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <label className="text-sm font-bold text-white/70">
                      Fluorescent team composition
                      <textarea
                        disabled={!canEdit}
                        rows={3}
                        value={report.fluorescentTeam}
                        onChange={(event) => updateMatchReport(reservation, "fluorescentTeam", event.target.value)}
                        placeholder="Najib, Ahmed A, Ahmed G..."
                        className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                    <label className="text-sm font-bold text-white/70">
                      Orange team composition
                      <textarea
                        disabled={!canEdit}
                        rows={3}
                        value={report.orangeTeam}
                        onChange={(event) => updateMatchReport(reservation, "orangeTeam", event.target.value)}
                        placeholder="Bobker, Abdelhamid, Ismail..."
                        className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="text-sm font-bold text-white/70">
                      Fluorescent score
                      <input
                        disabled={!canEdit}
                        type="number"
                        min="0"
                        value={report.fluorescentScore}
                        onChange={(event) => updateMatchReport(reservation, "fluorescentScore", Number(event.target.value))}
                        className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                    <label className="text-sm font-bold text-white/70">
                      Orange score
                      <input
                        disabled={!canEdit}
                        type="number"
                        min="0"
                        value={report.orangeScore}
                        onChange={(event) => updateMatchReport(reservation, "orangeScore", Number(event.target.value))}
                        className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-center font-black text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                    <label className="text-sm font-bold text-white/70">
                      Winning team
                      <select
                        disabled={!canEdit}
                        value={report.winner}
                        onChange={(event) => updateMatchReport(reservation, "winner", event.target.value as MatchReport["winner"])}
                        className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      >
                        <option className="bg-[#08110b]" value="draw">Draw</option>
                        <option className="bg-[#08110b]" value="fluorescent">Fluorescent</option>
                        <option className="bg-[#08110b]" value="orange">Orange</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                    <label className="text-sm font-bold text-white/70">
                      Scorers
                      <input
                        disabled={!canEdit}
                        value={report.scorers}
                        onChange={(event) => updateMatchReport(reservation, "scorers", event.target.value)}
                        placeholder="Najib 2, Badr 1, Ismail 1..."
                        className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                    <label className="text-sm font-bold text-white/70">
                      Notes
                      <input
                        disabled={!canEdit}
                        value={report.notes}
                        onChange={(event) => updateMatchReport(reservation, "notes", event.target.value)}
                        placeholder="Injuries, comments, special events..."
                        className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300 disabled:opacity-60"
                      />
                    </label>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/[.05] p-5 text-sm text-white/60">No past games yet.</p>
          )}
        </div>
      </Card>

      {canEdit && <button
        onClick={() => {
          const last = reservations.at(-1);
          const baseDate = last ? new Date(`${last.date}T00:00:00`) : new Date("2026-07-27T00:00:00");
          baseDate.setDate(baseDate.getDate() + 7);
          const date = baseDate.toISOString().slice(0, 10);
          upsertReservation({ ...emptyReservation, id: `res-${date}`, date });
        }}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-lime-300/40 px-5 font-black text-lime-300 transition hover:bg-lime-300 hover:text-black"
      >
        <Plus className="h-4 w-4" />
        Add next Monday
      </button>}
    </div>
  );
}

