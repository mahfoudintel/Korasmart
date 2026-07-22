"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Coins,
  CreditCard,
  Download,
  Eye,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import { canEditFinance } from "@/lib/access";
import { financeSnapshot, formatDh, isAfterFinanceBaseline } from "@/lib/finance";
import { useLanguage } from "@/components/language-provider";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useMembers } from "@/hooks/use-members";
import { useRole } from "@/hooks/use-role";
import { useFinanceTransactions } from "@/hooks/use-finance-transactions";
import { useReservations } from "@/hooks/use-reservations";
import { formatReservationDate } from "@/lib/reservations";
import { translateText } from "@/lib/translations";
import { Card, SectionTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FinanceView = "player" | "admin";
type ContributionStatus = "Paid" | "Unpaid";

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
  status: ContributionStatus;
};

type PaymentAccount = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  note: string;
};

type LedgerRow = {
  id: string;
  date: string;
  item: string;
  type: string;
  inAmount: number;
  outAmount: number;
};

const storageKey = "korasmart-finance-admin-v1";
const storageVersion = "2026-07-22-clean-baseline-230";
const defaultPaymentAccount: PaymentAccount = {
  accountName: "KoraSmart Caisse",
  bankName: "Cash / bank transfer",
  accountNumber: "Ask Najib or Nawfal",
  note: "Send proof after payment."
};

const todayInputValue = () => new Date().toISOString().slice(0, 10);

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR");
}

function StatusPill({ status }: { status: ContributionStatus }) {
  const { language } = useLanguage();
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-black", status === "Paid" ? "bg-lime-100 text-[#247e24]" : "bg-orange-50 text-orange-700")}>
      {translateText(status, language)}
    </span>
  );
}

