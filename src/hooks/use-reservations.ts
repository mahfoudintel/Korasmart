"use client";

import { useEffect, useState } from "react";
import { defaultReservations, sortReservations, type Reservation } from "@/lib/reservations";

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
      const next = exists
        ? current.map((item) => (item.id === reservation.id ? reservation : item))
        : [...current, reservation];

      return sortReservations(next);
    });
  };

  const removeReservation = (id: string) => {
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
