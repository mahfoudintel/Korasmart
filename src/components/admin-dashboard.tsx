"use client";

import Link from "next/link";
import { AlertCircle, CalendarDays, CheckCircle2, Lock, ShieldCheck, UsersRound, WalletCards } from "lucide-react";
import { AccessSettings } from "@/components/access-settings";
import { Card, SectionTitle } from "@/components/ui/card";
import { useAttendance, playingLimit } from "@/hooks/use-attendance";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { useMembers } from "@/hooks/use-members";
import { useReservations } from "@/hooks/use-reservations";
import { useLanguage } from "@/components/language-provider";
import { financeSnapshot, formatDh, isAfterFinanceBaseline } from "@/lib/finance";
import { formatReservationDate, getNextReservation } from "@/lib/reservations";
import { translateText } from "@/lib/translations";

function AdminMetric({
  label,
  value,
  caption,
  tone = "slate"
}: {
  label: string;
  value: string;
  caption: string;
  tone?: "green" | "orange" | "slate";
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/58 p-4">
      <p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">{label}</p>
      <p className={tone === "green" ? "mt-2 text-3xl font-black text-[#247e24]" : tone === "orange" ? "mt-2 text-3xl font-black text-orange-700" : "mt-2 text-3xl font-black text-slate-950"}>
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{caption}</p>
    </div>
  );
}

export function AdminDashboard() {
  const { language } = useLanguage();
  const { reservations } = useReservations();
  const { members } = useMembers();
  const { transactions } = useFinanceTransactions();
  const nextReservation = getNextReservation(reservations);
  const attendance = useAttendance(nextReservation?.id, nextReservation);
  const t = (text: string) => translateText(text, language);
  const missingCount = Math.max(members.length - attendance.summary.playing - attendance.summary.waiting, 0);
  const balance = financeSnapshot.balance + transactions.filter((transaction) => isAfterFinanceBaseline(transaction.createdAt)).reduce((sum, transaction) => sum + transaction.amount, 0);
  const teamsSaved = Boolean(nextReservation?.matchReport?.fluorescentTeam?.length && nextReservation?.matchReport?.orangeTeam?.length);
  const teamsLocked = Boolean(nextReservation?.matchReport?.teamsLocked);

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-white/25 bg-[#0d2132] p-5 text-white shadow-[0_24px_60px_rgba(2,20,28,.28)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">{t("Admin dashboard")}</p>
            <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{t("Match readiness")}</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/68">
              {nextReservation ? `${formatReservationDate(nextReservation.date)} - ${nextReservation.time}` : t("No upcoming matches scheduled.")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/matches" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-lime-300 px-4 font-black text-slate-950">
              <CalendarDays className="h-4 w-4" />
              {t("Matches")}
            </Link>
            <Link href="/teams" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/16 bg-white/10 px-4 font-black text-white">
              <UsersRound className="h-4 w-4" />
              {t("Teams")}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetric
          label={t("Attendance")}
          value={`${attendance.summary.playing}/${playingLimit}`}
          caption={t("Confirmed")}
          tone={attendance.summary.playing >= playingLimit ? "green" : "orange"}
        />
        <AdminMetric
          label={t("Missing responses")}
          value={`${missingCount}`}
          caption={t("No response")}
          tone={missingCount ? "orange" : "green"}
        />
        <AdminMetric
          label={t("Teams")}
          value={teamsLocked ? t("Locked") : teamsSaved ? t("Saved") : t("Pending")}
          caption={teamsSaved ? t("Team sheet ready") : t("Generate teams from attendance")}
          tone={teamsSaved ? "green" : "orange"}
        />
        <AdminMetric
          label={t("Balance")}
          value={formatDh(balance)}
          caption={balance < 0 ? t("Amount needed to reach zero.") : t("Caisse is positive.")}
          tone={balance < 0 ? "orange" : "green"}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Action list")}</SectionTitle>
            <ShieldCheck className="h-6 w-6 text-[#247e24]" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Link href="/matches" className="flex gap-3 rounded-2xl bg-white/58 p-4 font-black text-slate-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <span>{missingCount ? t("Follow up missing attendance.") : t("Attendance is ready.")}</span>
            </Link>
            <Link href="/teams" className="flex gap-3 rounded-2xl bg-white/58 p-4 font-black text-slate-800">
              {teamsLocked ? <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#247e24]" /> : <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />}
              <span>{teamsLocked ? t("Teams are locked.") : teamsSaved ? t("Review and lock teams.") : t("Generate and save teams.")}</span>
            </Link>
            <Link href="/finances" className="flex gap-3 rounded-2xl bg-white/58 p-4 font-black text-slate-800">
              <WalletCards className="mt-0.5 h-5 w-5 shrink-0 text-[#247e24]" />
              <span>{t("Review payments and booking costs.")}</span>
            </Link>
            <Link href="/players" className="flex gap-3 rounded-2xl bg-white/58 p-4 font-black text-slate-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#247e24]" />
              <span>{t("Improve peer ratings for fair teams.")}</span>
            </Link>
          </div>
        </Card>

        <Card>
          <SectionTitle>{t("Confirmed players")}</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {attendance.confirmedPlayers.length ? (
              attendance.confirmedPlayers.map((player, index) => (
                <span key={player.player} className="rounded-full bg-lime-100 px-3 py-2 text-sm font-black text-[#247e24]">
                  {index + 1}. {player.player}
                </span>
              ))
            ) : (
              <p className="text-sm font-bold text-slate-500">{t("No confirmed players yet.")}</p>
            )}
          </div>
        </Card>
      </div>

      <AccessSettings />
    </div>
  );
}
