"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate, getNextReservation, getUpcomingReservations } from "@/lib/reservations";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";

export function NextReservationTopCard() {
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);

  return (
    <Card className="glass-line min-h-[118px]">
      <div className="relative flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-300/25 text-lime-300">
          <CalendarCheck className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-white/80">Next Game</p>
          <p className="mt-2 text-xl font-black text-white">{nextReservation ? nextReservation.time : "--:--"}</p>
          <p className="mt-1 text-sm text-white/70">{nextReservation ? formatReservationDate(nextReservation.date) : "No reservation"}</p>
          {nextReservation && <ReservationMapLink reservation={nextReservation} compact className="mt-1 text-sm font-bold" />}
        </div>
      </div>
    </Card>
  );
}

export function UpcomingReservationsCard() {
  const { reservations } = useReservations();
  const upcoming = getUpcomingReservations(reservations).slice(0, 3);

  return (
    <Card>
      <SectionTitle>Upcoming Games</SectionTitle>
      <div className="mt-4 space-y-3">
        {upcoming.map((reservation, index) => (
          <div key={reservation.id} className={`flex items-center justify-between rounded-2xl border border-white/8 p-4 ${index === 0 ? "bg-lime-300/12 text-lime-200" : "bg-white/4"}`}>
            <div>
              <p className="font-black">{formatReservationDate(reservation.date)}</p>
              <p className="text-sm text-white/72">{reservation.time}</p>
            </div>
            <div className="text-right text-sm">
              <ReservationMapLink reservation={reservation} compact className="justify-end font-black" />
              <p className="text-white/66">{reservation.venue}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-lime-300" />
          </div>
        ))}
      </div>
      <Link href="/calendar" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-black text-lime-300">
        View full calendar <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

