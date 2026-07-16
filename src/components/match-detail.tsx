"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Edit3, MapPin, Save, Trophy, UsersRound, X } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { ReservationMapLink } from "@/components/reservation-map-link";
import { useAttendance } from "@/hooks/use-attendance";
import { useMembers } from "@/hooks/use-members";
import { useReservations } from "@/hooks/use-reservations";
import { useRole } from "@/hooks/use-role";
import { useLanguage } from "@/components/language-provider";
import { formatReservationDate, type MatchReport, type Reservation } from "@/lib/reservations";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

const emptyReport: MatchReport = {
  fluorescentTeam: [],
  orangeTeam: [],
  fluorescentScore: 0,
  orangeScore: 0,
  winner: "draw",
  scorers: {},
  mvp: "",
  notes: ""
};

function normalizeReport(report?: Partial<MatchReport>): MatchReport {
  return {
    ...emptyReport,
    ...(report || {}),
    scorers: report?.scorers || {},
    mvp: report?.mvp || ""
  };
}

function topScorers(report?: MatchReport) {
  if (!report) return [];
  const scorers = Object.entries(report.scorers).filter(([, goals]) => goals > 0);
  const max = Math.max(0, ...scorers.map(([, goals]) => goals));
  return scorers.filter(([, goals]) => goals === max);
}

