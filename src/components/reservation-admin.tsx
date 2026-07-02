"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { canEditBookings } from "@/lib/access";
import {
  formatReservationDate,
  getNextReservation,
  getPastReservations,
  getUpcomingReservations,
  type Reservation,
  type ReservationStatus
} from "@/lib/reservations";
import { ReservationMapLink } from "@/components/reservation-map-link";

const emptyReservation: Reservation = {
  id: "",
  date: "2026-07-27",
  time: "20:00",
  venue: "LYCEE IBN ROCHD",
  field: "",
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
  const upcomingReservations = useMemo(() => getUpcomingReservations(reservations), [reservations]);
  const pastReservations = useMemo(() => getPastReservations(reservations), [reservations]);

  const updateDraft = <Key extends keyof Reservation>(key: Key, value: Reservation[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => {
    const id = draft.id || `res-${draft.date}-${draft.time.replace(":", "")}`;
    upsertReservation({ ...draft, id });
    setDraft({ ...emptyReservation, date: draft.date, time: draft.time, venue: draft.venue });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionTitle>Upcoming Schedule</SectionTitle>
                <p className="mt-2 text-sm leading-6 text-slate-600">Next games with only what members need: date, time, and location.</p>
              </div>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-extrabold text-[#247e24]">
                {upcomingReservations.length} upcoming
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {upcomingReservations.length ? (
                upcomingReservations.map((reservation, index) => (
                  <div key={reservation.id} className={index === 0 ? "grid gap-3 rounded-2xl border border-lime-200 bg-lime-50/80 p-4 shadow-[0_14px_32px_rgba(47,158,47,.12)] md:grid-cols-[1fr_auto] md:items-center" : "grid gap-3 rounded-2xl border border-white/60 bg-white/68 p-4 md:grid-cols-[1fr_auto] md:items-center"}>
                    <div className={canEdit ? "cursor-pointer text-left" : "text-left"} onClick={() => canEdit && setDraft(reservation)}>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className={index === 0 ? "inline-flex items-center gap-2 text-lg font-extrabold text-slate-900" : "inline-flex items-center gap-2 font-extrabold text-slate-900"}>
                          <CalendarDays className="h-4 w-4 text-[#2f9e2f]" />
                          {formatReservationDate(reservation.date)}
                        </span>
                        <span className={index === 0 ? "inline-flex items-center gap-2 text-lg font-extrabold text-slate-900" : "inline-flex items-center gap-2 font-extrabold text-slate-900"}>
                          <Clock3 className="h-4 w-4 text-[#2f9e2f]" />
                          {reservation.time}
                        </span>
                      </div>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#247e24]">
                        <MapPin className="h-4 w-4" />
                        <ReservationMapLink reservation={reservation} className="font-semibold text-[#247e24]" />
                      </p>
                    </div>
                    {index === 0 && <span className="rounded-full bg-[#3dad3d] px-3 py-1 text-xs font-extrabold text-white">next</span>}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-orange-700">No upcoming reservations.</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>Past Games</SectionTitle>
              <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-extrabold text-slate-500">
                {pastReservations.length} past
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {pastReservations.length ? (
                pastReservations.map((reservation) => (
                  <div key={reservation.id} className="grid gap-2 rounded-2xl border border-white/55 bg-white/42 p-3 opacity-80 md:grid-cols-[1fr_auto] md:items-center">
                    <div className={canEdit ? "cursor-pointer text-left" : "text-left"} onClick={() => canEdit && setDraft(reservation)}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-700">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                          {formatReservationDate(reservation.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-700">
                          <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                          {reservation.time}
                        </span>
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <ReservationMapLink reservation={reservation} className="font-semibold text-slate-500" />
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No past games yet.</p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Next Reservation</SectionTitle>
            {nextReservation ? (
              <div className="mt-5 rounded-2xl border border-white/60 bg-lime-50/70 p-5">
                <div className="flex flex-wrap items-center gap-4 text-slate-900">
                  <span className="inline-flex items-center gap-2 text-xl font-extrabold">
                    <CalendarDays className="h-5 w-5 text-[#2f9e2f]" />
                    {formatReservationDate(nextReservation.date)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xl font-extrabold">
                    <Clock3 className="h-5 w-5 text-[#2f9e2f]" />
                    {nextReservation.time}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-extrabold text-[#247e24]">
                  <MapPin className="h-4 w-4" />
                  <ReservationMapLink reservation={nextReservation} className="text-[#247e24]" />
                </div>
              </div>
            ) : (
              <p className="mt-5 text-orange-600">No upcoming reservations.</p>
            )}
          </Card>
        </div>

        <Card>
          <SectionTitle>Reservation</SectionTitle>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {canEdit
              ? "Add or update a booking with only the essentials: date, time, location, duration, and status."
              : "Read-only view. Booking or admin access is required to change reservations."}
          </p>

          {canEdit && <div className="mt-5 grid gap-3">
            <label className="text-sm font-semibold text-slate-600">
              Date
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/72 px-4 font-semibold text-slate-900 outline-none focus:border-lime-400" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Time
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/72 px-4 font-semibold text-slate-900 outline-none focus:border-lime-400" type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Location
              <input className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/72 px-4 font-semibold text-slate-900 outline-none focus:border-lime-400" value={draft.venue} onChange={(event) => updateDraft("venue", event.target.value)} />
            </label>
            <div>
              <p className="text-sm font-semibold text-slate-600">Duration</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[60, 75, 90].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => updateDraft("durationMinutes", minutes)}
                    className={draft.durationMinutes === minutes ? "h-11 rounded-2xl bg-[#3dad3d] text-sm font-extrabold text-white" : "h-11 rounded-2xl border border-white/70 bg-white/68 text-sm font-extrabold text-slate-600"}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>
            <label className="text-sm font-semibold text-slate-600">
              Status
              <select className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/72 px-4 font-semibold text-slate-900 outline-none focus:border-lime-400" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as ReservationStatus)}>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>}

          {canEdit && <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={saveDraft} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#3dad3d] px-5 font-extrabold text-white transition hover:bg-[#319c31]">
              <Save className="h-4 w-4" />
              Save
            </button>
            <button onClick={resetReservations} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-5 font-extrabold text-orange-700 transition hover:bg-orange-100">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            {draft.id && (
              <button
                onClick={() => {
                  removeReservation(draft.id);
                  setDraft(emptyReservation);
                }}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-orange-200 bg-white/70 px-5 font-extrabold text-orange-700 transition hover:bg-orange-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete selected
              </button>
            )}
          </div>}
        </Card>
      </div>

      {canEdit && <button
        onClick={() => {
          const last = reservations.at(-1);
          const baseDate = last ? new Date(`${last.date}T00:00:00`) : new Date("2026-07-27T00:00:00");
          baseDate.setDate(baseDate.getDate() + 7);
          const date = baseDate.toISOString().slice(0, 10);
          upsertReservation({ ...emptyReservation, id: `res-${date}`, date });
        }}
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-lime-200 bg-lime-50 px-5 font-extrabold text-[#247e24] transition hover:bg-lime-100"
      >
        <Plus className="h-4 w-4" />
        Add next Monday
      </button>}
    </div>
  );
}

