"use client";

import { useEffect, useState } from "react";
import { defaultReservations, sortReservations, type Reservation } from "@/lib/reservations";
import { supabase } from "@/lib/supabase";

const storageKey = "korasmart-reservations-v1";

type BookingRow = {
  external_id: string | null;
  starts_at: string;
  venue: string | null;
  field_name: string;
  duration_minutes: number;
  sport: string;
  status: string;
};

const reservationToBooking = (reservation: Reservation) => ({
  external_id: reservation.id,
  starts_at: `${reservation.date}T${reservation.time}:00+01:00`,
  venue: reservation.venue,
  field_name: reservation.field,
  duration_minutes: reservation.durationMinutes,
  sport: reservation.sport,
  status: reservation.status,
  external_provider: "KoraSmart"
});

const bookingToReservation = (booking: BookingRow): Reservation => {
  const startsAt = new Date(booking.starts_at);

  return {
    id: booking.external_id || `booking-${booking.starts_at}`,
    date: startsAt.toISOString().slice(0, 10),
    time: startsAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Casablanca"
    }),
    venue: booking.venue || "",
    field: booking.field_name,
    durationMinutes: booking.duration_minutes,
    sport: "Football",
    status: booking.status === "past" || booking.status === "cancelled" ? booking.status : "upcoming"
  };
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(defaultReservations);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReservations() {
      if (supabase) {
        const { data, error } = await supabase
          .from("bookings")
          .select("external_id, starts_at, venue, field_name, duration_minutes, sport, status")
          .order("starts_at", { ascending: true });

        if (!cancelled && !error && data?.length) {
          const nextReservations = sortReservations(data.map((booking) => bookingToReservation(booking)));
          setReservations(nextReservations);
          setIsSupabaseReady(true);
          window.localStorage.setItem(storageKey, JSON.stringify(nextReservations));
          return;
        }
      }

      const saved = window.localStorage.getItem(storageKey);
      if (!saved || cancelled) return;

      try {
        const parsed = JSON.parse(saved) as Reservation[];
        if (Array.isArray(parsed)) setReservations(sortReservations(parsed));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(sortReservations(reservations)));
  }, [reservations]);

  const upsertReservation = async (reservation: Reservation) => {
    setReservations((current) => {
      const exists = current.some((item) => item.id === reservation.id);
      const next = exists
        ? current.map((item) => (item.id === reservation.id ? reservation : item))
        : [...current, reservation];

      return sortReservations(next);
    });

    if (!supabase || !isSupabaseReady) return;

    const booking = reservationToBooking(reservation);
    const { data } = await supabase
      .from("bookings")
      .select("id")
      .eq("external_id", reservation.id)
      .maybeSingle();

    if (data?.id) {
      await supabase.from("bookings").update(booking).eq("id", data.id);
    } else {
      await supabase.from("bookings").insert(booking);
    }
  };

  const removeReservation = async (id: string) => {
    setReservations((current) => current.filter((item) => item.id !== id));

    if (supabase && isSupabaseReady) {
      await supabase.from("bookings").delete().eq("external_id", id);
    }
  };

  const resetReservations = () => {
    window.localStorage.removeItem(storageKey);
    setReservations(defaultReservations);
  };

  return {
    reservations: sortReservations(reservations),
    upsertReservation,
    removeReservation,
    resetReservations
  };
}
