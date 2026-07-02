"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Coins, Pencil, Plus, RotateCcw, Save, Search, UserRoundCheck, WalletCards } from "lucide-react";
import { canEditFinance } from "@/lib/access";
import { financeSnapshot, formatDh } from "@/lib/finance";
import { useRole } from "@/hooks/use-role";
import { useMembers } from "@/hooks/use-members";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { bookingCurrencyLabel } from "@/lib/workflow-rules";
import { Card, SectionTitle } from "@/components/ui/card";

type Contribution = {
  player: string;
  amount: number;
};

const storageKey = "korasmart-finance-admin-v1";

export function AdminFinancePanel() {
  const { role } = useRole();
  const { members } = useMembers();
  const { transactions, transactionTotal } = useFinanceTransactions();
  const canEdit = canEditFinance(role);
  const [adminMode, setAdminMode] = useState(false);
  const [balance, setBalance] = useState(financeSnapshot.balance);
  const [reservedUntil, setReservedUntil] = useState(financeSnapshot.reservedUntil);
  const [contributions, setContributions] = useState<Contribution[]>(financeSnapshot.contributions);
  const [query, setQuery] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        balance?: number;
        reservedUntil?: string;
        contributions?: Contribution[];
      };
      if (typeof parsed.balance === "number") setBalance(parsed.balance);
      if (parsed.reservedUntil) setReservedUntil(parsed.reservedUntil);
      if (Array.isArray(parsed.contributions)) setContributions(parsed.contributions);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ balance, reservedUntil, contributions }));
    setLastSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
  }, [balance, reservedUntil, contributions]);

  const totalReceived = useMemo(
    () => contributions.reduce((sum, contribution) => sum + Number(contribution.amount || 0), 0),
    [contributions]
  );
  const paidPlayers = new Set(contributions.filter((item) => Number(item.amount) > 0).map((item) => item.player));
  const unpaidPlayers = members.filter((player) => !paidPlayers.has(player.name));
  const activeContributions = useMemo(
    () =>
      members.map((member) => ({
        player: member.name,
        amount: contributions.find((contribution) => contribution.player === member.name)?.amount || 0
      })),
    [contributions, members]
  );
  const filteredContributions = activeContributions.filter((contribution) =>
    contribution.player.toLowerCase().includes(query.trim().toLowerCase())
  );
  const strongestContribution = activeContributions.reduce(
    (max, contribution) => (contribution.amount > max.amount ? contribution : max),
    activeContributions[0] || { player: "-", amount: 0 }
  );
  const expectedContribution = 200;
  const expectedTotal = members.length * expectedContribution;
  const collectionRate = members.length ? Math.round((paidPlayers.size / members.length) * 100) : 0;
  const amountRate = expectedTotal ? Math.min(Math.round((totalReceived / expectedTotal) * 100), 100) : 0;
  const adjustedBalance = balance + transactionTotal;
  const neededToZero = Math.max(Math.abs(Math.min(adjustedBalance, 0)), 0);

  const updateContribution = (player: string, amount: number) => {
    setContributions((current) =>
      current.some((contribution) => contribution.player === player)
        ? current.map((contribution) => (contribution.player === player ? { ...contribution, amount } : contribution))
        : [...current, { player, amount }]
    );
  };

  const addMissingPlayer = (player: string) => {
    updateContribution(player, expectedContribution);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr_.9fr]">
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Situation caisse</p>
              {adminMode && canEdit ? (
                <input
                  type="number"
                  value={balance}
                  onChange={(event) => setBalance(Number(event.target.value))}
                  className="mt-3 h-14 w-full rounded-2xl border border-white/70 bg-white/70 px-4 text-3xl font-extrabold text-slate-900 outline-none focus:border-lime-400"
                />
              ) : (
                <p className={`mt-3 text-4xl font-extrabold ${adjustedBalance < 0 ? "text-orange-600" : "text-[#238923]"}`}>
                  {formatDh(adjustedBalance)}
                </p>
              )}
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-[#2f9e2f]">
              <WalletCards className="h-6 w-6" />
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {adjustedBalance < 0 ? `${formatDh(neededToZero)} needed to bring the caisse back to zero.` : "Caisse is positive today."}
            <span className="mt-1 block text-xs font-semibold text-slate-500">
              Booking transactions: {formatDh(transactionTotal)} ({bookingCurrencyLabel}).
            </span>
          </p>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Cotisations recues</p>
              <p className="mt-3 text-4xl font-extrabold text-[#238923]">{formatDh(totalReceived)}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-[#2f9e2f]">
              <Coins className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-600">
            <span>{paidPlayers.size}/{members.length} members paid</span>
            <span>{collectionRate}%</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-white/60">
            <div className="h-3 rounded-full bg-[#8ee82f]" style={{ width: `${collectionRate}%` }} />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Reservation terrain</p>
              {adminMode && canEdit ? (
                <input
                  type="date"
                  value={reservedUntil}
                  onChange={(event) => setReservedUntil(event.target.value)}
                  className="mt-3 h-12 w-full rounded-2xl border border-white/70 bg-white/70 px-4 text-base font-extrabold text-slate-900 outline-none focus:border-lime-400"
                />
              ) : (
                <p className="mt-3 text-2xl font-extrabold text-slate-900">
                  Jusqu&apos;au {new Date(`${reservedUntil}T00:00:00`).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-[#2f9e2f]">
              <CalendarCheck className="h-6 w-6" />
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-600">Reserve chaque semaine</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <SectionTitle>Budget Officer Workspace</SectionTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Update each player contribution directly. Changes are saved locally now and can later be connected to Supabase payments.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-slate-600">
                <span className="rounded-full bg-white/65 px-3 py-1">Expected {formatDh(expectedTotal)}</span>
                <span className="rounded-full bg-lime-100 px-3 py-1 text-[#247e24]">{amountRate}% of target amount</span>
                {lastSavedAt && <span className="rounded-full bg-white/65 px-3 py-1">Saved {lastSavedAt}</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <button
                  onClick={() => setAdminMode((value) => !value)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#3dad3d] px-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(47,158,47,.18)]"
                >
                  {adminMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  {adminMode ? "Finish updates" : "Update contributions"}
                </button>
              )}
              {adminMode && canEdit && (
                <button
                  onClick={() => {
                    setBalance(financeSnapshot.balance);
                    setReservedUntil(financeSnapshot.reservedUntil);
                    setContributions(financeSnapshot.contributions);
                    window.localStorage.removeItem(storageKey);
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 text-sm font-extrabold text-orange-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="relative block min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search player"
                className="h-11 w-full rounded-2xl border border-white/70 bg-white/70 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-[18px] border border-white/60 bg-white/42">
            <div className="grid grid-cols-[1fr_120px_180px] gap-3 border-b border-white/60 px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-slate-500 max-md:hidden">
              <span>Member</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Quick update</span>
            </div>
            <div className="divide-y divide-white/55">
              {filteredContributions.map((contribution) => {
                const paid = contribution.amount > 0;

                return (
                  <div key={contribution.player} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_120px_180px] md:items-center">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={paid ? "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-100 text-[#247e24]" : "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700"}>
                        {paid ? <CheckCircle2 className="h-5 w-5" /> : <UserRoundCheck className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-slate-900">{contribution.player}</p>
                        <p className="text-xs font-medium text-slate-500">{paid ? "Contribution recorded" : "Still to collect"}</p>
                      </div>
                    </div>

                    {adminMode && canEdit ? (
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={contribution.amount}
                        onChange={(event) => updateContribution(contribution.player, Number(event.target.value))}
                        className="h-11 w-full rounded-2xl border border-white/70 bg-white/75 px-3 text-right font-extrabold text-slate-900 outline-none focus:border-lime-400 md:w-[120px]"
                      />
                    ) : (
                      <span className={paid ? "justify-self-start rounded-full bg-lime-100 px-4 py-2 font-extrabold text-[#247e24] md:justify-self-end" : "justify-self-start rounded-full bg-orange-50 px-4 py-2 font-extrabold text-orange-700 md:justify-self-end"}>
                        {formatDh(contribution.amount)}
                      </span>
                    )}

                    <div className="flex flex-wrap justify-start gap-2 md:justify-end">
                      {[100, 200, 300].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => adminMode && canEdit && updateContribution(contribution.player, amount)}
                          disabled={!adminMode || !canEdit}
                          className="h-9 rounded-full border border-white/70 bg-white/70 px-3 text-xs font-extrabold text-slate-600 transition enabled:hover:border-lime-400 enabled:hover:text-[#247e24] disabled:opacity-55"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <SectionTitle>Still To Collect</SectionTitle>
            <p className="mt-2 text-sm text-slate-600">{unpaidPlayers.length} members with no recorded contribution.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {unpaidPlayers.length ? (
                unpaidPlayers.map((player) => (
                  <button
                    key={player.name}
                    onClick={() => adminMode && canEdit && addMissingPlayer(player.name)}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-700 transition hover:bg-orange-100"
                  >
                    {adminMode && canEdit && <Plus className="h-4 w-4" />}
                    {player.name}
                  </button>
                ))
              ) : (
                <p className="text-sm font-semibold text-[#247e24]">All active members have a recorded contribution.</p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Booking Costs</SectionTitle>
            <p className="mt-2 text-sm text-slate-600">Each new reservation records an 80 MAD/DH cost once. Deleted bookings add a reversal.</p>
            <div className="mt-4 space-y-2">
              {transactions.length ? (
                transactions.slice(-5).reverse().map((transaction) => (
                  <div key={transaction.id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/60 bg-white/55 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-slate-900">{transaction.note}</p>
                      <p className="text-xs font-medium text-slate-500">{new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <span className={transaction.amount < 0 ? "shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-extrabold text-orange-700" : "shrink-0 rounded-full bg-lime-100 px-3 py-1 text-sm font-extrabold text-[#247e24]"}>
                      {formatDh(transaction.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/60 bg-white/45 p-4 text-sm text-slate-500">No booking transactions yet.</p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Quick Read</SectionTitle>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <p><span className="font-extrabold text-slate-900">{formatDh(strongestContribution.amount)}</span> highest contribution from {strongestContribution.player}.</p>
              <p><span className="font-extrabold text-slate-900">{formatDh(neededToZero)}</span> needed to bring the caisse back to zero.</p>
              <p><span className="font-extrabold text-slate-900">{formatDh(expectedContribution)}</span> is used as the quick expected amount per member.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
