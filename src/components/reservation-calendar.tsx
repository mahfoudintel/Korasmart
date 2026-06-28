"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";
import { ReservationMapLink } from "@/components/reservation-map-link";

export function ReservationCalendar() {
  const { reservations } = useReservations();
  const upcoming = reservations.filter((reservation) => reservation.status === "upcoming");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_.75fr]">
        <Card>
          <SectionTitle>Reserved Slots</SectionTitle>
          <div className="mt-5 space-y-3">
            {upcoming.map((reservation) => (
              <div key={reservation.id} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[.07] p-4 md:grid-cols-[170px_1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-black uppercase text-lime-300">{formatReservationDate(reservation.date)}</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-white">
                    <Clock className="h-5 w-5 text-white/70" />
                    {reservation.time}
                  </p>
                </div>
                <div>
                  <ReservationMapLink reservation={reservation} className="text-xl font-black" />
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/62">
                    <MapPin className="h-4 w-4" />
                    {reservation.sport} - {reservation.durationMinutes} min
                  </p>
                </div>
                <span className="rounded-full bg-lime-300/15 px-4 py-2 text-sm font-black text-lime-300">Reserved</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CalendarDays className="h-9 w-9 text-lime-300" />
          <p className="mt-5 text-sm font-black uppercase text-white/60">Reservation Summary</p>
          <p className="mt-3 text-5xl font-black text-white">{upcoming.length}</p>
          <p className="mt-2 text-white/65">upcoming weekly reservations</p>
          <div className="mt-6 rounded-2xl bg-lime-300/10 p-4">
            <p className="text-sm text-white/65">Next reservation</p>
            {upcoming[0] ? (
              <p className="mt-1 text-xl font-black text-lime-300">{formatReservationDate(upcoming[0].date)} - {upcoming[0].time}</p>
            ) : (
              <p className="mt-1 text-xl font-black text-orange-400">No reservation</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

