import { bookingCostAmount } from "@/lib/workflow-rules";

export type FinanceTransactionType = "booking_cost" | "booking_cost_reversal" | "manual_adjustment";

export type FinanceTransaction = {
  id: string;
  type: FinanceTransactionType;
  amount: number;
  bookingId?: string;
  note: string;
  createdAt: string;
  reversedTransactionId?: string;
};

export const financeTransactionsStorageKey = "korasmart-finance-transactions-v1";
export const financeTransactionsChangedEvent = "korasmart-finance-transactions-changed";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readFinanceTransactions(): FinanceTransaction[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(financeTransactionsStorageKey);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Partial<FinanceTransaction>[];
    return Array.isArray(parsed)
      ? parsed.filter((transaction): transaction is FinanceTransaction =>
          Boolean(transaction.id && transaction.type && typeof transaction.amount === "number" && transaction.createdAt)
        )
      : [];
  } catch {
    window.localStorage.removeItem(financeTransactionsStorageKey);
    return [];
  }
}

export function saveFinanceTransactions(transactions: FinanceTransaction[]) {
  window.localStorage.setItem(financeTransactionsStorageKey, JSON.stringify(transactions));
  window.dispatchEvent(new Event(financeTransactionsChangedEvent));
}

export function recordBookingCost(bookingId: string, label: string) {
  const transactions = readFinanceTransactions();
  const existing = transactions.find((transaction) => transaction.type === "booking_cost" && transaction.bookingId === bookingId);
  if (existing) return transactions;

  const next = [
    ...transactions,
    {
      id: makeId("booking-cost"),
      type: "booking_cost" as const,
      amount: bookingCostAmount,
      bookingId,
      note: `Booking cost: ${label}`,
      createdAt: new Date().toISOString()
    }
  ];
  saveFinanceTransactions(next);
  return next;
}

export function reverseBookingCost(bookingId: string, reason = "Booking cancelled/deleted") {
  const transactions = readFinanceTransactions();
  const bookingCost = transactions.find((transaction) => transaction.type === "booking_cost" && transaction.bookingId === bookingId);
  if (!bookingCost) return transactions;

  const existingReversal = transactions.find(
    (transaction) => transaction.type === "booking_cost_reversal" && transaction.reversedTransactionId === bookingCost.id
  );
  if (existingReversal) return transactions;

  const next = [
    ...transactions,
    {
      id: makeId("booking-reversal"),
      type: "booking_cost_reversal" as const,
      amount: Math.abs(bookingCost.amount),
      bookingId,
      note: reason,
      createdAt: new Date().toISOString(),
      reversedTransactionId: bookingCost.id
    }
  ];
  saveFinanceTransactions(next);
  return next;
}

export function getFinanceTransactionTotal(transactions: FinanceTransaction[]) {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}
