import { getReservationStart, type Reservation } from "@/lib/reservations";

export const bookingCostAmount = -80;
export const bookingCurrencyLabel = "MAD/DH";
export const rabatTimeZone = "Africa/Casablanca";

export type SessionReservationStatus = "closed" | "open" | "completed";

function localDateAtHour(date: Date, hour: number) {
  const next = new Date(date);
  next.setHours(hour, 0, 0, 0);
  return next;
}

export function getReservationOpenAt(reservation: Pick<Reservation, "date">) {
  const gameDate = new Date(`${reservation.date}T00:00:00`);
  const openDate = new Date(gameDate);
  openDate.setDate(gameDate.getDate() - 1);
  return localDateAtHour(openDate, 11);
}

export function getReservationEndAt(reservation: Pick<Reservation, "date" | "time" | "durationMinutes">) {
  return new Date(getReservationStart(reservation).getTime() + reservation.durationMinutes * 60 * 1000);
}

export function getSessionReservationStatus(
  reservation: Pick<Reservation, "date" | "time" | "durationMinutes" | "reservationStatus">,
  now = new Date()
): SessionReservationStatus {
  if (getReservationEndAt(reservation).getTime() <= now.getTime()) return "completed";
  if (reservation.reservationStatus === "open") return "open";
  if (reservation.reservationStatus === "completed") return "completed";
  return getReservationOpenAt(reservation).getTime() <= now.getTime() ? "open" : "closed";
}

export function formatReservationOpenMessage(reservation: Pick<Reservation, "date">) {
  const openAt = getReservationOpenAt(reservation);
  const date = openAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return `Reservations open on ${date} at 11:00.`;
}
