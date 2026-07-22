"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Save, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/use-attendance";
import { useMembers } from "@/hooks/use-members";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { useLanguage } from "@/components/language-provider";
import { canEditBookings } from "@/lib/access";
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
  const { role } = useRole();
  const { members } = useMembers();
  const { reservations, upsertReservation } = useReservations();
  const nextReservation = getNextReservation(reservations);
  const attendance = useAttendance(nextReservation?.id, nextReservation);
  const [ratings, setRatings] = useState<PeerRatings>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const t = (text: string) => translateText(text, language);
  const canSaveTeams = canEditBookings(role);

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
  const selectedPerformance = performance.filter((player) => selectedNames.includes(player.player));
  const ratedSelectedCount = selectedPerformance.filter((player) => player.ratingScore !== null).length;
  const readinessPercent = selectedNames.length ? Math.round((ratedSelectedCount / selectedNames.length) * 100) : 0;
  const readyForBalance = readinessPercent >= 70 || selectedNames.length <= 2;
  const teamAPlayers = teamA.players.map((player) => player.player);
  const teamBPlayers = teamB.players.map((player) => player.player);
  const hasSavedTeams =
    Boolean(nextReservation?.matchReport?.fluorescentTeam?.length || nextReservation?.matchReport?.orangeTeam?.length) &&
    nextReservation?.matchReport?.fluorescentTeam.join("|") === teamAPlayers.join("|") &&
    nextReservation?.matchReport?.orangeTeam.join("|") === teamBPlayers.join("|");

  const saveTeams = async () => {
    if (!nextReservation) return;

    setSaveStatus("saving");
    setSaveMessage("");

    const result = await upsertReservation({
      ...nextReservation,
      matchReport: {
        fluorescentTeam: teamAPlayers,
        orangeTeam: teamBPlayers,
        fluorescentScore: nextReservation.matchReport?.fluorescentScore ?? 0,
        orangeScore: nextReservation.matchReport?.orangeScore ?? 0,
        winner: nextReservation.matchReport?.winner ?? "draw",
        scorers: nextReservation.matchReport?.scorers ?? {},
        mvp: nextReservation.matchReport?.mvp,
        teamsLocked: nextReservation.matchReport?.teamsLocked ?? false,
        notes: nextReservation.matchReport?.notes ?? "",
        submittedAt: new Date().toISOString()
      }
    });

    if (!result.ok) {
      setSaveStatus("error");
      setSaveMessage(result.error || t("Teams could not be saved."));
      return;
    }

    setSaveStatus("saved");
    setSaveMessage(t("Teams saved to the next match."));
  };

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
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-white">{t("Balanced from confirmed players")}</p>
            <p className="mt-1 text-sm font-semibold text-white/65">
              {confirmedNames.length
                ? t("Attendance is driving this selection.")
                : t("Using roster preview until players confirm attendance.")}
            </p>
          </div>
          {canSaveTeams && (
            <button
              onClick={saveTeams}
              disabled={!nextReservation || saveStatus === "saving" || hasSavedTeams}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 font-black text-slate-950 transition hover:bg-lime-200 disabled:opacity-60"
            >
              {hasSavedTeams ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
              {saveStatus === "saving" ? t("Saving...") : hasSavedTeams ? t("Saved to match") : t("Save teams to match")}
            </button>
          )}
        </div>
        {saveMessage && (
          <p className={cn("mt-3 rounded-2xl px-4 py-3 text-sm font-black", saveStatus === "error" ? "bg-orange-100 text-orange-800" : "bg-lime-100 text-[#247e24]")}>
            {saveMessage}
          </p>
        )}
      </section>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionTitle>{t("Team readiness")}</SectionTitle>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {readyForBalance ? t("Enough ratings for a useful team balance.") : t("More ratings will improve team balance.")}
            </p>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex items-center justify-between text-sm font-black text-slate-700">
              <span>{ratedSelectedCount}/{selectedNames.length} {t("rated")}</span>
              <span className={readyForBalance ? "text-[#247e24]" : "text-amber-700"}>{readinessPercent}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/70">
              <div className={readyForBalance ? "h-full rounded-full bg-[#35b43a]" : "h-full rounded-full bg-amber-400"} style={{ width: `${readinessPercent}%` }} />
            </div>
          </div>
        </div>
      </Card>

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

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionTitle>{t("Selection list")}</SectionTitle>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {confirmedNames.length ? t("Only confirmed players are considered for team balancing.") : t("Confirm attendance to replace this roster preview.")}
            </p>
          </div>
          <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-[#247e24]">{selectedNames.length} {t("players")}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedNames.map((name, index) => (
            <span key={name} className="rounded-full bg-white/65 px-3 py-2 text-sm font-black text-slate-700">
              {index + 1}. {name}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
