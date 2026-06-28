export type ReservationStatus = "upcoming" | "past" | "cancelled";

export type Reservation = {
  id: string;
  date: string;
  time: string;
  venue: string;
  field: string;
  durationMinutes: number;
  sport: "Football";
  status: ReservationStatus;
};

export const defaultReservations: Reservation[] = [
  {
    id: "res-2026-06-29",
    date: "2026-06-29",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-07-06",
    date: "2026-07-06",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-07-13",
    date: "2026-07-13",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-07-20",
    date: "2026-07-20",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-07-27",
    date: "2026-07-27",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  }
];

export const formatReservationDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

export const sortReservations = (reservations: Reservation[]) =>
  [...reservations].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

export const getReservationMapUrl = (reservation: Pick<Reservation, "venue" | "field">) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${reservation.venue} ${reservation.field}`)}`;
