"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, LogOut, MapPin, UserX } from "lucide-react";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { cn } from "@/lib/utils";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useLanguage } from "@/components/language-provider";
import { getReservationOpenAt } from "@/lib/workflow-rules";
import { type Language } from "@/lib/translations";

function formatOpenMessage(language: Language, reservationDate: string) {
  const locale = language === "ar" ? "ar-MA" : "fr-FR";
  const date = getReservationOpenAt({ date: reservationDate }).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (language === "fr") return `Ouverture le ${date} a 11:00.`;
  if (language === "ar") return `يفتح الحجز يوم ${date} على الساعة 11:00.`;
  return `Opens on ${date} at 11:00.`;
}

export function NextMatchAttendance({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const { profile } = useLocalProfile();
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const {
    selectedPlayer,
    setSelectedPlayer,
    currentStatus,
    selectedPosition,
    summary,
    confirmedPlayers,
    waitingPlayers,
    members,
    reservationStatus,
    canSubmitAttendance,
    attendanceMessage,
    saveError,
    setStatus,
    dropOut
  } = useAttendance(nextReservation?.id, nextReservation);
  const statusMessage =
    reservationStatus === "open"
      ? "Choose your status."
      : reservationStatus === "completed"
        ? "Closed"
        : formatOpenMessage(language, nextReservation?.date || "");

  if (!nextReservation) {
    return (
      <div className="glass-panel rounded-[20px] p-4 text-slate-950">
        <p className="text-xs font-extrabold uppercase tracking-[.08em] text-slate-600">Next Game</p>
        <p className="mt-4 text-sm text-orange-300">No reservation scheduled.</p>
        <Link href="/bookings" className="mt-4 flex h-11 items-center justify-center rounded-2xl bg-lime-300 font-black text-black">
          Add reservation
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel min-w-0 rounded-[20px] p-4 text-slate-950">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[.08em] text-[#238923]">Attendance</p>
        <span className={reservationStatus === "open" ? "rounded-full bg-lime-100 px-3 py-1 text-[11px] font-extrabold text-[#247e24]" : "rounded-full bg-white/65 px-3 py-1 text-[11px] font-extrabold text-slate-600"}>
          {reservationStatus === "open" ? "Open" : reservationStatus === "completed" ? "Closed" : "Locked"}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        {statusMessage || attendanceMessage}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <CalendarDays className="h-7 w-7 text-[#2f9e2f]" />
        <div>
          <p className="text-sm text-slate-600">{formatReservationDate(nextReservation.date)}</p>
          <p className="text-xl font-extrabold text-slate-900">{nextReservation.time}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 text-sm text-slate-700">
        <MapPin className="mt-1 h-6 w-6 text-[#2f9e2f]" />
        <ReservationMapLink reservation={nextReservation} className="font-extrabold text-slate-700" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/55 p-2 text-center text-[11px] text-slate-600">
        <span><b className="block text-lg text-[#2f9e2f]">{summary.playing}</b>Attending</span>
        <span><b className="block text-lg text-amber-300">{summary.waiting}</b>Waiting</span>
        <span><b className="block text-lg text-red-500">{summary.notAttending}</b>Out</span>
      </div>

      {!compact && (
        <label className="mt-4 block text-xs font-bold text-slate-600">
          Member
          <select
            value={selectedPlayer}
            onChange={(event) => setSelectedPlayer(event.target.value)}
            disabled={profile.loggedIn}
            className="mt-2 h-10 w-full rounded-2xl border border-white/60 bg-white/72 px-3 font-semibold text-slate-900 outline-none"
          >
            {members.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={setStatus}
          disabled={!canSubmitAttendance}
          className={cn(
            "grid min-h-12 place-items-center rounded-2xl border border-white/10 px-2 text-[11px] font-extrabold transition disabled:cursor-not-allowed disabled:opacity-55",
            currentStatus === "playing" ? "bg-[#49b848] text-white" : currentStatus === "waiting" ? "bg-amber-300 text-black" : "bg-white/60 text-slate-700 hover:border-lime-500/45"
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          {summary.playing >= playingLimit && currentStatus !== "playing" ? "Waitlist" : "Attending"}
        </button>
        <button
          onClick={dropOut}
          disabled={!canSubmitAttendance}
          className="grid min-h-12 place-items-center rounded-2xl border border-white/60 bg-white/68 px-2 text-[11px] font-extrabold text-slate-700 transition hover:border-orange-300/70 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {currentStatus ? <LogOut className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
          {currentStatus ? "Drop out" : "Out"}
        </button>
      </div>

      {saveError && (
        <p className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-xs font-bold text-orange-700">
          {saveError}
        </p>
      )}

      {(currentStatus || canSubmitAttendance) && <div className="mt-3 rounded-2xl border border-white/60 bg-white/55 p-3 text-xs text-slate-600">
        {currentStatus === "playing" && <span><b className="text-[#2f9e2f]">Confirmed</b> spot #{selectedPosition}. Use Drop out if something comes up.</span>}
        {currentStatus === "waiting" && <span><b className="text-amber-300">Waiting list</b> position #{selectedPosition}.</span>}
        {!currentStatus && canSubmitAttendance && <span><b className="text-slate-950">Not attending</b> by default until you choose attending.</span>}
      </div>}

      <div className="mt-4 grid gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-[#2f9e2f]" />
            Confirmed {summary.playing}/{playingLimit}
          </div>
          <div className="flex flex-wrap gap-2">
            {confirmedPlayers.length ? (
              confirmedPlayers.map((record, index) => (
                <span key={record.player} className="rounded-full bg-lime-100 px-3 py-1 text-xs font-extrabold text-[#247e24]">
                  {index + 1}. {record.player}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No confirmed players yet.</span>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-slate-500">
            <Clock3 className="h-4 w-4 text-amber-300" />
            Waiting list
          </div>
          <div className="flex flex-wrap gap-2">
            {waitingPlayers.length ? (
              waitingPlayers.map((record, index) => (
                <span key={record.player} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-700">
                  {index + 1}. {record.player}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Waiting list is empty.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
