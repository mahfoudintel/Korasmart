"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Pencil, Plus, Save, WalletCards } from "lucide-react";
import { players } from "@/lib/data";
import { canEditFinance } from "@/lib/access";
import { financeSnapshot, formatDh } from "@/lib/finance";
import { useRole } from "@/hooks/use-role";
import { Card, SectionTitle } from "@/components/ui/card";

type Contribution = {
  player: string;
  amount: number;
};

const storageKey = "korasmart-finance-admin-v1";

export function AdminFinancePanel() {
  const { role } = useRole();
  const canEdit = canEditFinance(role);
  const [adminMode, setAdminMode] = useState(false);
  const [balance, setBalance] = useState(financeSnapshot.balance);
  const [reservedUntil, setReservedUntil] = useState(financeSnapshot.reservedUntil);
  const [contributions, setContributions] = useState<Contribution[]>(financeSnapshot.contributions);

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
  }, [balance, reservedUntil, contributions]);

  const totalReceived = useMemo(
    () => contributions.reduce((sum, contribution) => sum + Number(contribution.amount || 0), 0),
    [contributions]
  );
  const paidPlayers = new Set(contributions.filter((item) => Number(item.amount) > 0).map((item) => item.player));
  const unpaidPlayers = players.filter((player) => !paidPlayers.has(player.name));
  const strongestContribution = contributions.reduce(
    (max, contribution) => (contribution.amount > max.amount ? contribution : max),
    contributions[0]
  );

  const updateContribution = (player: string, amount: number) => {
    setContributions((current) =>
      current.map((contribution) =>
        contribution.player === player ? { ...contribution, amount } : contribution
      )
    );
  };

  const addMissingPlayer = (player: string) => {
    setContributions((current) => [...current, { player, amount: 0 }]);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
        <Card className="relative overflow-hidden">
          <WalletCards className="h-8 w-8 text-lime-300" />
          <p className="mt-5 text-sm font-black uppercase text-white/60">Situation caisse</p>
          {adminMode && canEdit ? (
            <input
              type="number"
              value={balance}
              onChange={(event) => setBalance(Number(event.target.value))}
              className="mt-3 h-14 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-4xl font-black text-white outline-none focus:border-lime-300"
            />
          ) : (
            <p className={`mt-3 text-5xl font-black ${balance < 0 ? "text-orange-400" : "text-lime-300"}`}>
              {formatDh(balance)}
            </p>
          )}
          <p className="mt-3 text-sm text-white/65">Nouvelle situation de la caisse a ce jour</p>
        </Card>

        <Card>
          <p className="text-sm font-black uppercase text-white/60">Cotisations recues</p>
          <p className="mt-3 text-5xl font-black text-lime-300">{formatDh(totalReceived)}</p>
          <p className="mt-3 text-sm text-white/65">{paidPlayers.size}/{players.length} joueurs ont deja cotise</p>
          <div className="mt-5 h-3 rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-lime-300"
              style={{ width: `${Math.round((paidPlayers.size / players.length) * 100)}%` }}
            />
          </div>
        </Card>

        <Card>
          <CalendarCheck className="h-8 w-8 text-lime-300" />
          <p className="mt-5 text-sm font-black uppercase text-white/60">Reservation terrain</p>
          {adminMode && canEdit ? (
            <input
              type="date"
              value={reservedUntil}
              onChange={(event) => setReservedUntil(event.target.value)}
              className="mt-3 h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-lg font-black text-white outline-none focus:border-lime-300"
            />
          ) : (
            <p className="mt-3 text-3xl font-black text-white">Jusqu&apos;au {new Date(`${reservedUntil}T00:00:00`).toLocaleDateString("fr-FR")}</p>
          )}
          <p className="mt-3 text-sm text-white/65">Reserve chaque semaine</p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Cotisations par joueur</h2>
          <p className="text-sm text-white/62">
            {canEdit ? "Admin peut mettre a jour les montants avant connexion Supabase." : "Lecture seule. Demandez un acces finance ou admin pour modifier."}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setAdminMode((value) => !value)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lime-300 px-5 font-black text-black transition hover:bg-lime-200"
          >
            {adminMode ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {adminMode ? "Done editing" : "Admin edit"}
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
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 font-black text-white/82 transition hover:border-orange-400 hover:text-orange-300"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <Card>
          <SectionTitle>Received Payments</SectionTitle>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contributions.map((contribution) => (
              <div key={contribution.player} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-black">
                  {contribution.player.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1 font-black">{contribution.player}</span>
                {adminMode && canEdit ? (
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={contribution.amount}
                    onChange={(event) => updateContribution(contribution.player, Number(event.target.value))}
                    className="h-11 w-24 rounded-2xl border border-white/15 bg-black/15 text-center font-black text-lime-300 outline-none focus:border-lime-300"
                  />
                ) : (
                  <span className="rounded-full bg-lime-300/15 px-4 py-2 font-black text-lime-300">
                    {formatDh(contribution.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <SectionTitle>Still To Collect</SectionTitle>
            <div className="mt-5 flex flex-wrap gap-2">
              {unpaidPlayers.length ? (
                unpaidPlayers.map((player) => (
                  <button
                    key={player.name}
                    onClick={() => adminMode && canEdit && addMissingPlayer(player.name)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-sm font-bold text-white/82"
                  >
                    {adminMode && canEdit && <Plus className="h-4 w-4 text-lime-300" />}
                    {player.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-lime-300">All players have a recorded contribution.</p>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Quick Read</SectionTitle>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p><span className="font-black text-white">{formatDh(strongestContribution.amount)}</span> highest contribution from {strongestContribution.player}.</p>
              <p><span className="font-black text-white">{formatDh(Math.abs(balance))}</span> needed to bring the caisse back to zero.</p>
              <p>Use admin edit now; later these edits should save to `payments`, `expenses`, and a finance snapshot in Supabase.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
