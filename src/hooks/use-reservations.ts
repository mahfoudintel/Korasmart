"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { defaultReservations, sortReservations, type Reservation } from "@/lib/reservations";
import { recordBookingCost, reverseBookingCost } from "@/lib/finance-transactions";
import { supabase } from "@/lib/supabase";
import { bookingCostAmount, getReservationOpenAt, getSessionReservationStatus } from "@/lib/workflow-rules";

const storageKey = "korasmart-reservations-v1";

export function useReservations() {
  const { session } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>(defaultReservations);
  const remoteEnabled = Boolean(supabase && session);

  const mapBookingToReservation = (booking: {
    external_id: string | null;
    starts_at: string;
    venue: string | null;
    field_name: string | null;
    duration_minutes: number | null;
    sport: string | null;
    status: string | null;
    reservation_status: string | null;
    reservation_open_at: string | null;
    notification_sent_at: string | null;
    match_report?: unknown;
  }): Reservation => {
    const startsAt = new Date(booking.starts_at);
    const date = startsAt.toLocaleDateString("en-CA", { timeZone: "Africa/Casablanca" });
    const time = startsAt.toLocaleTimeString("fr-FR", {
      timeZone: "Africa/Casablanca",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    return {
      id: booking.external_id || booking.starts_at,
      date,
      time,
      venue: booking.venue || "LYCEE IBN ROCHD",
      field: booking.field_name || "",
      durationMinutes: Number(booking.duration_minutes || 60),
      sport: "Football",
      status: booking.status === "past" || booking.status === "cancelled" ? booking.status : "upcoming",
      reservationOpenAt: booking.reservation_open_at || undefined,
      reservationStatus:
        booking.reservation_status === "open" || booking.reservation_status === "completed" ? booking.reservation_status : "closed",
      notificationSentAt: booking.notification_sent_at || undefined,
      matchReport: typeof booking.match_report === "object" && booking.match_report ? (booking.match_report as Reservation["matchReport"]) : undefined
    };
  };

  useEffect(() => {
    if (remoteEnabled) return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Reservation[];
      if (Array.isArray(parsed)) setReservations(sortReservations(parsed));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [remoteEnabled]);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteReservations() {
      if (!supabase || !session) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("external_id, starts_at, venue, field_name, duration_minutes, sport, status, reservation_status, reservation_open_at, notification_sent_at, match_report")
        .order("starts_at", { ascending: true });

      if (!cancelled && !error && data) {
        setReservations(sortReservations(data.map(mapBookingToReservation)));
      }
    }

    loadRemoteReservations();

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (remoteEnabled) return;
    window.localStorage.setItem(storageKey, JSON.stringify(sortReservations(reservations)));
  }, [remoteEnabled, reservations]);

  const upsertReservation = async (reservation: Reservation): Promise<{ ok: boolean; error?: string }> => {
    const existsBeforeSave = reservations.some((item) => item.id === reservation.id);
    const normalizedReservation: Reservation = {
      ...reservation,
      reservationOpenAt: reservation.reservationOpenAt || getReservationOpenAt(reservation).toISOString(),
      reservationStatus: getSessionReservationStatus(reservation)
    };

    if (supabase && session) {
      const payload = {
        external_id: normalizedReservation.id,
        starts_at: `${normalizedReservation.date}T${normalizedReservation.time}:00+01:00`,
        venue: normalizedReservation.venue,
        field_name: normalizedReservation.field,
        duration_minutes: normalizedReservation.durationMinutes,
        sport: normalizedReservation.sport,
        status: normalizedReservation.status,
        reservation_status: normalizedReservation.reservationStatus || "closed",
        reservation_open_at: normalizedReservation.reservationOpenAt || null,
        notification_sent_at: normalizedReservation.notificationSentAt || null,
        match_report: normalizedReservation.matchReport || null
      };

      const { data: updatedBooking, error: updateError } = await supabase
        .from("bookings")
        .update(payload)
        .eq("external_id", normalizedReservation.id)
        .select("id")
        .limit(1);

      if (updateError) return { ok: false, error: updateError.message || "Booking could not be updated." };

      const insertResult = updatedBooking?.[0]
        ? { data: updatedBooking[0], error: null }
        : await supabase.from("bookings").insert(payload).select("id").maybeSingle();

      if (insertResult.error) return { ok: false, error: insertResult.error.message || "Booking could not be saved." };

      const savedBooking = insertResult.data;

      setReservations((current) => {
        const exists = current.some((item) => item.id === normalizedReservation.id);
        const next = exists
          ? current.map((item) => (item.id === normalizedReservation.id ? normalizedReservation : item))
          : [...current, normalizedReservation];

        return sortReservations(next);
      });

      if (savedBooking?.id && !existsBeforeSave && normalizedReservation.status !== "cancelled") {
        const { data: existingCost } = await supabase
          .from("finance_transactions")
          .select("id")
          .eq("booking_id", savedBooking.id)
          .eq("type", "booking_cost")
          .maybeSingle();

        if (!existingCost) {
          await supabase.from("finance_transactions").insert({
            type: "booking_cost",
            amount: bookingCostAmount,
            booking_id: savedBooking.id,
            note: `Booking cost: ${normalizedReservation.venue} ${normalizedReservation.date} ${normalizedReservation.time}`
          });
        }
      }

      return { ok: true };
    }

    setReservations((current) => {
      const exists = current.some((item) => item.id === normalizedReservation.id);
      const next = exists
        ? current.map((item) => (item.id === reservation.id ? normalizedReservation : item))
        : [...current, normalizedReservation];

      if (!remoteEnabled && !exists && normalizedReservation.status !== "cancelled") {
        recordBookingCost(normalizedReservation.id, `${normalizedReservation.venue} ${normalizedReservation.date} ${normalizedReservation.time}`);
      }
      if (!remoteEnabled && normalizedReservation.status === "cancelled") {
        reverseBookingCost(normalizedReservation.id, "Booking cancelled");
      }

      return sortReservations(next);
    });

    return { ok: true };
  };

  const removeReservation = async (id: string) => {
    if (!remoteEnabled) reverseBookingCost(id);
    setReservations((current) => current.filter((item) => item.id !== id));
    if (supabase && session) await supabase.from("bookings").delete().eq("external_id", id);
  };

  const resetReservations = () => {
    if (remoteEnabled) return;
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
