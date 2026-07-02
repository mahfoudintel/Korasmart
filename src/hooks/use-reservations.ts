"use client";

import { useEffect, useState } from "react";
import { defaultReservations, sortReservations, type Reservation } from "@/lib/reservations";
import { recordBookingCost, reverseBookingCost } from "@/lib/finance-transactions";
import { getReservationOpenAt, getSessionReservationStatus } from "@/lib/workflow-rules";

const storageKey = "korasmart-reservations-v1";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(defaultReservations);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Reservation[];
      if (Array.isArray(parsed)) setReservations(sortReservations(parsed));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(sortReservations(reservations)));
  }, [reservations]);

  const upsertReservation = (reservation: Reservation) => {
    setReservations((current) => {
      const exists = current.some((item) => item.id === reservation.id);
      const normalizedReservation: Reservation = {
        ...reservation,
        reservationOpenAt: reservation.reservationOpenAt || getReservationOpenAt(reservation).toISOString(),
        reservationStatus: getSessionReservationStatus(reservation)
      };
      const next = exists
        ? current.map((item) => (item.id === reservation.id ? normalizedReservation : item))
        : [...current, normalizedReservation];

      if (!exists && normalizedReservation.status !== "cancelled") {
        recordBookingCost(normalizedReservation.id, `${normalizedReservation.venue} ${normalizedReservation.date} ${normalizedReservation.time}`);
      }
      if (normalizedReservation.status === "cancelled") {
        reverseBookingCost(normalizedReservation.id, "Booking cancelled");
      }

      return sortReservations(next);
    });
  };

  const removeReservation = (id: string) => {
    reverseBookingCost(id);
    setReservations((current) => current.filter((item) => item.id !== id));
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
