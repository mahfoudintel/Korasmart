"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { useLanguage } from "@/components/language-provider";
import { canEditBookings } from "@/lib/access";
import {
  formatReservationDate,
  getNextReservation,
  getPastReservations,
  getUpcomingReservations,
  type MatchReport,
  type Reservation,
  type ReservationStatus
} from "@/lib/reservations";
import { getReservationOpenAt } from "@/lib/workflow-rules";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

const rabatAnimationUrl = "https://rabatanimation.ma/";

const emptyReservation: Reservation = {
  id: "",
  date: new Date().toISOString().slice(0, 10),
  time: "20:00",
  venue: "LYCEE IBN ROCHD",
  field: "F6-10",
  durationMinutes: 60,
  sport: "Football",
  status: "upcoming"
};

function getTopScorers(report?: MatchReport) {
  if (!report) return [];
  const scorers = Object.entries(report.scorers).filter(([, goals]) => goals > 0);
  const maxGoals = Math.max(0, ...scorers.map(([, goals]) => goals));
  return scorers.filter(([, goals]) => goals === maxGoals).map(([player, goals]) => `${player} x${goals}`);
}

function formatOpenAt(date: string) {
  return getReservationOpenAt({ date }).toLocaleString("fr-FR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function MatchStatusPill({ reservation, isNext = false }: { reservation: Reservation; isNext?: boolean }) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);
  const { reservationStatus, summary } = useAttendance(reservation.id, reservation);
  const full = summary.playing >= playingLimit;

  const label =
    reservation.status === "cancelled"
      ? t("Cancelled")
      : reservationStatus === "completed"
        ? t("Completed")
        : full
          ? t("Full")
          : reservationStatus === "open"
            ? t("Registration open")
            : `${t("Opens")} ${formatOpenAt(reservation.date)}`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-black",
        isNext || reservationStatus === "open"
          ? "bg-lime-100 text-[#247e24]"
          : reservationStatus === "completed"
            ? "bg-slate-100 text-slate-600"
            : "bg-white/70 text-slate-600"
      )}
    >
      {label}
    </span>
  );
}

function AttendanceMini({ reservation }: { reservation: Reservation }) {
  const { summary } = useAttendance(reservation.id, reservation);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-700">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/65 px-3 py-1">
        <UsersRound className="h-4 w-4 text-[#247e24]" />
        {summary.playing}/{playingLimit}
      </span>
      {summary.waiting > 0 && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{summary.waiting} waiting</span>}
    </div>
  );
}

