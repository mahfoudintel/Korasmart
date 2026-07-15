"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/use-attendance";
import { useMembers } from "@/hooks/use-members";
import { useReservations } from "@/hooks/use-reservations";
import { useLanguage } from "@/components/language-provider";
import { balanceTeams, derivePlayerPerformance } from "@/lib/player-performance";
import { ratingsStorageKey, type PeerRatings } from "@/lib/ratings";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

function TeamCard({ name, tone, players, total }: { name: string; tone: "lime" | "orange"; players: ReturnType<typeof balanceTeams>[number]["players"]; total: number }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn("h-11 w-11 rounded-xl", tone === "lime" ? "bg-lime-300" : "bg-orange-500")} />
          <SectionTitle>{name}</SectionTitle>
        </div>
        <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-slate-600">{total.toFixed(2)}</span>
      </div>

      <div className="mt-5 space-y-3">
        {players.map((player, index) => (
          <div key={player.player} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-2xl border border-white/60 bg-white/56 p-3">
            <span className={cn("grid h-8 w-8 place-items-center rounded-full text-sm font-black", tone === "lime" ? "bg-lime-100 text-[#247e24]" : "bg-orange-100 text-orange-700")}>{index + 1}</span>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-950">{player.player}</p>
              <p className="text-xs font-bold text-slate-500">{player.ratingScore ?? "rating pending"} rating · {player.goals} goals · {player.appearances} games</p>
            </div>
            <span className="text-lg font-black text-slate-950">{player.balanceScore}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TeamGeneratorWorkspace() {
  const { language } = useLanguage();
  const { members } = useMembers();
  const { reservations } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const attendance = useAttendance(nextReservation?.id, nextReservation);
  const [ratings, setRatings] = useState<PeerRatings>({});
  const t = (text: string) => translateText(text, language);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ratingsStorageKey);
      if (saved) setRatings(JSON.parse(saved) as PeerRatings);
    } catch {
      setRatings({});
    }
  }, []);

  const performance = useMemo(() => derivePlayerPerformance(members, reservations, ratings), [members, reservations, ratings]);
  const confirmedNames = attendance.confirmedPlayers.map((player) => player.player);
  const selectedNames = confirmedNames.length >= 2 ? confirmedNames : members.slice(0, 10).map((member) => member.name);
  const [teamA, teamB] = useMemo(() => balanceTeams(performance, selectedNames), [performance, selectedNames]);
  const difference = Math.abs(teamA.total - teamB.total);

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-white/25 bg-[#0d2132] p-5 text-white shadow-[0_24px_60px_rgba(2,20,28,.28)]">
        <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">{t("Balanced teams")}</p>
        <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t("Team Generator")}</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-white/65">
              <CalendarDays className="h-5 w-5 text-lime-300" />
              <span className="text-sm font-black">{t("Next Match")}</span>
            </div>
            <p className="mt-2 font-black">{nextReservation ? `${formatReservationDate(nextReservation.date)} · ${nextReservation.time}` : t("No upcoming matches scheduled.")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-white/65">
              <UsersRound className="h-5 w-5 text-lime-300" />
              <span className="text-sm font-black">{t("Selection pool")}</span>
            </div>
            <p className="mt-2 font-black">{selectedNames.length} {confirmedNames.length ? t("confirmed players") : t("players")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-white/65">
              <Scale className="h-5 w-5 text-lime-300" />
              <span className="text-sm font-black">{t("Balance gap")}</span>
            </div>
            <p className="mt-2 font-black">{difference.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <TeamCard name={t("Team A")} tone="lime" players={teamA.players} total={teamA.total} />
        <TeamCard name={t("Team B")} tone="orange" players={teamB.players} total={teamB.total} />
      </div>

      <Card>
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime-100 text-[#247e24]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <SectionTitle>{t("Data used")}</SectionTitle>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {t("Teams use attendance first, then anonymous peer ratings, recorded goals, appearances, wins, and result margin.")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