function MatchReportEditor({
  reservation,
  playerNames,
  mode,
  title,
  onCancel,
  onSaved
}: {
  reservation: Reservation;
  playerNames: string[];
  mode: "teams" | "stats";
  title: string;
  onCancel: () => void;
  onSaved: (message: string, isError?: boolean) => void;
}) {
  const { language } = useLanguage();
  const { upsertReservation } = useReservations();
  const t = (text: string) => translateText(text, language);
  const [draft, setDraft] = useState<MatchReport>(() => normalizeReport(reservation.matchReport));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving">("idle");
  const totalGoals = Object.values(draft.scorers).reduce((sum, goals) => sum + Number(goals || 0), 0);

  useEffect(() => {
    setDraft(normalizeReport(reservation.matchReport));
  }, [reservation.id, reservation.matchReport]);

  const playerTeam = (player: string) => {
    if (draft.fluorescentTeam.includes(player)) return "fluorescent";
    if (draft.orangeTeam.includes(player)) return "orange";
    return "";
  };

  const updatePlayerTeam = (player: string, team: string) => {
    setDraft((current) => ({
      ...current,
      fluorescentTeam: team === "fluorescent" ? [...current.fluorescentTeam.filter((name) => name !== player), player] : current.fluorescentTeam.filter((name) => name !== player),
      orangeTeam: team === "orange" ? [...current.orangeTeam.filter((name) => name !== player), player] : current.orangeTeam.filter((name) => name !== player)
    }));
  };

  const updateScorer = (player: string, goals: number) => {
    setDraft((current) => {
      const scorers = { ...current.scorers };
      if (goals > 0) scorers[player] = goals;
      else delete scorers[player];
      return { ...current, scorers };
    });
  };

  const saveReport = async () => {
    setSaveStatus("saving");
    const result = await upsertReservation({
      ...reservation,
      status: "past",
      matchReport: {
        ...draft,
        submittedAt: new Date().toISOString()
      }
    });

    setSaveStatus("idle");
    if (!result.ok) {
      onSaved(result.error || t("Could not save stats."), true);
      return;
    }
    onSaved(t("Stats saved."));
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{title}</SectionTitle>
        <button onClick={onCancel} className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 font-black text-slate-700">
          <X className="h-4 w-4" />
          {t("Cancel")}
        </button>
      </div>

      {mode === "stats" && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="text-sm font-bold text-slate-600">
            {t("Team A score")}
            <input type="number" min={0} value={draft.fluorescentScore} onChange={(event) => setDraft((current) => ({ ...current, fluorescentScore: Number(event.target.value) }))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-center text-xl font-black text-slate-950 outline-none focus:border-lime-400" />
          </label>
          <label className="text-sm font-bold text-slate-600">
            {t("Team B score")}
            <input type="number" min={0} value={draft.orangeScore} onChange={(event) => setDraft((current) => ({ ...current, orangeScore: Number(event.target.value) }))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/80 px-4 text-center text-xl font-black text-slate-950 outline-none focus:border-lime-400" />
          </label>
          <label className="text-sm font-bold text-slate-600">
            {t("Winner")}
            <select value={draft.winner} onChange={(event) => setDraft((current) => ({ ...current, winner: event.target.value as MatchReport["winner"] }))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/80 px-4 font-black text-slate-950 outline-none focus:border-lime-400">
              <option value="draw">{t("Draw")}</option>
              <option value="fluorescent">{t("Team A")}</option>
              <option value="orange">{t("Team B")}</option>
            </select>
          </label>
        </div>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle>{mode === "teams" ? t("Players and teams") : t("Players and scorers")}</SectionTitle>
            {mode === "stats" && <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-slate-600">{totalGoals} {t("goals")}</span>}
          </div>
          <div className="mt-3 grid gap-2">
            {playerNames.map((player) => (
              <div key={player} className={cn("grid gap-2 rounded-2xl border border-white/70 bg-white/68 p-2 sm:items-center", mode === "teams" ? "sm:grid-cols-[minmax(0,1fr)_150px]" : "sm:grid-cols-[minmax(0,1fr)_88px]")}>
                <p className="truncate font-black text-slate-800">{player}</p>
                {mode === "teams" ? (
                  <select value={playerTeam(player)} onChange={(event) => updatePlayerTeam(player, event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800">
                    <option value="">{t("No team")}</option>
                    <option value="fluorescent">{t("Team A")}</option>
                    <option value="orange">{t("Team B")}</option>
                  </select>
                ) : (
                  <input aria-label={`${player} ${t("Scorers")}`} type="number" min={0} value={draft.scorers[player] || 0} onChange={(event) => updateScorer(player, Number(event.target.value))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-center font-black text-[#247e24]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {mode === "stats" && (
            <>
              <label className="block text-sm font-bold text-slate-600">
                {t("MVP")}
                <select value={draft.mvp || ""} onChange={(event) => setDraft((current) => ({ ...current, mvp: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/80 px-4 font-black text-slate-950 outline-none focus:border-lime-400">
                  <option value="">{t("Not recorded")}</option>
                  {playerNames.map((player) => <option key={player} value={player}>{player}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold text-slate-600">
                {t("Notes")}
                <textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} className="mt-2 min-h-32 w-full rounded-2xl border border-white/70 bg-white/80 p-4 font-bold text-slate-950 outline-none focus:border-lime-400" />
              </label>
            </>
          )}
          <button onClick={saveReport} disabled={saveStatus === "saving"} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white disabled:opacity-60">
            <Save className="h-5 w-5" />
            {saveStatus === "saving" ? t("Saving...") : mode === "teams" ? t("Save teams") : t("Save stats")}
          </button>
        </div>
      </div>
    </Card>
  );
}

function AttendanceEditor({
  attendance,
  playerNames,
  onCancel
}: {
  attendance: ReturnType<typeof useAttendance>;
  playerNames: string[];
  onCancel: () => void;
}) {
  const { language } = useLanguage();
  const t = (text: string) => translateText(text, language);

  const statusFor = (player: string) => {
    if (attendance.confirmedPlayers.some((record) => record.player === player)) return "playing";
    if (attendance.waitingPlayers.some((record) => record.player === player)) return "waiting";
    return "";
  };

  const updateStatus = async (player: string, status: string) => {
    if (status === "playing" || status === "waiting") {
      await attendance.savePlayerAttendance(player, status);
      return;
    }
    await attendance.removePlayerAttendance(player);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{t("Edit attendance")}</SectionTitle>
        <button onClick={onCancel} className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 font-black text-slate-700">
          <X className="h-4 w-4" />
          {t("Cancel")}
        </button>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {playerNames.map((player) => (
          <label key={player} className="grid gap-2 rounded-2xl border border-white/70 bg-white/68 p-3 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
            <span className="truncate font-black text-slate-800">{player}</span>
            <select value={statusFor(player)} onChange={(event) => void updateStatus(player, event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800">
              <option value="">{t("No response")}</option>
              <option value="playing">{t("Confirmed")}</option>
              <option value="waiting">{t("Waiting")}</option>
            </select>
          </label>
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-lime-50 p-3 text-sm font-black text-[#247e24]">{t("Attendance updates save immediately.")}</p>
    </Card>
  );
}

export function MatchDetail({ matchId }: { matchId: string }) {
  const { language } = useLanguage();
  const { role } = useRole();
  const canEdit = role === "superuser" || role === "admin";
  const { members } = useMembers();
  const { reservations } = useReservations();
  const [editSection, setEditSection] = useState<"attendance" | "teams" | "stats" | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const t = (text: string) => translateText(text, language);
  const reservation = reservations.find((item) => item.id === matchId);
  const attendance = useAttendance(reservation?.id, reservation);
  const report = reservation?.matchReport;
  const scorers = topScorers(report);
  const playerNames = useMemo(() => {
    const names = new Set<string>(members.map((member) => member.name));
    attendance.confirmedPlayers.forEach((player) => names.add(player.player));
    report?.fluorescentTeam.forEach((player) => names.add(player));
    report?.orangeTeam.forEach((player) => names.add(player));
    Object.keys(report?.scorers || {}).forEach((player) => names.add(player));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [members, attendance.confirmedPlayers, report]);

  if (!reservation) {
    return (
      <Card>
        <SectionTitle>{t("Match not found")}</SectionTitle>
        <Link href="/matches" className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white">
          <ArrowLeft className="h-4 w-4" />
          {t("Back to Matches")}
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/matches" className="inline-flex items-center gap-2 text-sm font-black text-[#247e24]">
        <ArrowLeft className="h-4 w-4" />
        {t("Back to Matches")}
      </Link>

      <section className="rounded-[26px] border border-white/25 bg-[#0d2132] p-5 text-white shadow-[0_24px_60px_rgba(2,20,28,.28)]">
        <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">{t("Match Details")}</p>
        <h1 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">{formatReservationDate(reservation.date)}</h1>
        <div className="mt-5 grid gap-3 text-base font-black text-white/92 sm:grid-cols-3">
          <span className="inline-flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-lime-300" />
            {reservation.time}
          </span>
          <span className="inline-flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-lime-300" />
            {reservation.durationMinutes} min
          </span>
          <span className="inline-flex min-w-0 items-center gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-lime-300" />
            <ReservationMapLink reservation={reservation} className="truncate text-white" />
          </span>
        </div>
        {report ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-black uppercase tracking-[.12em] text-white/60">{t("Final Score")}</p>
            <p className="mt-2 text-4xl font-black">
              {t("Team A")} {report.fluorescentScore} - {report.orangeScore} {t("Team B")}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-black uppercase tracking-[.12em] text-white/60">{t("Final Score")}</p>
            <p className="mt-2 text-2xl font-black text-white/80">{t("Stats not recorded yet.")}</p>
          </div>
        )}
      </section>

      {saveMessage && <p className={cn("rounded-2xl p-3 text-sm font-black", saveMessage.isError ? "bg-orange-50 text-orange-700" : "bg-lime-50 text-[#247e24]")}>{saveMessage.text}</p>}

      {editSection === "attendance" && canEdit && (
        <AttendanceEditor
          attendance={attendance}
          playerNames={playerNames}
          onCancel={() => setEditSection(null)}
        />
      )}

      {editSection === "teams" && canEdit && (
        <MatchReportEditor
          reservation={reservation}
          playerNames={playerNames}
          mode="teams"
          title={t("Edit teams")}
          onCancel={() => setEditSection(null)}
          onSaved={(message, isError) => {
            setSaveMessage({ text: message, isError });
            if (!isError) setEditSection(null);
          }}
        />
      )}

      {editSection === "stats" && canEdit && (
        <MatchReportEditor
          reservation={reservation}
          playerNames={playerNames}
          mode="stats"
          title={t("Edit key stats")}
          onCancel={() => setEditSection(null)}
          onSaved={(message, isError) => {
            setSaveMessage({ text: message, isError });
            if (!isError) setEditSection(null);
          }}
        />
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Attendance")}</SectionTitle>
            {canEdit && (
              <button onClick={() => setEditSection(editSection === "attendance" ? null : "attendance")} className="inline-flex h-9 items-center gap-2 rounded-2xl bg-white/70 px-3 text-xs font-black text-slate-700">
                <Edit3 className="h-3.5 w-3.5" />
                {t("Edit")}
              </button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-lime-50 p-3">
              <p className="text-2xl font-black text-[#247e24]">{attendance.summary.playing}</p>
              <p className="text-xs font-bold text-slate-500">{t("Confirmed")}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-2xl font-black text-amber-700">{attendance.summary.waiting}</p>
              <p className="text-xs font-bold text-slate-500">{t("Waiting")}</p>
            </div>
            <div className="rounded-2xl bg-white/55 p-3">
              <p className="text-2xl font-black text-slate-950">{attendance.summary.notAttending}</p>
              <p className="text-xs font-bold text-slate-500">{t("No response")}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {attendance.confirmedPlayers.length ? attendance.confirmedPlayers.map((player) => (
              <p key={player.player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black text-slate-800">{player.player}</p>
            )) : <p className="text-sm font-bold text-slate-500">{t("No confirmed players yet.")}</p>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Teams")}</SectionTitle>
            {canEdit && (
              <button onClick={() => setEditSection(editSection === "teams" ? null : "teams")} className="inline-flex h-9 items-center gap-2 rounded-2xl bg-white/70 px-3 text-xs font-black text-slate-700">
                <Edit3 className="h-3.5 w-3.5" />
                {t("Edit")}
              </button>
            )}
          </div>
          {report ? (
            <div className="mt-4 grid gap-4">
              <div>
                <p className="font-black text-[#247e24]">{t("Team A")}</p>
                <div className="mt-2 space-y-2">{report.fluorescentTeam.length ? report.fluorescentTeam.map((player) => <p key={player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black">{player}</p>) : <p className="text-sm font-bold text-slate-500">{t("Not recorded")}</p>}</div>
              </div>
              <div>
                <p className="font-black text-orange-600">{t("Team B")}</p>
                <div className="mt-2 space-y-2">{report.orangeTeam.length ? report.orangeTeam.map((player) => <p key={player} className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-black">{player}</p>) : <p className="text-sm font-bold text-slate-500">{t("Not recorded")}</p>}</div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-bold text-slate-500">{t("Teams not recorded yet.")}</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Key Stats")}</SectionTitle>
            {canEdit && (
              <button onClick={() => setEditSection(editSection === "stats" ? null : "stats")} className="inline-flex h-9 items-center gap-2 rounded-2xl bg-white/70 px-3 text-xs font-black text-slate-700">
                <Edit3 className="h-3.5 w-3.5" />
                {t("Edit")}
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white/55 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                <Trophy className="h-4 w-4 text-[#247e24]" />
                {t("Top scorer")}
              </div>
              <p className="mt-2 text-lg font-black text-slate-950">
                {scorers.length ? scorers.map(([player, goals]) => `${player} x${goals}`).join(", ") : t("Not recorded")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                <UsersRound className="h-4 w-4 text-[#247e24]" />
                {t("MVP")}
              </div>
              <p className="mt-2 text-lg font-black text-slate-950">{report?.mvp || t("Not recorded")}</p>
            </div>
            {report?.notes && <p className="rounded-2xl bg-white/55 p-4 text-sm font-bold text-slate-700">{report.notes}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
