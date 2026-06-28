"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, LogOut, MapPin, UserX } from "lucide-react";
import { players } from "@/lib/data";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";
import { cn } from "@/lib/utils";
import { ReservationMapLink } from "@/components/reservation-map-link";

export function NextMatchAttendance({ compact = false }: { compact?: boolean }) {
  const { reservations } = useReservations();
  const nextReservation = reservations.find((reservation) => reservation.status === "upcoming");
  const {
    selectedPlayer,
    setSelectedPlayer,
    currentStatus,
    selectedPosition,
    summary,
    confirmedPlayers,
    waitingPlayers,
    setStatus,
    dropOut
  } = useAttendance(nextReservation?.id);

  if (!nextReservation) {
    return (
      <div className="rounded-[20px] border border-white/15 bg-white/[.07] p-4 backdrop-blur-sm">
        <p className="text-xs font-black uppercase tracking-[.08em] text-white/70">Next Game</p>
        <p className="mt-4 text-sm text-orange-300">No reservation scheduled.</p>
        <Link href="/bookings" className="mt-4 flex h-11 items-center justify-center rounded-2xl bg-lime-300 font-black text-black">
          Add reservation
        </Link>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-[20px] border border-white/15 bg-white/[.07] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[.08em] text-white/70">Next Game</p>
        <span className="rounded-full bg-lime-300/15 px-3 py-1 text-[11px] font-black text-lime-300">Attendance</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/62">
        First 10 members who choose attending are confirmed. Later signups join the waiting list automatically. No response means not attending.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <CalendarDays className="h-7 w-7 text-white" />
        <div>
          <p className="text-sm text-white/72">{formatReservationDate(nextReservation.date)}</p>
          <p className="text-xl font-black text-lime-300">{nextReservation.time}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 text-sm text-white/82">
        <MapPin className="mt-1 h-6 w-6 text-white" />
        <ReservationMapLink reservation={nextReservation} className="font-bold text-white/82" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-black/10 p-2 text-center text-[11px]">
        <span><b className="block text-lg text-lime-300">{summary.playing}</b>Attending</span>
        <span><b className="block text-lg text-amber-300">{summary.waiting}</b>Waiting</span>
        <span><b className="block text-lg text-white">{summary.notAttending}</b>Not attending</span>
      </div>

      {!compact && (
        <label className="mt-4 block text-xs font-bold text-white/68">
          Member
          <select
            value={selectedPlayer}
            onChange={(event) => setSelectedPlayer(event.target.value)}
            className="mt-2 h-10 w-full rounded-2xl border border-white/15 bg-white/10 px-3 font-black text-white outline-none"
          >
            {players.map((player) => (
              <option key={player.name} value={player.name} className="bg-[#08110b]">
                {player.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={setStatus}
          className={cn(
            "grid min-h-12 place-items-center rounded-2xl border border-white/10 px-2 text-[11px] font-black transition",
            currentStatus === "playing" ? "bg-lime-300 text-black" : currentStatus === "waiting" ? "bg-amber-300 text-black" : "bg-white/[.06] text-white/78 hover:border-lime-300/45"
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          {summary.playing >= playingLimit && currentStatus !== "playing" ? "Join waitlist" : "Attending"}
        </button>
        <button
          onClick={dropOut}
          className="grid min-h-12 place-items-center rounded-2xl border border-white/10 bg-white/[.06] px-2 text-[11px] font-black text-white/78 transition hover:border-orange-300/55 hover:text-orange-200"
        >
          {currentStatus ? <LogOut className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
          {currentStatus ? "Drop out" : "Not attending"}
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[.05] p-3 text-xs text-white/72">
        {currentStatus === "playing" && <span><b className="text-lime-300">Confirmed</b> spot #{selectedPosition}. Use Drop out if something comes up.</span>}
        {currentStatus === "waiting" && <span><b className="text-amber-300">Waiting list</b> position #{selectedPosition}. You move up automatically if someone drops out.</span>}
        {!currentStatus && <span><b className="text-white">Not attending</b> by default until you choose attending.</span>}
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.08em] text-white/58">
            <CheckCircle2 className="h-4 w-4 text-lime-300" />
            Confirmed {summary.playing}/{playingLimit}
          </div>
          <div className="flex flex-wrap gap-2">
            {confirmedPlayers.length ? (
              confirmedPlayers.map((record, index) => (
                <span key={record.player} className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-200">
                  {index + 1}. {record.player}
                </span>
              ))
            ) : (
              <span className="text-xs text-white/45">No confirmed players yet.</span>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.08em] text-white/58">
            <Clock3 className="h-4 w-4 text-amber-300" />
            Waiting list
          </div>
          <div className="flex flex-wrap gap-2">
            {waitingPlayers.length ? (
              waitingPlayers.map((record, index) => (
                <span key={record.player} className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-black text-amber-200">
                  {index + 1}. {record.player}
                </span>
              ))
            ) : (
              <span className="text-xs text-white/45">Waiting list is empty.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
