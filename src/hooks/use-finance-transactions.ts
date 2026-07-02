"use client";

import { useEffect, useMemo, useState } from "react";
import {
  financeTransactionsChangedEvent,
  getFinanceTransactionTotal,
  readFinanceTransactions,
  type FinanceTransaction
} from "@/lib/finance-transactions";

export function useFinanceTransactions() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  useEffect(() => {
    const syncTransactions = () => setTransactions(readFinanceTransactions());
    syncTransactions();
    window.addEventListener("storage", syncTransactions);
    window.addEventListener(financeTransactionsChangedEvent, syncTransactions);

    return () => {
      window.removeEventListener("storage", syncTransactions);
      window.removeEventListener(financeTransactionsChangedEvent, syncTransactions);
    };
  }, []);

  const transactionTotal = useMemo(() => getFinanceTransactionTotal(transactions), [transactions]);

  return { transactions, transactionTotal };
}
