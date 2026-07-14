export type ReservationStatus = "upcoming" | "past" | "cancelled";

export type MatchReport = {
  fluorescentTeam: string[];
  orangeTeam: string[];
  fluorescentScore: number;
  orangeScore: number;
  winner: "fluorescent" | "orange" | "draw";
  scorers: Record<string, number>;
  notes: string;
  submittedAt?: string;
};

export type Reservation = {
  id: string;
  date: string;
  time: string;
  venue: string;
  field: string;
  durationMinutes: number;
  sport: "Football";
  status: ReservationStatus;
  reservationOpenAt?: string;
  reservationStatus?: "closed" | "open" | "completed";
  notificationSentAt?: string;
  matchReport?: MatchReport;
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
  },
  {
    id: "res-2026-08-03",
    date: "2026-08-03",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-08-10",
    date: "2026-08-10",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-08-17",
    date: "2026-08-17",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-08-24",
    date: "2026-08-24",
    time: "20:00",
    venue: "LYCEE IBN ROCHD",
    field: "F6-10",
    durationMinutes: 60,
    sport: "Football",
    status: "upcoming"
  },
  {
    id: "res-2026-08-31",
    date: "2026-08-31",
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

export const getReservationStart = (reservation: Pick<Reservation, "date" | "time">) =>
  new Date(`${reservation.date}T${reservation.time || "00:00"}:00`);

export const getEffectiveReservationStatus = (reservation: Reservation, now = new Date()): ReservationStatus => {
  if (reservation.status === "cancelled") return "cancelled";
  return getReservationStart(reservation).getTime() < now.getTime() ? "past" : "upcoming";
};

export const getNextReservation = (reservations: Reservation[], now = new Date()) =>
  sortReservations(reservations).find((reservation) => getEffectiveReservationStatus(reservation, now) === "upcoming");

export const getUpcomingReservations = (reservations: Reservation[], now = new Date()) =>
  sortReservations(reservations).filter((reservation) => getEffectiveReservationStatus(reservation, now) === "upcoming");

export const getPastReservations = (reservations: Reservation[], now = new Date()) =>
  sortReservations(reservations)
    .filter((reservation) => getEffectiveReservationStatus(reservation, now) === "past")
    .reverse();

export const getReservationMapUrl = (reservation: Pick<Reservation, "venue">) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.venue)}`;