function NextMatchHero({ reservation }: { reservation?: Reservation }) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);
  const {
    summary,
    currentStatus,
    canSubmitAttendance,
    attendanceMessage,
    setStatus,
    dropOut,
    saveStatus
  } = useAttendance(reservation?.id, reservation);

  if (!reservation) {
    return (
      <Card className="min-h-[260px]">
        <SectionTitle>{t("Next Match")}</SectionTitle>
        <p className="mt-8 text-2xl font-black text-slate-950">{t("No upcoming matches scheduled.")}</p>
      </Card>
    );
  }

  return (
    <section className="rounded-[26px] border border-white/25 bg-[#0d2132] p-5 text-white shadow-[0_24px_60px_rgba(2,20,28,.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">{t("Next Match")}</p>
          <h2 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl">{formatReservationDate(reservation.date)}</h2>
          <div className="mt-5 grid gap-3 text-base font-black text-white/92 sm:grid-cols-2">
            <span className="inline-flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-lime-300" />
              {reservation.time}
            </span>
            <span className="inline-flex min-w-0 items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-lime-300" />
              <ReservationMapLink reservation={reservation} className="truncate text-white" />
            </span>
          </div>
        </div>
        <MatchStatusPill reservation={reservation} isNext />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="text-3xl font-black text-lime-300">{summary.playing}/{playingLimit}</p>
          <p className="mt-1 text-sm font-bold text-white/70">{t("Confirmed")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="text-3xl font-black text-amber-300">{summary.waiting}</p>
          <p className="mt-1 text-sm font-bold text-white/70">{t("Waiting")}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <p className="text-3xl font-black text-white">{summary.notAttending}</p>
          <p className="mt-1 text-sm font-bold text-white/70">{t("No response")}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {canSubmitAttendance && (
          <>
            <button
              onClick={setStatus}
              disabled={saveStatus === "saving" || currentStatus === "playing"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 font-black text-slate-950 transition hover:bg-lime-200 disabled:opacity-70"
            >
              <CheckCircle2 className="h-5 w-5" />
              {currentStatus === "playing" ? t("You are playing") : summary.playing >= playingLimit ? t("Join waiting list") : t("I'll play")}
            </button>
            <button
              onClick={dropOut}
              disabled={saveStatus === "saving" || !currentStatus}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 font-black text-white transition hover:bg-white/16 disabled:opacity-60"
            >
              {t("Can't make it")}
            </button>
          </>
        )}
        {!canSubmitAttendance && attendanceMessage && (
          <span className="inline-flex min-h-12 items-center rounded-2xl border border-white/12 bg-white/10 px-4 text-sm font-bold text-white/75">
            {attendanceMessage}
          </span>
        )}
        <Link href={`/matches/${reservation.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 font-black text-white transition hover:bg-white/16">
          {t("View Match")}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

function UpcomingRow({ reservation, isNext }: { reservation: Reservation; isNext?: boolean }) {
  return (
    <Link
      href={`/matches/${reservation.id}`}
      className={cn(
        "grid gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,.12)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center",
        isNext ? "border-lime-300 bg-lime-50/82" : "border-white/60 bg-white/56"
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-950">
          <span className="inline-flex items-center gap-2 text-lg font-black">
            <CalendarDays className="h-4 w-4 text-[#247e24]" />
            {formatReservationDate(reservation.date)}
          </span>
          <span className="inline-flex items-center gap-2 font-black">
            <Clock3 className="h-4 w-4 text-[#247e24]" />
            {reservation.time}
          </span>
        </div>
        <p className="mt-2 inline-flex min-w-0 items-center gap-2 text-sm font-black text-[#247e24]">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{reservation.venue}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <AttendanceMini reservation={reservation} />
        <MatchStatusPill reservation={reservation} />
        <ArrowRight className="h-5 w-5 text-slate-500" />
      </div>
    </Link>
  );
}

function PastRow({ reservation }: { reservation: Reservation }) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);
  const report = reservation.matchReport;
  const topScorers = getTopScorers(report);

  return (
    <Link href={`/matches/${reservation.id}`} className="grid gap-3 rounded-2xl border border-white/60 bg-white/56 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,.12)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-black text-slate-950">{formatReservationDate(reservation.date)}</span>
          <span className="text-sm font-bold text-slate-500">{reservation.time}</span>
        </div>
        {report ? (
          <div className="mt-2 space-y-1 text-sm font-bold text-slate-600">
            <p className="text-lg font-black text-slate-950">
              {t("Team A")} {report.fluorescentScore} - {report.orangeScore} {t("Team B")}
            </p>
            <p>{topScorers.length ? `${t("Top scorer")}: ${topScorers.join(", ")}` : t("Top scorer not recorded")}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm font-bold text-slate-500">{t("Stats not recorded")}</p>
        )}
      </div>
      <span className="inline-flex items-center justify-end gap-2 text-sm font-black text-[#247e24]">
        {t("Match Details")}
        <ArrowRight className="h-5 w-5" />
      </span>
    </Link>
  );
}

function SeasonTimeline({ reservations, nextId }: { reservations: Reservation[]; nextId?: string }) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);

  return (
    <Card>
      <SectionTitle>{t("Season timeline")}</SectionTitle>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {reservations.map((reservation, index) => {
          const isNext = reservation.id === nextId;
          const done = new Date(`${reservation.date}T${reservation.time}:00`).getTime() < Date.now();
          return (
            <Link
              key={reservation.id}
              href={`/matches/${reservation.id}`}
              className={cn(
                "min-w-[118px] rounded-2xl border px-3 py-3 text-center",
                isNext ? "border-lime-300 bg-lime-100 text-[#247e24]" : done ? "border-white/60 bg-white/48 text-slate-600" : "border-white/60 bg-white/58 text-slate-800"
              )}
            >
              <p className="text-xs font-black uppercase tracking-[.08em]">{t("Match")} {index + 1}</p>
              <p className="mt-1 text-sm font-black">{new Date(`${reservation.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function NewMatchModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);
  const { upsertReservation } = useReservations();
  const [draft, setDraft] = useState<Reservation>(emptyReservation);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const updateDraft = <Key extends keyof Reservation>(key: Key, value: Reservation[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = async () => {
    setSaveStatus("saving");
    setMessage("");
    const id = draft.id || `res-${draft.date}-${draft.time.replace(":", "")}`;
    const result = await upsertReservation({ ...draft, id });
    if (!result.ok) {
      setSaveStatus("error");
      setMessage(result.error || t("Booking could not be saved."));
      return;
    }
    setSaveStatus("saved");
    setMessage(t("Match saved."));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl rounded-[26px] border border-white/70 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,.28)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>{t("New Match")}</SectionTitle>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-600">
            {t("Date")}
            <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black text-slate-950 outline-none focus:border-lime-400" type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
          </label>
          <label className="text-sm font-bold text-slate-600">
            {t("Time")}
            <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black text-slate-950 outline-none focus:border-lime-400" type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
          </label>
          <label className="text-sm font-bold text-slate-600 sm:col-span-2">
            {t("Location")}
            <input className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black text-slate-950 outline-none focus:border-lime-400" value={draft.venue} onChange={(event) => updateDraft("venue", event.target.value)} />
          </label>
          <label className="text-sm font-bold text-slate-600">
            {t("Duration")}
            <select className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black text-slate-950 outline-none focus:border-lime-400" value={draft.durationMinutes} onChange={(event) => updateDraft("durationMinutes", Number(event.target.value))}>
              <option value={60}>60 min</option>
              <option value={75}>75 min</option>
              <option value={90}>90 min</option>
            </select>
          </label>
          <label className="text-sm font-bold text-slate-600">
            {t("Status")}
            <select className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black text-slate-950 outline-none focus:border-lime-400" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as ReservationStatus)}>
              <option value="upcoming">{t("Upcoming")}</option>
              <option value="past">{t("Past")}</option>
              <option value="cancelled">{t("Cancelled")}</option>
            </select>
          </label>
        </div>
        {message && <p className={cn("mt-4 rounded-2xl p-3 text-sm font-black", saveStatus === "error" ? "bg-orange-50 text-orange-700" : "bg-lime-50 text-[#247e24]")}>{message}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="h-12 rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700">{t("Cancel")}</button>
          <button onClick={saveDraft} disabled={saveStatus === "saving"} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#35b43a] px-6 font-black text-white disabled:opacity-60">
            <Save className="h-5 w-5" />
            {saveStatus === "saving" ? t("Saving...") : t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MatchesDashboard() {
  const { language } = useLanguage();
  const { role } = useRole();
  const canEdit = canEditBookings(role);
  const { reservations } = useReservations();
  const [modalOpen, setModalOpen] = useState(false);
  const t = (text: string) => translateText(text, language);

  const sorted = useMemo(() => [...reservations].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [reservations]);
  const nextReservation = useMemo(() => getNextReservation(reservations), [reservations]);
  const upcoming = useMemo(() => getUpcomingReservations(reservations), [reservations]);
  const scheduledAfterNext = upcoming.filter((reservation) => reservation.id !== nextReservation?.id);
  const past = useMemo(() => getPastReservations(reservations), [reservations]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.18em] text-[#247e24]">{t("Season 2026")}</p>
          <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950">{t("Matches")}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={rabatAnimationUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#102033] px-4 font-black text-white">
            {t("Reserve field")}
            <ExternalLink className="h-4 w-4" />
          </a>
          {canEdit && (
            <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-4 font-black text-slate-950">
              <Plus className="h-4 w-4" />
              {t("New Match")}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,.75fr)]">
        <div className="space-y-5">
          <NextMatchHero reservation={nextReservation} />
          <SeasonTimeline reservations={sorted} nextId={nextReservation?.id} />
        </div>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Scheduled Games")}</SectionTitle>
            <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-[#247e24]">{scheduledAfterNext.length} {t("upcoming")}</span>
          </div>
          <div className="mt-4 space-y-3">
            {scheduledAfterNext.length ? scheduledAfterNext.map((reservation) => <UpcomingRow key={reservation.id} reservation={reservation} />) : <p className="rounded-2xl bg-white/55 p-4 text-sm font-bold text-slate-600">{t("No other scheduled games.")}</p>}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle>{t("Past Games")}</SectionTitle>
          <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-slate-500">{past.length} {t("past")}</span>
        </div>
        <div className="mt-4 grid gap-3">
          {past.length ? past.map((reservation) => <PastRow key={reservation.id} reservation={reservation} />) : <p className="rounded-2xl bg-white/55 p-4 text-sm font-bold text-slate-600">{t("No past games yet.")}</p>}
        </div>
      </Card>

      {canEdit && (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime-100 text-[#247e24]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <SectionTitle>{t("Admin actions")}</SectionTitle>
                <p className="mt-1 text-sm font-bold text-slate-600">{t("Use New Match for schedule updates. Full reservation tools stay in Admin.")}</p>
              </div>
            </div>
            <button onClick={() => setModalOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white">
              <Plus className="h-4 w-4" />
              {t("New Match")}
            </button>
          </div>
        </Card>
      )}

      {modalOpen && <NewMatchModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
