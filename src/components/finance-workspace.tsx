"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Coins, CreditCard, History, MinusCircle, Plus, Search, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import { canEditFinance } from "@/lib/access";
import { financeSnapshot, formatDh } from "@/lib/finance";
import { useRole } from "@/hooks/use-role";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useMembers } from "@/hooks/use-members";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";
import { Card, SectionTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { translateText } from "@/lib/translations";

type Contribution = {
  player: string;
  amount: number;
  lastAmount?: number;
  lastDate?: string;
};

type ContributionRow = {
  player: string;
  amount: number;
  lastAmount: number;
  lastDate: string;
  remaining: number;
  overpaid: number;
  status: "Paid" | "Partial" | "Unpaid";
};

type PaymentAccount = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  note: string;
};

const storageKey = "korasmart-finance-admin-v1";
const expectedContribution = 200;
const todayInputValue = () => new Date().toISOString().slice(0, 10);
const defaultPaymentAccount: PaymentAccount = {
  accountName: "KoraSmart Caisse",
  bankName: "Cash / bank transfer",
  accountNumber: "Ask Najib or Nawfal",
  note: "Send proof after payment."
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR");
}

function MoneyCard({
  label,
  value,
  caption,
  icon: Icon,
  tone = "navy"
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof WalletCards;
  tone?: "green" | "orange" | "navy";
}) {
  return (
    <Card className="min-h-[148px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[.16em] text-slate-500">{label}</p>
          <p
            className={cn(
              "mt-3 text-3xl font-black tracking-normal sm:text-4xl",
              tone === "green" && "text-[#238923]",
              tone === "orange" && "text-orange-600",
              tone === "navy" && "text-slate-950"
            )}
          >
            {value}
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-100 text-[#2f9e2f]">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-5 text-slate-600">{caption}</p>
    </Card>
  );
}

function StatusPill({ status }: { status: ContributionRow["status"] }) {
  const { language } = useLanguage();
  const label = translateText(status, language);

  return (
    <span
      className={cn(
        "justify-self-end rounded-full px-3 py-1 text-xs font-black",
        status === "Paid" && "bg-lime-100 text-[#247e24]",
        status === "Partial" && "bg-amber-50 text-amber-700",
        status === "Unpaid" && "bg-orange-50 text-orange-700"
      )}
    >
      {label}
    </span>
  );
}

export function FinanceWorkspace() {
  const { role } = useRole();
  const { language } = useLanguage();
  const { profile } = useLocalProfile();
  const { members } = useMembers();
  const { reservations } = useReservations();
  const { transactions, transactionTotal } = useFinanceTransactions();
  const canEdit = canEditFinance(role);
  const [baseBalance, setBaseBalance] = useState(financeSnapshot.balance);
  const [reservedUntil] = useState(financeSnapshot.reservedUntil);
  const [contributions, setContributions] = useState<Contribution[]>(financeSnapshot.contributions);
  const [query, setQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(profile.playerName);
  const [entryAmount, setEntryAmount] = useState(200);
  const [entryDate, setEntryDate] = useState(todayInputValue);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount>(defaultPaymentAccount);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const t = (text: string) => translateText(text, language);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { balance?: number; contributions?: Contribution[]; paymentAccount?: Partial<PaymentAccount> };
      if (typeof parsed.balance === "number") setBaseBalance(parsed.balance);
      if (parsed.paymentAccount) setPaymentAccount({ ...defaultPaymentAccount, ...parsed.paymentAccount });
      if (Array.isArray(parsed.contributions)) {
        setContributions(
          parsed.contributions.map((item) => ({
            ...item,
            lastAmount: item.lastAmount ?? item.amount,
            lastDate: item.lastDate || ""
          }))
        );
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ balance: baseBalance, reservedUntil, contributions, paymentAccount }));
    setLastSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
  }, [baseBalance, reservedUntil, contributions, paymentAccount]);

  useEffect(() => {
    if (!selectedPlayer && members[0]) setSelectedPlayer(members[0].name);
  }, [members, selectedPlayer]);

  const contributionRows = useMemo<ContributionRow[]>(
    () =>
      members.map((member) => {
        const contribution = contributions.find((item) => item.player === member.name);
        const amount = Number(contribution?.amount || 0);
        const remaining = Math.max(expectedContribution - amount, 0);
        return {
          player: member.name,
          amount,
          lastAmount: Number(contribution?.lastAmount || 0),
          lastDate: contribution?.lastDate || "",
          remaining,
          overpaid: Math.max(amount - expectedContribution, 0),
          status: amount >= expectedContribution ? "Paid" : amount > 0 ? "Partial" : "Unpaid"
        };
      }),
    [contributions, members]
  );

  const filteredRows = contributionRows.filter((row) => row.player.toLowerCase().includes(query.trim().toLowerCase()));
  const totalReceived = contributionRows.reduce((sum, row) => sum + row.amount, 0);
  const paidCount = contributionRows.filter((row) => row.amount > 0).length;
  const unpaidRows = contributionRows.filter((row) => row.amount <= 0);
  const adjustedBalance = baseBalance + transactionTotal;
  const bookingCostTotal = Math.abs(transactions.filter((item) => item.type === "booking_cost").reduce((sum, item) => sum + item.amount, 0));
  const bookingReversalTotal = transactions.filter((item) => item.type === "booking_cost_reversal").reduce((sum, item) => sum + item.amount, 0);
  const netBookingCosts = bookingCostTotal - bookingReversalTotal;
  const myContribution = contributionRows.find((row) => row.player === profile.playerName);

  const bookingRows = transactions
    .filter((transaction) => transaction.type === "booking_cost" || transaction.type === "booking_cost_reversal")
    .map((transaction) => {
      const reservation = transaction.bookingId ? reservations.find((item) => item.id === transaction.bookingId) : undefined;
      return {
        id: transaction.id,
        date: new Date(transaction.createdAt).toLocaleDateString("fr-FR"),
        match: reservation ? `${formatReservationDate(reservation.date)} ${reservation.time}` : transaction.note.replace("Booking cost: ", ""),
        location: reservation?.venue || "-",
        amount: transaction.amount,
        status: transaction.type === "booking_cost_reversal" ? "Reversed" : "Deducted"
      };
    });

  const ledgerRows = [
    ...contributionRows
      .filter((row) => row.amount > 0)
      .map((row) => ({
        id: `contribution-${row.player}`,
        date: formatDate(row.lastDate),
        item: row.player,
        type: "Contribution",
        inAmount: row.amount,
        outAmount: 0
      })),
    ...bookingRows.map((row) => ({
      id: row.id,
      date: row.date,
      item: row.match,
      type: row.status,
      inAmount: row.amount > 0 ? row.amount : 0,
      outAmount: row.amount < 0 ? Math.abs(row.amount) : 0
    }))
  ];

  const addContribution = () => {
    const amount = Math.max(Number(entryAmount || 0), 0);
    if (!selectedPlayer || !amount) return;

    setContributions((current) => {
      const existing = current.find((item) => item.player === selectedPlayer);
      return existing
        ? current.map((item) =>
            item.player === selectedPlayer
              ? { ...item, amount: item.amount + amount, lastAmount: amount, lastDate: entryDate }
              : item
          )
        : [...current, { player: selectedPlayer, amount, lastAmount: amount, lastDate: entryDate }];
    });
  };

  const updateTotal = (player: string, amount: number) => {
    const safeAmount = Math.max(Number(amount || 0), 0);
    setContributions((current) => {
      const existing = current.find((item) => item.player === player);
      return existing
        ? current.map((item) =>
            item.player === player
              ? { ...item, amount: safeAmount, lastAmount: safeAmount, lastDate: item.lastDate || todayInputValue() }
              : item
          )
        : [...current, { player, amount: safeAmount, lastAmount: safeAmount, lastDate: todayInputValue() }];
    });
  };

  const clearContribution = (player: string) => {
    setContributions((current) =>
      current.map((item) => (item.player === player ? { ...item, amount: 0, lastAmount: 0, lastDate: "" } : item))
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MoneyCard
          label={t("Balance")}
          value={formatDh(adjustedBalance)}
          tone={adjustedBalance < 0 ? "orange" : "green"}
          icon={WalletCards}
          caption={adjustedBalance < 0 ? t("Amount needed to reach zero.") : t("Caisse is positive.")}
        />
        <MoneyCard label={t("Contributions")} value={formatDh(totalReceived)} tone="green" icon={Coins} caption={t("Total paid by players.")} />
        <MoneyCard label={t("Booking costs")} value={formatDh(netBookingCosts)} tone="orange" icon={CalendarCheck} caption={t("New bookings deduct automatically.")} />
        <MoneyCard label={t("Unpaid players")} value={`${unpaidRows.length}`} tone={unpaidRows.length ? "orange" : "green"} icon={UserRound} caption={`${paidCount}/${members.length} ${t("players paid")}.`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <SectionTitle>{t("Contribution ledger")}</SectionTitle>
              <p className="mt-2 text-sm font-semibold text-slate-600">{t("Player totals, last contribution, and remaining amount.")}</p>
            </div>
            <label className="relative block w-full lg:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("Search player")}
                className="h-11 w-full rounded-2xl border border-white/70 bg-white/72 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:border-lime-400"
              />
            </label>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {filteredRows.map((row) => (
              <div key={row.player} className="rounded-[18px] border border-white/60 bg-white/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-slate-950">{row.player}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {t("Last date")}: {formatDate(row.lastDate)}
                    </p>
                  </div>
                  <StatusPill status={row.status} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-500">
                  <span>{t("Total")}</span>
                  <span>{t("Last amount")}</span>
                  <span>{t("Remaining")}</span>
                  <span className="text-sm font-black text-slate-950">{formatDh(row.amount)}</span>
                  <span className="text-sm font-black text-slate-950">{row.lastAmount ? formatDh(row.lastAmount) : "-"}</span>
                  <span className={cn("text-sm font-black", row.remaining ? "text-orange-700" : "text-[#247e24]")}>
                    {row.remaining ? formatDh(row.remaining) : row.overpaid ? `+${formatDh(row.overpaid)}` : "0 dh"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 hidden overflow-x-auto rounded-[18px] border border-white/60 bg-white/42 md:block">
            <div className="min-w-[820px]">
              <div
                className={cn(
                  "grid gap-3 border-b border-white/60 px-4 py-3 text-xs font-black uppercase tracking-[.08em] text-slate-500",
                  canEdit ? "grid-cols-[1.2fr_110px_115px_115px_110px_110px_92px]" : "grid-cols-[1.2fr_110px_115px_115px_110px_110px]"
                )}
              >
                <span>{t("Player")}</span>
                <span className="text-right">{t("Total paid")}</span>
                <span className="text-right">{t("Last amount")}</span>
                <span className="text-right">{t("Last date")}</span>
                <span className="text-right">{t("Remaining")}</span>
                <span className="text-right">{t("Status")}</span>
                {canEdit && <span className="text-right">{t("Action")}</span>}
              </div>
              <div className="divide-y divide-white/55">
                {filteredRows.map((row) => (
                  <div
                    key={row.player}
                    className={cn(
                      "grid items-center gap-3 px-4 py-3",
                      canEdit ? "grid-cols-[1.2fr_110px_115px_115px_110px_110px_92px]" : "grid-cols-[1.2fr_110px_115px_115px_110px_110px]"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", row.status === "Paid" ? "bg-lime-100 text-[#247e24]" : "bg-orange-50 text-orange-700")}>
                        {row.status === "Paid" ? <CheckCircle2 className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                      </span>
                      <p className="truncate font-black text-slate-950">{row.player}</p>
                    </div>
                    {canEdit ? (
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={row.amount}
                        onChange={(event) => updateTotal(row.player, Number(event.target.value))}
                        className="h-10 rounded-2xl border border-white/70 bg-white/75 px-3 text-right text-sm font-black text-slate-900 outline-none focus:border-lime-400"
                      />
                    ) : (
                      <span className="text-right text-sm font-black text-slate-950">{formatDh(row.amount)}</span>
                    )}
                    <span className="text-right text-sm font-black text-slate-700">{row.lastAmount ? formatDh(row.lastAmount) : "-"}</span>
                    <span className="text-right text-xs font-bold text-slate-500">{formatDate(row.lastDate)}</span>
                    <span className={cn("text-right text-sm font-black", row.remaining ? "text-orange-700" : "text-[#247e24]")}>
                      {row.remaining ? formatDh(row.remaining) : row.overpaid ? `+${formatDh(row.overpaid)}` : "0 dh"}
                    </span>
                    <StatusPill status={row.status} />
                    {canEdit && (
                      <button onClick={() => clearContribution(row.player)} className="inline-flex h-10 items-center justify-end gap-2 rounded-2xl px-3 text-xs font-black text-orange-700 transition hover:bg-orange-50">
                        <MinusCircle className="h-4 w-4" />
                        {t("Clear")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          {canEdit ? (
            <Card>
              <div className="flex items-center justify-between gap-3">
                <SectionTitle>{t("Add contribution")}</SectionTitle>
                {lastSavedAt && <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-slate-500">{t("Saved")} {lastSavedAt}</span>}
              </div>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Opening balance")}</span>
                  <input type="number" value={baseBalance} onChange={(event) => setBaseBalance(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400" />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Player")}</span>
                  <select value={selectedPlayer} onChange={(event) => setSelectedPlayer(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400">
                    {members.map((member) => (
                      <option key={member.name} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Amount")}</span>
                    <input type="number" min="0" step="10" value={entryAmount} onChange={(event) => setEntryAmount(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t("Paid on")}</span>
                    <input type="date" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400" />
                  </label>
                </div>
                <button onClick={addContribution} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white shadow-[0_16px_30px_rgba(47,158,47,.22)]">
                  <Plus className="h-5 w-5" />
                  {t("Add payment")}
                </button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionTitle>{t("My contribution")}</SectionTitle>
                  <p className="mt-4 text-4xl font-black text-[#238923]">{formatDh(myContribution?.amount || 0)}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime-100 text-[#2f9e2f]">
                  <CreditCard className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                {[
                  [t("Last amount"), myContribution?.lastAmount ? formatDh(myContribution.lastAmount) : "-"],
                  [t("Last date"), formatDate(myContribution?.lastDate)],
                  [t("Remaining"), formatDh(myContribution?.remaining || 0)]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3">
                    <span className="font-bold text-slate-600">{label}</span>
                    <span className="font-black text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPaymentOpen(true)} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-5 font-black text-white shadow-[0_16px_30px_rgba(47,158,47,.22)]">
                <CreditCard className="h-5 w-5" />
                {t("Make contribution")}
              </button>
            </Card>
          )}

          <Card>
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>{t("Payment account")}</SectionTitle>
              {!canEdit && (
                <button onClick={() => setPaymentOpen((value) => !value)} className="rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-[#247e24]">
                  {paymentOpen ? t("Hide") : t("Show")}
                </button>
              )}
            </div>

            {canEdit ? (
              <div className="mt-5 space-y-3">
                {[
                  ["Account name", "accountName"],
                  ["Payment method", "bankName"],
                  ["Account details", "accountNumber"],
                  ["Payment note", "note"]
                ].map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t(label)}</span>
                    <input
                      value={paymentAccount[key as keyof PaymentAccount]}
                      onChange={(event) => setPaymentAccount((current) => ({ ...current, [key]: event.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-bold text-slate-900 outline-none focus:border-lime-400"
                    />
                  </label>
                ))}
              </div>
            ) : paymentOpen ? (
              <div className="mt-5 space-y-3 text-sm">
                {[
                  ["Account name", paymentAccount.accountName],
                  ["Payment method", paymentAccount.bankName],
                  ["Account details", paymentAccount.accountNumber],
                  ["Payment note", paymentAccount.note]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/55 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">{t(label)}</p>
                    <p className="mt-1 font-black text-slate-950">{t(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{t("Open this when you are ready to contribute.")}</p>
            )}
          </Card>

          <Card>
            <SectionTitle>{canEdit ? t("Finance access") : t("Transparency")}</SectionTitle>
            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              <div className="flex gap-3 rounded-2xl bg-white/55 p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#238923]" />
                <p>{canEdit ? t("You can update contributions and payment dates.") : t("Everyone can see contribution totals.")}</p>
              </div>
              <div className="flex gap-3 rounded-2xl bg-white/55 p-3">
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#238923]" />
                <p>{t("Booking cost is linked to matches.")}</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>{t("Booking costs")}</SectionTitle>
            <div className="mt-4 space-y-2">
              {bookingRows.length ? (
                bookingRows.slice(-5).reverse().map((row) => (
                  <div key={row.id} className="rounded-2xl bg-white/55 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-950">{row.match}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">{row.location}</p>
                      </div>
                      <span className={cn("shrink-0 font-black", row.amount < 0 ? "text-orange-700" : "text-[#247e24]")}>
                        {formatDh(row.amount)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-semibold text-slate-600">{t("No booking costs recorded yet.")}</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionTitle>{t("Account ledger")}</SectionTitle>
            <p className="mt-2 text-sm font-semibold text-slate-600">{t("Ins, outs, and booking deductions.")}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/65 px-3 py-2 text-xs font-black text-slate-600">
            <History className="h-4 w-4" />
            {ledgerRows.length} {t("rows")}
          </span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-[18px] border border-white/60 bg-white/42">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[120px_1fr_180px_110px_110px] gap-3 border-b border-white/60 px-4 py-3 text-xs font-black uppercase tracking-[.08em] text-slate-500">
              <span>{t("Date")}</span>
              <span>{t("Item")}</span>
              <span>{t("Type")}</span>
              <span className="text-right">{t("In")}</span>
              <span className="text-right">{t("Outflow")}</span>
            </div>
            <div className="divide-y divide-white/55">
              {ledgerRows.map((row) => (
                <div key={row.id} className="grid grid-cols-[120px_1fr_180px_110px_110px] items-center gap-3 px-4 py-3 text-sm">
                  <span className="font-bold text-slate-500">{row.date}</span>
                  <span className="truncate font-black text-slate-950">{row.item}</span>
                  <span className="font-bold text-slate-600">{t(row.type)}</span>
                  <span className="text-right font-black text-[#247e24]">{row.inAmount ? formatDh(row.inAmount) : "-"}</span>
                  <span className="text-right font-black text-orange-700">{row.outAmount ? formatDh(row.outAmount) : "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
