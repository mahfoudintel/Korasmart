"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { canEditBookings } from "@/lib/access";
import { formatReservationDate, type Reservation, type ReservationStatus } from "@/lib/reservations";
import { ReservationMapLink } from "@/components/reservation-map-link";

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
  const { roles } = useRole();
  const canEdit = canEditBookings(roles);
  const { reservations, upsertReservation, removeReservation, resetReservations } = useReservations();
  const [draft, setDraft] = useState<Reservation>(emptyReservation);

  const nextReservation = useMemo(
    () => reservations.find((reservation) => reservation.status === "upcoming"),
    [reservations]
  );

  const updateDraft = <Key extends keyof Reservation>(key: Key, value: Reservation[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => {
    const id = draft.id || `res-${draft.date}-${draft.time.replace(":", "")}`;
    upsertReservation({ ...draft, id });
    setDraft({ ...emptyReservation, date: draft.date, time: draft.time, venue: draft.venue, field: draft.field });
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
                    <span className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-300">{reservation.status}</span>
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

