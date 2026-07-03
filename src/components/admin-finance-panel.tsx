"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Coins, Pencil, Plus, RotateCcw, Save, Search, UserRoundCheck, WalletCards } from "lucide-react";
import { canEditFinance } from "@/lib/access";
import { financeSnapshot, formatDh } from "@/lib/finance";
import { useRole } from "@/hooks/use-role";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useMembers } from "@/hooks/use-members";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";
import { bookingCostAmount, bookingCurrencyLabel } from "@/lib/workflow-rules";
import { Card, SectionTitle } from "@/components/ui/card";

type Contribution = {
  player: string;
  amount: number;
  lastAmount?: number;
  lastDate?: string;
};

const storageKey = "korasmart-finance-admin-v1";

export function AdminFinancePanel() {
  const { role } = useRole();
  const { profile } = useLocalProfile();
  const { members } = useMembers();
  const { reservations } = useReservations();
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
      if (Array.isArray(parsed.contributions)) {
        setContributions(
          parsed.contributions.map((contribution) => ({
            ...contribution,
            lastAmount: contribution.lastAmount ?? contribution.amount,
            lastDate: contribution.lastDate
          }))
        );
      }
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
      members.map((member) => {
        const contribution = contributions.find((item) => item.player === member.name);
        return {
          player: member.name,
          amount: contribution?.amount || 0,
          lastAmount: contribution?.lastAmount ?? contribution?.amount ?? 0,
          lastDate: contribution?.lastDate || ""
        };
      }),
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
  const openingBalance = balance - totalReceived;
  const bookingRows = transactions.map((transaction) => {
    const reservation = transaction.bookingId ? reservations.find((item) => item.id === transaction.bookingId) : undefined;
    return {
      ...transaction,
      label: reservation ? `${formatReservationDate(reservation.date)} • ${reservation.time} • ${reservation.venue}` : transaction.note
    };
  });
  const accountRows = [
    {
      id: "opening-balance",
      date: "Opening",
      description: "Opening caisse balance",
      type: "Opening",
      in: openingBalance > 0 ? openingBalance : 0,
      out: openingBalance < 0 ? Math.abs(openingBalance) : 0,
      net: openingBalance
    },
    {
      id: "contributions-total",
      date: "Current",
      description: "Player contributions received",
      type: "Contribution",
      in: totalReceived,
      out: 0,
      net: totalReceived
    },
    ...bookingRows.map((transaction) => ({
      id: transaction.id,
      date: new Date(transaction.createdAt).toLocaleDateString("fr-FR"),
      description: transaction.label,
      type: transaction.type === "booking_cost_reversal" ? "Booking reversal" : "Booking cost",
      in: transaction.amount > 0 ? transaction.amount : 0,
      out: transaction.amount < 0 ? Math.abs(transaction.amount) : 0,
      net: transaction.amount
    }))
  ];

  const updateContribution = (player: string, amount: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setContributions((current) => {
      const existing = current.find((contribution) => contribution.player === player);
      const delta = amount - (existing?.amount || 0);
      const lastAmount = delta > 0 ? delta : amount;
      return existing
        ? current.map((contribution) =>
            contribution.player === player ? { ...contribution, amount, lastAmount, lastDate: today } : contribution
          )
        : [...current, { player, amount, lastAmount, lastDate: today }];
    });
  };

  const addMissingPlayer = (player: string) => {
    updateContribution(player, expectedContribution);
  };

  const currentPlayerContribution = activeContributions.find((item) => item.player === profile.playerName);

  if (!canEdit) {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Current balance</p>
            <p className={`mt-3 text-4xl font-extrabold ${adjustedBalance < 0 ? "text-orange-600" : "text-[#238923]"}`}>
              {formatDh(adjustedBalance)}
            </p>
            <p className="mt-3 text-sm text-slate-600">Club caisse after scheduled booking costs.</p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">My contribution</p>
            <p className="mt-3 text-4xl font-extrabold text-[#238923]">{formatDh(currentPlayerContribution?.amount || 0)}</p>
            <p className="mt-3 text-sm text-slate-600">
              Last paid: {currentPlayerContribution?.lastDate ? new Date(`${currentPlayerContribution.lastDate}T00:00:00`).toLocaleDateString("fr-FR") : "not recorded"}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Booking costs</p>
            <p className="mt-3 text-4xl font-extrabold text-orange-600">{formatDh(transactionTotal)}</p>
            <p className="mt-3 text-sm text-slate-600">New bookings deduct {formatDh(Math.abs(bookingCostAmount))} automatically.</p>
          </Card>
        </div>

        <Card>
          <SectionTitle>Recent Money Movements</SectionTitle>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/60 bg-white/45">
            <div className="grid grid-cols-[100px_1fr_90px] gap-2 border-b border-white/60 px-4 py-3 text-xs font-extrabold uppercase text-slate-500">
              <span>Date</span>
              <span>Item</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="divide-y divide-white/55">
              {accountRows.slice(-6).map((row) => (
                <div key={row.id} className="grid grid-cols-[100px_1fr_90px] gap-2 px-4 py-3 text-sm">
                  <span className="font-bold text-slate-500">{row.date}</span>
                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-slate-900">{row.description}</p>
                    <p className="text-xs font-semibold text-slate-500">{row.type}</p>
                  </div>
                  <span className={row.net < 0 ? "text-right font-extrabold text-orange-700" : "text-right font-extrabold text-[#247e24]"}>
                    {formatDh(row.net)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
            <span>{paidPlayers.size}/{members.length} players paid</span>
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

          <div className="mt-5 overflow-x-auto rounded-[18px] border border-white/60 bg-white/42">
            <div className="min-w-[880px]">
            <div className="grid grid-cols-[1.25fr_100px_110px_110px_110px_110px_160px] gap-3 border-b border-white/60 px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-slate-500">
              <span>Player</span>
              <span className="text-right">Expected</span>
              <span className="text-right">Total paid</span>
              <span className="text-right">Last in</span>
              <span className="text-right">Last date</span>
              <span className="text-right">Balance</span>
              <span className="text-right">Quick update</span>
            </div>
            <div className="divide-y divide-white/55">
              {filteredContributions.map((contribution) => {
                const paid = contribution.amount > 0;
                const remaining = Math.max(expectedContribution - contribution.amount, 0);
                const overpaid = Math.max(contribution.amount - expectedContribution, 0);
                const settled = remaining === 0 && paid;

                return (
                  <div key={contribution.player} className="grid grid-cols-[1.25fr_100px_110px_110px_110px_110px_160px] items-center gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={settled ? "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-100 text-[#247e24]" : paid ? "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700" : "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700"}>
                        {settled ? <CheckCircle2 className="h-5 w-5" /> : <UserRoundCheck className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-slate-900">{contribution.player}</p>
                        <p className="text-xs font-medium text-slate-500">{settled ? "Settled" : paid ? "Partial" : "Unpaid"}</p>
                      </div>
                    </div>
                    <span className="text-right text-sm font-extrabold text-slate-700">{formatDh(expectedContribution)}</span>

                    {adminMode && canEdit ? (
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={contribution.amount}
                        onChange={(event) => updateContribution(contribution.player, Number(event.target.value))}
                        className="h-11 w-full rounded-2xl border border-white/70 bg-white/75 px-3 text-right font-extrabold text-slate-900 outline-none focus:border-lime-400"
                      />
                    ) : (
                      <span className={paid ? "justify-self-end rounded-full bg-lime-100 px-4 py-2 font-extrabold text-[#247e24]" : "justify-self-end rounded-full bg-orange-50 px-4 py-2 font-extrabold text-orange-700"}>
                        {formatDh(contribution.amount)}
                      </span>
                    )}
                    <span className="text-right text-sm font-extrabold text-slate-700">{paid ? formatDh(contribution.lastAmount || contribution.amount) : "-"}</span>
                    <span className="text-right text-xs font-bold text-slate-500">{contribution.lastDate ? new Date(`${contribution.lastDate}T00:00:00`).toLocaleDateString("fr-FR") : "-"}</span>
                    <span className={remaining ? "text-right text-sm font-extrabold text-orange-700" : "text-right text-sm font-extrabold text-[#247e24]"}>
                      {remaining ? formatDh(remaining) : overpaid ? `+${formatDh(overpaid)}` : "0 dh"}
                    </span>

                    <div className="flex flex-wrap justify-end gap-2">
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
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <SectionTitle>Still To Collect</SectionTitle>
            <p className="mt-2 text-sm text-slate-600">{unpaidPlayers.length} players with no recorded contribution.</p>
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
                <p className="text-sm font-semibold text-[#247e24]">All active players have a recorded contribution.</p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Account Ledger</SectionTitle>
            <p className="mt-2 text-sm text-slate-600">Ins, outs, and booking deductions linked to scheduled matches.</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/60 bg-white/45">
              <div className="grid grid-cols-[90px_1fr_80px_80px] gap-2 border-b border-white/60 px-3 py-2 text-[11px] font-extrabold uppercase text-slate-500">
                <span>Date</span>
                <span>Item</span>
                <span className="text-right">In</span>
                <span className="text-right">Out</span>
              </div>
              <div className="divide-y divide-white/55">
                {accountRows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[90px_1fr_80px_80px] gap-2 px-3 py-3 text-xs">
                    <span className="font-bold text-slate-500">{row.date}</span>
                    <div className="min-w-0">
                      <p className="truncate font-extrabold text-slate-900">{row.description}</p>
                      <p className="text-[11px] font-semibold text-slate-500">{row.type}</p>
                    </div>
                    <span className="text-right font-extrabold text-[#247e24]">{row.in ? formatDh(row.in) : "-"}</span>
                    <span className="text-right font-extrabold text-orange-700">{row.out ? formatDh(row.out) : "-"}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">New match bookings automatically add one {formatDh(Math.abs(bookingCostAmount))} outflow; cancelled/deleted bookings add a reversal.</p>
          </Card>

          <Card>
            <SectionTitle>Quick Read</SectionTitle>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <p><span className="font-extrabold text-slate-900">{formatDh(strongestContribution.amount)}</span> highest contribution from {strongestContribution.player}.</p>
              <p><span className="font-extrabold text-slate-900">{formatDh(neededToZero)}</span> needed to bring the caisse back to zero.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
