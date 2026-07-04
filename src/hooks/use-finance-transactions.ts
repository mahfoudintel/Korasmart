"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  financeTransactionsChangedEvent,
  getFinanceTransactionTotal,
  readFinanceTransactions,
  type FinanceTransaction
} from "@/lib/finance-transactions";
import { supabase } from "@/lib/supabase";

export function useFinanceTransactions() {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  useEffect(() => {
    if (supabase && session) return;

    const syncTransactions = () => setTransactions(readFinanceTransactions());
    syncTransactions();
    window.addEventListener("storage", syncTransactions);
    window.addEventListener(financeTransactionsChangedEvent, syncTransactions);

    return () => {
      window.removeEventListener("storage", syncTransactions);
      window.removeEventListener(financeTransactionsChangedEvent, syncTransactions);
    };
  }, [session]);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteTransactions() {
      if (!supabase || !session) return;

      const { data, error } = await supabase
        .from("finance_transactions")
        .select("id, type, amount, booking_id, note, created_at, reversed_transaction_id")
        .order("created_at", { ascending: true });

      if (cancelled || error || !data) return;

      setTransactions(
        data.map((transaction) => ({
          id: transaction.id,
          type: transaction.type as FinanceTransaction["type"],
          amount: Number(transaction.amount || 0),
          bookingId: transaction.booking_id || undefined,
          note: transaction.note,
          createdAt: transaction.created_at,
          reversedTransactionId: transaction.reversed_transaction_id || undefined
        }))
      );
    }

    loadRemoteTransactions();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const transactionTotal = useMemo(() => getFinanceTransactionTotal(transactions), [transactions]);

  return { transactions, transactionTotal };
}