function MetricCard({
  label,
  value,
  caption,
  icon: Icon,
  tone = "green",
  action
}: {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone?: "green" | "orange" | "blue";
  action?: React.ReactNode;
}) {
  return (
    <Card className="min-h-[142px] rounded-[18px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[.06em] text-slate-500">{label}</p>
          <p className={cn("mt-5 text-3xl font-black tracking-normal", tone === "green" && "text-[#238923]", tone === "orange" && "text-orange-600", tone === "blue" && "text-blue-700")}>
            {value}
          </p>
        </div>
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", tone === "green" && "bg-lime-100 text-[#2f9e2f]", tone === "orange" && "bg-orange-50 text-orange-600", tone === "blue" && "bg-blue-50 text-blue-700")}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold leading-5 text-slate-600">{caption}</p>
        {action}
      </div>
    </Card>
  );
}

function ViewToggle({ view, setView, t }: { view: FinanceView; setView: (view: FinanceView) => void; t: (text: string) => string }) {
  return (
    <div className="inline-flex rounded-2xl border border-white/70 bg-white/60 p-1">
      {(["player", "admin"] as FinanceView[]).map((item) => (
        <button
          key={item}
          onClick={() => setView(item)}
          className={cn("h-9 rounded-xl px-4 text-xs font-black transition", view === item ? "bg-[#35b43a] text-white shadow-sm" : "text-slate-600 hover:bg-white/80")}
        >
          {item === "player" ? t("Player View") : t("Admin View")}
        </button>
      ))}
    </div>
  );
}

function ContributionsModal({ rows, total, onClose, t }: { rows: ContributionRow[]; total: number; onClose: () => void; t: (text: string) => string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[24px] border border-white/70 bg-white p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">{t("All Contributions")}</h2>
            <p className="mt-3 text-sm font-black text-blue-700">
              {t("Total")}: {formatDh(total)}
            </p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label={t("Close")}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 max-h-[58vh] overflow-auto rounded-2xl border border-slate-100">
          <div className="grid grid-cols-[1fr_100px_90px_110px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[.06em] text-slate-500">
            <span>{t("Player")}</span>
            <span className="text-right">{t("Amount")}</span>
            <span className="text-center">{t("Status")}</span>
            <span className="text-right">{t("Date")}</span>
          </div>
          {rows.filter((row) => row.amount > 0).map((row) => (
            <div key={row.player} className="grid grid-cols-[1fr_100px_90px_110px] items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0">
              <span className="font-black text-slate-950">{row.player}</span>
              <span className="text-right font-bold text-slate-700">{formatDh(row.amount)}</span>
              <span className="text-center"><StatusPill status={row.status} /></span>
              <span className="text-right text-xs font-bold text-slate-500">{formatDate(row.lastDate)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FinanceWorkspaceV2({ initialView = "player" }: { initialView?: FinanceView }) {
  const { role } = useRole();
  const { language } = useLanguage();
  const { profile } = useLocalProfile();
  const { members } = useMembers();
  const { reservations } = useReservations();
  const { transactions } = useFinanceTransactions();
  const canEdit = canEditFinance(role);
  const [view, setView] = useState<FinanceView>(initialView);
  const [baseBalance, setBaseBalance] = useState(financeSnapshot.balance);
  const [contributions, setContributions] = useState<Contribution[]>(financeSnapshot.contributions);
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount>(defaultPaymentAccount);
  const [selectedPlayer, setSelectedPlayer] = useState(profile.playerName);
  const [entryAmount, setEntryAmount] = useState(100);
  const [entryDate, setEntryDate] = useState(todayInputValue);
  const [query, setQuery] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [showContributions, setShowContributions] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);
  const t = (text: string) => translateText(text, language);

  useEffect(() => {
    setView(canEdit && initialView === "admin" ? "admin" : "player");
  }, [canEdit, initialView]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { version?: string; balance?: number; contributions?: Contribution[]; paymentAccount?: Partial<PaymentAccount> };
      if (parsed.paymentAccount) setPaymentAccount({ ...defaultPaymentAccount, ...parsed.paymentAccount });
      if (parsed.version !== storageVersion) return;
      if (typeof parsed.balance === "number") setBaseBalance(parsed.balance);
      if (Array.isArray(parsed.contributions)) setContributions(parsed.contributions);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ version: storageVersion, balance: baseBalance, contributions, paymentAccount }));
    setLastSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
  }, [baseBalance, contributions, paymentAccount]);

  useEffect(() => {
    if (!selectedPlayer && members[0]) setSelectedPlayer(members[0].name);
  }, [members, selectedPlayer]);

  const contributionRows = useMemo<ContributionRow[]>(
    () =>
      members.map((member) => {
        const contribution = contributions.find((item) => item.player === member.name);
        const amount = Number(contribution?.amount || 0);
        return {
          player: member.name,
          amount,
          lastAmount: Number(contribution?.lastAmount || 0),
          lastDate: contribution?.lastDate || "",
          status: amount > 0 ? "Paid" : "Unpaid"
        };
      }),
    [contributions, members]
  );

  const activeTransactions = transactions.filter((transaction) => isAfterFinanceBaseline(transaction.createdAt));
  const adjustedBalance = baseBalance + activeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalReceived = contributionRows.reduce((sum, row) => sum + row.amount, 0);
  const paidRows = contributionRows.filter((row) => row.amount > 0);
  const unpaidRows = contributionRows.filter((row) => row.amount <= 0);
  const myContribution = contributionRows.find((row) => row.player === profile.playerName);
  const bookingCostTotal = Math.abs(activeTransactions.filter((item) => item.type === "booking_cost").reduce((sum, item) => sum + item.amount, 0));
  const bookingReversalTotal = activeTransactions.filter((item) => item.type === "booking_cost_reversal").reduce((sum, item) => sum + item.amount, 0);
  const totalUsed = financeSnapshot.usedAmount + bookingCostTotal - bookingReversalTotal;
  const maxMetric = Math.max(totalReceived, totalUsed, adjustedBalance, 1);
  const nextReservation = reservations.find((reservation) => reservation.status !== "past");
  const filteredRows = contributionRows.filter((row) => row.player.toLowerCase().includes(query.trim().toLowerCase()));
  const upcomingReservations = nextReservation
    ? [nextReservation, ...reservations.filter((item) => item.id !== nextReservation.id && item.status !== "past").slice(0, 4)]
    : [];
  const bookingRows = activeTransactions
    .filter((transaction) => transaction.type === "booking_cost" || transaction.type === "booking_cost_reversal")
    .map((transaction) => {
      const reservation = transaction.bookingId ? reservations.find((item) => item.id === transaction.bookingId) : undefined;
      return {
        id: transaction.id,
        date: new Date(transaction.createdAt).toLocaleDateString("fr-FR"),
        item: reservation ? `${formatReservationDate(reservation.date)} ${reservation.time}` : transaction.note.replace("Booking cost: ", ""),
        amount: transaction.amount,
        type: transaction.type === "booking_cost_reversal" ? "Reversed" : "Field reservation"
      };
    });
  const ledgerRows: LedgerRow[] = [
    ...paidRows.map((row) => ({
      id: `contribution-${row.player}`,
      date: formatDate(row.lastDate),
      item: `${t("Contribution")} - ${row.player}`,
      type: "Contribution",
      inAmount: row.amount,
      outAmount: 0
    })),
    { id: "baseline-used-amount", date: formatDate("2026-07-22"), item: "Baseline used amount", type: "Outflow", inAmount: 0, outAmount: financeSnapshot.usedAmount },
    ...bookingRows.map((row) => ({ id: row.id, date: row.date, item: row.item, type: row.type, inAmount: row.amount > 0 ? row.amount : 0, outAmount: row.amount < 0 ? Math.abs(row.amount) : 0 }))
  ];

  const addContribution = () => {
    const amount = Math.max(Number(entryAmount || 0), 0);
    if (!canEdit || !selectedPlayer || !amount) return;
    setBaseBalance((current) => current + amount);
    setContributions((current) => {
      const existing = current.find((item) => item.player === selectedPlayer);
      return existing
        ? current.map((item) => (item.player === selectedPlayer ? { ...item, amount: item.amount + amount, lastAmount: amount, lastDate: entryDate } : item))
        : [...current, { player: selectedPlayer, amount, lastAmount: amount, lastDate: entryDate }];
    });
  };

  const updateTotal = (player: string, amount: number) => {
    if (!canEdit) return;
    const safeAmount = Math.max(Number(amount || 0), 0);
    const previous = contributionRows.find((row) => row.player === player)?.amount || 0;
    setBaseBalance((current) => current + safeAmount - previous);
    setContributions((current) => {
      const existing = current.find((item) => item.player === player);
      return existing
        ? current.map((item) => (item.player === player ? { ...item, amount: safeAmount, lastAmount: safeAmount, lastDate: item.lastDate || todayInputValue() } : item))
        : [...current, { player, amount: safeAmount, lastAmount: safeAmount, lastDate: todayInputValue() }];
    });
  };

  const downloadReport = () => {
    const rows = [["Date", "Item", "Type", "In", "Out"], ...ledgerRows.map((row) => [row.date, row.item, t(row.type), String(row.inAmount), String(row.outAmount)])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "korasmart-finances.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const playerView = (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard label={t("Current Balance")} value={formatDh(adjustedBalance)} tone={adjustedBalance < 0 ? "orange" : "green"} icon={WalletCards} caption={adjustedBalance >= 0 ? t("Positive balance") : t("Amount needed to reach zero.")} />
        <MetricCard label={t("My Contribution")} value={formatDh(myContribution?.amount || 0)} tone={myContribution?.amount ? "green" : "orange"} icon={CreditCard} caption={myContribution?.amount ? t("Thank you for your contribution.") : t("Contribution not recorded yet.")} action={<StatusPill status={myContribution?.status || "Unpaid"} />} />
        <MetricCard label={t("Total Funds")} value={formatDh(totalReceived)} tone="blue" icon={Coins} caption={t("Total contributions")} action={<button onClick={() => setShowContributions(true)} className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-black text-blue-700">{t("View details")}<ArrowRight className="h-4 w-4" /></button>} />
        <MetricCard label={t("Reservations")} value={formatDate(financeSnapshot.reservedUntil)} tone="orange" icon={CalendarCheck} caption={t("Field reserved weekly")} action={<Link href="/matches" className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-black text-blue-700">{t("Matches")}<ArrowRight className="h-4 w-4" /></Link>} />
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle>{t("Recent Activity")}</SectionTitle>
          <button onClick={() => setShowPayment(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-4 text-sm font-black text-white">
            <CreditCard className="h-4 w-4" />
            {t("Make contribution")}
          </button>
        </div>
        <div className="mt-5 divide-y divide-white/60 rounded-[18px] border border-white/60 bg-white/45">
          {ledgerRows.slice(0, 6).map((row) => (
            <div key={row.id} className="grid grid-cols-[90px_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
              <span className="font-bold text-slate-500">{row.date}</span>
              <span className="truncate font-bold text-slate-700">{t(row.item)}</span>
              <span className={cn("font-black", row.inAmount ? "text-[#247e24]" : "text-orange-700")}>{row.inAmount ? `+${formatDh(row.inAmount)}` : `-${formatDh(row.outAmount)}`}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/70 text-slate-800"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <SectionTitle>{t("Important Reminder")}</SectionTitle>
            <p className="mt-2 text-sm font-semibold text-slate-600">{t("Please pay your contribution on time to keep the fund healthy.")}</p>
          </div>
        </div>
        <button onClick={() => setShowPayment(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-black text-slate-900">
          <Eye className="h-4 w-4" />
          {t("Payment account")}
        </button>
      </Card>
    </div>
  );

  const adminView = (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t("Current Balance")} value={formatDh(adjustedBalance)} tone={adjustedBalance < 0 ? "orange" : "green"} icon={WalletCards} caption={adjustedBalance >= 0 ? t("Positive balance") : t("Amount needed to reach zero.")} />
        <MetricCard label={t("Total Contributions")} value={formatDh(totalReceived)} tone="green" icon={Coins} caption={`${paidRows.length} ${t("players paid")}`} />
        <MetricCard label={t("Total Used")} value={formatDh(totalUsed)} tone="orange" icon={CalendarCheck} caption={t("Reservations")} />
        <MetricCard label={t("Unpaid")} value={`${unpaidRows.length}`} tone={unpaidRows.length ? "orange" : "green"} icon={CheckCircle2} caption={unpaidRows.length ? t("Needs follow-up") : t("All paid")} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Card>
          <SectionTitle>{t("Financial Summary")}</SectionTitle>
          <div className="mt-5 flex h-56 items-end gap-4 rounded-[18px] border border-white/60 bg-white/45 p-5">
            {[
              { label: t("Contributions"), amount: totalReceived, color: "bg-blue-500" },
              { label: t("Total Used"), amount: totalUsed, color: "bg-orange-500" },
              { label: t("Current Balance"), amount: Math.max(adjustedBalance, 0), color: "bg-[#35b43a]" }
            ].map((item) => (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div className={cn("min-h-4 rounded-t-2xl", item.color)} style={{ height: `${Math.max((item.amount / maxMetric) * 100, 6)}%` }} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[.06em] text-slate-500">{item.label}</p>
                  <p className="text-sm font-black text-slate-950">{formatDh(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>{t("Quick Actions")}</SectionTitle>
            {lastSavedAt && <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-slate-500">{t("Saved")} {lastSavedAt}</span>}
          </div>
          <div className="mt-5 space-y-3">
            <select value={selectedPlayer} onChange={(event) => setSelectedPlayer(event.target.value)} className="h-12 w-full rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400">
              {members.map((member) => <option key={member.name} value={member.name}>{member.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min="0" step="10" value={entryAmount} onChange={(event) => setEntryAmount(Number(event.target.value))} className="h-12 rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400" aria-label={t("Amount")} />
              <input type="date" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} className="h-12 rounded-2xl border border-white/70 bg-white/75 px-4 font-black text-slate-900 outline-none focus:border-lime-400" aria-label={t("Paid on")} />
            </div>
            <button onClick={addContribution} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#35b43a] px-4 font-black text-white"><Plus className="h-5 w-5" />{t("Add Contribution")}</button>
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 font-black text-orange-700" title={t("Booking expenses are recorded from Matches.")}><ReceiptText className="h-5 w-5" />{t("Record Expense")}</button>
            <button onClick={downloadReport} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 font-black text-slate-900"><Download className="h-5 w-5" />{t("Download Report")}</button>
            <button onClick={() => setShowUnpaid((value) => !value)} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 font-black text-slate-900"><UserRound className="h-5 w-5" />{t("View Unpaid")}</button>
          </div>
        </Card>
      </div>

      {showUnpaid && (
        <Card>
          <SectionTitle>{t("Unpaid Players")}</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {unpaidRows.length ? unpaidRows.map((row) => <span key={row.player} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">{row.player}</span>) : <span className="rounded-full bg-lime-100 px-4 py-2 text-sm font-black text-[#247e24]">{t("All paid")}</span>}
          </div>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle>{t("Contributions by Player")}</SectionTitle>
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search player")} className="h-11 w-full rounded-2xl border border-white/70 bg-white/72 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:border-lime-400" />
            </label>
          </div>
          <div className="mt-5 overflow-x-auto rounded-[18px] border border-white/60 bg-white/42">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1fr_92px_100px_112px_84px] gap-3 border-b border-white/60 px-4 py-3 text-xs font-black uppercase tracking-[.06em] text-slate-500">
                <span>{t("Player")}</span><span className="text-center">{t("Status")}</span><span className="text-right">{t("Amount")}</span><span className="text-right">{t("Last Payment")}</span><span className="text-right">{t("Last amount")}</span>
              </div>
              {filteredRows.map((row) => (
                <div key={row.player} className="grid grid-cols-[1fr_92px_100px_112px_84px] items-center gap-3 border-b border-white/55 px-4 py-3 text-sm last:border-b-0">
                  <span className="font-black text-slate-950">{row.player}</span>
                  <StatusPill status={row.status} />
                  <input type="number" min="0" step="10" value={row.amount} onChange={(event) => updateTotal(row.player, Number(event.target.value))} className="h-10 rounded-2xl border border-white/70 bg-white/75 px-3 text-right text-sm font-black text-slate-900 outline-none focus:border-lime-400" />
                  <span className="text-right text-xs font-bold text-slate-500">{formatDate(row.lastDate)}</span>
                  <span className="text-right text-xs font-black text-slate-500">{row.lastAmount ? formatDh(row.lastAmount) : "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>{t("Recent Transactions")}</SectionTitle>
          <div className="mt-5 divide-y divide-white/60 rounded-[18px] border border-white/60 bg-white/42">
            {ledgerRows.slice(0, 10).map((row) => (
              <div key={row.id} className="grid grid-cols-[90px_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <span className="font-bold text-slate-500">{row.date}</span>
                <span className="truncate font-bold text-slate-700">{t(row.item)}</span>
                <span className={cn("font-black", row.inAmount ? "text-[#247e24]" : "text-orange-700")}>{row.inAmount ? `+${formatDh(row.inAmount)}` : `-${formatDh(row.outAmount)}`}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{t("Upcoming Reservations")}</SectionTitle>
        <div className="mt-5 overflow-x-auto rounded-[18px] border border-white/60 bg-white/42">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[120px_110px_1fr_100px_110px] gap-3 border-b border-white/60 px-4 py-3 text-xs font-black uppercase tracking-[.06em] text-slate-500">
              <span>{t("Date")}</span><span>{t("Time")}</span><span>{t("Location")}</span><span className="text-right">{t("Amount")}</span><span className="text-right">{t("Status")}</span>
            </div>
            {upcomingReservations.map((reservation) => (
              <div key={reservation.id} className="grid grid-cols-[120px_110px_1fr_100px_110px] items-center gap-3 border-b border-white/55 px-4 py-3 text-sm last:border-b-0">
                <span className="font-bold text-slate-700">{formatReservationDate(reservation.date)}</span>
                <span className="font-bold text-slate-700">{reservation.time}</span>
                <span className="truncate font-black text-slate-950">{reservation.venue}</span>
                <span className="text-right font-black text-orange-700">80 dh</span>
                <span className="text-right"><span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-[#247e24]">{t("Confirmed")}</span></span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-5">
      <Card className="rounded-[20px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">{view === "admin" ? t("Finances Admin") : t("Finances")}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">{view === "admin" ? t("Full finance view for contributions, expenses, and bookings.") : t("Your contribution, total funds, and recent activity.")}</p>
          </div>
          {canEdit && <ViewToggle view={view} setView={setView} t={t} />}
        </div>
      </Card>

      {view === "admin" && canEdit ? adminView : playerView}

      {showContributions && <ContributionsModal rows={contributionRows} total={totalReceived} onClose={() => setShowContributions(false)} t={t} />}
      {showPayment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" onClick={() => setShowPayment(false)}>
          <div className="w-full max-w-lg rounded-[24px] border border-white/70 bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">{t("Payment account")}</h2>
                <p className="mt-2 text-sm font-semibold text-slate-600">{t("Send proof after payment.")}</p>
              </div>
              <button onClick={() => setShowPayment(false)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label={t("Close")}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 space-y-3">
              {(canEdit ? [
                ["Account name", "accountName"],
                ["Payment method", "bankName"],
                ["Account details", "accountNumber"],
                ["Payment note", "note"]
              ] : []).map(([label, key]) => (
                <label key={key} className="block">
                  <span className="text-xs font-black uppercase tracking-[.08em] text-slate-500">{t(label)}</span>
                  <input value={paymentAccount[key as keyof PaymentAccount]} onChange={(event) => setPaymentAccount((current) => ({ ...current, [key]: event.target.value }))} className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-900 outline-none focus:border-lime-400" />
                </label>
              ))}
              {!canEdit && ([
                ["Account name", paymentAccount.accountName],
                ["Payment method", paymentAccount.bankName],
                ["Account details", paymentAccount.accountNumber],
                ["Payment note", paymentAccount.note]
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[.08em] text-slate-500">{t(label)}</p>
                  <p className="mt-1 font-black text-slate-950">{t(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
