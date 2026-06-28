import Link from "next/link";
import { ArrowRight, CircleDollarSign, Dices, Footprints, ShieldCheck, Trophy, UserPlus, WalletCards, type LucideIcon } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { fluorescentTeam, orangeTeam, players } from "@/lib/data";
import { contributionTotal, financeSnapshot, formatDh } from "@/lib/finance";
import { NextMatchAttendance } from "@/components/next-match-attendance";
import { NextReservationTopCard, UpcomingReservationsCard } from "@/components/reservation-dashboard-widgets";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { HomePage } from "@/components/home-page";

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-9 w-9 text-sm", md: "h-14 w-14 text-lg", lg: "h-16 w-16 text-2xl" };
  return (
    <div className={`${sizes[size]} grid shrink-0 place-items-center rounded-full border-2 border-white/70 bg-gradient-to-br from-zinc-100 to-zinc-500 font-black text-black shadow-[0_0_20px_rgba(255,255,255,.18)]`}>
      {name.slice(0, 1)}
    </div>
  );
}

function Jersey({ tone }: { tone: "lime" | "orange" }) {
  return (
    <div className={`jersey h-24 w-24 border border-black/30 ${tone === "lime" ? "bg-lime-300" : "bg-orange-500"} shadow-[0_18px_40px_rgba(0,0,0,.32)]`}>
      <div className="mx-auto mt-3 h-5 w-8 rounded-b-full border-b-2 border-x-2 border-black/55" />
      <div className="mx-auto mt-8 h-4 w-4 rounded-full border border-black/45" />
    </div>
  );
}

function TopCard({ icon: Icon, label, value, meta, accent = "lime" }: { icon: LucideIcon; label: string; value: string; meta: string; accent?: "lime" | "orange" }) {
  return (
    <Card className="glass-line min-h-[118px]">
      <div className="relative flex items-center gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-full ${accent === "lime" ? "bg-lime-300/25 text-lime-300" : "bg-orange-500/25 text-orange-400"}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-white/80">{label}</p>
          <p className="mt-2 text-xl font-black text-white">{value}</p>
          <p className="mt-1 text-sm text-white/70">{meta}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  return <HomePage />;

  const quickActions: Array<[LucideIcon, string]> = [
    [Trophy, "Add Result"],
    [UserPlus, "Invite Player"],
    [Dices, "Generate Teams"],
    [CircleDollarSign, "Add Expense"]
  ];

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <h1 className="text-3xl font-black text-white">Welcome back, Najib!</h1>
        <p className="mt-2 text-white/76">Ready for another great game?</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[.9fr_.9fr_1.45fr]">
        <TopCard icon={WalletCards} label="Balance" value={formatDh(financeSnapshot.balance)} meta="Situation caisse" accent="orange" />
        <NextReservationTopCard />
        <Card className="grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-500/25 text-orange-400">
              <Footprints className="h-7 w-7" />
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-lime-300 bg-lime-300/15 text-lime-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white/80">Ratings Status</p>
              <p className="mt-2 text-lg font-black text-white">Awaiting member ratings</p>
              <p className="text-sm text-white/70">Scores will appear after peer submissions.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 border-white/10 md:border-l md:pl-7">
            <div className="stat-ring grid h-20 w-20 shrink-0 place-items-center rounded-full text-xl font-black text-white">85%</div>
            <div>
              <p className="text-xs font-black uppercase text-white/80">Team Chemistry</p>
              <p className="mt-3 text-sm text-white/72">Great rhythm, high attendance, clean balance.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <Card className="p-5">
          <SectionTitle>Next Game Preview</SectionTitle>
          <div className="mt-6 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-[20px] bg-lime-300/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-lime-300">FLUORESCENT TEAM</p>
                  <div className="mt-6 flex -space-x-2">
                    {fluorescentTeam.map((player) => <Avatar key={player.name} name={player.name} />)}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/80">
                    {fluorescentTeam.map((player) => <span key={player.name}>{player.name}</span>)}
                  </div>
                </div>
                <Jersey tone="lime" />
              </div>
            </div>
            <div className="text-center text-5xl font-black text-white md:text-6xl">VS</div>
            <div className="rounded-[20px] bg-orange-500/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-orange-400">ORANGE TEAM</p>
                  <div className="mt-6 flex -space-x-2">
                    {orangeTeam.map((player) => <Avatar key={player.name} name={player.name} />)}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/80">
                    {orangeTeam.map((player) => <span key={player.name}>{player.name}</span>)}
                  </div>
                </div>
                <Jersey tone="orange" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <Link href="/games" className="inline-flex h-11 items-center gap-2 rounded-full border border-lime-300/55 px-8 text-sm font-black text-lime-300 transition hover:bg-lime-300 hover:text-black">
              VIEW GAME DETAILS
            </Link>
          </div>
        </Card>

        <div className="space-y-5">
          <NextMatchAttendance />
          <UpcomingReservationsCard />

          <Card>
            <SectionTitle>Quick Actions</SectionTitle>
            <div className="mt-5 grid grid-cols-4 gap-3 text-center text-xs font-semibold">
              {quickActions.map(([Icon, label]) => (
                <button key={label} className="group grid place-items-center gap-2 text-white/86">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-lime-300/12 text-lime-300 transition group-hover:bg-lime-300 group-hover:text-black">
                    <Icon className="h-6 w-6" />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr_.95fr_1.35fr]">
        <Card>
          <SectionTitle>Recent Result</SectionTitle>
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.06] p-5 text-center">
            <p className="text-4xl font-black text-white">--</p>
            <p className="mt-2 text-sm text-white/64">No official game stats entered yet.</p>
          </div>
          <Link href="/players" className="mt-7 flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 text-sm font-black text-lime-300">
            Enter game stats <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card>
          <SectionTitle>Player Ratings</SectionTitle>
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.06] p-5">
            <p className="text-3xl font-black text-lime-300">Pending</p>
            <p className="mt-2 text-sm text-white/64">Members need to rate each other once before fair-team scores can be calculated.</p>
          </div>
        </Card>

        <Card>
          <SectionTitle>Goal Stats</SectionTitle>
          <div className="mt-5 space-y-3">
            {["Scorers", "Winner", "MVP"].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-white/4 p-3">
                <span className="font-semibold">{label}</span>
                <span className="font-black text-orange-400">Pending</span>
              </div>
            ))}
          </div>
          <Link href="/players" className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-lime-300">Open ratings <ArrowRight className="h-4 w-4" /></Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <SectionTitle>Budget Overview</SectionTitle>
            <span className="text-sm text-white/72">This Month</span>
          </div>
          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1fr]">
            <div className="budget-ring grid aspect-square max-h-44 place-items-center rounded-full text-center">
              <div>
                <p className="text-2xl font-black">{formatDh(financeSnapshot.balance)}</p>
                <p className="text-sm text-white/72">Caisse</p>
              </div>
            </div>
            <div className="space-y-5 text-sm">
              <p><span className="mr-3 inline-block h-3 w-3 rounded bg-lime-300" />Cotisations <b className="mt-1 block text-lg text-white">{formatDh(contributionTotal)}</b></p>
              <p><span className="mr-3 inline-block h-3 w-3 rounded bg-orange-500" />Reserve until <b className="mt-1 block text-lg text-white">27/07/2026</b></p>
            </div>
          </div>
          <Link href="/finances" className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-lime-300">View finances <ArrowRight className="h-4 w-4" /></Link>
        </Card>
      </div>
    </div>
  );
}
